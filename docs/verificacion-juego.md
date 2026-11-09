# Verificación y mejoras de uso — 7 de noviembre de 2026

Prueba local: http://127.0.0.1:5174/debate?view=elecciones.

## Funcionalidades nuevas

- Pausar y reanudar el escrutinio sin perder la tanda actual; velocidad normal o 2×.
- Pausa automática al ocultar la pestaña. Al volver, se reanuda únicamente si el usuario no lo había pausado manualmente.
- Tabla desplegable de los 24 distritos, ordenable por nombre o por cercanía entre las dos primeras fuerzas. Seleccionar una fila actualiza también el mapa y el detalle. Las diferencias se expresan en puntos porcentuales; los distritos sin votos contados se muestran al final al ordenar por cercanía.
- Descarga local de resultados CSV al completar el recuento: cinco fuerzas, 24 filas distritales, una fila nacional y marca explícita de votos simulados. Incluye BOM UTF-8 para nombres con acentos; el enlace y la URL temporal se liberan incluso si falla la descarga.

## Fallos corregidos

Los atajos A–D, 1–4 y Enter podían seleccionar y confirmar una opción antes de que terminara la presentación electoral. La tarjeta ahora informa que sus opciones están ocultas y el controlador de teclado respeta ese bloqueo. Las interacciones con botones SVG del mapa tampoco disparan los atajos generales. La prueba conjunta de tarjeta, controlador y store confirma una sola decisión después del cierre del recuento.

Cambiar la preferencia de movimiento reducido a activa y después desactivarla podía devolver el mapa al inicio. Ahora, una vez presentado el resultado completo por esa preferencia, permanece completo.

## Resultados comprobados

| Comprobación | Evidencia |
| --- | --- |
| Motor | 230 pruebas aprobadas |
| Web | 580 pruebas aprobadas; 810 en total |
| Partidas de las pruebas existentes | 1.008 simulaciones con doce presidentes, cuatro dificultades, escenarios históricos y modo Express |
| Partidas adicionales | 384 partidas completas, cuatro semillas adicionales, doce presidentes, cuatro dificultades y ambos modos; reproducción idéntica en fuente y bundle del servidor |
| Recuentos adicionales | 96 noches electorales, con ambos desenlaces, idénticas entre fuente y bundle del servidor |
| Recuperación de campaña | Turnos 38 y 40 restaurados desde decisiones; conserva el debate y el mapa, ignora estado y tarjeta falsificados en el guardado |
| Reproducción del recuento | Pausa, reanudación, velocidad, pestaña oculta, movimiento reducido y desmontaje verificados |
| Comparación distrital | Las 24 filas se ordenan por diferencia real de sus votos; selección compartida con el mapa |
| CSV | Pruebas de filas, sumas, acentos, escape y limpieza; archivo generado y leído también con el parser CSV de Python: 24 distritos y totales nacionales coincidentes |
| Validaciones | Lint sin errores ni advertencias, tipos de ambos workspaces, build, bundle, contenido y `git diff --check` aprobados |
| Servidor local | Vista electoral y módulos de tabla y exportación responden 200 |

Se conserva un archivo de revisión en `art/raw/escrutinio-prueba.csv`, excluido de Git como los demás originales de arte.

## Límites de esta comprobación

Las pruebas de interfaz usan jsdom y las descargas se comprueban mediante generación real de archivos y simulación de las APIs del navegador. No se completó una inspección visual de esta versión en un navegador real ni una descarga manual en todos los navegadores. Compras, ranking y escrituras remotas requieren el entorno publicado de prueba; no se hicieron pagos ni escrituras externas.

No hubo commit ni despliegue. Se regeneró el bundle local del motor. Web y funciones deben publicarse coordinadamente cuando se apruebe. La app móvil, los prompts de arte, el lockfile y los cambios previos de `.claude/launch.json` no se modificaron.
