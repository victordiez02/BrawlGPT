/** @jsxImportSource react */
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { GeminiSuggestion } from "@/lib/api";
import { brawlers } from "@/lib/brawlers";
import {
  Sparkles,
  Loader2,
  TriangleAlert,
  Info,
  ChevronUp,
  ChevronDown,
  Crown,
  Medal,
  Award,
  Zap,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";

interface AIRecommendationsProps {
  isLoading: boolean;
  error: Error | null;
  recommendations: GeminiSuggestion[] | null;
  phase: number;
  onSelectRecommendation: (suggestion: GeminiSuggestion, phase: number) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onRecommendationClick?: () => void;
}

const FALLBACK_IMAGE = "https://cdn.brawlify.com/placeholder.png";

const getBrawlerImage = (name: string): string =>
  brawlers.find((b) => b.name === name)?.image ?? FALLBACK_IMAGE;

const getProbabilityTier = (probability: number) => {
  if (probability >= 85)
    return {
      label: "S",
      from: "from-emerald-400",
      to: "to-green-600",
      ring: "ring-emerald-300",
    };
  if (probability >= 70)
    return {
      label: "A",
      from: "from-teal-400",
      to: "to-emerald-500",
      ring: "ring-teal-300",
    };
  if (probability >= 60)
    return {
      label: "B",
      from: "from-sky-400",
      to: "to-blue-600",
      ring: "ring-sky-300",
    };
  if (probability >= 50)
    return {
      label: "C",
      from: "from-amber-400",
      to: "to-yellow-500",
      ring: "ring-amber-300",
    };
  return {
    label: "D",
    from: "from-orange-400",
    to: "to-red-500",
    ring: "ring-orange-300",
  };
};

const toBrawlerArray = (value: string | string[]): string[] => {
  if (Array.isArray(value)) return value;
  return value.includes("+") ? value.split("+").map((s) => s.trim()) : [value];
};

type PodiumStyle = {
  icon: React.ComponentType<{ size?: number; className?: string }> | null;
  ringFrom: string;
  ringTo: string;
  glow: string;
  badgeBg: string;
  badgeText: string;
  label: string;
};

const PODIUM: readonly PodiumStyle[] = [
  {
    icon: Crown,
    ringFrom: "from-yellow-300",
    ringTo: "to-amber-500",
    glow: "shadow-[0_0_28px_-4px_hsl(45_100%_55%/0.85)]",
    badgeBg: "bg-gradient-to-br from-yellow-300 to-amber-500",
    badgeText: "text-amber-950",
    label: "#1",
  },
  {
    icon: Medal,
    ringFrom: "from-slate-200",
    ringTo: "to-slate-400",
    glow: "shadow-[0_0_22px_-6px_hsl(0_0%_85%/0.7)]",
    badgeBg: "bg-gradient-to-br from-slate-200 to-slate-400",
    badgeText: "text-slate-900",
    label: "#2",
  },
  {
    icon: Award,
    ringFrom: "from-orange-300",
    ringTo: "to-amber-700",
    glow: "shadow-[0_0_22px_-6px_hsl(30_70%_45%/0.7)]",
    badgeBg: "bg-gradient-to-br from-orange-400 to-amber-700",
    badgeText: "text-amber-50",
    label: "#3",
  },
  {
    icon: null,
    ringFrom: "from-zinc-300",
    ringTo: "to-zinc-400",
    glow: "shadow-none",
    badgeBg: "bg-gradient-to-br from-zinc-300 to-zinc-400",
    badgeText: "text-zinc-900",
    label: "#4",
  },
  {
    icon: null,
    ringFrom: "from-zinc-300",
    ringTo: "to-zinc-400",
    glow: "shadow-none",
    badgeBg: "bg-gradient-to-br from-zinc-300 to-zinc-400",
    badgeText: "text-zinc-900",
    label: "#5",
  },
] as const;

const AIRecommendations: React.FC<AIRecommendationsProps> = ({
  isLoading,
  error,
  recommendations,
  phase,
  onSelectRecommendation,
  isOpen,
  setIsOpen,
  onRecommendationClick,
}) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  if (isLoading) {
    return (
      <StatusPanel>
        <div className="relative mb-4">
          <div className="absolute inset-0 animate-pulse-soft rounded-full bg-gradient-to-br from-brawl-gold via-accent to-brawl-purple blur-xl opacity-70" />
          <div className="relative rounded-full border-[3px] border-foreground bg-card p-5 shadow-pop">
            <Loader2 size={42} className="animate-spin text-accent" />
          </div>
        </div>
        <h3 className="mb-1 font-brawl text-2xl uppercase tracking-wide text-foreground">
          {t("generating_ai_recommendation")}
        </h3>
        <div className="mt-1 flex items-center gap-1.5 text-sm opacity-80">
          <span>{t("this_might_take_a_moment")}</span>
        </div>
      </StatusPanel>
    );
  }

  if (error) {
    return (
      <StatusPanel>
        <div className="mb-4 rounded-full border-[3px] border-foreground bg-destructive/25 p-5 shadow-sticker animate-comic-pop">
          <TriangleAlert size={42} className="text-destructive" />
        </div>
        <h3 className="mb-1 font-brawl text-2xl uppercase tracking-wide">
          {t("error_generating_recommendation")}
        </h3>
        <p className="text-sm opacity-80">{t("please_try_again")}</p>
        <p className="mx-auto mt-2 max-w-md text-xs opacity-60">
          {error.message}
        </p>
      </StatusPanel>
    );
  }

  if (!recommendations || recommendations.length === 0) return null;

  const handleSelect = (suggestion: GeminiSuggestion) => {
    onSelectRecommendation(suggestion, phase);
    setIsOpen(false);
    onRecommendationClick?.();
  };

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="glass-panel mb-6 mt-6 animate-fade-in overflow-hidden border-[3px] border-foreground"
    >
      {/* Banner header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-brawl-blue via-brawl-purple to-secondary opacity-90" />
        <div className="absolute inset-0 bg-brawl-grid bg-brawl-grid opacity-20" />
        <div className="relative flex items-center justify-between gap-3 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full border-[3px] border-foreground bg-brawl-gold p-2 shadow-sticker animate-bs-float">
              <Sparkles size={20} className="text-amber-950" />
            </div>
            <div className="flex flex-col">
              <h3 className="font-brawl text-2xl uppercase tracking-wider text-white drop-shadow-[2px_2px_0_hsl(var(--ink))]">
                {t("ai_recommendations")}
              </h3>
              <span className="font-brawl text-xs uppercase tracking-widest text-white/85">
                Phase {phase} · Top {recommendations.length}
              </span>
            </div>
          </div>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-10 w-10 rounded-full border-[3px] border-foreground bg-white/95 p-0 text-foreground shadow-sticker-sm hover:bg-white"
            >
              {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </Button>
          </CollapsibleTrigger>
        </div>
        {/* Brawl tri-band */}
        <div className="flex h-1.5">
          <div className="flex-1 bg-brawl-blue" />
          <div className="flex-1 bg-primary" />
          <div className="flex-1 bg-brawl-red" />
        </div>
      </div>

      <CollapsibleContent className="bg-gradient-to-b from-background/60 to-background/0 px-5 py-5">
        <div className="grid grid-cols-1 gap-4">
          {recommendations.map((suggestion, index) => (
            <RecommendationCard
              key={index}
              index={index}
              suggestion={suggestion}
              language={lang}
              t={t}
              onClick={() => handleSelect(suggestion)}
            />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

const StatusPanel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="glass-panel mb-6 mt-6 animate-fade-in border-[3px] border-foreground p-8 text-center">
    <div className="flex flex-col items-center justify-center">{children}</div>
  </div>
);

interface RecommendationCardProps {
  index: number;
  suggestion: GeminiSuggestion;
  language: string;
  t: (key: string) => string;
  onClick: () => void;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({
  index,
  suggestion,
  language,
  t,
  onClick,
}) => {
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});
  const podium = PODIUM[index] ?? PODIUM[2];
  const tier = getProbabilityTier(suggestion.probability);
  const names = toBrawlerArray(suggestion.brawlers);
  const explanation =
    (language === "es"
      ? suggestion.explanationESP
      : suggestion.explanationUSA) ??
    suggestion.explanationUSA ??
    "";

  return (
    <button
      type="button"
      onClick={onClick}
      style={{ animationDelay: `${index * 90}ms` }}
      className={`group relative w-full animate-comic-pop overflow-hidden rounded-2xl border-[3px] border-foreground bg-card p-4 text-left shadow-sticker transition-all duration-200 hover:-translate-y-1 hover:shadow-pop focus:outline-none focus-visible:ring-4 focus-visible:ring-brawl-gold/60`}
    >
      {/* Rank ribbon on the left */}
      <div
        aria-hidden
        className={`absolute left-0 top-0 h-full w-2 bg-gradient-to-b ${podium.ringFrom} ${podium.ringTo}`}
      />

      {/* Podium medal */}
      {podium.icon && (
        <div className="absolute -right-3 -top-3 z-10 flex items-center gap-1">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-full border-[3px] border-foreground ${podium.badgeBg} ${podium.glow} ${podium.badgeText} animate-bs-float`}
          >
            {podium.icon && <podium.icon size={22} />}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-4 pl-3 md:flex-row md:items-stretch">
        {/* Left: rank + brawlers */}
        <div className="md:w-2/5">
          <div className="mb-3 flex items-center justify-between pr-12">
            <div className="flex items-center gap-2">
              <span
                className={`rounded-lg border-[3px] border-foreground bg-gradient-to-br ${podium.ringFrom} ${podium.ringTo} px-2.5 py-1 font-brawl text-sm shadow-sticker-sm ${podium.badgeText}`}
              >
                {podium.label}
              </span>
              <h4 className="font-brawl text-lg uppercase tracking-wide">
                {names.length === 1 ? t("best_pick") : t("best_combination")}
              </h4>
            </div>
          </div>

          {/* Brawler portraits */}
          <div className="flex flex-wrap items-end justify-center gap-4 md:justify-start">
            {names.map((name, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <div
                  className={`relative h-24 w-24 rounded-full border-[3px] border-foreground bg-gradient-to-br ${podium.ringFrom} ${podium.ringTo} p-[3px] shadow-sticker-sm transition-transform duration-200 group-hover:scale-105`}
                >
                  <div className="h-full w-full overflow-hidden rounded-full bg-card">
                    <img
                      src={
                        imgErrors[name] ? FALLBACK_IMAGE : getBrawlerImage(name)
                      }
                      alt={name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                      onError={() =>
                        setImgErrors((prev) => ({ ...prev, [name]: true }))
                      }
                    />
                  </div>
                </div>
                <span className="mt-1.5 max-w-[6rem] truncate rounded-md border-2 border-foreground bg-background/80 px-2 py-0.5 text-center font-brawl text-xs uppercase tracking-wide">
                  {name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: probability + explanation */}
        <div className="flex flex-1 flex-col gap-3 md:w-3/5">
          {/* Win-rate gauge */}
          <div className="flex items-center gap-3 rounded-xl border-2 border-foreground bg-background/70 p-3">
            <div
              className={`relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-[3px] border-foreground bg-gradient-to-br ${tier.from} ${tier.to} text-white shadow-sticker-sm ring-2 ${tier.ring}`}
            >
              <span className="font-brawl text-xl leading-none drop-shadow-[1px_1px_0_rgba(0,0,0,0.4)]">
                {suggestion.probability}
              </span>
              <span className="absolute -bottom-2 rounded-md border-2 border-foreground bg-background px-1.5 py-0.5 font-brawl text-[10px] uppercase tracking-wider text-foreground">
                {tier.label}
              </span>
            </div>
            <div className="flex-1">
              <div className="mb-1 flex items-center justify-between">
                <span className="font-brawl text-xs uppercase tracking-widest text-muted-foreground">
                  Win rate
                </span>
                <span className="font-brawl text-sm">
                  {suggestion.probability}%
                </span>
              </div>
              <div className="relative h-3 overflow-hidden rounded-full border-2 border-foreground bg-muted">
                <div
                  className={`h-full bg-gradient-to-r ${tier.from} ${tier.to} transition-all duration-700`}
                  style={{ width: `${Math.min(100, suggestion.probability)}%` }}
                />
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,transparent_0,rgba(255,255,255,0.35)_50%,transparent_100%)] opacity-50" />
              </div>
            </div>
          </div>

          {explanation && (
            <div className="flex items-start gap-2 rounded-xl border-2 border-foreground bg-accent/10 p-3">
              <div className="rounded-full border-2 border-foreground bg-accent p-1.5 shadow-sticker-sm">
                <Info size={14} className="text-accent-foreground" />
              </div>
              <p className="text-sm leading-relaxed text-foreground">
                {explanation}
              </p>
            </div>
          )}

          {/* Hover CTA */}
          <div className="mt-auto flex items-center justify-end">
            <span className="inline-flex items-center gap-1.5 rounded-full border-[3px] border-foreground bg-primary px-3 py-1 font-brawl text-xs uppercase tracking-wider text-primary-foreground shadow-sticker-sm opacity-0 transition-all duration-200 group-hover:opacity-100">
              <Zap size={14} />
              {t("best_pick")}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
};

export default AIRecommendations;
