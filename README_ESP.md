<p align="center">
<img src="frontend/public/favicon.ico" alt="Kcalsculadora" width="100" />
</p>

<h1 align="center">BrawlGPT</h1>

<p align="center">
Asistente de drafts para Brawl Stars competitivo con recomendaciones generadas por IA.
</p>

<p align="center">
  <a href="https://kcalsculadora.vercel.app/"><img src="https://img.shields.io/badge/Abrir%20app-FBCD29?style=for-the-badge" alt="Abrir app"></a>
  &nbsp;
  <a href="https://kcalsculadora-backend-762078704585.europe-west1.run.app/docs"><img src="https://img.shields.io/badge/API%20docs-00A779?style=for-the-badge" alt="API docs"></a>
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

## Qué es

BrawlGPT analiza el estado de un draft de Brawl Stars (mapa, baneos, picks por equipo) y devuelve, en cada una de las 4 fases del draft, las mejores combinaciones de brawlers con una explicación en español e inglés.

Está formado por dos piezas independientes:

- **Frontend** — SPA en React + TypeScript con drag & drop, i18n (es/en), tema claro/oscuro y diseño inspirado en la estética del juego.
- **API** — Servicio en FastAPI que construye el payload por fase y lo envía a **Google Gemini** con un `response_schema` estricto que garantiza respuestas JSON validadas.

## Demo

<table>
  <tr>
    <td><img src="frontend/public/resources/demos/Demo1.png" alt="Landing" /></td>
    <td><img src="frontend/public/resources/demos/Demo2.png" alt="Draft en progreso" /></td>
  </tr>
  <tr>
    <td><img src="frontend/public/resources/demos/Demo3.png" alt="Recomendaciones IA" /></td>
    <td><img src="frontend/public/resources/demos/Demo4.png" alt="Selección de brawlers" /></td>
  </tr>
</table>

## Cómo funciona

```
Frontend (React)
   │  POST /draft { phase, map, team, banned, picks }
   ▼
API (FastAPI)
   │  build_user_message()        → JSON con el estado mínimo del draft
   │  build_system_instruction()  → reglas específicas de la fase (1-4)
   │  call_gemini()               → llamada con response_schema
   ▼
{ gemini_suggestions: [ { brawlers, probability, explanationESP, explanationUSA } ] }
```

Cada fase se envía a Gemini de forma autocontenida: solo recibe lo accionable (mapa, brawlers disponibles, counters relevantes y picks ya realizados).

## Estructura

```
brawlgpt/
├── frontend/   React + Vite + TypeScript + Tailwind
└── backend/    FastAPI + Pydantic v2 + Google Gemini
```

Cada subproyecto tiene su propio README con detalles técnicos y de despliegue:

- [frontend/README.md](frontend/README.md)
- [backend/README.md](backend/README.md)

## Stack

| Capa     | Tecnologías                                              |
| -------- | -------------------------------------------------------- |
| Frontend | React 18, TypeScript, Vite, Tailwind, shadcn/ui, i18next |
| API      | Python 3.11, FastAPI, Pydantic v2, google-genai (Gemini) |
| Deploy   | Render (frontend estático + API en contenedor)           |

## Ejemplo de llamada

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
  <sub>Desarrollado por <strong>Víctor Díez</strong> · Proyecto no afiliado a Supercell. Brawl Stars y sus activos pertenecen a Supercell — ver <a href="https://supercell.com/en/fan-content-policy/">Fan Content Policy</a>.</sub>
</div>
