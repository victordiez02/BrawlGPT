import React, { useMemo, useState, useCallback } from "react";
import { Brawler } from "@/lib/brawlers";
import BrawlerCard from "./BrawlerCard";
import BrawlerSearch from "./BrawlerSearch";
import { ArrowDownAZ, ArrowUpAZ, Filter, LayoutGrid } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

const RARITY_ORDER = [
  "Common",
  "Rare",
  "Super Rare",
  "Epic",
  "Mythic",
  "Legendary",
];

interface BrawlerGridProps {
  brawlers: Brawler[];
  selectedBrawlers: (number | null)[];
  bannedBrawlers: number[];
  onSelectBrawler: (brawler: Brawler) => void;
  onBanBrawler: (brawlerId: number) => void;
  onUnbanBrawler: (brawlerId: number) => void;
  onRemoveBrawlerFromDraft: (brawlerId: number) => void;
}

const BrawlerGrid: React.FC<BrawlerGridProps> = ({
  brawlers,
  selectedBrawlers,
  bannedBrawlers,
  onSelectBrawler,
  onBanBrawler,
  onUnbanBrawler,
  onRemoveBrawlerFromDraft,
}) => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"rarity" | "nameAsc" | "nameDesc">(
    "rarity",
  );
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const getBrawlerTeam = (brawlerId: number) => {
    const blueTeamIds = selectedBrawlers.slice(0, 3);
    const redTeamIds = selectedBrawlers.slice(3, 6);
    if (blueTeamIds.includes(brawlerId)) return "blue";
    if (redTeamIds.includes(brawlerId)) return "red";
    return null;
  };

  const getRarityBackground = (rarity: string) => {
    switch (rarity) {
      case "Common":
        return "bg-blue-200 dark:bg-blue-800/40";
      case "Rare":
        return "bg-green-300 dark:bg-green-700/40";
      case "Super Rare":
        return "bg-blue-400 dark:bg-blue-600/50";
      case "Epic":
        return "bg-purple-300 dark:bg-purple-700/40";
      case "Mythic":
        return "bg-red-300 dark:bg-red-700/40";
      case "Legendary":
        return "bg-yellow-300 dark:bg-yellow-700/40";
      default:
        return "";
    }
  };

  const handleBrawlerContextMenu = useCallback(
    (e: React.MouseEvent, brawler: Brawler) => {
      e.preventDefault();

      if (bannedBrawlers.includes(brawler.id)) {
        onUnbanBrawler(brawler.id);
        return;
      }

      if (selectedBrawlers.includes(brawler.id)) {
        onRemoveBrawlerFromDraft(brawler.id);

        if (bannedBrawlers.length < 6) {
          onBanBrawler(brawler.id);
        }
        return;
      }

      if (bannedBrawlers.length >= 6) {
        toast.error(t("max_bans_error"));
        return;
      }
      onBanBrawler(brawler.id);
    },
    [
      selectedBrawlers,
      bannedBrawlers,
      onBanBrawler,
      onUnbanBrawler,
      onRemoveBrawlerFromDraft,
      t,
    ],
  );

  const handleBrawlerClick = useCallback(
    (brawler: Brawler) => {
      if (bannedBrawlers.includes(brawler.id)) {
        onUnbanBrawler(brawler.id);
        return;
      }

      if (selectedBrawlers.includes(brawler.id)) {
        onRemoveBrawlerFromDraft(brawler.id);
        return;
      }

      onSelectBrawler(brawler);
    },
    [
      bannedBrawlers,
      selectedBrawlers,
      onUnbanBrawler,
      onRemoveBrawlerFromDraft,
      onSelectBrawler,
    ],
  );

  const getTranslatedRarity = (rarity: string) => {
    if (rarity === "Common") return t("common");
    if (rarity === "Rare") return t("rare");
    if (rarity === "Super Rare") return t("super_rare");
    if (rarity === "Epic") return t("epic");
    if (rarity === "Mythic") return t("mythic");
    if (rarity === "Legendary") return t("legendary");
    if (rarity === "Chromatic") return t("chromatic");
    return rarity;
  };

  const filteredBrawlers = useMemo(
    () =>
      brawlers.filter((brawler) =>
        brawler.name.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [brawlers, searchTerm],
  );

  const brawlersByRarity = useMemo(() => {
    if (sortOrder !== "rarity") {
      const sorted = [...filteredBrawlers].sort((a, b) =>
        sortOrder === "nameAsc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name),
      );
      return [{ rarity: "All", brawlers: sorted }];
    }

    const grouped = filteredBrawlers.reduce(
      (acc, brawler) => {
        (acc[brawler.rarity] ??= []).push(brawler);
        return acc;
      },
      {} as Record<string, Brawler[]>,
    );

    return Object.entries(grouped)
      .sort((a, b) => RARITY_ORDER.indexOf(a[0]) - RARITY_ORDER.indexOf(b[0]))
      .map(([rarity, brawlers]) => ({ rarity, brawlers }));
  }, [filteredBrawlers, sortOrder]);

  return (
    <div className="glass-panel p-4 animate-fade-in brawler-grid">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <h3 className="text-lg font-bold font-display">
          {t("select_brawlers")}
        </h3>

        <div className="flex items-center space-x-2">
          <div className="relative">
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              className="flex items-center space-x-1 px-3 py-2 rounded-lg transition-all bg-card hover:-translate-y-0.5 text-foreground border-2 border-foreground shadow-sticker-sm"
            >
              <Filter size={16} />
              <span className="text-sm">{t("sort_by")}</span>
            </button>

            {showSortDropdown && (
              <div className="absolute right-0 z-10 mt-1 w-48 rounded-lg shadow-sticker border-2 border-foreground bg-popover text-popover-foreground overflow-hidden">
                <div
                  onClick={() => {
                    setSortOrder("rarity");
                    setShowSortDropdown(false);
                  }}
                  className="flex items-center space-x-2 p-2 cursor-pointer hover:bg-muted transition-colors"
                >
                  <LayoutGrid size={16} />
                  <span className="text-sm">{t("by_rarity")}</span>
                  {sortOrder === "rarity" && (
                    <span className="ml-auto text-primary">✓</span>
                  )}
                </div>
                <div
                  onClick={() => {
                    setSortOrder("nameAsc");
                    setShowSortDropdown(false);
                  }}
                  className="flex items-center space-x-2 p-2 cursor-pointer hover:bg-muted transition-colors"
                >
                  <ArrowDownAZ size={16} />
                  <span className="text-sm">{t("name_az")}</span>
                  {sortOrder === "nameAsc" && (
                    <span className="ml-auto text-primary">✓</span>
                  )}
                </div>
                <div
                  onClick={() => {
                    setSortOrder("nameDesc");
                    setShowSortDropdown(false);
                  }}
                  className="flex items-center space-x-2 p-2 cursor-pointer hover:bg-muted transition-colors"
                >
                  <ArrowUpAZ size={16} />
                  <span className="text-sm">{t("name_za")}</span>
                  {sortOrder === "nameDesc" && (
                    <span className="ml-auto text-primary">✓</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mb-6">
        <BrawlerSearch
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          placeholder={t("search_brawlers")}
        />
      </div>

      <div className="space-y-6">
        {brawlersByRarity.map(({ rarity, brawlers }) => (
          <div key={rarity} className="transition-all duration-300">
            {sortOrder === "rarity" && (
              <div
                className={`p-2 rounded-lg mb-3 ${getRarityBackground(rarity)}`}
              >
                <h4 className="text-sm font-semibold text-foreground font-display">
                  {getTranslatedRarity(rarity)}
                </h4>
              </div>
            )}
            <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 xl:grid-cols-12 gap-2 transition-all duration-300">
              {brawlers.map((brawler) => {
                const isSelected = selectedBrawlers.includes(brawler.id);
                const isBanned = bannedBrawlers.includes(brawler.id);
                const team = getBrawlerTeam(brawler.id);
                return (
                  <div
                    key={brawler.id}
                    onContextMenu={(e) => handleBrawlerContextMenu(e, brawler)}
                  >
                    <BrawlerCard
                      brawler={brawler}
                      disabled={isSelected}
                      banned={isBanned}
                      team={team}
                      onClick={() => handleBrawlerClick(brawler)}
                      size="sm"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {filteredBrawlers.length === 0 && (
          <div className="text-center py-8 text-muted-foreground font-display">
            {t("no_brawlers_found")}
          </div>
        )}
      </div>
    </div>
  );
};

export default BrawlerGrid;
