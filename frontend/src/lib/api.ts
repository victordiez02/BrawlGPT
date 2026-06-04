import { brawlers } from "./brawlers";
import { GameMap } from "./maps";

export interface DraftData {
  map: { id: number; name: string; mode: string };
  userTeam: "blue" | "red";
  blueTeam: (number | null)[];
  redTeam: (number | null)[];
  banned: number[];
}

export interface ApiResponse {
  suggestedBrawlers: { id: number; name: string; reason: string }[];
  counterPicks: { id: number; name: string; counters: number[] }[];
}

export interface GeminiSuggestion {
  brawlers: string[] | string;
  probability: number;
  explanationUSA?: string;
  explanationESP?: string;
}

export interface GeminiResponse {
  gemini_response: { gemini_suggestions: GeminiSuggestion[] };
}

const API_BASE_URL =
  import.meta.env.VITE_BRAWLGPT_API_URL as string | undefined

const idsToNames = (ids: ReadonlyArray<number | null>): string[] =>
  ids
    .map((id) =>
      id === null ? null : (brawlers.find((b) => b.id === id)?.name ?? null),
    )
    .filter((n): n is string => Boolean(n));

const toChronologicalOrder = (
  selectedBrawlers: (number | null)[],
  firstPick: "blue" | "red",
): (number | null)[] => {
  const pickOrder =
    firstPick === "blue" ? [0, 3, 4, 1, 2, 5] : [3, 0, 1, 4, 5, 2];
  return pickOrder.map((slot) => selectedBrawlers[slot]);
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

interface FetchWithRetryOptions {
  retries?: number;
  retryDelayMs?: number;
}

async function fetchWithRetry(
  url: string,
  init: RequestInit,
  { retries = 2, retryDelayMs = 800 }: FetchWithRetryOptions = {},
): Promise<Response> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, init);
      if (response.status >= 500 && attempt < retries) {
        await sleep(retryDelayMs * (attempt + 1));
        continue;
      }
      return response;
    } catch (err) {
      lastError = err;
      if (attempt < retries) {
        await sleep(retryDelayMs * (attempt + 1));
      }
    }
  }
  throw lastError instanceof Error ? lastError : new Error("Network error");
}

export const getAIRecommendation = async (
  phase: number,
  selectedMap: GameMap | null,
  bannedBrawlers: number[],
  firstPick: "blue" | "red",
  selectedBrawlers: (number | null)[],
): Promise<GeminiResponse> => {
  if (!selectedMap) throw new Error("No map selected");

  const requestData = {
    phase,
    selected_map: selectedMap.name,
    banned_brawlers: idsToNames(bannedBrawlers),
    team: firstPick,
    picks: idsToNames(toChronologicalOrder(selectedBrawlers, firstPick)),
  };

  const apiKey = import.meta.env.VITE_BRAWLGPT_API_KEY as string | undefined;
  const response = await fetchWithRetry(`${API_BASE_URL}/draft`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(apiKey ? { "x-api-key": apiKey } : {}),
    },
    body: JSON.stringify(requestData),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(
      `API error ${response.status}${detail ? `: ${detail}` : ""}`,
    );
  }
  return response.json();
};
