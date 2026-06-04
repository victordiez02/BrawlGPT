"""Punto de entrada FastAPI para BrawlGPT."""

from __future__ import annotations
import logging
import os
from contextlib import asynccontextmanager
from pathlib import Path
from dotenv import load_dotenv
load_dotenv()
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.data import load_meta, load_prompts
from app.routes import router as draft_router

logging.basicConfig(
    level=os.getenv("LOG_LEVEL", "INFO"),
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)

META_VERSION = os.getenv("META_VERSION", "mar2025")
DATA_DIR = Path(__file__).resolve().parent / "data"
META_JSON = DATA_DIR / "meta" / META_VERSION / "meta.json"
PROMPTS_JSON = DATA_DIR / "prompts" / "prompts.json"


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Cargando meta '%s'", META_VERSION)
    brawlers, maps = load_meta(META_JSON)
    prompts = load_prompts(PROMPTS_JSON)
    app.state.brawlers = brawlers
    app.state.maps = maps
    app.state.prompts = prompts
    logger.info("Cargados %d brawlers y %d mapas", len(brawlers), len(maps))
    yield


app = FastAPI(
    title="BrawlGPT API",
    description="API que recomienda picks óptimos de Brawl Stars usando Gemini AI.",
    version="1.0.0",
    lifespan=lifespan,
)

origins = os.getenv("ALLOWED_ORIGINS").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in origins],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

app.include_router(draft_router)
