import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ChevronRight, Cpu, Swords, Target, Wand2 } from "lucide-react";
import Toolbar from "@/components/Toolbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const LandingPage = () => {
  const { t } = useTranslation();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className="app-shell min-h-screen overflow-hidden">
      <Toolbar />

      <header className="relative pb-16 pt-12 sm:pb-24 sm:pt-16">
        <div className="brawl-band absolute inset-x-0 top-0 h-1.5 border-b-2 border-[hsl(var(--ink))]" />

        <div className="container relative mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 text-center">
          <img
            src="/resources/Logo.png"
            alt="BrawlGPT"
            className={`drop-bs-lg w-full max-w-2xl ${
              visible ? "animate-comic-pop" : "opacity-0"
            }`}
            style={{ animationDelay: "0.1s" }}
          />

          <div
            className={`glass-panel max-w-2xl px-6 py-4 ${
              visible ? "animate-fade-in" : "opacity-0"
            }`}
            style={{ animationDelay: "0.3s" }}
          >
            <p className="font-brawl text-lg uppercase tracking-wide text-primary sm:text-xl">
              {t("landing_subtitle_1")}
            </p>
            <p className="mt-1 text-sm text-foreground/80 sm:text-base">
              {t("landing_subtitle_2")}
            </p>
          </div>

          <Link to="/simulator" className="group inline-block">
            <Button
              variant="ai"
              size="lg"
              className="bs-shine font-brawl text-lg uppercase tracking-widest"
            >
              <Swords className="size-5" />
              {t("cta_button")}
              <ChevronRight className="transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </header>

      <section className="relative py-10">
        <div className="container mx-auto grid max-w-6xl gap-6 px-4 sm:grid-cols-2 lg:grid-cols-3">
          <HudPanel
            number="1"
            icon={<Target className="size-6" />}
            color="brawl-blue"
            title={t("step_1_title")}
            description={t("step_1_desc")}
          />
          <HudPanel
            number="2"
            icon={<Wand2 className="size-6" />}
            color="primary"
            title={t("step_2_title")}
            description={t("step_2_desc")}
          />
          <HudPanel
            number="3"
            icon={<Cpu className="size-6" />}
            color="brawl-red"
            title={t("step_3_title")}
            description={t("step_3_desc")}
          />
        </div>
      </section>

      <Footer />
    </div>
  );
};

interface HudPanelProps {
  number: string;
  icon: React.ReactNode;
  color: "brawl-blue" | "primary" | "brawl-red";
  title: string;
  description: string;
}

const HudPanel = ({
  number,
  icon,
  color,
  title,
  description,
}: HudPanelProps) => {
  const colorMap: Record<HudPanelProps["color"], string> = {
    "brawl-blue": "bg-brawl-blue text-white",
    primary: "bg-primary text-primary-foreground",
    "brawl-red": "bg-brawl-red text-white",
  };

  return (
    <article className="glass-panel relative p-6 pt-8 transition-transform hover:-translate-y-1">
      <div
        className={`absolute -top-5 left-6 flex size-12 items-center justify-center rounded-xl border-[3px] border-[hsl(var(--ink))] font-brawl text-xl shadow-sticker ${colorMap[color]}`}
      >
        {number}
      </div>
      <div className="absolute -top-5 right-6 inline-flex size-12 items-center justify-center rounded-xl border-[3px] border-[hsl(var(--ink))] bg-card text-primary shadow-sticker-sm">
        {icon}
      </div>
      <h3 className="mb-2 mt-4 font-brawl text-2xl uppercase">{title}</h3>
      <p className="text-sm text-foreground/85 sm:text-base">{description}</p>
    </article>
  );
};

export default LandingPage;
