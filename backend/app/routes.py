"""Rutas FastAPI."""

from __future__ import annotations

import logging
import os

from fastapi import APIRouter, Depends, Header, HTTPException, Request, status

from app.recommender import recommend
from app.schemas import DraftRequest

logger = logging.getLogger(__name__)
router = APIRouter()


def _verify_api_key(x_api_key: str = Header(default="")) -> None:
    expected = os.getenv("BRAWLGPT_API_KEY")
    if not expected or x_api_key != expected:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden: invalid API key",
        )


@router.get("/", tags=["health"])
def root() -> dict:
    return {"message": "Brawl Stars API is working"}


@router.get("/health", tags=["health"])
def health() -> dict:
    return {"status": "ok"}


@router.post("/draft", tags=["draft"], dependencies=[Depends(_verify_api_key)])
def handle_draft(request: Request, draft_request: DraftRequest) -> dict:
    """Procesa el draft y devuelve recomendaciones generadas por Gemini."""
    state = request.app.state
    logger.info(
        "Draft phase=%d map=%s team=%s picks=%s bans=%s",
        draft_request.phase,
        draft_request.selected_map,
        draft_request.team,
        draft_request.picks,
        draft_request.banned_brawlers,
    )
    try:
        gemini_response = recommend(
            phase=draft_request.phase,
            selected_map=draft_request.selected_map,
            team=draft_request.team,
            banned_brawlers=draft_request.banned_brawlers,
            picks=draft_request.picks,
            brawlers=state.brawlers,
            maps=state.maps,
            prompts=state.prompts,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e
    except FileNotFoundError as e:
        raise HTTPException(status_code=500, detail=f"Recurso ausente: {e}") from e
    except Exception as e:  # noqa: BLE001
        logger.exception("Error generando recomendación")
        raise HTTPException(status_code=502, detail=f"Gemini error: {e}") from e

    return {"gemini_response": gemini_response}
