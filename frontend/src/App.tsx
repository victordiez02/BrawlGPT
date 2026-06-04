import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import ThemeProvider from "./components/ThemeProvider";
import LandingPage from "./pages/LandingPage";
import SimulatorPage from "./pages/SimulatorPage";
import NotFound from "./pages/NotFound";
import "./i18n";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const App = () => {
  // Despertamos backend
  useEffect(() => {
    fetch('https://brawlgpt-backend-762078704585.europe-west1.run.app/health')
  }, []);

  return (
    <ThemeProvider>
      <TooltipProvider>
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/simulator" element={<SimulatorPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  );
};

export default App;