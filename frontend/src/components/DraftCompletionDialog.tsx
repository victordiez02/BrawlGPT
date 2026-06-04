import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { brawlers } from "@/lib/brawlers";
import { Swords, Trophy } from "lucide-react";
import { useTranslation } from "react-i18next";

interface DraftCompletionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedBrawlers: (number | null)[];
}

const DraftCompletionDialog: React.FC<DraftCompletionDialogProps> = ({
  isOpen,
  onClose,
  selectedBrawlers,
}) => {
  const { t } = useTranslation();

  const getBrawler = (id: number | null) => {
    if (id === null) return null;
    return brawlers.find((b) => b.id === id);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-panel w-[90vw] max-w-3xl animate-scale-in">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-center text-center font-display text-2xl font-bold">
            <Trophy className="mr-2 text-primary" />
            <span className="uppercase tracking-wide text-foreground">
              {t("draft_completed")}
            </span>
            <Trophy className="ml-2 text-primary" />
          </DialogTitle>
        </DialogHeader>

        <div className="py-6">
          <div className="mb-6 text-center">
            <p className="text-lg opacity-90">
              {t("draft_completion_message")}
            </p>
            <div className="mt-2 flex justify-center">
              <div className="ink-tag bg-primary text-primary-foreground">
                <Swords className="mr-1" size={18} />
                <span className="text-sm font-semibold">{t("good_luck")}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Blue Team */}
            <div>
              <div className="rounded-t-lg border-2 border-foreground bg-brawl-blue p-2 text-center font-display font-bold text-white">
                {t("blue_team")}
              </div>
              <div className="flex flex-col space-y-2 rounded-b-lg border-2 border-t-0 border-foreground bg-muted/60 p-4">
                {selectedBrawlers.slice(0, 3).map((id, idx) => {
                  const brawler = getBrawler(id);
                  return brawler ? (
                    <div
                      key={idx}
                      className="flex items-center space-x-2 rounded-lg border-2 border-foreground/70 bg-card p-2 transition-all duration-200 hover:-translate-y-0.5"
                    >
                      <div className="h-12 w-12 overflow-hidden rounded-full border-2 border-brawl-blue">
                        <img
                          src={brawler.image}
                          alt={brawler.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <span className="font-medium">{brawler.name}</span>
                    </div>
                  ) : null;
                })}
              </div>
            </div>

            {/* Red Team */}
            <div>
              <div className="rounded-t-lg border-2 border-foreground bg-brawl-red p-2 text-center font-display font-bold text-white">
                {t("red_team")}
              </div>
              <div className="flex flex-col space-y-2 rounded-b-lg border-2 border-t-0 border-foreground bg-muted/60 p-4">
                {selectedBrawlers.slice(3, 6).map((id, idx) => {
                  const brawler = getBrawler(id);
                  return brawler ? (
                    <div
                      key={idx}
                      className="flex items-center space-x-2 rounded-lg border-2 border-foreground/70 bg-card p-2 transition-all duration-200 hover:-translate-y-0.5"
                    >
                      <div className="h-12 w-12 overflow-hidden rounded-full border-2 border-brawl-red">
                        <img
                          src={brawler.image}
                          alt={brawler.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <span className="font-medium">{brawler.name}</span>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose} className="w-full">
            {t("close")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DraftCompletionDialog;
