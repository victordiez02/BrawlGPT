import HelpDialog from "@/components/HelpDialog";
import LanguageToggle from "@/components/LanguageToggle";
import ThemeToggle from "@/components/ThemeToggle";

interface ToolbarProps {
  showHelp?: boolean;
}

const Toolbar = ({ showHelp = false }: ToolbarProps) => (
  <div className="fixed right-4 top-4 z-50 flex items-center gap-2">
    {showHelp && <HelpDialog />}
    <LanguageToggle />
    <ThemeToggle />
  </div>
);

export default Toolbar;
