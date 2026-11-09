# Prueba local del juego

Actualización de seguridad del 8 de noviembre: 252 pruebas del motor, 626 de la web y 46 de seguridad aprobadas (924 total). Ver [informe actual](../security_best_practices_report.md); las cifras de revisiones anteriores se conservan como antecedentes.

Abrir http://127.0.0.1:5174 en esta computadora. Para iniciar el servidor desde la raíz:

```sh
npm run playtest --workspace=apps/web
```

Este modo funciona solamente en desarrollo: permite elegir gratis a Milei, Massa y Kicillof. Los otros nueve presidentes, incluido Juan Grabois, muestran el Pack Presidentes; el modo de prueba ya no desbloquea ese pack. Habilita los nueve escenarios históricos y Crisis Express, sin límites diarios. No pide tickets, no envía puntajes al servidor ni carga analytics. Su guardado local pertenece al origen del puerto 5174. La compilación de producción conserva las condiciones normales de acceso a modos y partidas diarias.

La votación del Congreso usa un solo temporizador para actualizar bancas por lotes y termina en unos 2,6 segundos. El audio reutiliza el contexto compartido del juego, respeta silencio y desconecta los nodos al terminar; salir de la sesión cancela el temporizador. “Completar recuento” adelanta la animación y conserva las negociaciones de votos indecisos. Las fases cambian sin esperar la salida de la anterior; se bloquean acciones y confirmaciones repetidas. Los costos de negociación permanecen visibles para evitar saltos de altura al mover el cursor. Las pruebas cubren aprobación, rechazo, decreto, negociación ajustada, conteo final exacto, sonido, cancelación y avance de un turno con replay idéntico.

Recorrido sugerido:

1. Empezar una partida clásica, elegir un presidente y completar el tutorial.
2. Elegir una opción con clic o A/B/C/D, confirmar y revisar el resumen del turno.
3. Recargar durante el resumen y comprobar que continúa en el siguiente turno sin repetir la decisión.
4. Abrir el diario; probar que sus controles no disparen opciones de la partida.
5. Volver al inicio y elegir un escenario histórico. Probar otro presidente y el reloj de Crisis Express.

La interfaz usa Pixelify Sans local para narrativa, decisiones, títulos, indicadores, resúmenes y controles, con pesos reales de 400–700 y acentos españoles verificados. Se quitaron tamaños de 6–8 px y la cursiva sintetizada del resumen; los titulares de La Gaceta usan al menos 22 px y sus etiquetas 14 px. El logo conserva Press Start 2P. Ambas fuentes se precargan y mantienen sus licencias OFL en `/fonts/`. Se respeta la preferencia de movimiento reducido.

Las acciones y niveles del menú usan 22 px; pestañas y cuenta, 18 px. “Nueva Partida” y “Tabla de Líderes” comparten tipografía y altura de interacción. Los indicadores muestran sus nombres completos y las opciones se distribuyen en columnas según el ancho de escritorio, con menos espacio interno y una ilustración cuya altura se adapta a la ventana. Las banderas de la Casa Rosada son capas SVG de celeste y blanco con movimiento por columnas; se ocultan las banderas estáticas descoloridas del sprite. El techo mantiene sus banderas después de la ceremonia y cada escena usa una máscara propia.

Se verificaron 960 combinaciones de doce presidentes × cuatro dificultades × diez contextos (clásico y nueve históricos) × dos modos, más 48 simulaciones con otras semillas. Cada partida termina, mantiene valores acotados y reproduce el resultado desde sus decisiones.

La prueba de interfaz carga los componentes y rutas reales en jsdom: inicio → selección de Kicillof → primera decisión → confirmación → reanudación del guardado. También comprueba los tres presidentes gratis, los nueve candados y la apertura del pack al elegir Grabois sin comprarlo, sin cambiar la selección gratuita. Este recorrido no invoca funciones remotas. La configuración de Vitest procesa las dependencias compartidas para usar el mismo React 19 de la web; no cambia React 18 de la app móvil.

Resultado actual: 252 pruebas del motor y 593 de la web aprobadas (845 total), tipos de motor, UI compartida y web, lint y build global correctos. El contenido incluye 1.543 tarjetas y 324 ilustraciones locales. Kicillof y Grabois tienen 100 tarjetas propias cada uno y 18 imágenes nuevas entre retratos, escenas y sprites de asunción; estos últimos tienen transparencia sin magenta visible. Los archivos WOFF2 se validan junto con el contenido. El build de producción excluye las ventajas del modo de prueba. Se reparó `packages/ui/tsconfig.json`; el comando global de tipos aún encuentra tres errores previos en móvil. Ver [auditoría del 8 de noviembre](buenas-practicas-2026-11-08.md).

La pestaña **CARRERA** permite empezar como intendente, gobernador o ministro nacional y ascender hasta presidente. Incluye gestión y recursos propios, requisitos de ascenso, guardado local y finales específicos. Las pruebas recorren los tres puntos de entrada, la recuperación del guardado, una carrera completa y una gestión que termina por corrupción. Ver [reglas y verificación de carrera](carrera-politica.md).

La captura de un navegador automático no se completó: las capturas iniciales mostraron solamente la carga y la aprobación automática rechazó el lanzamiento posterior para capturar el build. La prueba de interfaz no sustituye la revisión visual en un navegador real. Ranking y pagos reales siguen pendientes de pruebas externas; este modo no los ejecuta.
