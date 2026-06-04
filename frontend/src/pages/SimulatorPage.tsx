import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import DraftSimulator from "@/components/DraftSimulator";
import Toolbar from "@/components/Toolbar";
import MapSelectionPage from "@/components/MapSelectionPage";
import Footer from "@/components/Footer";
import { GameMap } from "@/lib/maps";
import { Swords } from "lucide-react";

const SimulatorPage: React.FC = () => {
  const [selectedMap, setSelectedMap] = useState<GameMap | null>(null);
  const [showIconBS, setShowIconBS] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIconBS(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const returnToMapSelection = () => {
    setSelectedMap(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSelectMap = (map: GameMap) => {
    setSelectedMap(map);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="app-shell min-h-screen pb-12">
      <Header />

      <Toolbar showHelp />

      <main className="container relative mx-auto pb-20">
        {showIconBS && (
          <div className="pointer-events-none absolute inset-0 z-10 flex animate-fade-in items-center justify-center">
            <Swords className="text-primary opacity-80" size={100} />
          </div>
        )}

        {selectedMap ? (
          <DraftSimulator
            initialMap={selectedMap}
            onReturnToMapSelection={returnToMapSelection}
          />
        ) : (
          <MapSelectionPage onSelectMap={handleSelectMap} />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default SimulatorPage;
