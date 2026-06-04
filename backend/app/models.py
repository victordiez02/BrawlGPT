"""Modelos de dominio: `Brawler` y `Map` (dataclasses)."""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import List, Optional


@dataclass
class Brawler:
    name: str
    tier: Optional[str] = None
    category: str = ""
    counters: List[str] = field(default_factory=list)


@dataclass
class Map:
    name: str
    mode: str = ""
    indestructible_walls: bool = False
    first_pick: List[str] = field(default_factory=list)
    last_pick: List[str] = field(default_factory=list)
    other_picks: List[str] = field(default_factory=list)
    strategy: str = ""
