"""Modelos Pydantic v2 para la API (entradas / salidas HTTP)."""

from typing import List, Literal

from pydantic import BaseModel, Field, field_validator


class DraftRequest(BaseModel):
    phase: int = Field(ge=1, le=4)
    selected_map: str = Field(min_length=1)
    banned_brawlers: List[str] = Field(default_factory=list, max_length=6)
    team: Literal["blue", "red"]
    picks: List[str] = Field(default_factory=list, max_length=5)

    @field_validator("banned_brawlers", "picks")
    @classmethod
    def _strip_and_unique(cls, v: List[str]) -> List[str]:
        cleaned = [s.strip() for s in v if s and s.strip()]
        if len(cleaned) != len(set(cleaned)):
            raise ValueError("Duplicate brawler names are not allowed")
        return cleaned


class GeminiSuggestion(BaseModel):
    brawlers: str
    probability: int = Field(ge=0, le=100)
    explanationUSA: str
    explanationESP: str


class GeminiResponse(BaseModel):
    gemini_suggestions: List[GeminiSuggestion]


class DraftResponse(BaseModel):
    gemini_response: GeminiResponse
