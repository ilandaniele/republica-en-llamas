# Base del mapa electoral

`argentina-provincias.geojson` se descargó el 7 de noviembre de 2026 de [Georef, descarga oficial](https://apis.datos.gob.ar/georef/api/v2.0/provincias.geojson). Contiene 24 jurisdicciones; la propiedad `fuente` identifica al IGN.

Licencia: [Creative Commons Atribución 4.0 Internacional, condiciones de Georef](https://www.argentina.gob.ar/georef/condiciones-de-uso-y-licencia). Atribución: Georef / IGN, República Argentina. El original se conserva sin modificar.

La adaptación del juego rasteriza los límites a una grilla pixel art. Usa proyección equirectangular con corrección longitudinal a 40° S para la parte continental, Tierra del Fuego y Malvinas; coloca las demás islas del Atlántico Sur y el sector antártico de la fuente en recuadros separados. CABA conserva su huella original y tiene una ampliación adicional para facilitar la interacción. No es cartografía de navegación ni una representación a escala única.

Reproducir con `uvx --with pillow==12.0.0 python scripts/build-election-map.py`. El resultado es `apps/web/src/assets/argentina-pixel-map.json`; el navegador no descarga ni procesa el GeoJSON original.

Referencias de presentación consultadas: [resultados oficiales de 2023](https://resultados.gob.ar/2023) y [mapa electoral de LA NACION, PASO 2023](https://www.lanacion.com.ar/politica/paso-2023-el-mapa-de-resultados-de-las-elecciones-a-presidente-en-todo-el-pais-nid13082023/). Se tomó la idea de colorear jurisdicciones por fuerza que va primera y mostrar totales; no se copiaron sus gráficos ni sus resultados.

Los votos, pesos distritales y cargas del juego son sintéticos. Se informa esa distinción junto al mapa.
