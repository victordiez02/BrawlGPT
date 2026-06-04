"""CLI rápido para probar el flujo sin levantar el servidor.

Uso (desde la carpeta `api/`):
    python -m scripts.main_console
"""

from __future__ import annotations

import os
from pathlib import Path

from dotenv import load_dotenv
from rich.console import Console
from rich.prompt import Prompt
from rich.table import Table

from app.data import load_meta, load_prompts
from app.recommender import build_system_instruction, build_user_message, call_gemini

load_dotenv()
console = Console()

META_VERSION = os.getenv("META_VERSION", "mar2025")
DATA_DIR = Path(__file__).resolve().parents[1] / "data"
META_JSON = DATA_DIR / "meta" / META_VERSION / "meta.json"
PROMPTS_JSON = DATA_DIR / "prompts" / "prompts.json"


def _ask_map(maps: dict) -> str:
    console.print("\n[bold]Available maps:[/bold]")
    for name, m in maps.items():
        console.print(f"  - {name} ({m.mode})")
    while True:
        choice = Prompt.ask("Selected map").strip()
        if choice in maps:
            return choice
        console.print(f"[red]'{choice}' not valid.[/red]")


def _ask_list(label: str, valid: set[str], max_count: int) -> list[str]:
    while True:
        raw = Prompt.ask(
            f"{label} (comma-separated, up to {max_count})", default=""
        ).strip()
        if not raw:
            return []
        names = [n.strip() for n in raw.split(",") if n.strip()]
        invalid = [n for n in names if n not in valid]
        if invalid:
            console.print(f"[red]Unknown: {', '.join(invalid)}[/red]")
            continue
        if len(names) > max_count:
            console.print(f"[red]Max {max_count}.[/red]")
            continue
        return names


def _print_suggestions(response: dict) -> None:
    suggestions = response.get("gemini_suggestions", [])
    if not suggestions:
        console.print("[bold red]No suggestions.[/bold red]")
        return
    table = Table(title="Best Brawler Options", show_lines=True)
    table.add_column("Brawlers", style="cyan", justify="center")
    table.add_column("%", style="green", justify="center")
    table.add_column("English", style="yellow", max_width=50)
    table.add_column("Español", style="magenta", max_width=50)
    for s in suggestions:
        table.add_row(
            str(s.get("brawlers", "")),
            str(s.get("probability", "")),
            str(s.get("explanationUSA", "")),
            str(s.get("explanationESP", "")),
        )
    console.print(table)


def main() -> None:
    brawlers, maps = load_meta(META_JSON)
    prompts = load_prompts(PROMPTS_JSON)
    valid_names = set(brawlers.keys())

    selected_map = _ask_map(maps)
    team = Prompt.ask("First-pick team", choices=["blue", "red"], default="blue")
    phase = int(Prompt.ask("Phase", choices=["1", "2", "3", "4"], default="1"))
    bans = _ask_list("Banned brawlers", valid_names, max_count=6)
    picks = _ask_list("Picks (chronological)", valid_names, max_count=5)

    phase_meta = prompts["phases"][str(phase)]
    user_msg = build_user_message(
        phase=phase,
        selected_map=selected_map,
        maps=maps,
        brawlers=brawlers,
        banned_brawlers=bans,
        team=team,
        picks=picks,
        phase_meta=phase_meta,
    )

    if Prompt.ask("Send to Gemini?", choices=["y", "n"], default="y") == "y":
        system = build_system_instruction(prompts, phase)
        _print_suggestions(call_gemini(system, user_msg))
    else:
        console.print_json(user_msg)


if __name__ == "__main__":
    main()
