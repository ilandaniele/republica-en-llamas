# Debate presidencial y revisión del juego — 6 de noviembre de 2026

## Probar ahora

Con `npm run playtest --workspace=apps/web`, abrir http://127.0.0.1:5174/debate o usar **Probar debate presidencial** en el inicio. Elegir un personaje, seleccionar una de cuatro respuestas y confirmar. Cada resumen permite pasar al siguiente cruce; después del tercero se abre el escrutinio.

La práctica admite los doce personajes, está separada del guardado y no llama a Supabase, envía puntajes ni altera compras. El build de producción elimina esta ruta, su botón y su módulo. La partida normal conserva los tres personajes gratuitos y los nueve del pack.

## Integración en la partida

| Turno | Evento |
| --- | --- |
| 36 | Campaña electoral |
| 37 | Debate: ataques personales y carácter |
| 38 | Debate: economía y resultados de gestión |
| 39 | Debate: credibilidad y cierre |
| 40 | Elecciones presidenciales |

Estos eventos tienen prioridad sobre las sesiones periódicas del Congreso en esos turnos. Crisis Express termina en el turno 15 y conserva su recorrido corto, sin esta elección.

Tres rivales distintos se eligen con la semilla de la partida, excluyendo al personaje del jugador. Cada cruce muestra dos intervenciones entre rivales y un ataque dirigido al jugador. Los ataques personales tienen textos propios para los doce personajes. Son diálogos de ficción del juego, no citas reales.

Las cuatro respuestas permiten defender la gestión, devolver el ataque al orador, desafiar a otro rival o presentar una propuesta. El orden varía de forma determinista. La respuesta apropiada depende del tema, los indicadores y el desempeño acumulado: defender una mala gestión puede salir mal y una chicana puede funcionar ante una provocación personal pero resultar evasiva ante una pregunta económica. Los indicadores pertinentes también aparecen junto a las opciones.

## Consecuencias

El marcador de desempeño comienza en 50/100 para cada candidato y no representa intención de voto. Los cruces entre rivales también cambian ese marcador. Cada respuesta afecta el desempeño del jugador, su popularidad y la credibilidad; un contraataque efectivo también puede restar desempeño al destinatario.

Después de tres cruces, superar a todos los rivales gana el debate; empatar el máximo lo empata. Ganar otorga 6 puntos base adicionales de popularidad y 60 de puntaje; perder resta 6 y 60, respectivamente. Empatar no agrega ese premio ni penalización. La dificultad modifica los efectos adversos como en las demás decisiones. El resumen informa el cambio de popularidad realmente aplicado después de escalas y topes. El ajuste de puntaje se conserva una sola vez en el cálculo y aparece en el informe final.

La inflación, el déficit y las reservas no cambian directamente por responder en televisión. La evolución económica habitual sigue ocurriendo al terminar cada turno.

El escrutinio ahora usa el resultado calculado por el motor: popularidad superior a 45 y confianza económica superior a 35. El cliente ya no puede decidir ganar pulsando una opción. Ganar el debate mejora las posibilidades mediante la popularidad, pero no asegura ganar las elecciones. Una derrota electoral conserva la transición de ocho turnos existente.

## Auditoría y correcciones

| Hallazgo | Cambio |
| --- | --- |
| El resultado electoral podía elegirse manualmente | El motor resuelve y registra el resultado real; la interfaz muestra únicamente la acción pertinente |
| La tarjeta de escrutinio no tenía ventana temporal | Restringida al turno 40; no aparece aleatoriamente al principio |
| La campaña podía quedar desplazada por el Congreso | Campaña forzada antes del debate |
| Texto de escenarios y titulares todavía en 6–8 px | Tamaños legibles y tipografía pixelada coherente |
| La interfaz había pasado a fuentes del sistema | Pixelify Sans local, pesos reales 400–700, acentos españoles comprobados y sin estilos sintetizados |
| La exportación no esperaba la fuente ni el PNG; habilitaba el botón demasiado pronto | Espera fuentes, codificación y compartir; libera el canvas incluso ante errores y permite reintentar |
| El recorte fijo del periódico podía cortar texto ampliado | Altura según contenido y pie dentro del flujo |
| Herramientas instaladas con archivos faltantes | Dependencias restauradas con `npm ci --ignore-scripts`, sin cambiar versiones ni lockfile |

Se revisaron las rutas de decisiones, guardado y recuperación, reproducción de partidas, cálculo de puntaje, elección, interfaz y exportación; lint y tipos cubren el repositorio y los dos workspaces principales. Esto no equivale a una inspección manual de cada línea de toda la aplicación.

## Evidencia

- Motor: 215 pruebas, incluidas las simulaciones completas de todos los presidentes, dificultades, escenarios y modos, más regresiones de empate, victoria, derrota, escala, límites y elecciones no manipulables.
- Web: 562 pruebas. El recorrido real de componentes y store cubre los cuatro candidatos, tres cruces, confirmaciones, resumen y escrutinio. La ruta real desde el inicio y la práctica de ambos resultados también se prueban sin modificar partidas ni invocar funciones remotas.
- Fuente y bundle para el servidor: estados idénticos en 72 debates y elecciones, con los doce personajes, tres semillas y dos estrategias de desempeño.
- `npm run lint`, tipos de motor y web, build, bundle, contenido y `git diff --check` aprobados.
- 1.528 tarjetas con textos españoles completos y 324 ilustraciones registradas. Los textos nuevos tienen traducción inglesa; siguen los 522 respaldos españoles de textos ingleses anteriores.
- La fuente local contiene á, é, í, ó, ú, ñ, ü, ¿, ¡ y las mayúsculas comprobadas. El servidor local devuelve 200 para inicio, práctica, módulo, fuente y retrato.

La interfaz se verifica con jsdom; no se completó una inspección visual de esta versión en un navegador real. Pagos, ranking y escritura remota siguen pendientes de pruebas en un entorno publicado. No se hicieron compras, escrituras remotas, commit ni despliegue.

Publicar web y funciones con la misma versión del motor cuando se apruebe. Los guardados de reglas anteriores pueden resultar incompatibles: el recuperador informa el problema y conserva las preferencias. `art/prompts.json`, `art/PROMPTS.md`, la app móvil y `.claude/launch.json` no se modificaron en esta revisión.
