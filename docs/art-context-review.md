# Tamaño, detalle y contexto de las escenas

Las ilustraciones de tarjetas ocupan 200 px de alto en móvil y entre 160 y 270 px en escritorio, según la altura de la ventana. Se conserva la escena completa, sin deformarla ni recortar su contexto.

Se reprocesaron las 202 escenas desde sus originales con una grilla mínima de 480×270 y una paleta de 64 colores. Los WebP son lossless y se exportan a 1920×1080 con escalado por vecino más cercano. La grilla anterior era 320×180: la nueva conserva más detalle real del original, además de aumentar el tamaño visible. Retratos y sprites de la Casa Rosada conservan sus grillas y paletas.

Se revisaron las escenas del Congreso de los doce presidentes. Las cinco escenas institucionales de Milei heredaban la campera de cuero del retrato; se editaron con la herramienta integrada de generación de imágenes, conservando identidad, composición y lugar, y usando traje azul oscuro, camisa blanca y corbata celeste.

IDs regenerados:

```text
president_milei_office
president_milei_congress
president_milei_press
president_milei_diplomacy
president_milei_crisis
```

Cada original está guardado como `art/raw/<id>.png` y su imagen del juego como `apps/web/public/illustrations/<id>.webp`. Los prompts exactos están en [context-corrections.json](../art/context-corrections.json), que el importador carga al final. Los originales anteriores de estas cinco escenas se conservaron en `art/raw/context-review-backup-20261024/`. Los prompts suplementarios de escenas presidenciales ahora separan la identidad de la vestimenta para futuras generaciones.

Otras escenas reprocesadas: 197. IDs omitidos o fallidos en esta revisión: ninguno. Se comprobaron dimensiones, paleta y lectura de las 202 escenas, y se inspeccionaron las cinco correcciones importadas. Pasaron las 537 pruebas web, lint, tipos, verificación de contenido y build. No se editaron `art/prompts.json` ni `art/PROMPTS.md`. Sin commit ni despliegue.
# Definición del diorama — 24 de octubre de 2026

Se reimportaron los 60 sprites `cr_*` desde los originales, sin cambiar prompts ni regenerar identidades. Las capas grandes conservan el doble de resolución lógica y los actores pequeños el triple, con 64 colores y exportación lossless. La isla pasa de 832×576 a 1664×1152; el caminante de referencia pasa de 48×96 a 148×288. Esto recupera detalle de los originales en lugar de ampliar solamente los píxeles ya reducidos.

Los personajes animados y el presidente del balcón crecen un 30% alrededor de sus pies para conservar su contacto con la plaza. En pantallas desde 1280 px, el panel lateral pasa de 340 a 380 px. Se conservan las rutas, los estados, las dos poses y el movimiento reducido.

La máscara de transparencia elimina también magenta oscuro de los bordes. Se comprobaron los 60 archivos: ningún píxel visible tiene simultáneamente exceso rojo y azul sobre verde mayor a 20. El conjunto pesa aproximadamente 518 KiB. Se revisaron composiciones estáticas de la asunción y la plaza habitual renderizadas desde los componentes con Sharp; esto no sustituye una prueba de animación en navegador.
