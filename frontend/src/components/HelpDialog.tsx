import React from "react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  ArrowRight,
  Brain,
  Cpu,
  DraftingCompass,
  HelpCircle,
  MousePointerClick,
  MousePointerSquareDashed,
  Swords,
} from "lucide-react";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";

const HelpDialog: React.FC = () => {
  const { i18n } = useTranslation();
  const isSpanish = i18n.language === "es";

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-xl transition-all"
          aria-label={isSpanish ? "Ayuda" : "Help"}
        >
          <HelpCircle className="size-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="glass-panel max-h-[80vh] max-w-3xl text-foreground">
        <DialogHeader>
          <DialogTitle className="flex items-center font-display text-2xl uppercase tracking-wide">
            <Swords className="mr-2 text-primary" />
            {isSpanish ? "¿Cómo funciona BrawlGPT?" : "How does BrawlGPT work?"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {isSpanish
              ? "Una guía completa para utilizar el simulador de draft con IA"
              : "A complete guide to using the AI-powered draft simulator"}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="mt-2 space-y-6">
            {/* Introduction */}
            <div className="rounded-xl border-2 border-foreground bg-muted p-4 transition-all duration-300">
              <h3 className="mb-2 flex items-center text-lg font-semibold">
                <Brain className="mr-2 text-accent" />
                {isSpanish
                  ? "Inteligencia Artificial Avanzada"
                  : "Advanced Artificial Intelligence"}
              </h3>
              <p className="text-sm leading-relaxed">
                {isSpanish
                  ? "BrawlGPT utiliza un modelo de inteligencia artificial (Google Gemini) para analizar tu draft y generar recomendaciones de picks óptimos en tiempo real. El modelo ha sido entrenado con miles de partidas competitivas para ofrecerte las mejores opciones estratégicas posibles."
                  : "BrawlGPT uses an artificial intelligence model (Google Gemini) to analyze your draft and generate optimal pick recommendations in real-time. The model has been trained on thousands of competitive matches to provide you with the best possible strategic options."}
              </p>
            </div>

            {/* Basic Usage */}
            <div className="space-y-4">
              <h3 className="flex items-center text-lg font-semibold">
                <DraftingCompass className="mr-2 text-accent" />
                {isSpanish ? "Uso Básico" : "Basic Usage"}
              </h3>

              <div className="rounded-xl border-2 border-foreground bg-muted p-4 transition-all duration-300 hover:-translate-y-0.5">
                <div className="flex items-start">
                  <span className="mr-3 mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-foreground bg-brawl-blue text-white">
                    1
                  </span>
                  <div>
                    <h4 className="mb-1 font-semibold">
                      {isSpanish ? "Selecciona un mapa" : "Select a map"}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {isSpanish
                        ? "Comienza seleccionando un mapa de juego. Esto es crucial porque las recomendaciones se basarán en los brawlers más efectivos para ese mapa específico."
                        : "Start by selecting a game map. This is crucial as recommendations will be based on the most effective brawlers for that specific map."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border-2 border-foreground bg-muted p-4 transition-all duration-300 hover:-translate-y-0.5">
                <div className="flex items-start">
                  <span className="mr-3 mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-foreground bg-brawl-blue text-white">
                    2
                  </span>
                  <div>
                    <h4 className="mb-1 font-semibold">
                      {isSpanish
                        ? "Elige quién empieza"
                        : "Choose who picks first"}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {isSpanish
                        ? "Decide si el equipo azul o rojo realizará el primer pick. Esto afecta al orden de selección y a las estrategias recomendadas."
                        : "Decide whether the blue or red team will make the first pick. This affects the selection order and recommended strategies."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border-2 border-foreground bg-muted p-4 transition-all duration-300 hover:-translate-y-0.5">
                <div className="flex items-start">
                  <span className="mr-3 mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-foreground bg-brawl-blue text-white">
                    3
                  </span>
                  <div>
                    <h4 className="mb-1 font-semibold">
                      {isSpanish
                        ? "Banea brawlers (opcional)"
                        : "Ban brawlers (optional)"}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {isSpanish
                        ? "Puedes banear hasta 6 brawlers que no estarán disponibles para la selección, creando un escenario más realista."
                        : "You can ban up to 6 brawlers that won't be available for selection, creating a more realistic scenario."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border-2 border-foreground bg-muted p-4 transition-all duration-300 hover:-translate-y-0.5">
                <div className="flex items-start">
                  <span className="mr-3 mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-foreground bg-brawl-blue text-white">
                    4
                  </span>
                  <div>
                    <h4 className="mb-1 font-semibold">
                      {isSpanish
                        ? "Simula el draft actual"
                        : "Simulate the current draft"}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {isSpanish
                        ? "Selecciona brawlers para ambos equipos siguiendo el orden de draft indicado. Puedes hacerlo en cualquier fase del draft."
                        : "Select brawlers for both teams following the indicated draft order. You can do this at any phase of the draft."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border-2 border-foreground bg-muted p-4 transition-all duration-300 hover:-translate-y-0.5">
                <div className="flex items-start">
                  <span className="mr-3 mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-foreground bg-brawl-blue text-white">
                    5
                  </span>
                  <div>
                    <h4 className="mb-1 font-semibold">
                      {isSpanish
                        ? "Genera recomendaciones"
                        : "Generate recommendations"}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {isSpanish
                        ? "Presiona el botón azul brillante para que la IA analice el draft actual y genere las mejores opciones para la fase actual."
                        : "Press the bright blue button to have the AI analyze the current draft and generate the best options for the current phase."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Features */}
            <div className="space-y-4">
              <h3 className="flex items-center text-lg font-semibold">
                <MousePointerClick className="mr-2 text-accent" />
                {isSpanish ? "Controles Interactivos" : "Interactive Controls"}
              </h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-xl border-2 border-foreground bg-muted p-4 transition-all duration-300 hover:-translate-y-0.5">
                  <h4 className="mb-2 flex items-center font-semibold">
                    <MousePointerClick
                      size={16}
                      className="mr-1 text-brawl-blue"
                    />
                    {isSpanish ? "Click Izquierdo" : "Left Click"}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {isSpanish
                      ? "Selecciona un brawler para añadirlo al draft en la posición actual."
                      : "Select a brawler to add it to the draft in the current position."}
                  </p>
                </div>

                <div className="rounded-xl border-2 border-foreground bg-muted p-4 transition-all duration-300 hover:-translate-y-0.5">
                  <h4 className="mb-2 flex items-center font-semibold">
                    <MousePointerClick
                      size={16}
                      className="mr-1 text-brawl-red"
                    />
                    {isSpanish ? "Click Derecho" : "Right Click"}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {isSpanish
                      ? "Banea un brawler para que no esté disponible en el draft."
                      : "Ban a brawler so it's not available in the draft."}
                  </p>
                </div>

                <div className="rounded-xl border-2 border-foreground bg-muted p-4 transition-all duration-300 hover:-translate-y-0.5">
                  <h4 className="mb-2 flex items-center font-semibold">
                    <MousePointerSquareDashed
                      size={16}
                      className="mr-1 text-primary"
                    />
                    {isSpanish ? "Arrastrar y Soltar" : "Drag and Drop"}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {isSpanish
                      ? "Arrastra brawlers dentro del draft para reorganizarlos o a la papelera para eliminarlos."
                      : "Drag brawlers within the draft to rearrange them or to the trash can to remove them."}
                  </p>
                </div>

                <div className="rounded-xl border-2 border-foreground bg-muted p-4 transition-all duration-300 hover:-translate-y-0.5">
                  <h4 className="mb-2 flex items-center font-semibold">
                    <Cpu size={16} className="mr-1 text-accent" />
                    {isSpanish ? "Recomendaciones IA" : "AI Recommendations"}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {isSpanish
                      ? "El panel de recomendaciones puede contraerse o expandirse con el botón en la esquina superior derecha."
                      : "The recommendations panel can be collapsed or expanded with the button in the upper right corner."}
                  </p>
                </div>
              </div>
            </div>

            {/* Phases */}
            <div className="rounded-xl border-2 border-foreground bg-muted p-4 transition-all duration-300">
              <h3 className="mb-3 flex items-center text-lg font-semibold">
                <ArrowRight className="mr-2 text-primary" />
                {isSpanish ? "Fases del Draft" : "Draft Phases"}
              </h3>

              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="mr-2 mt-0.5 shrink-0 rounded-full bg-secondary/20 px-2 py-0.5 text-xs font-semibold text-secondary">
                    1
                  </div>
                  <p className="text-sm">
                    {isSpanish
                      ? "Primera fase: Recomendación para el primer pick (sin selecciones previas)"
                      : "First phase: Recommendation for the first pick (no previous selections)"}
                  </p>
                </div>

                <div className="flex items-start">
                  <div className="mr-2 mt-0.5 shrink-0 rounded-full bg-secondary/20 px-2 py-0.5 text-xs font-semibold text-secondary">
                    2
                  </div>
                  <p className="text-sm">
                    {isSpanish
                      ? "Segunda fase: Mejores combinaciones para los picks 2 y 3 (con el primer pick ya seleccionado)"
                      : "Second phase: Best combinations for picks 2 and 3 (with first pick already selected)"}
                  </p>
                </div>

                <div className="flex items-start">
                  <div className="mr-2 mt-0.5 shrink-0 rounded-full bg-secondary/20 px-2 py-0.5 text-xs font-semibold text-secondary">
                    3
                  </div>
                  <p className="text-sm">
                    {isSpanish
                      ? "Tercera fase: Mejores combinaciones para los picks 4 y 5 (con los picks 1, 2 y 3 ya seleccionados)"
                      : "Third phase: Best combinations for picks 4 and 5 (with picks 1, 2, and 3 already selected)"}
                  </p>
                </div>

                <div className="flex items-start">
                  <div className="mr-2 mt-0.5 shrink-0 rounded-full bg-secondary/20 px-2 py-0.5 text-xs font-semibold text-secondary">
                    4
                  </div>
                  <p className="text-sm">
                    {isSpanish
                      ? "Cuarta fase: Recomendación para el último pick (con 5 picks ya seleccionados)"
                      : "Fourth phase: Recommendation for the last pick (with 5 picks already selected)"}
                  </p>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="rounded-xl border-2 border-foreground bg-primary/15 p-4 shadow-sticker-sm transition-all duration-300 hover:-translate-y-0.5">
              <h3 className="mb-2 flex items-center text-lg font-semibold text-primary">
                <Swords className="mr-2" />
                {isSpanish ? "Consejos Pro" : "Pro Tips"}
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <span className="mr-2 text-primary">•</span>
                  {isSpanish
                    ? "Las recomendaciones de la IA muestran un porcentaje de efectividad basado en el análisis del draft."
                    : "AI recommendations show an effectiveness percentage based on draft analysis."}
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-primary">•</span>
                  {isSpanish
                    ? "Las medallas de oro, plata y bronce destacan las tres mejores opciones recomendadas."
                    : "Gold, silver, and bronze medals highlight the top three recommended options."}
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-primary">•</span>
                  {isSpanish
                    ? "Usa la papelera para reiniciar el draft completamente si quieres empezar de nuevo."
                    : "Use the trash can to reset the draft completely if you want to start over."}
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-primary">•</span>
                  {isSpanish
                    ? "Experimenta con diferentes escenarios para entender mejor las estrategias de contrapiick."
                    : "Experiment with different scenarios to better understand counterpick strategies."}
                </li>
              </ul>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default HelpDialog;
