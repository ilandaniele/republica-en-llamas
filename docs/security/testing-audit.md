# Auditoría de pruebas, carga y diagnóstico — 8 de noviembre de 2026

Se aplicaron `configure-load-tests`, `load-testing-reference`, `debugger`, `error-detective`, `performance-engineer` y `qa-expert` del ZIP. Las guías se adaptaron a República en Llamas: no se copiaron ejemplos de seguros, turnos médicos, reservas ni agentes IA. STRIX quedó excluido.

## Resultado

- k6 v2.3.0 instalado y ejecutado localmente.
- Seis perfiles implementados: smoke, load, peak, stress, spike y soak.
- Los seis perfiles cortos pasaron. La repetición final, después de compilar los cambios de seguridad, hizo 1.354 solicitudes HTTP a archivos reales del build, sin errores HTTP y con checks de contenido al 100%.
- Nueve tests del harness y sus guardas pasaron; ninguno omitido en esta ejecución.
- JSON y HTML reales por perfil disponibles localmente en `scripts/security/results/`; no se incluyen en git. El reporte de cada perfil identifica sus umbrales y el alcance medido.
- No se ejecutaron pruebas extendidas de dos horas ni se atacaron servicios remotos.

## Resultados de la carga corta

| Perfil | Duración de etapas | VUs máximos | Solicitudes | p95 HTTP (ms) | p99 HTTP (ms) | Resultado |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| smoke | 2 s | 1 | 25 | 1,70 | 3,82 | Aprobado |
| load | 5 s | 4 | 102 | 1,43 | 1,55 | Aprobado |
| peak | 6 s | 12 | 261 | 1,63 | 1,92 | Aprobado |
| stress | 6 s | 24 | 485 | 1,20 | 1,52 | Aprobado |
| spike | 5 s | 24 | 303 | 1,31 | 1,54 | Aprobado |
| soak | 8 s | 4 | 178 | 1,67 | 2,19 | Aprobado |

Son solicitudes HTTP de loopback al build servido por Node, incluyendo preflight HEAD y visitas iniciales al HTML. No son tiempos de respuesta de Supabase ni del juego renderizado. El servidor de prueba no reproduce nginx, su caché ni gzip. Los VUs no equivalen directamente a jugadores simultáneos y esta carga no alcanza el punto de ruptura del servicio real.

## Hallazgos y correcciones

### TEST-01 — Asset ausente oculto por comprobaciones superficiales, bajo, corregido

El build referenciaba `/favicon.svg`, pero el archivo no existía. La nueva comprobación de archivos falló con ENOENT antes de ejecutar carga. Se comunicó al agente frontend, que agregó el favicon local y reconstruyó la web. El segundo preflight y los seis perfiles pasaron. Evidencia: `scripts/security/load-config.mjs:38`, validación inicial en `scripts/security/run-load.mjs:22` y test de asset ausente en `scripts/security/load.test.mjs:45`.

### TEST-02 — Falta de pruebas de carga reproducibles, medio, corregido en alcance local

No había infraestructura de carga detectada por la búsqueda de scripts k6, Artillery o Locust. Ahora los perfiles comparten configuración, descubren rutas existentes, verifican contenido, limitan tiempo de ejecución y producen resúmenes. Peak/spike miden recuperación, stress separa escalones y soak compara mitades, en vez de duplicar el mismo test con otro nombre. Configuración en `scripts/security/load-config.mjs`; solicitudes y métricas en `scripts/security/game-load.k6.js`.

### TEST-03 — Riesgo de falso éxito por HTML 200, cubierto por prueba negativa

Una prueba que comprueba solo estado 200 puede aceptar el HTML de fallback SPA o login como un asset válido. Los checks exigen tipo distinto de HTML y longitud no vacía (`scripts/security/game-load.k6.js:95`). Un servidor fixture intencionalmente devuelve HTML 200 para `/assets/main.js`; k6 sale con código 99 y el reporte declara `passed: false`. Esto se prueba en `scripts/security/k6-guards.test.mjs:76`. El fixture solo valida el detector: sus resultados no se presentan como carga del juego.

### TEST-04 — Destino incorrecto o tráfico externo accidental, mitigado

El runner no acepta una URL externa y crea su propio listener loopback en puerto aleatorio. El script k6 vuelve a validar destino y tipos de rutas (`scripts/security/game-load.k6.js:7`). No utiliza tokens ni dispara endpoints mutantes. Las guardas prueban rechazo de una URL no loopback y una API inventada. Los logs no imprimen variables de entorno ni credenciales.

### TEST-05 — Capacidad del backend y pruebas end-to-end reales, pendiente

No se dispone de Deno en PATH ni se ejecutó Supabase local/DB. El otro agente prepara pruebas de políticas y handlers reales con dependencias controladas; esas pruebas siguen siendo locales. No se declaró validado el rate limiter persistente ni la RLS en una base real. Los tests existentes con jsdom verifican flujo de UI, no navegador, red remota ni ejecución de pagos. Esta revisión tampoco mide heap de pestaña o GPU; no se afirma que la pestaña cumpla un límite de RAM.

## Comandos reproducibles

```sh
npm run build --workspace=apps/web
node --test scripts/security/load.test.mjs scripts/security/k6-guards.test.mjs
node scripts/security/run-load.mjs
```

Un perfil: `node scripts/security/run-load.mjs stress`. Ensayo de endurance preparado, no ejecutado: `node scripts/security/run-load.mjs soak --extended` (dos horas, mismo servidor local).

Para integración continua, el smoke local puede ejecutarse después del build si k6 está instalado, con JSON/HTML como artifacts. Las pruebas completas publicadas necesitan un entorno de staging autorizado y separado: no se incluyó una opción que pueda enviar carga al servidor productivo por error. No hace falta agregar dependencias npm para estos scripts.

## Plan de verificación de destino

1. Ejecutar el contenedor nginx real en un entorno aislado y comprobar headers, caché, compresión, assets 404 y HTTPS del proxy de destino.
2. Levantar Supabase/Postgres locales, aplicar migraciones y ejecutar pruebas de RLS, auth, límites por usuario y rechazos de entradas inválidas con datos descartables.
3. Diseñar carga de API autenticada con cuentas de prueba: escenarios de inicio, envío y reclamo de tickets; respetar presupuesto por usuario/IP. No lanzar pago real ni usar cuentas de usuarios.
4. Medir una partida real en navegador: Congreso, debate, elección, guardar, salir y reentrar. Registrar tareas largas, memoria retenida y latencia por fase. Mantener los resultados separados de este laboratorio de archivos estáticos.

Referencias: [k6: resúmenes personalizados](https://grafana.com/docs/k6/latest/results-output/end-of-test/custom-summary/) y [k6: ejecutor ramping-vus](https://grafana.com/docs/k6/latest/using-k6/scenarios/executors/ramping-vus/).
