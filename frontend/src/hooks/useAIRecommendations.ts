import { useCallback, useState } from "react";
import { getAIRecommendation, GeminiSuggestion } from "@/lib/api";
import { GameMap } from "@/lib/maps";
import type { Team } from "@/lib/draftPhase";

export interface UseAIRecommendationsResult {
  isLoading: boolean;
  error: Error | null;
  recommendations: GeminiSuggestion[] | null;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  request: (params: {
    phase: number;
    map: GameMap;
    bannedBrawlers: number[];
    firstPick: Team;
    selectedBrawlers: (number | null)[];
  }) => Promise<GeminiSuggestion[]>;
  reset: () => void;
}

export const useAIRecommendations = (): UseAIRecommendationsResult => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [recommendations, setRecommendations] = useState<
    GeminiSuggestion[] | null
  >(null);
  const [isOpen, setIsOpen] = useState(true);

  const request = useCallback<UseAIRecommendationsResult["request"]>(
    async ({ phase, map, bannedBrawlers, firstPick, selectedBrawlers }) => {
      setIsLoading(true);
      setError(null);
      setRecommendations(null);
      setIsOpen(true);
      try {
        const response = await getAIRecommendation(
          phase,
          map,
          bannedBrawlers,
          firstPick,
          selectedBrawlers,
        );
        const suggestions = response?.gemini_response?.gemini_suggestions;
        if (!suggestions) throw new Error("Unexpected API response");
        setRecommendations(suggestions);
        return suggestions;
      } catch (err) {
        const e = err instanceof Error ? err : new Error(String(err));
        setError(e);
        throw e;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const reset = useCallback(() => {
    setRecommendations(null);
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    recommendations,
    isOpen,
    setIsOpen,
    request,
    reset,
  };
};
