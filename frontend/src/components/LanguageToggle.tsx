import { useTranslation } from "react-i18next";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const LanguageToggle = () => {
  const { i18n, t } = useTranslation();
  const current = i18n.language?.startsWith("en") ? "en" : "es";
  const next = current === "es" ? "en" : "es";
  const flag = current === "es" ? "fi-es" : "fi-us";

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className="btn-hud gap-1.5 px-2 font-sans text-xs font-extrabold tracking-wide"
          style={{ width: "auto", minWidth: "2.75rem" }}
          aria-label={t("toggle_language")}
          onClick={() => i18n.changeLanguage(next)}
        >
          <span
            className={`fi ${flag} rounded-sm`}
            style={{ fontSize: "1.25rem", lineHeight: 1 }}
          />
          <span>{current.toUpperCase()}</span>
        </button>
      </TooltipTrigger>
      <TooltipContent>{t("toggle_language")}</TooltipContent>
    </Tooltip>
  );
};

export default LanguageToggle;
