"""Construye el payload para Gemini y llama al modelo."""

from __future__ import annotations

import json
import logging
import os
import re
from typing import Any, Dict, List, Tuple

from app.models import Brawler, Map
from google.genai import types
from google import genai

logger = logging.getLogger(__name__)


# Slots cronológicos del primer equipo (los demás son del segundo equipo).
_FIRST_TEAM_SLOTS = {0, 3, 4}

# Índices cronológicos de los picks enemigos cuya información de counters
# entregamos al modelo en cada fase.
_ENEMY_INDICES_BY_PHASE: Dict[int, List[int]] = {
    1: [],
    2: [0],
    3: [1, 2],
    4: [0, 3, 4],
}

# Recomendaciones del mapa relevantes en cada fase.
_MAP_RECS_BY_PHASE = {
    1: "first_pick",
    2: "other_picks",
    3: "other_picks",
    4: "last_pick",
}


_RESPONSE_SCHEMA = {
    "type": "object",
    "properties": {
        "gemini_suggestions": {
            "type": "array",
            "minItems": 1,
            "maxItems": 5,
            "items": {
                "type": "object",
                "properties": {
                    "brawlers": {"type": "string"},
                    "probability": {"type": "integer", "minimum": 0, "maximum": 100},
                    "explanationUSA": {"type": "string"},
                    "explanationESP": {"type": "string"},
                },
                "required": [
                    "brawlers",
                    "probability",
                    "explanationUSA",
                    "explanationESP",
                ],
            },
        }
    },
    "required": ["gemini_suggestions"],
}


def _split_picks_by_team(
    team: str, picks: List[str]
) -> Tuple[List[str | None], List[str | None]]:
    """Devuelve (blue_team, red_team) en orden cronológico."""
    full = list(picks) + [None] * (6 - len(picks))
    first, second = [], []
    for i, value in enumerate(full):
        (first if i in _FIRST_TEAM_SLOTS else second).append(value)
    return (first, second) if team == "blue" else (second, first)


def _enemy_picks(phase: int, picks: List[str]) -> List[str]:
    return [picks[i] for i in _ENEMY_INDICES_BY_PHASE[phase] if i < len(picks)]


def _slim_available(
    brawlers: Dict[str, Brawler],
    banned: List[str],
    picks: List[str],
    enemy_team: List[str],
) -> List[Dict[str, Any]]:
    """Lista de brawlers disponibles. Sólo incluye `countered_by_enemies` si aplica."""
    excluded = set(banned) | set(picks)
    enemy_set = set(enemy_team)
    available: List[Dict[str, Any]] = []
    for b in brawlers.values():
        if b.name in excluded:
            continue
        item: Dict[str, Any] = {"name": b.name}
        if b.tier:
            item["tier"] = b.tier
        if b.category:
            item["category"] = b.category
        risky = [c for c in b.counters if c in enemy_set]
        if risky:
            item["countered_by_enemies"] = risky
        available.append(item)
    return available


def _enemy_block(
    enemy_team: List[str],
    brawlers: Dict[str, Brawler],
    banned: List[str],
    picks: List[str],
) -> List[Dict[str, Any]]:
    """Por cada enemigo, lista quién lo cuenta entre los pickeables."""
    excluded = set(banned) | set(picks) | set(enemy_team)
    out: List[Dict[str, Any]] = []
    for name in enemy_team:
        b = brawlers.get(name)
        if not b:
            continue
        good = [c for c in b.counters if c not in excluded]
        out.append({"name": name, "countered_by": good})
    return out


def _map_block(selected: Map, phase: int) -> Dict[str, Any]:
    rec_field = _MAP_RECS_BY_PHASE[phase]
    return {
        "name": selected.name,
        "mode": selected.mode,
        "indestructible_walls": selected.indestructible_walls,
        "recommended_picks": list(getattr(selected, rec_field)),
        "strategy": selected.strategy,
    }


