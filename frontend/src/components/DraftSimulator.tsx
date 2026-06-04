import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Info, Swords, Sparkles, Shield, Ban, Map as MapIcon, Flag } from "lucide-react";

import { brawlers, Brawler } from "@/lib/brawlers";
import { GameMap } from "@/lib/maps";
import { GeminiSuggestion } from "@/lib/api";
import {
  Team,
  getPickOrder,
  findTeamByIndex,
  getCurrentDraftPhase,
  isPhaseValid,
  getMissingPicksMessage,
} from "@/lib/draftPhase";
import { useAIRecommendations } from "@/hooks/useAIRecommendations";

import MapSelector from "./MapSelector";
import TeamSelector from "./TeamSelector";
import DraftTeam from "./DraftTeam";
import BannedBrawlers from "./BannedBrawlers";
import BrawlerGrid from "./BrawlerGrid";
import TrashCan from "./TrashCan";
import AIRecommendations from "./AIRecommendations";
import DraftCompletionDialog from "./DraftCompletionDialog";
import { Button } from "@/components/ui/button";

interface DraftSimulatorProps {
  initialMap?: GameMap | null;
  onReturnToMapSelection?: () => void;
}

const EMPTY_DRAFT: ReadonlyArray<number | null> = [
  null,
  null,
  null,
  null,
  null,
  null,
];

const PHASE_LABELS = ["pre", "1st", "2nd", "3rd", "4th"];

