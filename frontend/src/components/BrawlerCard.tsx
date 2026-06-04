import React, { useState, useEffect } from "react";
import { Brawler } from "@/lib/brawlers";

interface BrawlerCardProps {
  brawler: Brawler;
  disabled?: boolean;
  banned?: boolean;
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
  team?: "blue" | "red" | null;
  isDragging?: boolean;
}

const BrawlerCard: React.FC<BrawlerCardProps> = ({
  brawler,
  disabled = false,
  banned = false,
  onClick,
  size = "md",
  team = null,
  isDragging = false,
}) => {
  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-20 h-20",
    lg: "w-full h-full", // Fill the container
  };

  const statusClass = banned
    ? "brawler-card-banned"
    : disabled
      ? "brawler-card-disabled opacity-70"
      : "hover:-translate-y-0.5 hover:shadow-sticker cursor-pointer";

  const teamBorderClass = team
    ? team === "blue"
      ? "ring-4 ring-brawl-blue shadow-sticker-sm"
      : "ring-4 ring-brawl-red shadow-sticker-sm"
    : "";

  const draggingClass = isDragging
    ? "scale-70 rotate-3 animate-sway shadow-sticker-lg z-50"
    : "";

  const fallbackImage = "https://cdn.brawlify.com/placeholder.png";
  const [imgSrc, setImgSrc] = useState(brawler.image);

  useEffect(() => {
    setImgSrc(brawler.image); // eslint-disable-line react-hooks/set-state-in-effect
  }, [brawler]);

  const handleImageError = () => {
    console.error(`Failed to load image for ${brawler.name}:`, brawler.image);

    const fallbackId = brawler.id.toString().padStart(8, "0");
    const brawlifyUrl = `https://cdn.brawlify.com/brawler-thumbs/${fallbackId}.png`;

    if (imgSrc.includes("brawlify.com")) {
      setImgSrc(fallbackImage);
    } else {
      setImgSrc(brawlifyUrl);
    }
  };

  return (
    <div
      className={`brawler-card ${sizeClasses[size]} ${statusClass} ${teamBorderClass} ${draggingClass} animate-scale-in transition-all duration-200`}
      onClick={!disabled && !banned ? onClick : undefined}
    >
      <div
        className={`relative h-full w-full overflow-hidden rounded-xl ${isDragging ? "shadow-lg" : ""} ${disabled ? "grayscale filter" : ""}`}
      >
        <img
          src={imgSrc}
          alt={brawler.name}
          className={`h-full w-full object-cover transition-transform duration-300 ${isDragging ? "rotate-2" : ""}`}
          loading="lazy"
          onError={handleImageError}
        />

        {banned && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-1.5 w-full origin-center rotate-45 transform bg-red-500"></div>
            <div className="h-1.5 w-full origin-center -rotate-45 transform bg-red-500"></div>
          </div>
        )}

        {size === "lg" ? (
          <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-2">
            <p className="text-center font-brawl uppercase tracking-wider text-white">
              {brawler.name}
            </p>
          </div>
        ) : (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-1">
            <p className="truncate text-center font-brawl text-xs text-white">
              {brawler.name}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrawlerCard;
