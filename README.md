<p align="center">
<img src="frontend/public/favicon.ico" alt="BrawlGPT" width="100" />
</p>

<h1 align="center">BrawlGPT</h1>

<p align="center">
Competitive Brawl Stars drafting assistant powered by Google Gemini.
</p>

<p align="center">
  <a href="https://brawl-gpt.vercel.app/"><img src="https://img.shields.io/badge/Open%20App-FBCD29?style=for-the-badge" alt="Open App"></a>
  &nbsp;
  <a href="https://brawlgpt-backend-762078704585.europe-west1.run.app/docs"><img src="https://img.shields.io/badge/API%20Docs-00A779?style=for-the-badge" alt="API Docs"></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61dafb?logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-5-646cff?logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/FastAPI-Python-009688?logo=fastapi&logoColor=white" />
  <img src="https://img.shields.io/badge/Python-3.10+-3776AB?logo=python&logoColor=white" />
  <img src="https://img.shields.io/badge/Gemini-AI-4285F4?logo=google&logoColor=white" />
</p>

---

## Overview

BrawlGPT analyzes the current state of a competitive Brawl Stars draft (map, bans and team picks) and generates recommendations for each draft phase.

The application consists of two independent components:

- **Frontend** — React + TypeScript single-page application featuring drag-and-drop interactions, internationalization (English and Spanish), light/dark themes, and a game-inspired interface.
- **API** — FastAPI service that builds phase-specific prompts and communicates with Google Gemini using a strict `response_schema` to guarantee validated and structured JSON responses.

---

## Key Features

- Real-time draft recommendations for all draft phases.
- Structured Gemini outputs validated through Pydantic schemas.
- Explanations available in both English and Spanish.
- Interactive React frontend with drag-and-drop support.
- FastAPI backend designed around a simple JSON API.

---

## Demo

<table>
  <tr>
    <td><img src="frontend/public/resources/demos/Demo1.png" alt="Landing Page" /></td>
    <td><img src="frontend/public/resources/demos/Demo2.png" alt="Draft Progress" /></td>
  </tr>
  <tr>
    <td><img src="frontend/public/resources/demos/Demo3.png" alt="AI Recommendations" /></td>
    <td><img src="frontend/public/resources/demos/Demo4.png" alt="Brawler Selection" /></td>
  </tr>
</table>

---

## How It Works

```text
Frontend (React)
   │  POST /draft { phase, map, team, banned, picks }
   ▼
API (FastAPI)
   │  Build draft context
   │  Generate phase-specific instructions
   │  Request recommendations from Gemini
   ▼
Structured JSON response
```

Each draft phase is processed independently. Gemini only receives the information required to make recommendations, including the selected map, available brawlers, relevant counters, and current picks.

---

## Project Structure

```text
brawlgpt/
├── frontend/   React + Vite + TypeScript + Tailwind
└── backend/    FastAPI + Pydantic v2 + Google Gemini
```

Additional implementation details can be found in:

- frontend/README.md
- backend/README.md

---

## Tech Stack

| Layer | Technologies |
|---------|---------|
| Frontend | React 18, TypeScript, Vite, Tailwind, shadcn/ui, i18next |
| Backend | Python 3.11, FastAPI, Pydantic v2, Google Gemini |
| Deployment | Render (static frontend + containerized API) |

---

## API Example

```http
POST /draft
{
  "phase": 2,
  "selected_map": "Hard Rock Mine",
  "banned_brawlers": ["Spike", "Crow", "Rico"],
  "team": "blue",
  "picks": ["Brock"]
}
```

```json
{
  "gemini_suggestions": [
    {
      "brawlers": "Maisie + Stu",
      "probability": 75,
      "explanationUSA": "Stu's mobility fits the lanes and Maisie keeps constant pressure.",
      "explanationESP": "La movilidad de Stu encaja con el mapa y Maisie aporta presión constante."
    }
  ]
}
```

---

<div align="center">
  <sub>
    Developed by <strong>Víctor Díez</strong>. This project is not affiliated with Supercell. Brawl Stars and related assets are property of Supercell.
  </sub>
</div>
