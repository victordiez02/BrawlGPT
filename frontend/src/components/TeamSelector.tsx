/** @jsxImportSource react */
import React from "react";
import { useTranslation } from "react-i18next";

interface TeamSelectorProps {
  firstPick: "blue" | "red";
  onSelectFirstPick: (team: "blue" | "red") => void;
}

const TeamSelector: React.FC<TeamSelectorProps> = ({
  firstPick,
  onSelectFirstPick,
}) => {
  const { t } = useTranslation();

  return (
    <div className="animate-slide-in w-full">
      <label className="block text-sm font-medium text-foreground mb-4 font-display text-center">
        {t("who_picks_first")}
      </label>

      <div className="flex flex-col space-y-4 items-center w-full">
        <button
          onClick={() => onSelectFirstPick("blue")}
          className={`glass-card py-4 px-6 w-full max-w-xs transition-all duration-200 rounded-xl ${
            firstPick === "blue"
              ? "ring-4 ring-brawl-blue shadow-sticker"
              : "opacity-90 hover:-translate-y-0.5 hover:shadow-sticker-sm"
          }`}
        >
          <div className="flex items-center justify-center gap-3">
            <div className="w-6 h-6 bg-brawl-blue rounded-full border-2 border-foreground"></div>
            <span className="font-medium font-brawl text-lg">
              {t("blue_team")}
            </span>
          </div>
        </button>

        <button
          onClick={() => onSelectFirstPick("red")}
          className={`glass-card py-4 px-6 w-full max-w-xs transition-all duration-200 rounded-xl ${
            firstPick === "red"
              ? "ring-4 ring-brawl-red shadow-sticker"
              : "opacity-90 hover:-translate-y-0.5 hover:shadow-sticker-sm"
          }`}
        >
          <div className="flex items-center justify-center gap-3">
            <div className="w-6 h-6 bg-brawl-red rounded-full border-2 border-foreground"></div>
            <span className="font-medium font-brawl text-lg">
              {t("red_team")}
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default TeamSelector;