def build_user_message(
    *,
    phase: int,
    selected_map: str,
    maps: Dict[str, Map],
    brawlers: Dict[str, Brawler],
    banned_brawlers: List[str],
    team: str,
    picks: List[str],
    phase_meta: Dict[str, Any],
) -> str:
    """Construye el JSON que se envía como `contents` a Gemini."""
    if phase not in _ENEMY_INDICES_BY_PHASE:
        raise ValueError(f"Fase no válida: {phase} (esperado 1-4).")
    if selected_map not in maps:
        raise ValueError(f"Mapa no encontrado: '{selected_map}'.")

    other_color = "red" if team == "blue" else "blue"
    next_turn = team if phase % 2 else other_color
    blue_team, red_team = _split_picks_by_team(team, picks)
    enemies = _enemy_picks(phase, picks)

    payload: Dict[str, Any] = {
        "phase_name": phase_meta["name"],
        "picks_to_make": phase_meta["picks_to_make"],
        "map": _map_block(maps[selected_map], phase),
        "draft": {
            "first_pick_team": team,
            "next_turn": next_turn,
            "banned": list(banned_brawlers),
            "blue_team": blue_team,
            "red_team": red_team,
        },
        "available_brawlers": _slim_available(
            brawlers, banned_brawlers, picks, enemies
        ),
    }
    if enemies:
        payload["enemy_picks"] = _enemy_block(enemies, brawlers, banned_brawlers, picks)
    return json.dumps(payload, ensure_ascii=False, indent=2)


def build_system_instruction(prompts: Dict[str, Any], phase: int) -> str:
    return prompts["phases"][str(phase)]["system"]


_MODEL_NAME = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")

_API_KEY = os.getenv("GEMINI_API_KEY")
if not _API_KEY:
    raise RuntimeError("GEMINI_API_KEY no está definida en las variables de entorno.")

_gemini_client = genai.Client(api_key=_API_KEY)

def call_gemini(system_instruction: str, user_message: str) -> Dict[str, Any]:
    response = _gemini_client.models.generate_content(
        model=_MODEL_NAME,
        contents=user_message,
        config=types.GenerateContentConfig(
            system_instruction=system_instruction,
            response_mime_type="application/json",
            response_schema=_RESPONSE_SCHEMA,
            temperature=0.7,
        ),
    )
    text = (response.text or "").strip()
    if not text:
        return {"gemini_suggestions": []}
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        logger.warning("Gemini devolvió contenido no-JSON; aplicando parser legacy.")
        return {"gemini_suggestions": _legacy_parse(text)}


_LEGACY_PATTERN = re.compile(
    r"(?:\d+\.)?\s*(.*?)\s*\|\s*(\d+)%\s*\|\s*(.*?)\s*\|\s*(.*)"
)


def _legacy_parse(text: str) -> List[Dict[str, Any]]:
    """Fallback para respuestas no-JSON con formato `Brawler | % | EN | ES`."""
    out: List[Dict[str, Any]] = []
    for line in text.splitlines():
        m = _LEGACY_PATTERN.match(line.strip())
        if not m:
            continue
        b, prob, en, es = m.groups()
        out.append(
            {
                "brawlers": b.replace("**", "").strip(),
                "probability": int(prob),
                "explanationUSA": en.replace("**", "").strip(),
                "explanationESP": es.replace("**", "").strip(),
            }
        )
    return out


def recommend(
    *,
    phase: int,
    selected_map: str,
    team: str,
    banned_brawlers: List[str],
    picks: List[str],
    brawlers: Dict[str, Brawler],
    maps: Dict[str, Map],
    prompts: Dict[str, Any],
) -> Dict[str, Any]:
    """Genera la recomendación completa para un draft. Lo que llama la ruta."""
    phase_meta = prompts["phases"][str(phase)]
    system = build_system_instruction(prompts, phase)
    user_msg = build_user_message(
        phase=phase,
        selected_map=selected_map,
        maps=maps,
        brawlers=brawlers,
        banned_brawlers=banned_brawlers,
        team=team,
        picks=picks,
        phase_meta=phase_meta,
    )
    return call_gemini(system, user_msg)
