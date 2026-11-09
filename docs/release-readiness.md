# Preparación del juego para revisión

Actualización del 8 de noviembre de 2026: [auditoría de buenas prácticas](buenas-practicas-2026-11-08.md), 845 pruebas aprobadas y build global reparado. Las cantidades y resultados de las secciones siguientes corresponden a la revisión anterior.

La revisión actual de fuentes, 1.008 simulaciones y selección de tres presidentes gratuitos está documentada en [Prueba local](playtest.md). Usar http://127.0.0.1:5174 para revisar el juego.

La partida permite elegir presidente, resolver decisiones y sesiones del Congreso, guardar progreso local y reconstruir el mismo resultado mediante replay. Esta revisión mejora ese recorrido y prepara el build; no publica cambios ni aplica migraciones.

## Correcciones

- La elección presidencial actualiza el estado del motor, el primer evento y la configuración usada por el servidor. Los seis personajes que anuncian bonos numéricos reciben esos efectos iniciales una sola vez; los otros seis conservan su agenda sin inventar bonos adicionales.
- Milei, Massa y Kicillof son gratuitos; los otros nueve requieren Pack Presidentes o Acceso Total. La selección y el guardado de puntajes del servidor verifican esa política, incluyendo los IDs antiguos. Kicillof y Grabois incorporan sus propias tarjetas, retratos y escenas.
- Crisis Express mantiene el modo elegido y su multiplicador de puntaje después de cerrar cada turno.
- Confirmar una decisión resuelve y guarda el turno completo de forma atómica. La transición presenta el resultado, incluyendo inflación y shocks nuevos. Doble clic, confirmación repetida o eventos de una tarjeta anterior no pueden adelantar turnos ni duplicar decisiones.
- El guardado versión 1 conserva configuración, decisiones y preferencias. Reconstruye estado y tarjeta desde el motor al recargar, incluso durante la transición. Guarda menos datos y evita reutilizar tarjetas serializadas de versiones anteriores. Guardados incompatibles conservan preferencias y muestran un aviso para iniciar otra partida.
- Bloquear almacenamiento en el navegador no impide abrir el juego. Fallos de carga o renderizado ofrecen reintentar sin borrar progreso.
- El teclado respeta campos de texto, botones, atajos del navegador y ventanas superpuestas. Tutorial, diario y oferta de mitad de partida pausan el reloj Express y los atajos.
- Nueva partida clásica limpia la selección del escenario histórico anterior. Reiniciar cancela respuestas pendientes de solicitudes de tickets.
- Cliente y servidor comparten validación de configuración y decisiones, incluyendo presidentes, escenarios y límites de negociación conocidos.

## Limpieza y rendimiento

Se quitaron acciones del store sin consumidores, un temporizador que no actualizaba ningún efecto visual, seguimiento duplicado de turnos, campos de selección sin uso, un componente de ilustración sin referencias, el alias prohibido `@engine` y 17 referencias a imágenes remotas antiguas sin consumidores. Las ilustraciones SVG usadas como respaldo permanecen.

El sorteo construye una sola tabla de decisiones anteriores y un conjunto de cartas vistas por llamada, calcula salud económica/política una vez y reutiliza pesos. Conserva orden y reglas de selección aleatoria. Las ilustraciones locales tienen caché corta y rutas inexistentes devuelven 404 en nginx.

## Verificación local

Desde la raíz:

```sh
npm run lint
npm run type-check --workspace=packages/game-engine
npm run type-check --workspace=apps/web
npm test --workspace=packages/game-engine
npm test --workspace=apps/web
npm run verify:content
npm run build --workspace=apps/web
npm run bundle:engine
```

`verify:content` comprueba IDs únicos, opciones válidas, textos, continuaciones y existencia de los archivos de ilustraciones. CI ejecuta esta verificación y el build de producción antes del despliegue. Las simulaciones completas cubren doce presidentes, cuatro dificultades, diez contextos y dos modos, más dos semillas adicionales: 1.008 partidas reproducidas con el mismo resultado que el motor del servidor.

Resultado local actual: 230 pruebas del motor y 580 de la web aprobadas (810 total), ambos chequeos de tipos, verificación de contenido, build web y bundle del motor correctos.

## Límites y publicación

- El mazo contiene 1.528 tarjetas y 324 ilustraciones locales registradas. Español tiene todos los textos; 522 textos anteriores carecen de traducción inglesa y usan respaldo español. Las nuevas tarjetas presidenciales sí tienen ambos idiomas. No se presentan claves internas como opciones.
- Ranking, compra, autenticación remota y reclamo de tickets requieren validar su integración con Supabase y Stripe en un entorno publicado de prueba. Los tests locales comprueban las reglas compartidas y las respuestas simuladas, sin generar compras ni escrituras remotas.
- La comprobación visual automática del build en Chrome no devolvió captura ni DOM en este entorno tras dos intentos; no se marca como aprobada. Docker está instalado pero su servicio no está disponible, por lo que el contenedor nginx no se ejecutó aquí. Quedan la revisión visual y la prueba del contenedor en el entorno de destino.
- Publicar web y funciones que reproducen partidas con la misma versión del motor. Generar el bundle antes de desplegar `submit-run`. Revisar aplicación de las migraciones existentes en el entorno de destino; esta revisión no agrega ni aplica migraciones.
- Los cambios de reglas pueden volver incompatibles guardados anteriores; la recuperación informa este caso y preserva preferencias. Revisar la experiencia y las partidas antes de publicar.
- No se modificaron `art/prompts.json` ni `art/PROMPTS.md`; no se hizo commit ni despliegue.
