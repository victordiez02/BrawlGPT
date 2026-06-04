import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <div className="app-shell flex min-h-screen flex-col items-center justify-center gap-8 px-4 text-center">
      <img
        src="/resources/IconoApp.png"
        alt=""
        aria-hidden
        className="drop-bs-lg size-32 animate-bs-float"
      />
      <span
        aria-hidden
        className="text-stroke-thick drop-bs-lg animate-comic-pop font-brawl text-[140px] leading-none text-primary sm:text-[180px]"
      >
        404
      </span>
      <div className="glass-panel max-w-md animate-fade-in px-6 py-4">
        <p className="font-brawl text-2xl uppercase text-primary">
          ¡Mapa no encontrado!
        </p>
        <p className="mt-1 text-base text-foreground/85">
          Este draft no existe en ningún brawl.
        </p>
      </div>
      <Link to="/" className="inline-block">
        <Button
          variant="ai"
          size="lg"
          className="bs-shine font-brawl uppercase"
        >
          <Home className="size-5" />
          {t("back_to_home")}
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;
