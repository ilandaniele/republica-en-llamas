# Kicillof y Grabois

Selección gratuita: Javier Milei, Sergio Massa y Axel Kicillof. Pack Presidentes o Acceso Total desbloquean los nueve restantes, incluido Juan Grabois. Los compradores existentes de esos packs reciben ambos personajes sin otro producto. Pack Oposición no desbloquea presidentes.

Se eligió a Grabois por su candidatura presidencial en las PASO de 2023, documentada en el [resultado oficial de la Cámara Nacional Electoral](https://www.electoral.gob.ar/nuevo_legislacion/pdf/AE%20119-23.pdf), página 3 del PDF.

Cada personaje nuevo tiene 50 decisiones iniciales y 50 continuaciones con textos en español e inglés. Sus agendas y efectos son reglas de la simulación. Sus escenas presidenciales usan las animaciones existentes; su asunción usa el sprite del personaje seleccionado y la plaza con movimiento.

Los prompts y tamaños adicionales están en `art/new-candidates.json`. No se cambiaron `art/prompts.json` ni `art/PROMPTS.md`. Los retratos neutrales se generaron primero como referencia de identidad; los sprites también usaron `cr_island` como referencia de estilo. El importador convirtió las 18 imágenes a WebP, las registró en el manifiesto y eliminó el fondo magenta de ambos sprites. Se revisaron las imágenes importadas y se verificó que los sprites tienen transparencia y ningún píxel magenta opaco.

IDs generados:

```text
portrait_kicillof_neutral
portrait_kicillof_panic
portrait_kicillof_victory
president_kicillof_office
president_kicillof_congress
president_kicillof_press
president_kicillof_diplomacy
president_kicillof_crisis
cr_president_kicillof
portrait_grabois_neutral
portrait_grabois_panic
portrait_grabois_victory
president_grabois_office
president_grabois_congress
president_grabois_press
president_grabois_diplomacy
president_grabois_crisis
cr_president_grabois
```

IDs omitidos: ninguno. IDs fallidos: ninguno.

No se hicieron compras, migraciones, despliegues ni commits. El control de acceso del servidor requiere desplegar la función actualizada junto con la web después de la revisión. Pagos y ranking reales siguen pendientes de validación en un entorno publicado de prueba.
