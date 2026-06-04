import React from "react";
import { useDrag, useDrop } from "react-dnd";
import { Lock } from "lucide-react";
import { useTranslation } from "react-i18next";
import BrawlerCard from "./BrawlerCard";
import { brawlers } from "@/lib/brawlers";

interface DraftItem {
  id: number | null;
  slotIndex: number;
}

interface DraftSlotProps {
  index: number;
  team: "blue" | "red";
  brawlerId: number | null;
  isActiveSlot: boolean;
  pickLabel: string;
  isLocked: boolean;
  onRemoveBrawler: (index: number) => void;
  onMoveBrawler: (fromIndex: number, toIndex: number) => void;
}

const scrollToBrawlerGrid = () => {
  document
    .querySelector(".brawler-grid")
    ?.scrollIntoView({ behavior: "smooth" });
};

const DraftSlot: React.FC<DraftSlotProps> = ({
  index,
  team,
  brawlerId,
  isActiveSlot,
  pickLabel,
  isLocked,
  onRemoveBrawler,
  onMoveBrawler,
}) => {
  const { t } = useTranslation();
  const teamColorClass = team === "blue" ? "draft-slot-blue" : "draft-slot-red";
  const brawler =
    brawlerId !== null
      ? (brawlers.find((b) => b.id === brawlerId) ?? null)
      : null;

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: "DRAFT_BRAWLER",
      item: (): DraftItem => ({ id: brawlerId, slotIndex: index }),
      collect: (monitor) => ({ isDragging: !!monitor.isDragging() }),
      canDrag: brawlerId !== null && !isLocked,
    }),
    [brawlerId, index, isLocked],
  );

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: "DRAFT_BRAWLER",
      drop: (item: DraftItem) => {
        if (item.slotIndex !== index) onMoveBrawler(item.slotIndex, index);
      },
      collect: (monitor) => ({ isOver: !!monitor.isOver() }),
      canDrop: () => !isLocked,
    }),
    [index, onMoveBrawler, isLocked],
  );

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    if (brawlerId !== null && !isLocked) onRemoveBrawler(index);
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <div
        ref={(node) => {
          drop(node);
        }}
        className={`relative aspect-square w-full ${teamColorClass} ${isActiveSlot && !isLocked ? "animate-pulse-soft ring-2 ring-yellow-400" : ""} ${isOver ? "ring-2 ring-white" : ""} ${isLocked ? "opacity-70" : ""}`}
      >
        {brawler ? (
          <div
            ref={(node) => {
              drag(node);
            }}
            className={`relative h-full w-full ${isDragging ? "opacity-50" : ""}`}
            onContextMenu={handleContextMenu}
          >
            <BrawlerCard
              brawler={brawler}
              size="lg"
              team={team}
              isDragging={isDragging}
              disabled={isLocked}
            />
            {isLocked && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <Lock size={24} className="text-white" />
              </div>
            )}
          </div>
        ) : (
          <button
            type="button"
            className="flex h-full w-full cursor-pointer items-center justify-center"
            onClick={isLocked ? undefined : scrollToBrawlerGrid}
            disabled={isLocked}
          >
            {isActiveSlot && !isLocked && (
              <span className="animate-pulse font-display text-sm font-medium text-foreground opacity-80 transition-colors hover:text-primary">
                {t("select")}
              </span>
            )}
            {isLocked && (
              <div className="flex flex-col items-center justify-center">
                <Lock size={24} className="mb-1 text-white/70" />
                <span className="font-brawl text-xs font-medium text-white/70">
                  {t("locked")}
                </span>
              </div>
            )}
          </button>
        )}
      </div>
      <span className="w-full truncate text-center font-display text-xs font-medium text-muted-foreground">
        {pickLabel}
      </span>
    </div>
  );
};

export default DraftSlot;
