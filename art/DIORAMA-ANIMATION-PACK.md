# Casa Rosada: pack de animación

24 sprites adicionales, compatibles con `cr_island`: 14 capas y cuadros de movimiento, más 10 presidentes para el balcón. PNG sobre magenta sólido en `art/raw/`; WebP con transparencia en `apps/web/public/illustrations/`. Especificaciones separadas en `diorama-animation-pack.json`; no se modifican los prompts originales.

| Sprites | Uso |
| --- | --- |
| `cr_citizen_walk_a`, `cr_citizen_walk_b` | Caminata individual en plaza tranquila y marchas |
| `cr_supporter_cheer_a`, `cr_supporter_cheer_b` | Brazos y piernas alternados durante festejos |
| `cr_protester_run_a`, `cr_protester_run_b` | Carrera individual durante disturbios o combate |
| `cr_guard_fire_a`, `cr_guard_fire_b` | Guardia y retroceso durante enfrentamiento armado |
| `cr_british_marine_a`, `cr_british_marine_b` | Infantes británicos que avanzan desde el borde |
| `cr_flag_wave_a`, `cr_flag_wave_b` | Bandera argentina que flamea |
| `cr_british_ship` | Buque en aproximación, detrás de la isla |
| `cr_helicopter_transport` | Aproximación, descenso, espera y despegue |
| `cr_president_milei` | Milei saludando con banda presidencial |
| `cr_president_massa` | Massa saludando con banda presidencial |
| `cr_president_bullrich` | Bullrich saludando con banda presidencial |
| `cr_president_bregman` | Bregman saludando con banda presidencial |
| `cr_president_schiaretti` | Schiaretti saludando con banda presidencial |
| `cr_president_larreta` | Larreta saludando con banda presidencial |
| `cr_president_nestor` | Néstor Kirchner saludando con banda presidencial |
| `cr_president_cristina` | Cristina Fernández de Kirchner saludando con banda presidencial |
| `cr_president_macri` | Macri saludando con banda presidencial |
| `cr_president_del_cano` | Del Caño saludando con banda presidencial |

La ceremonia ocupa los primeros dos turnos de una partida libre, sin crisis activa. Muestra al presidente elegido, 72 personas con desfases individuales, banderas y confeti. Los escenarios históricos conservan su contexto inicial.

La vida de la plaza sigue popularidad y estabilidad: peatones, marchas, cacerolazo, carreras, policía, incendios y helicóptero presidencial. Se conservan los desenlaces anteriores, incluida la plaza vacía y la destrucción.

La flota británica aparece al escalar la segunda decisión de Malvinas, o durante el escenario histórico de Malvinas. Elegir combate en `malvinas_003` activa un desembarco ficticio en el diorama, infantes, helicóptero y disparos sin sangre ni impactos sobre personas. Las salidas diplomáticas desactivan esa escalada visual. Los disparos también pueden aparecer tras elegir entrar en la guerra en `guerra_001`; no se activan por una protesta social.

La animación combina cuadros alternados y desplazamientos por personaje. Movimiento reducido detiene las animaciones CSS y la línea de tiempo SVG, dejando una pose visible.

Resultado: 24 generadas e importadas, ninguna omitida ni fallida. Fondos originales uniformes `#FF00FF`; WebP transparentes sin magenta visible. Revisados sprites y seis composiciones en navegador. 489 pruebas web y 68 del motor aprobadas, lint, tipos y compilación correctos. Sin commits.

Vista de revisión local: [seis escenarios](raw/previews/diorama-final.png) y [sprites del pack](raw/previews/diorama-pack-complete.png).
