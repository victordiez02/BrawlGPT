/** @jsxImportSource react */
import React, { useState } from "react";
import { useDrop, useDragLayer } from "react-dnd";
import { useTranslation } from "react-i18next";

const TRASH_ICON = "/resources/trashIcon.png";
const FALLBACK_TRASH_ICON = "https://cdn.brawlify.com/placeholder.png";

interface TrashCanProps {
  onResetDraft: () => void;
  onRemoveBrawler: (id: number) => void;
}

const TrashCan: React.FC<TrashCanProps> = ({
  onResetDraft,
  onRemoveBrawler,
}) => {
  const { t } = useTranslation();
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  const { isDraggingBrawler } = useDragLayer((monitor) => ({
    isDraggingBrawler:
      monitor.isDragging() && monitor.getItemType() === "DRAFT_BRAWLER",
  }));

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: "DRAFT_BRAWLER",
      drop: (item: { id: number | null }) => {
        if (item.id !== null) onRemoveBrawler(item.id);
      },
      collect: (monitor) => ({ isOver: !!monitor.isOver() }),
    }),
    [onRemoveBrawler],
  );

  const isActive = isOver || isHovered || isDraggingBrawler;

  return (
    <div
      ref={(node) => {
        drop(node);
      }}
      role="button"
      tabIndex={0}
      onClick={onResetDraft}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onResetDraft()}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title={t("reset")}
      className={`flex cursor-pointer flex-col items-center justify-center transition-all duration-300 ${isActive ? "scale-110" : ""}`}
    >
      <div
        className={`rounded-full p-3 transition-all duration-300 ${isActive ? "animate-pulse-soft bg-destructive/20" : "bg-transparent"}`}
      >
        <img
          src={imageError ? FALLBACK_TRASH_ICON : TRASH_ICON}
          alt={t("reset")}
          className="h-12 w-12"
          style={{
            transition: "all 0.3s ease",
            filter: isActive
              ? "brightness(1.3) drop-shadow(0 0 8px rgba(239, 68, 68, 0.7))"
              : "brightness(1) drop-shadow(0 0 2px rgba(0, 0, 0, 0.3))",
            transform: isOver
              ? "rotate(-10deg)"
              : isActive
                ? "rotate(-5deg)"
                : "rotate(0)",
          }}
          onError={() => setImageError(true)}
        />
      </div>
    </div>
  );
};

export default TrashCan;
