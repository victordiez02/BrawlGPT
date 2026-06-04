import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ComponentProps } from "react";

const ThemeProvider = ({
  children,
  ...props
}: ComponentProps<typeof NextThemesProvider>) => (
  <NextThemesProvider
    attribute="class"
    defaultTheme="dark"
    enableSystem
    storageKey="brawlgpt:theme"
    disableTransitionOnChange
    {...props}
  >
    {children}
  </NextThemesProvider>
);

export default ThemeProvider;
