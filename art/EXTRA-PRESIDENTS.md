# Presidentes y agendas adicionales

Néstor Kirchner (`nestor`), Cristina Fernández de Kirchner (`cristina`), Mauricio Macri (`macri`) y Nicolás del Caño (`del_cano`) se incorporan a la selección de presidentes.

Cada personaje tiene tres imágenes: `portrait_<id>_neutral`, `portrait_<id>_panic` y `portrait_<id>_victory`. Los PNG originales están en `art/raw/`; los WebP importados, en `apps/web/public/illustrations/`. Las especificaciones están en `extra-presidents.json`. Se genera primero neutral y se usa como referencia para las otras expresiones. El juego aplica las animaciones existentes de respiración, pánico y celebración.

Las diez cartas de agenda están en `packages/game-engine/src/events/parties.ts`. Cada espacio tiene dos debates y tres respuestas por debate:

| Espacio | Debates |
| --- | --- |
| La Libertad Avanza | Gasto fiscal y desregulación |
| Peronismo / kirchnerismo | Obra pública y subsidios |
| PRO | Incentivos a la inversión y apertura comercial |
| FIT-Unidad | Jornada laboral y banca |
| Federalismo | Coparticipación y corredores productivos |

Los efectos son reglas ficticias de balance del juego, no pronósticos económicos. El jugador puede seguir la agenda, negociar o elegir otra política. Las cartas se sortean únicamente para el espacio del presidente seleccionado, respetando turnos y enfriamiento. La identidad viaja en la configuración y el estado de la partida para conservar una reproducción determinista y compatibilidad con partidas anteriores sin presidente.

Se mantiene el acceso existente del paquete de presidentes. No se modifican `prompts.json` ni `PROMPTS.md`.

## Imágenes generadas

- [portrait_nestor_neutral](../apps/web/public/illustrations/portrait_nestor_neutral.webp)
- [portrait_nestor_panic](../apps/web/public/illustrations/portrait_nestor_panic.webp)
- [portrait_nestor_victory](../apps/web/public/illustrations/portrait_nestor_victory.webp)
- [portrait_cristina_neutral](../apps/web/public/illustrations/portrait_cristina_neutral.webp)
- [portrait_cristina_panic](../apps/web/public/illustrations/portrait_cristina_panic.webp)
- [portrait_cristina_victory](../apps/web/public/illustrations/portrait_cristina_victory.webp)
- [portrait_macri_neutral](../apps/web/public/illustrations/portrait_macri_neutral.webp)
- [portrait_macri_panic](../apps/web/public/illustrations/portrait_macri_panic.webp)
- [portrait_macri_victory](../apps/web/public/illustrations/portrait_macri_victory.webp)
- [portrait_del_cano_neutral](../apps/web/public/illustrations/portrait_del_cano_neutral.webp)
- [portrait_del_cano_panic](../apps/web/public/illustrations/portrait_del_cano_panic.webp)
- [portrait_del_cano_victory](../apps/web/public/illustrations/portrait_del_cano_victory.webp)

Omitidos: ninguno. Fallidos: ninguno.
