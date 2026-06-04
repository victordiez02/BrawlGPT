import React, { useMemo, useState } from "react";
import {
  GameMap,
  gameMaps,
  getGameModeByName,
  getModeIcon,
  getTranslatedMode,
  getLocalizedMapName,
  PLACEHOLDER_IMAGE,
} from "@/lib/maps";
import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

interface MapSelectionPageProps {
  onSelectMap: (map: GameMap) => void;
}

const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
  e.currentTarget.src = PLACEHOLDER_IMAGE;
};

const MapSelectionPage: React.FC<MapSelectionPageProps> = ({ onSelectMap }) => {
  const { t, i18n } = useTranslation();
  const [filterMode, setFilterMode] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const modes = useMemo(
    () => Array.from(new Set(gameMaps.map((m) => m.mode))),
    [],
  );

  const filteredMaps = useMemo(() => {
    const search = searchTerm.toLowerCase();
    return gameMaps.filter((map) => {
      if (filterMode && map.mode !== filterMode) return false;
      if (!search) return true;
      const haystacks = [
        map.name,
        map.translatedName ?? "",
        map.mode,
        getTranslatedMode(map.mode, i18n.language),
      ];
      return haystacks.some((h) => h.toLowerCase().includes(search));
    });
  }, [filterMode, searchTerm, i18n.language]);

  const currentBanner = filterMode
    ? getGameModeByName(filterMode)?.banner
    : null;

  return (
    <div className="mx-auto max-w-5xl animate-fade-in">
      <div className="glass-panel mb-6 p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-center font-brawl text-2xl font-bold">
            {t("select_map_first")}
          </h2>
          <img
            src="/iconBS.svg"
            alt="Brawl Stars Logo"
            className="h-16 w-16 animate-pulse-soft cursor-pointer transition-transform hover:scale-110"
            style={{
              filter:
                "brightness(0) saturate(100%) invert(58%) sepia(99%) saturate(2160%) hue-rotate(247deg) brightness(101%) contrast(101%)",
            }}
          />
        </div>

        <div className="relative mb-6">
          <Search
            size={18}
            className="absolute inset-y-0 left-3 my-auto text-muted-foreground"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t("search")}
            className="w-full rounded-xl border-2 border-foreground bg-card py-3 pl-10 pr-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          <FilterButton
            active={filterMode === null}
            onClick={() => setFilterMode(null)}
          >
            {t("all_modes")}
          </FilterButton>
          {modes.map((mode) => (
            <FilterButton
              key={mode}
              active={filterMode === mode}
              onClick={() => setFilterMode(mode)}
            >
              <img
                src={getModeIcon(mode)}
                alt={mode}
                className="mr-1 h-5 w-5"
              />
              {getTranslatedMode(mode, i18n.language)}
            </FilterButton>
          ))}
        </div>

        {currentBanner && (
          <div className="relative mb-6 w-full overflow-hidden rounded-lg">
            <img
              src={currentBanner}
              alt={filterMode ?? ""}
              className="h-32 w-full object-cover"
              onError={handleImageError}
            />
            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent">
              <div className="w-full p-3 text-center">
                <h3 className="font-brawl text-xl text-white drop-shadow-lg">
                  {getTranslatedMode(filterMode!, i18n.language)}
                </h3>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredMaps.map((map) => (
          <button
            type="button"
            key={map.id}
            onClick={() => onSelectMap(map)}
            className="glass-panel cursor-pointer overflow-hidden text-left transition-all hover:-translate-y-1 hover:shadow-sticker-lg"
          >
            <div className="relative flex h-48 items-center justify-center overflow-hidden">
              <img
                src={map.image}
                alt={map.name}
                className="h-full w-full object-contain"
                onError={handleImageError}
              />
              <div className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-foreground bg-black/60">
                <img
                  src={getModeIcon(map.mode)}
                  alt={map.mode}
                  className="h-6 w-6"
                />
              </div>
            </div>
            <div className="border-t-2 border-foreground bg-card p-3">
              <p className="font-display text-lg font-medium">
                {getLocalizedMapName(map, i18n.language)}
              </p>
              <p className="text-sm text-muted-foreground">
                {getTranslatedMode(map.mode, i18n.language)}
              </p>
            </div>
          </button>
        ))}

        {filteredMaps.length === 0 && (
          <div className="col-span-full py-12 text-center text-muted-foreground">
            {t("no_maps_found")}
          </div>
        )}
      </div>
    </div>
  );
};

const FilterButton: React.FC<{
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}> = ({ active, onClick, children }) => (
  <Button
    type="button"
    onClick={onClick}
    size="sm"
    variant={active ? "default" : "outline"}
    className="rounded-full px-4"
  >
    {children}
  </Button>
);

export default MapSelectionPage;
