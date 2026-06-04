import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-card group-[.toaster]:text-foreground group-[.toaster]:border-[3px] group-[.toaster]:border-[hsl(var(--ink))] group-[.toaster]:rounded-xl group-[.toaster]:shadow-[0_4px_0_0_hsl(var(--ink))] group-[.toaster]:font-sans",
          title: "font-brawl uppercase tracking-wide text-primary",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:border-2 group-[.toast]:border-[hsl(var(--ink))] group-[.toast]:font-brawl group-[.toast]:uppercase",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:border-2 group-[.toast]:border-[hsl(var(--ink))]",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
