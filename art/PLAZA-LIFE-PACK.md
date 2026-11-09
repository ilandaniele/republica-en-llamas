# Plaza viva: segundo pack

20 imágenes nuevas. Se conserva `cr_island` como referencia de cámara, luz y pixel art. Los originales se guardan en `art/raw/` a 1024×1024 sobre magenta sólido; la importación genera WebP transparentes. Las especificaciones están en `plaza-life-pack.json`.

| Imágenes | Actividad |
| --- | --- |
| `cr_vendor_serve_a`, `cr_vendor_serve_b` | Vendedor que entrega un vaso y vuelve a preparar |
| `cr_photographer_a`, `cr_photographer_b` | Fotógrafa que levanta y baja la cámara |
| `cr_drummer_a`, `cr_drummer_b` | Manifestante que toca el bombo |
| `cr_medic_walk_a`, `cr_medic_walk_b` | Médica que camina con un bolso |
| `cr_worker_a`, `cr_worker_b` | Obrero que trabaja con pala |
| `cr_woman_walk_a`, `cr_woman_walk_b` | Peatona para variar las multitudes |
| `cr_ambulance` | Ambulancia con llegada y baliza animada |
| `cr_water_cannon` | Camión hidrante con baliza y agua en disturbios graves |
| `cr_limousine` | Auto oficial durante la asunción |
| `cr_news_van` | Móvil de televisión con antena |
| `cr_food_cart` | Puesto de comida con vapor animado |
| `cr_barricade_solid` | Barricada de madera y neumáticos |
| `cr_aid_tent` | Puesto sanitario durante combate |
| `cr_construction_barrier` | Valla de obra |

La plaza conserva los actores y escenarios del pack anterior. Las capas nuevas se activan por estabilidad social, contexto de asunción, presión mediática y decisiones recientes de salud u obras. Las actividades temporales desaparecen después de dos turnos. Las ruinas y el final de plaza vacía no muestran estos actores.

Los movimientos respetan la preferencia de movimiento reducido. No se modifican `prompts.json` ni `PROMPTS.md`. Sin commits.

Resultado: 20 imágenes generadas e importadas. Omitidas: ninguna. Fallidas: ninguna. Fondos originales normalizados a magenta sólido; todos los WebP tienen transparencia y ningún píxel magenta visible. Revisados sprites y seis escenas completas en navegador.

Validación: 494 pruebas web y 68 del motor aprobadas; lint, tipos y compilación correctos.

[Ver escenas](raw/previews/plaza-life-scenes.png) · [Ver sprites](raw/previews/plaza-life-sprites.png).