const DraftSimulator: React.FC<DraftSimulatorProps> = ({
  initialMap = null,
  onReturnToMapSelection,
}) => {
  const { t } = useTranslation();
  const draftContainerRef = useRef<HTMLDivElement>(null);

  const [selectedMap] = useState<GameMap | null>(initialMap);
  const [firstPick, setFirstPick] = useState<Team>("blue");
  const [selectedBrawlers, setSelectedBrawlers] = useState<(number | null)[]>([
    ...EMPTY_DRAFT,
  ]);
  const [bannedBrawlers, setBannedBrawlers] = useState<number[]>([]);
  const [currentPickIndex, setCurrentPickIndex] = useState<number>(0);
  const [showDraftCompletionDialog, setShowDraftCompletionDialog] =
    useState(false);

  const ai = useAIRecommendations();
  const { reset: resetAi } = ai;

  const pickOrder = useMemo(() => getPickOrder(firstPick), [firstPick]);
  const selectedCount = useMemo(
    () => selectedBrawlers.filter((id) => id !== null).length,
    [selectedBrawlers],
  );
  const phase = useMemo(
    () => getCurrentDraftPhase(selectedCount),
    [selectedCount],
  );
  const isValid = useMemo(
    () => isPhaseValid(selectedBrawlers, pickOrder),
    [selectedBrawlers, pickOrder],
  );
  const currentPickTeam: Team = findTeamByIndex(currentPickIndex);

  const generateButtonConfig = useMemo(() => {
    if (!selectedMap) {
      return {
        enabled: false,
        text: t("generate_best_option"),
        reason: t("select_map_first"),
      };
    }
    if (!isValid || phase === 0) {
      return {
        enabled: false,
        text: t("generate_best_option"),
        reason: getMissingPicksMessage({
          selectedBrawlers,
          pickOrder,
          isValid,
          t,
        }),
      };
    }
    const phaseTextKey = `generate_phase_${phase}`;
    return { enabled: true, text: t(phaseTextKey), reason: "" };
  }, [selectedMap, isValid, phase, selectedBrawlers, pickOrder, t]);

  useEffect(() => {
    const next = pickOrder.find((slot) => selectedBrawlers[slot] === null);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (next !== undefined) setCurrentPickIndex(next);
  }, [selectedBrawlers, pickOrder]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPickIndex(firstPick === "blue" ? 0 : 3);
  }, [firstPick]);

  useEffect(() => {
    if (selectedCount === 0) resetAi();
  }, [selectedCount, resetAi]);

  const handleSelectBrawler = useCallback(
    (brawler: Brawler) => {
      if (
        selectedBrawlers.includes(brawler.id) ||
        bannedBrawlers.includes(brawler.id)
      )
        return;
      if (selectedCount >= 5) {
        toast.error(t("max_picks_error"));
        return;
      }
      const slot = pickOrder.find((s) => selectedBrawlers[s] === null);
      if (slot === undefined) return;
      setSelectedBrawlers((prev) => {
        const next = [...prev];
        next[slot] = brawler.id;
        return next;
      });
      const team = slot < 3 ? t("blue_team") : t("red_team");
      toast.success(t("brawler_selected", { name: brawler.name, team }));
    },
    [bannedBrawlers, pickOrder, selectedBrawlers, selectedCount, t],
  );

  const handleRemoveBrawler = useCallback(
    (index: number) => {
      setSelectedBrawlers((prev) => {
        const id = prev[index];
        if (id === null) return prev;
        const brawler = brawlers.find((b) => b.id === id);
        if (brawler) toast.info(t("brawler_removed", { name: brawler.name }));
        const next = [...prev];
        next[index] = null;
        return next;
      });
    },
    [t],
  );

  const handleRemoveBrawlerById = useCallback(
    (id: number) => {
      const idx = selectedBrawlers.indexOf(id);
      if (idx !== -1) handleRemoveBrawler(idx);
    },
    [handleRemoveBrawler, selectedBrawlers],
  );

  const handleMoveBrawler = useCallback(
    (from: number, to: number) => {
      if (from === to) return;
      setSelectedBrawlers((prev) => {
        const next = [...prev];
        [next[from], next[to]] = [next[to], next[from]];
        const fromBrawler = brawlers.find((b) => b.id === prev[from]);
        const toBrawler =
          prev[to] !== null ? brawlers.find((b) => b.id === prev[to]!) : null;
        if (fromBrawler) {
          if (toBrawler)
            toast.info(
              t("brawlers_swapped", {
                from: fromBrawler.name,
                to: toBrawler.name,
              }),
            );
          else
            toast.info(t("brawler_moved_position", { name: fromBrawler.name }));
        }
        return next;
      });
    },
    [t],
  );

  const handleBanBrawler = useCallback(
    (id: number) => {
      if (bannedBrawlers.includes(id) || selectedBrawlers.includes(id)) return;
      if (bannedBrawlers.length >= 6) {
        toast.error(t("max_bans_error"));
        return;
      }
      const brawler = brawlers.find((b) => b.id === id);
      if (!brawler) return;
      toast.info(t("brawler_banned", { name: brawler.name }));
      setBannedBrawlers((prev) => [...prev, id]);
    },
    [bannedBrawlers, selectedBrawlers, t],
  );

  const handleUnbanBrawler = useCallback(
    (id: number) => {
      const brawler = brawlers.find((b) => b.id === id);
      if (brawler) toast.info(t("brawler_unbanned", { name: brawler.name }));
      setBannedBrawlers((prev) => prev.filter((b) => b !== id));
    },
    [t],
  );

  const handleResetDraft = useCallback(() => {
    setSelectedBrawlers([...EMPTY_DRAFT]);
    setBannedBrawlers([]);
    setCurrentPickIndex(firstPick === "blue" ? 0 : 3);
    ai.reset();
    setShowDraftCompletionDialog(false);
    toast.info(t("draft_reset"));
  }, [ai, firstPick, t]);

  const scrollToDraft = useCallback(() => {
    draftContainerRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

  const handleGenerateRecommendation = useCallback(async () => {
    if (!selectedMap) {
      toast.error(t("must_select_map"));
      return;
    }
    if (!generateButtonConfig.enabled) {
      toast.error(generateButtonConfig.reason);
      return;
    }
    if (phase === 0) {
      toast.error(t("invalid_draft_phase"));
      return;
    }
    try {
      await ai.request({
        phase,
        map: selectedMap,
        bannedBrawlers,
        firstPick,
        selectedBrawlers,
      });
      toast.success(t("ai_recommendations_generated"));
    } catch (err) {
      console.error("AI recommendation error:", err);
      toast.error(t("error_generating_recommendation"));
    }
  }, [
    ai,
    bannedBrawlers,
    firstPick,
    generateButtonConfig,
    phase,
    selectedBrawlers,
    selectedMap,
    t,
  ]);

  const handleSelectRecommendation = useCallback(
    (suggestion: GeminiSuggestion, recPhase: number) => {
      const names =
        typeof suggestion.brawlers === "string"
          ? suggestion.brawlers.includes("+")
            ? suggestion.brawlers.split("+").map((s) => s.trim())
            : [suggestion.brawlers]
          : suggestion.brawlers;
      const ids = names
        .map((n) => brawlers.find((b) => b.name === n)?.id)
        .filter((id): id is number => id !== undefined);
      if (ids.length === 0) return;

      setSelectedBrawlers((prev) => {
        const next = [...prev];
        const phaseSlots: Record<number, number[]> = {
          1: [pickOrder[0]],
          2: [pickOrder[1], pickOrder[2]],
          3: [pickOrder[3], pickOrder[4]],
          4: [pickOrder[5]],
        };
        const slots = phaseSlots[recPhase] ?? [];
        slots.forEach((slot) => {
          next[slot] = null;
        });
        ids.slice(0, slots.length).forEach((id, i) => {
          next[slots[i]] = id;
        });
        return next;
      });

      if (recPhase === 4) {
        setTimeout(() => setShowDraftCompletionDialog(true), 100);
      }

      const appliedNames = ids
        .map((id) => brawlers.find((b) => b.id === id)?.name)
        .filter(Boolean)
        .join(", ");
      toast.success(t("recommendation_applied", { brawlers: appliedNames }));
      ai.setIsOpen(false);
      scrollToDraft();
    },
    [ai, pickOrder, scrollToDraft, t],
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="mx-auto w-full max-w-6xl animate-fade-in px-4">
        {/* ===== Setup banner ===== */}
        <div className="glass-panel relative mb-6 overflow-hidden border-[3px] border-foreground">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-brawl-blue via-brawl-purple to-secondary opacity-90" />
            <div className="absolute inset-0 bg-brawl-grid bg-brawl-grid opacity-20" />
            <div className="relative flex items-center justify-between gap-3 px-5 py-3">
              <div className="flex items-center gap-3">
                <div className="rounded-full border-[3px] border-foreground bg-brawl-gold p-2 shadow-sticker animate-bs-float">
                  <Flag size={18} className="text-amber-950" />
                </div>
                <h2 className="font-brawl text-xl uppercase tracking-wider text-white drop-shadow-[2px_2px_0_hsl(var(--ink))] md:text-2xl">
                  {t("battle_setup") !== "battle_setup"
                    ? t("battle_setup")
                    : "Battle Setup"}
                </h2>
              </div>
              <div className="hidden items-center gap-2 md:flex">
                {PHASE_LABELS.slice(1).map((label, i) => {
                  const p = i + 1;
                  const active = phase === p;
                  const done = phase > p;
                  return (
                    <div
                      key={label}
                      className={`flex h-8 items-center gap-1 rounded-full border-[3px] border-foreground px-2.5 font-brawl text-xs uppercase tracking-wider shadow-sticker-sm transition-all ${
                        active
                          ? "scale-105 bg-brawl-gold text-amber-950"
                          : done
                            ? "bg-emerald-400 text-emerald-950"
                            : "bg-white/85 text-foreground/70"
                      }`}
                    >
                      <span className="font-brawl">{label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex h-1.5">
              <div className="flex-1 bg-brawl-blue" />
              <div className="flex-1 bg-primary" />
              <div className="flex-1 bg-brawl-red" />
            </div>
          </div>

          <div className="p-4">
            <div className="flex flex-col gap-4 md:flex-row md:gap-6">
              <div className="md:w-1/3">
                <SectionHeader icon={MapIcon} label={t("map") !== "map" ? t("map") : "Map"} />
                <MapSelector
                  selectedMap={selectedMap}
                  onReturnToMapSelection={onReturnToMapSelection}
                />
              </div>
              <div className="md:w-1/3">
                <SectionHeader
                  icon={Shield}
                  label={t("first_pick") !== "first_pick" ? t("first_pick") : "First Pick"}
                />
                <TeamSelector
                  firstPick={firstPick}
                  onSelectFirstPick={setFirstPick}
                />
              </div>
              <div className="md:w-1/3">
                <SectionHeader
                  icon={Ban}
                  label={t("bans") !== "bans" ? t("bans") : "Bans"}
                />
                <BannedBrawlers
                  bannedBrawlers={bannedBrawlers}
                  onBanBrawler={handleBanBrawler}
                  onUnbanBrawler={handleUnbanBrawler}
                />
              </div>
            </div>
          </div>
        </div>

        {selectedMap && (
          <>
            {/* ===== Current draft ===== */}
            <div
              className="glass-panel mb-6 overflow-hidden border-[3px] border-foreground"
              ref={draftContainerRef}
            >
              {/* Draft header */}
              <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-brawl-blue/90 via-brawl-purple/80 to-brawl-red/90" />
                <div className="absolute inset-0 bg-brawl-grid bg-brawl-grid opacity-15" />
                <div className="relative flex items-center justify-between gap-3 px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full border-[3px] border-foreground bg-brawl-gold p-2 shadow-sticker">
                      <Swords size={18} className="text-amber-950" />
                    </div>
                    <h2 className="font-brawl text-xl uppercase tracking-wider text-white drop-shadow-[2px_2px_0_hsl(var(--ink))] md:text-2xl">
                      {t("current_draft")}
                    </h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="hidden rounded-full border-[3px] border-foreground bg-brawl-gold px-3 py-1 font-brawl text-xs uppercase tracking-wider text-amber-950 shadow-sticker-sm sm:inline-flex">
                      {selectedCount}/6 picks
                    </span>
                    <TrashCan
                      onResetDraft={handleResetDraft}
                      onRemoveBrawler={handleRemoveBrawlerById}
                    />
                  </div>
                </div>
                <div className="flex h-1.5">
                  <div className="flex-1 bg-brawl-blue" />
                  <div className="flex-1 bg-primary" />
                  <div className="flex-1 bg-brawl-red" />
                </div>
              </div>

              <div className="p-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <DraftTeam
                    team="blue"
                    brawlerIds={selectedBrawlers.slice(0, 3)}
                    activeSlot={
                      currentPickTeam === "blue" ? currentPickIndex : null
                    }
                    currentPickTeam={currentPickTeam}
                    pickOrder={pickOrder as number[]}
                    onRemoveBrawler={handleRemoveBrawler}
                    onMoveBrawler={handleMoveBrawler}
                  />
                  <DraftTeam
                    team="red"
                    brawlerIds={selectedBrawlers.slice(3, 6)}
                    activeSlot={
                      currentPickTeam === "red" ? currentPickIndex - 3 : null
                    }
                    currentPickTeam={currentPickTeam}
                    pickOrder={pickOrder as number[]}
                    onRemoveBrawler={handleRemoveBrawler}
                    onMoveBrawler={handleMoveBrawler}
                  />
                </div>
              </div>

              {/* Generate AI section */}
              <div className="relative overflow-hidden border-t-[3px] border-foreground">
                <div className="absolute inset-0 bg-gradient-to-r from-accent/15 via-primary/10 to-secondary/15" />
                <div className="relative p-4">
                  <Button
                    type="button"
                    onClick={handleGenerateRecommendation}
                    disabled={!generateButtonConfig.enabled || ai.isLoading}
                    variant="ai"
                    size="lg"
                    className={`w-full font-brawl uppercase tracking-wider ${
                      generateButtonConfig.enabled && !ai.isLoading
                        ? "animate-pulse-soft"
                        : ""
                    }`}
                  >
                    <span className="relative flex items-center justify-center text-base">
                      <Swords size={20} className="mr-2" />
                      {generateButtonConfig.text}
                    </span>
                  </Button>

                  {!generateButtonConfig.enabled &&
                    generateButtonConfig.reason && (
                      <div className="mt-3 flex items-center justify-center gap-1.5 rounded-full border-2 border-destructive/50 bg-destructive/10 px-3 py-1.5 font-brawl text-xs uppercase tracking-wider text-destructive">
                        <Info size={14} />
                        {generateButtonConfig.reason}
                      </div>
                    )}
                </div>
              </div>
            </div>

            {(ai.isLoading || ai.recommendations || ai.error) && (
              <AIRecommendations
                isLoading={ai.isLoading}
                error={ai.error}
                recommendations={ai.recommendations}
                phase={phase}
                onSelectRecommendation={handleSelectRecommendation}
                isOpen={ai.isOpen}
                setIsOpen={ai.setIsOpen}
                onRecommendationClick={scrollToDraft}
              />
            )}

            <BrawlerGrid
              brawlers={brawlers}
              selectedBrawlers={selectedBrawlers}
              bannedBrawlers={bannedBrawlers}
              onSelectBrawler={handleSelectBrawler}
              onBanBrawler={handleBanBrawler}
              onUnbanBrawler={handleUnbanBrawler}
              onRemoveBrawlerFromDraft={handleRemoveBrawlerById}
            />

            <DraftCompletionDialog
              isOpen={showDraftCompletionDialog}
              onClose={() => setShowDraftCompletionDialog(false)}
              selectedBrawlers={selectedBrawlers}
            />
          </>
        )}
      </div>
    </DndProvider>
  );
};

interface SectionHeaderProps {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ icon: Icon, label }) => (
  <div className="mb-2 flex items-center gap-2">
    <div className="rounded-md border-2 border-foreground bg-brawl-gold p-1 shadow-sticker-sm">
      <Icon size={12} className="text-amber-950" />
    </div>
    <span className="font-brawl text-xs uppercase tracking-widest text-foreground/80">
      {label}
    </span>
    <div className="h-[2px] flex-1 rounded-full bg-gradient-to-r from-foreground/40 to-transparent" />
  </div>
);

export default DraftSimulator;
