/** @jsxImportSource react */
import React from "react";
import {
  GameMap,
  getModeIcon,
  getTranslatedMode,
  getLocalizedMapName,
  PLACEHOLDER_IMAGE,
} from "@/lib/maps";
import { Map, ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";

interface MapSelectorProps {
  selectedMap: GameMap | null;
  onReturnToMapSelection?: () => void;
}

const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
  e.currentTarget.src = PLACEHOLDER_IMAGE;
};

const MapSelector: React.FC<MapSelectorProps> = ({
  selectedMap,
  onReturnToMapSelection,
}) => {
  const { t, i18n } = useTranslation();

  return (
    <div className="w-full animate-fade-in">
      <label className="mb-1 block font-display text-sm font-medium text-foreground">
        {t("select_map")}
      </label>

      <button
        type="button"
        onClick={onReturnToMapSelection}
        className="glass-card flex w-full items-center justify-between px-4 py-2 text-left"
      >
        {selectedMap ? (
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 overflow-hidden rounded-md">
              <img
                src={selectedMap.image}
                alt={selectedMap.name}
                className="h-full w-full object-contain"
                onError={handleImageError}
              />
            </div>
            <div>
              <p className="font-medium">
                {getLocalizedMapName(selectedMap, i18n.language)}
              </p>
              <p className="flex items-center text-xs text-muted-foreground">
                <img
                  src={getModeIcon(selectedMap.mode)}
                  alt={selectedMap.mode}
                  className="mr-1 h-4 w-4"
                />
                {getTranslatedMode(selectedMap.mode, i18n.language)}
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-2 text-muted-foreground">
            <Map size={18} />
            <span>{t("select_map")}</span>
          </div>
        )}
        <ArrowLeft size={20} />
      </button>

      {selectedMap && (
        <div className="relative mt-2 flex items-center justify-center overflow-hidden rounded-lg">
          <img
            src={selectedMap.image}
            alt={selectedMap.name}
            className="h-48 w-full object-contain"
            onError={handleImageError}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-2 text-white">
            <p className="font-bold">
              {getLocalizedMapName(selectedMap, i18n.language)}
            </p>
            <p className="flex items-center text-sm opacity-80">
              <img
                src={getModeIcon(selectedMap.mode)}
                alt={selectedMap.mode}
                className="mr-1 h-4 w-4"
              />
              {getTranslatedMode(selectedMap.mode, i18n.language)}
            </p>
          </div>
          <div className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60">
            <img
              src={getModeIcon(selectedMap.mode)}
              alt={selectedMap.mode}
              className="h-6 w-6"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MapSelector;
