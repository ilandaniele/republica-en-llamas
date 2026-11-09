# Escrutinio presidencial — 7 de noviembre de 2026

Prueba directa: http://127.0.0.1:5174/debate?view=elecciones, con el servidor `npm run playtest --workspace=apps/web`. También se puede entrar a la práctica del debate y elegir **Probar solo el escrutinio**. El selector de personaje permite ver los colores de cada fuerza. No modifica la partida ni envía resultados.

## Mapa y referencias

El mapa usa los límites reales de las 24 jurisdicciones del [GeoJSON oficial de Georef](https://apis.datos.gob.ar/georef/api/v2.0/provincias.geojson), cuya fuente declarada es IGN. El original se conserva en `art/geography/argentina-provincias.geojson` con [atribución y licencia CC BY 4.0](../art/geography/README.md).

Se rasterizaron los polígonos a una grilla pixel art, sin dibujar una silueta aproximada ni generar una geografía con IA. El navegador usa 813 tramos horizontales de píxeles y bordes precalculados. No procesa el GeoJSON ni depende de servicios cartográficos en tiempo de ejecución. CABA tiene una ampliación para interacción; los sectores australes de la fuente se muestran en recuadros a otras escalas. Tierra del Fuego y sus partes insulares y antárticas comparten un único resultado distrital, no se cuentan como electores adicionales.

Se consultaron el [sistema oficial de resultados](https://resultados.gob.ar/2023) y el [mapa de las PASO 2023 de LA NACION](https://www.lanacion.com.ar/politica/paso-2023-el-mapa-de-resultados-de-las-elecciones-a-presidente-en-todo-el-pais-nid13082023/). Se tomó como referencia la presentación por distrito, fuerza que va primera y totales nacionales; no se copiaron imágenes, código ni resultados de esos sitios.

## Comportamiento

- En el turno 40, la tarjeta presidencial presenta el mapa antes de revelar el resultado. Empieza con distritos neutros y carga doce tandas durante aproximadamente 8,4 segundos.
- Las cinco fuerzas del juego tienen colores estables y nombres explícitos: violeta libertario, celeste peronista, amarillo PRO, coral izquierda y verde federal. Los resultados parciales pueden cambiar el liderazgo y el color de las provincias.
- Los votos son enteros, positivos o cero y acumulativos por fuerza y distrito. El porcentaje de avance usa votos efectivamente contados; los totales nacionales son la suma de los distritales. Las proporciones mostradas se redondean a una décima.
- El marcador usa votos y pesos distritales sintéticos, indicado junto al mapa. La geografía es real; los votos no son históricos, encuestas ni datos oficiales. La superficie del territorio no representa cantidad de votos.
- La muestra final reproduce la victoria o derrota que ya determina `calculateElectionResult`. No cambia reglas, popularidad, puntaje ni intención de voto. Tanto la distribución como las tandas son deterministas para la semilla de la partida y los candidatos.
- Se puede seleccionar una provincia con clic, Enter, Espacio o un selector, consultar sus cinco porcentajes y saltar a **Ver resultado completo**. El recuento no confirma automáticamente la decisión.
- Movimiento reducido muestra directamente el cierre. Se usa un solo intervalo, que se cancela al terminar, saltar o desmontar la vista. Los tramos gráficos estáticos están memorizados; cada tanda actualiza colores y valores.
- Se puede pausar, reanudar o usar velocidad 2×. Cambiar de pestaña pausa la presentación. La comparación de los 24 distritos y la descarga CSV están documentadas en [verificación y mejoras de uso](verificacion-juego.md).

## Verificación

- 230 pruebas del motor y 580 de la web aprobadas: 810 en total.
- Regresiones de resultado para los doce presidentes, ambos desenlaces, cinco fuerzas, votos monotónicos, sumas, cambios de liderazgo, semillas, distritos, teclado, salto y limpieza del intervalo.
- Igualdad exacta entre fuente y bundle del servidor en 72 recuentos: doce personajes, tres semillas y dos desenlaces.
- Tipos de ambos workspaces, lint, build web, bundle y verificación de contenido aprobados.
- Fuente cartográfica y PNG estático de control inspeccionados. La ruta de prueba, el módulo del mapa y sus datos responden 200. Las pruebas de interfaz usan jsdom; no se completó una revisión visual de la animación en navegador real.

La práctica continúa excluida de producción. No se hicieron commits, despliegues, escrituras remotas ni cambios en la app móvil o en los prompts de arte. El bundle local se regeneró para publicar junto con la web cuando se apruebe.
