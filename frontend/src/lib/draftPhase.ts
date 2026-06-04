/**
 * Lógica pura de fases del draft.
 *
 * Slots por equipo: 0,1,2 = blue · 3,4,5 = red.
 * Orden cronológico (primer pick → último): blue first → [0,3,4,1,2,5]; red first → [3,0,1,4,5,2].
 */

export type Team = "blue" | "red";

export const getPickOrder = (firstPick: Team): readonly number[] =>
  firstPick === "blue" ? [0, 3, 4, 1, 2, 5] : [3, 0, 1, 4, 5, 2];

export const findTeamByIndex = (index: number): Team =>
  index < 3 ? "blue" : "red";

/** Devuelve la fase actual según cuántos picks haya. 0 si el conteo es inválido. */
export const getCurrentDraftPhase = (
  selectedCount: number,
): 1 | 2 | 3 | 4 | 0 => {
  if (selectedCount === 0) return 1;
  if (selectedCount === 1) return 2;
  if (selectedCount === 3) return 3;
  if (selectedCount === 5) return 4;
  return 0;
};

/** Comprueba que las posiciones rellenas correspondan al orden cronológico esperado. */
export const isPhaseValid = (
  selectedBrawlers: ReadonlyArray<number | null>,
  pickOrder: readonly number[],
): boolean => {
  const filled = selectedBrawlers
    .map((id, idx) => (id !== null ? idx : -1))
    .filter((idx) => idx >= 0);
  const expected = pickOrder.slice(0, filled.length).slice().sort();
  const actual = filled.slice().sort();
  return (
    expected.length === actual.length &&
    expected.every((v, i) => v === actual[i])
  );
};

interface MissingMessageOptions {
  selectedBrawlers: ReadonlyArray<number | null>;
  pickOrder: readonly number[];
  isValid: boolean;
  /** Función `t` de i18n (string -> string). */
  t: (key: string, opts?: Record<string, unknown>) => string;
}

/** Devuelve un mensaje i18n explicando por qué el draft no es válido. */
export const getMissingPicksMessage = ({
  selectedBrawlers,
  pickOrder,
  isValid,
  t,
}: MissingMessageOptions): string => {
  const filled = selectedBrawlers
    .map((id, idx) => (id !== null ? idx : -1))
    .filter((idx) => idx >= 0);

  const missingPicks: number[] = [];
  for (let i = 0; i < 5; i++) {
    if (!filled.includes(pickOrder[i])) missingPicks.push(i + 1);
  }

  switch (filled.length) {
    case 0:
      return t("select_first_pick");
    case 1:
      return filled[0] === pickOrder[0]
        ? t("select_second_pick_brawler")
        : t("select_first_pick_brawler");
    case 2:
      return !filled.includes(pickOrder[0]) || !filled.includes(pickOrder[1])
        ? t("select_first_second_pick_brawlers")
        : t("select_third_pick_brawler");
    case 3:
      return isValid
        ? t("select_fourth_pick_brawler")
        : t("incorrect_pick_order", {
            missingPicks: missingPicks.slice(0, 3).join("º, "),
          });
    case 4:
      return [0, 1, 2, 3].every((i) => filled.includes(pickOrder[i]))
        ? t("select_fifth_pick_brawler")
        : t("incorrect_pick_order", {
            missingPicks: missingPicks.slice(0, 4).join("º, "),
          });
    case 5:
      return "";
    default:
      return t("incorrect_pick_order", {
        missingPicks: missingPicks.join("º, "),
      });
  }
};
