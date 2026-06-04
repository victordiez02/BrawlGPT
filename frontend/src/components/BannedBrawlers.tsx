import React, { useState } from "react";
import { Brawler, brawlers } from "@/lib/brawlers";
import BrawlerCard from "./BrawlerCard";
import { Ban } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface BannedBrawlersProps {
  bannedBrawlers: number[];
  onBanBrawler: (brawlerId: number) => void;
  onUnbanBrawler: (brawlerId: number) => void;
}

const MAX_BANNED_BRAWLERS = 6;

const BannedBrawlers: React.FC<BannedBrawlersProps> = ({
  bannedBrawlers,
  onBanBrawler,
  onUnbanBrawler,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const { t } = useTranslation();

  const filteredBrawlers = brawlers
    .filter((brawler) => !bannedBrawlers.includes(brawler.id))
    .filter((brawler) =>
      brawler.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

  const bannedBrawlerObjects = bannedBrawlers
    .map((id) => brawlers.find((brawler) => brawler.id === id))
    .filter(Boolean) as Brawler[];

  const handleBanBrawler = (brawlerId: number) => {
    if (bannedBrawlers.length >= MAX_BANNED_BRAWLERS) {
      toast.error(t("max_bans_error"));
      return;
    }
    onBanBrawler(brawlerId);
  };

  const firstRowBrawlers = bannedBrawlerObjects.slice(0, 3);
  const secondRowBrawlers = bannedBrawlerObjects.slice(3, 6);

  return (
    <div className="animate-fade-in">
      <h3 className="mb-4 flex items-center font-display text-lg font-bold">
        <Ban size={20} className="mr-2 text-destructive" />
        {t("banned_brawlers")} ({bannedBrawlers.length}/{MAX_BANNED_BRAWLERS})
      </h3>

      <div className="relative mb-4 w-full">
        <div className="flex w-full">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setShowDropdown(true)}
            placeholder={t("search_to_ban")}
            className="w-full flex-1 rounded-l-lg border-2 border-foreground bg-card p-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brawl-red"
          />
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className={`${bannedBrawlers.length >= MAX_BANNED_BRAWLERS ? "cursor-not-allowed bg-muted" : "bg-brawl-red"} rounded-r-lg border-2 border-l-0 border-foreground px-3 font-display text-white`}
            disabled={bannedBrawlers.length >= MAX_BANNED_BRAWLERS}
          >
            +
          </button>
        </div>

        {showDropdown && searchTerm.length > 0 && (
          <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border-2 border-foreground bg-popover text-popover-foreground shadow-sticker">
            {filteredBrawlers.length > 0 ? (
              filteredBrawlers.slice(0, 8).map((brawler) => (
                <div
                  key={brawler.id}
                  className="flex cursor-pointer items-center space-x-3 p-2 transition-colors hover:bg-muted"
                  onClick={() => {
                    if (bannedBrawlers.length < MAX_BANNED_BRAWLERS) {
                      handleBanBrawler(brawler.id);
                      setSearchTerm("");
                      setShowDropdown(false);
                    } else {
                      toast.error(t("max_bans_error"));
                    }
                  }}
                >
                  <img
                    src={brawler.image}
                    alt={brawler.name}
                    className="h-8 w-8 rounded-md"
                  />
                  <span className="text-foreground">{brawler.name}</span>
                </div>
              ))
            ) : (
              <div className="p-2 text-center text-muted-foreground">
                {t("no_brawlers_found")}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Display banned brawlers in two rows of 3 */}
      <div className="space-y-3">
        {/* First row */}
        <div className="grid grid-cols-3 gap-3">
          {firstRowBrawlers.length > 0 ? (
            firstRowBrawlers.map((brawler) => (
              <div key={brawler.id} className="relative">
                <BrawlerCard brawler={brawler} banned={true} size="sm" />
                <button
                  onClick={() => onUnbanBrawler(brawler.id)}
                  className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full border-2 border-foreground bg-brawl-red text-white transition-transform hover:-translate-y-0.5"
                >
                  ×
                </button>
              </div>
            ))
          ) : (
            <div className="col-span-full py-2 text-center font-display text-muted-foreground">
              {t("no_banned_brawlers")}
            </div>
          )}
        </div>

        {/* Second row - only render if there are more than 3 banned brawlers */}
        {secondRowBrawlers.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            {secondRowBrawlers.map((brawler) => (
              <div key={brawler.id} className="relative">
                <BrawlerCard brawler={brawler} banned={true} size="sm" />
                <button
                  onClick={() => onUnbanBrawler(brawler.id)}
                  className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full border-2 border-foreground bg-brawl-red text-white transition-transform hover:-translate-y-0.5"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BannedBrawlers;
