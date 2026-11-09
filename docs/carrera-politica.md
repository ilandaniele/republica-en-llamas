# Carrera política

En el inicio, elegir **CARRERA**, el cargo inicial y la dificultad; después elegir personaje. Se puede comenzar como intendente, gobernador o ministro nacional. La progresión del juego es intendente → gobernador → ministro nacional → presidente; representa una trayectoria ficticia, no un requisito legal argentino.

Cada cargo tiene cuatro tarjetas de gestión y una evaluación política, con cuatro opciones por tarjeta. Las decisiones afectan apoyo público, gestión, alianzas, presupuesto disponible e integridad. Los costos negativos aumentan con la dificultad; las opciones muestran el efecto real, con los límites aplicados. Durante estas etapas no se simulan inflación, reservas ni otros indicadores nacionales.

Después de cinco decisiones aparece la primera oportunidad de ascenso. Hay nuevas oportunidades en las decisiones 9, 12 y 15 del cargo. Postularse requiere cumplir todos los mínimos:

| Cargo actual | Gestión | Alianzas | Presupuesto | Integridad | Apoyo |
| --- | ---: | ---: | ---: | ---: | ---: |
| Intendente | 55 | 45 | 15 | 45 | 50 |
| Gobernador | 70 | 60 | 20 | 50 | 55 |
| Ministro nacional | 80 | 70 | 25 | 55 | 60 |

Una postulación sin requisitos pierde apoyo y alianzas. Se puede seguir preparando la candidatura o retirarse. La carrera también termina por presupuesto agotado, integridad de 10 o menos, apoyo de 10 o menos, o por no ascender al terminar la decisión 15 del cargo.

Al llegar a presidente empieza un mandato nacional en el turno 1, con los eventos, Congreso, debate y elecciones existentes. Se conservan el personaje, la semilla, los ascensos y el historial local archivado. El calendario sigue avanzando y el apoyo acumulado aporta un bono inicial. Los indicadores económicos se inicializan para el mandato nacional; el presupuesto de carrera no se convierte en reservas del Banco Central.

La partida se guarda localmente y se reconstruye desde la configuración y las decisiones. Este modo queda fuera del ranking competitivo, no solicita tickets y el servidor rechaza sus envíos. No se combina con escenarios históricos ni Crisis Express. Las restricciones de personajes del juego siguen vigentes.

Verificación del 7 de noviembre de 2026: pruebas del motor para los tres cargos iniciales, los doce personajes, ascensos, replay, calendario, costos y finales. Pruebas de interfaz en jsdom para selección, recuperación del guardado, trayectoria completa y final por corrupción. Tipos del motor y web, lint y compilación de la web comprobados. No se realizó una revisión visual en navegador.

Para probar: abrir http://127.0.0.1:5174/ y seleccionar CARRERA. Actualización del 8 de noviembre: se reparó `packages/ui/tsconfig.json` y el build global pasa. El comando global de tipos conserva tres errores previos de móvil; motor, UI compartida y web pasan. Ver [auditoría actual](buenas-practicas-2026-11-08.md).
