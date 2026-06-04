import type { Translations } from "./en";

export const es: Translations = {
  // Landing page
  landing_title: "¡Descubre el mejor pick con IA en Brawl Stars!",
  landing_subtitle_1:
    "Una IA avanzada analiza tu draft y te dice la mejor elección en tiempo real.",
  landing_subtitle_2:
    "Simula selecciones, realiza baneos y obtén los mejores picks para cada partida.",
  step_1_title: "Configura tu draft",
  step_1_desc: "Selecciona tu mapa y equipo para comenzar.",
  step_2_title: "Banea acorde a tu partida",
  step_2_desc:
    "Elimina hasta 6 brawlers del pool para adaptar las estrategias.",
  step_3_title: "Obtén el mejor pick según la IA",
  step_3_desc: "La IA te dará los mejores picks posibles en segundos.",
  draft_visualization_text:
    "Representación visual del draft con picks dinámicos.",
  cta_button: "Probar BrawlGPT",
  footer_text: "Herramienta no oficial para Brawl Stars",

  // Common
  back_to_home: "Volver al inicio",
  search: "Buscar...",
  search_brawlers: "Buscar brawlers...",
  all_modes: "Todos los modos",
  no_maps_found: "No se encontraron mapas",
  banned_brawlers: "Brawlers Baneados",
  search_to_ban: "Buscar para banear...",
  no_banned_brawlers: "No hay brawlers baneados",
  locked: "Bloqueado",
  cancel: "Cancelar",
  close: "Cerrar",
  toggle_theme: "Cambiar tema",
  toggle_language: "Cambiar idioma",

  // Simulator page
  select_brawlers: "Seleccionar brawlers",
  sort_by: "Ordenar por",
  by_rarity: "Por rareza",
  name_az: "Nombre (A-Z)",
  name_za: "Nombre (Z-A)",
  no_brawlers_found: "No se encontraron brawlers",
  current_draft: "Draft actual",
  reset: "Reiniciar",
  blue_team: "Equipo azul",
  red_team: "Equipo rojo",
  select: "Selecciona",
  generating: "Generando...",
  generate_best_option: "Buscar la mejor opción",
  generate_phase_1: "Buscar la mejor opción para la primera fase (PRIMER PICK)",
  generate_phase_2: "Buscar las mejores opciones para la segunda fase",
  generate_phase_3: "Buscar las mejores opciones para la tercera fase",
  generate_phase_4: "Buscar la mejor opción para la última fase (ÚLTIMO PICK)",
  select_map_first: "Primero selecciona un mapa",
  configure_draft_correctly: "Configura el draft correctamente",
  select_first_pick: "Selecciona el primer pick",
  select_first_pick_brawler: "Selecciona el brawler para el 1er pick",
  select_second_pick_brawler: "Selecciona el brawler para el 2º pick",
  select_first_second_pick_brawlers:
    "Selecciona los brawlers para los picks 1º y 2º",
  select_third_pick_brawler: "Selecciona el brawler para el 3er pick",
  select_fourth_pick_brawler: "Selecciona el brawler para el 4º pick",
  select_fifth_pick_brawler: "Selecciona el brawler para el 5º pick",
  remove_sixth_pick: "Elimina el 6º pick",
  incorrect_pick_order:
    "Orden de picks incorrecto. Faltan los picks {{missingPicks}}º",
  brawler_selected: "{{name}} seleccionado para el {{team}}",
  brawler_removed: "{{name}} eliminado del draft",
  brawlers_swapped: "Se ha intercambiado {{from}} por {{to}}",
  brawler_moved_position: "Se ha movido {{name}} a una nueva posición",
  brawler_banned: "{{name}} baneado",
  brawler_unbanned: "Baneo de {{name}} eliminado",
  max_bans_error: "No puedes banear más de 6 brawlers",
  max_picks_error: "No puedes seleccionar más de 5 brawlers",
  must_select_map: "Debes seleccionar un mapa",
  error_generating_recommendation:
    "Error al buscar la recomendación. Inténtalo de nuevo.",
  confirm_reset_draft: "¿Estás seguro de que quieres reiniciar el draft?",
  confirm_reset_message:
    "Perderás todas las selecciones actuales y las recomendaciones de la IA.",
  draft_reset: "Draft reiniciado",
  who_picks_first: "¿Quién empieza eligiendo?",
  select_map: "Seleccionar mapa",
  search_maps: "Buscar mapas...",
  recommendation_applied: "Recomendación aplicada: {{brawlers}}",

  // Draft Completion
  draft_completed: "¡Draft completado!",
  draft_completion_message: "Aquí está el draft final.",
  good_luck: "¡Buena suerte en tu partida!",

  // AI Recommendations
  ai_recommendations: "Recomendaciones de la IA",
  generating_ai_recommendation:
    "Analizando draft y generando recomendaciones...",
  this_might_take_a_moment: "Esto puede tardar un momento",
  please_try_again: "Por favor, inténtalo de nuevo",
  showing_best_pick_pairs: "Mostrando las mejores combinaciones para esta fase",
  best_pick: "Mejor pick",
  best_combination: "Mejores picks",
  unexpected_api_response: "Respuesta inesperada de la API",
  ai_recommendations_generated:
    "Recomendaciones de la IA generadas correctamente",
  invalid_draft_phase: "Fase de draft no válida",

  // Help Dialog
  how_brawlgpt_works: "¿Cómo funciona BrawlGPT?",
  help_subtitle: "Una guía completa para utilizar el simulador de draft con IA",
  ai_powered: "Inteligencia Artificial avanzada",
  ai_description:
    "BrawlGPT utiliza un modelo de inteligencia artificial (Google Gemini) para analizar tu draft y generar recomendaciones de picks óptimos en tiempo real.",
  basic_usage: "Uso básico",
  step_map: "Selecciona un mapa",
  step_map_desc:
    "Comienza seleccionando un mapa de juego. Las recomendaciones se basarán en los brawlers más efectivos para ese mapa.",
  step_team: "Elige quién empieza",
  step_team_desc: "Decide si el equipo azul o rojo realizará el primer pick.",
  step_ban: "Banea brawlers (opcional)",
  step_ban_desc:
    "Puedes banear hasta 6 brawlers que no estarán disponibles para la selección.",
  step_simulate: "Simula el draft actual",
  step_simulate_desc:
    "Selecciona brawlers para ambos equipos siguiendo el orden de draft.",
  step_generate: "Genera recomendaciones",
  step_generate_desc:
    "Presiona el botón azul brillante para que la IA analice el draft actual.",
  controls: "Controles interactivos",
  control_left_click: "Click izquierdo",
  control_left_click_desc:
    "Selecciona un brawler para añadirlo al draft en la posición actual.",
  control_right_click: "Click derecho",
  control_right_click_desc:
    "Banea un brawler para que no esté disponible en el draft.",
  control_drag: "Arrastrar y soltar",
  control_drag_desc:
    "Arrastra brawlers para reorganizarlos o a la papelera para eliminarlos.",
  control_recommendations: "Recomendaciones IA",
  control_recommendations_desc:
    "El panel de recomendaciones puede contraerse o expandirse.",
  phases: "Fases del draft",
  phase_1: "Primera fase: recomendación para el primer pick",
  phase_2: "Segunda fase: mejores combinaciones para los picks 2 y 3",
  phase_3: "Tercera fase: mejores combinaciones para los picks 4 y 5",
  phase_4: "Cuarta fase: recomendación para el último pick",
  pro_tips: "Consejos Pro",
  tip_percentage:
    "Las recomendaciones muestran un porcentaje de efectividad basado en el análisis del draft.",
  tip_medals:
    "Las medallas de oro, plata y bronce destacan las tres mejores opciones.",
  tip_reset: "Usa la papelera para reiniciar el draft completamente.",
  tip_experiment:
    "Experimenta con diferentes escenarios para entender mejor las estrategias.",
  tip_click_suggestions:
    "¡Haz clic en cualquier recomendación para aplicarla automáticamente!",

  // Game modes
  gem_grab: "Atrapagemas",
  brawl_ball: "Balón Brawl",
  heist: "Atraco",
  hot_zone: "Zona restringida",
  bounty: "Caza estelar",
  knockout: "Noqueo",
  basket_brawl: "Hockey Brawl",

  // Rarities
  common: "Común",
  rare: "Raro",
  super_rare: "Super raro",
  epic: "Épico",
  mythic: "Mítico",
  legendary: "Legendario",
  chromatic: "Cromático",

  // Footer
  footer_copyright:
    "© 2025 BrawlGPT - Herramienta sin fines comerciales, creada por fans.",
  footer_developer: "Desarrollado por <strong>Víctor Díez</strong>",
  footer_contact: "Contacto:",
  footer_source_code: "Código fuente:",
  footer_github: "Disponible en GitHub",
  footer_disclaimer:
    "BrawlGPT no es una herramienta oficial de Supercell ni está afiliada con ellos.",
};
