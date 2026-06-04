"""Carga de datos: `meta.json` (brawlers + mapas) y `prompts.json`."""

from __future__ import annotations

import json
from functools import lru_cache
from pathlib import Path
from typing import Any, Dict, List, Tuple

from app.models import Brawler, Map


def load_meta(path: str | Path) -> Tuple[Dict[str, Brawler], Dict[str, Map]]:
    """Devuelve `(brawlers_by_name, maps_by_name)` desde un único `meta.json`."""
    file = Path(path)
    if not file.exists():
        raise FileNotFoundError(f"Meta JSON no encontrado: {file}")
    data = json.loads(file.read_text(encoding="utf-8"))

    categories: Dict[str, List[str]] = data.get("categories", {})
    name_to_cat = {n: cat for cat, members in categories.items() for n in members}

    brawlers: Dict[str, Brawler] = {
        e["name"]: Brawler(
            name=e["name"],
            tier=e.get("tier"),
            category=e.get("category") or name_to_cat.get(e["name"], ""),
        )
        for e in data.get("brawlers", [])
    }

    # Resolución de counters: admite nombres de brawler o de categoría.
    for entry in data.get("brawlers", []):
        target = brawlers[entry["name"]]
        for raw in entry.get("counters", []):
            candidates = [raw] if raw in brawlers else categories.get(raw, [])
            for cn in candidates:
                if cn in brawlers and cn != target.name and cn not in target.counters:
                    target.counters.append(cn)

    maps: Dict[str, Map] = {
        e["name"]: Map(
            name=e["name"],
            mode=e.get("mode", ""),
            indestructible_walls=bool(e.get("indestructible_walls", False)),
            first_pick=list(e.get("first_pick", [])),
            last_pick=list(e.get("last_pick", [])),
            other_picks=list(e.get("other_picks", [])),
            strategy=e.get("strategy", ""),
        )
        for e in data.get("maps", [])
    }
    return brawlers, maps


@lru_cache(maxsize=4)
def load_prompts(path: str | Path) -> Dict[str, Any]:
    file = Path(path)
    if not file.exists():
        raise FileNotFoundError(f"Prompts JSON no encontrado: {file}")
    return json.loads(file.read_text(encoding="utf-8"))
