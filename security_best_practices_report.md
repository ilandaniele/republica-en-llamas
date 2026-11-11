# Revisión de seguridad — 8 de noviembre de 2026

## 2026-11-09 — Cloudflare migration update (current)

The backend moved from Supabase (Postgres, RLS, Edge functions) and Fly.io (nginx) to a Cloudflare Worker (`apps/api`) with D1 and Better Auth, serving the static web build from the same origin. **Everything below this section was written against the Supabase/Fly architecture and is historical.** Findings tied to Supabase (RLS policies, `getUser(token)`, migrations 001-011, the PGlite SQL tests, Edge-function JWT gateway config, nginx limits) and the publication order ("apply migration 010 before the Edge functions", Supabase Auth allowlists, counter cleanup RPCs) are **superseded by the migration** and no longer describe the deployed system. Application-level findings (SEC-001 to SEC-009, SEC-013 to SEC-015) must be re-verified against the Worker code before being called closed; the rate-limit, request-size and ticket-cap controls were re-implemented in `apps/api/src`.

### SEC-016 — Public default auth secret in the deployed Worker (high, fixed in code; secret set remotely)

- **Finding:** with `BETTER_AUTH_SECRET` unset, the deployed Worker fell back to Better Auth's built-in default secret. That value is public, so an attacker could forge session cookies for any user.
- **Fix:** `createAuth` (`apps/api/src/auth.ts`) throws when the secret is missing or shorter than 32 characters, and the API answers 503 (fail closed) instead of serving auth with a weak secret. A random 48-byte secret was generated and set with `wrangler secret put`.
- **Tests:** `apps/api/src/__tests__/api.test.ts` (15 tests) cover the fail-closed path. Run with `npm run test:security`.
- **Limit:** local tests prove the code refuses a missing or short secret. They do not prove the remote secret is set or strong; confirm with `wrangler secret list` (names only) and the live smoke checks (`/api/auth/get-session` answers null, not 503).

### SEC-017 — Missing hashed asset returned SPA HTML with 200 (low, fixed)

- **Finding:** a request for a missing `/assets/*.js` fell through to the SPA fallback and returned `index.html` with status 200, which breaks stale-client recovery and caches HTML under a script URL.
- **Fix:** `/assets/*` is now `run_worker_first`; a missing hashed asset returns 404 instead of HTML. `/api/*` also runs the Worker first.
- **Evidence:** covered by API tests; live smoke on https://republica-en-llamas.ilandaniele.workers.dev was run for `/`, `/api/leaderboard`, `/api/profile` (401), `/api/auth/get-session` (null) and `/api/nope` (404). That is a point-in-time smoke test, not a full pentest.

### Current status and open items

- CSP is still report-only (`apps/web/public/_headers`); enforcement needs testing on the deployed origin. Session cookies are managed by Better Auth.
- `tar` advisory under the Expo toolchain (SEC-010) is unchanged. Mobile type-check was not run.
- Not verified remotely: Google OAuth and Stripe dashboard configuration (redirect `<url>/api/auth/callback/google`, webhook `<url>/api/stripe-webhook`), the `EMAIL` binding for password reset, and rate-limit behavior behind the real edge. Local tests do not prove any of these.
- Owner tasks: set the remaining Worker secrets, add GitHub secrets `CLOUDFLARE_API_TOKEN`/`CLOUDFLARE_ACCOUNT_ID`, decommission the Fly app and the Supabase project.

---

# Histórico — Revisión de seguridad del 8 de noviembre de 2026 (Supabase/Fly)

Se descomprimió el ZIP solicitado, se leyeron sus 14 guías y `Seguridad.docx`, y se ejecutaron revisiones por fases con tres subagentes. Se corrigieron controles de autorización, solicitudes, sesiones, checkout, recuperación, RLS y persistencia. **924 pruebas locales aprobaron**, junto con lint, build, tipos de motor/UI/web y comprobación Deno de cinco funciones. **STRIX no se ejecutó.**

No se aplicaron migraciones, despliegues, compras ni escrituras remotas. Las correcciones de servidor requieren publicación coordinada. Quedan riesgos y configuración pendientes; este informe no certifica producción.

## Alcance y guías ejecutadas

Los archivos originales quedaron en `C:\Users\Ilan\Desktop\Desarrollo\Security\Security Agents with prompts to pass\`. La extracción verificó rutas y no sobrescribió archivos distintos. Son instrucciones de revisión, no 14 ejecutables ni resultados prefabricados.

| Grupo de revisión | Guías aplicadas | Evidencia |
| --- | --- | --- |
| Backend, datos y autorización | security-auditor, security-engineer, database-administrator, penetration-tester | [Informe backend](docs/security/backend-audit.md) |
| Frontend, arquitectura e infraestructura | code-reviewer, architect-reviewer, accessibility-tester, sre-engineer | [Informe frontend](docs/security/frontend-audit.md) |
| Pruebas, rendimiento y diagnóstico | configure-load-tests, load-testing-reference, debugger, error-detective, performance-engineer, qa-expert | [Informe de pruebas](docs/security/testing-audit.md) |

Hubo una segunda lectura adversarial independiente de backend y frontend. Se reprodujo una lectura de cuerpo sin plazo máximo y se corrigió con deadline y prueba de cancelación. Se revisaron los cambios finales; no se inventaron rutas, métricas ni una certificación WCAG/SOC2. Los ejemplos de seguros/agentes IA de las guías se adaptaron al juego.

Se aplicaron las referencias React/JavaScript de `security-best-practices` y [VibeSec](https://github.com/BehiSecc/VibeSec-Skill/blob/main/SKILL.md). La copia de VibeSec leída está fuera del repo, en la carpeta `review-resources` junto al ZIP. No se ejecutó código de ese repositorio: su contenido es una guía aplicada a la auditoría.

## Fases y correcciones

### Fase 1 — Entrada y autorización de API

1. **SEC-001, alta, corregida en código:** `submit-run` no verificaba las compras de Express/históricos al aceptar esos modos. Ahora contrasta todos los accesos requeridos con datos del servidor antes del replay. Ver `supabase/functions/submit-run/index.ts:72` y B-01 del informe backend. No se demostró una compra gratuita; el fallo afectaba aceptación de partidas de modos pagos.
2. **SEC-002, media, corregida en código:** solicitudes sin límites suficientes de método, tamaño, duración y frecuencia. Los cuatro endpoints de usuario admiten POST/OPTIONS, CORS exacto, cuerpos limitados por bytes reales y plazo de 15 segundos. Se rechazan encodings no soportados. Se agregaron límites duraderos por usuario; el control IP exige una cabecera saneada por el gateway. Ver `supabase/functions/_shared/http.ts:51`, `requestPolicy.ts:27`, `rateLimit.ts:24`. No se presenta como un DoS remoto demostrado.
3. **SEC-003, baja, corregida en código:** la selección de precio usaba propiedades heredadas de un objeto. `Object.hasOwn` rechaza `__proto__`/`constructor`; precios y usuario pertenecen al servidor. Stripe sigue exigiendo firma para el webhook, y checkout rechaza invitados. Ver B-05 y tests de handlers.

Autenticación se valida con Supabase `getUser(token)`, no con el body ni con decodificación local confiada. `supabase/config.toml` declara JWT en los cuatro endpoints de usuario; solo el webhook lo omite y exige la firma Stripe.

### Fase 2 — Datos y RLS

4. **SEC-004, media, corregida en código:** partida y eventos se guardaban por separado. `save_validated_run` los guarda en una transacción, comprueba dueño/semilla, bloquea el ticket y devuelve el registro almacenado al reintentar. El puntaje se calcula mediante replay en servidor. Ver B-04.
5. **SEC-005, baja, corregida en código:** las escrituras directas de perfiles podían eludir límites del formulario. La migración añade límites de longitud de username/avatar y adapta `username_available`; restricciones NOT VALID evitan bloquear la migración por datos anteriores, pero protegen escrituras nuevas. Ver B-06.

Se comprobaron políticas RLS entre dos identidades, rechazo de escrituras de puntajes/entitlements desde cliente y ejecución de RPC solo por service-role. La nueva tabla de contadores tiene RLS y permisos revocados al cliente. Se agregó limpieza administrativa de buckets antiguos, con índice y lotes acotados; programarla sigue siendo una tarea operativa.

PGlite ejecuta SQL real con fixtures de roles y `auth.uid`; no reproduce Supabase Auth, gateway, Storage ni su infraestructura. Se probaron migraciones 001 y 003–010. La 002, relativa a Storage público de imágenes, se revisó como código y no se ejecutó en esos fixtures.

### Fase 3 — Frontend y sesiones

6. **SEC-006, media, corregida:** Recordarme ahora decide entre almacenamiento persistente y de pestaña, sin fallback persistente silencioso. Se corrigió la carrera de bootstrap que podía restaurar la UI de un usuario después de salir y se limpia caché privada al cambiar identidad. Ver FE-01/02.
7. **SEC-007, media condicional, corregida como defensa:** checkout valida HTTPS, dominio Stripe exacto, ausencia de credenciales/puertos extra y ruta esperada. No se confirmó que un atacante pudiera controlar la respuesta del servidor; se cerró el destino sin validar. Ver `apps/web/src/lib/checkout.ts:4` y FE-03.
8. **SEC-008, baja, corregida:** errores desconocidos se presentan de forma genérica; el parámetro URL de regreso del pago no demuestra compra. El éxito requiere entitlement confirmado por servidor. Ver FE-04/07.

Se completó `/reset-password` con evento de recuperación del SDK, sesión, confirmación de contraseña y revocación global posterior. Un flag URL no habilita el formulario. Caducidad y uso único del enlace se deben comprobar en Supabase publicado. Ver FE-05.

nginx limita métodos y cuerpos del servidor estático, oculta versión y completa cabeceras en sus locations. No se instaló Helmet porque no hay Express. Estos límites no se trasladan automáticamente al dominio de Supabase.

### Fase 4 — Secretos, dependencias y pruebas

9. **SEC-009, baja, corregida como prevención:** `.gitignore:7` ahora cubre variantes `.env.*` y `.dockerignore:7` impide incluirlas en el contexto de build. Los ejemplos siguen versionados; las claves públicas de Supabase no se confunden con service-role, passwords ni secretos de Stripe.

Gitleaks 8.30.1, obtenido del release oficial y verificado con su checksum publicado, revisó el árbol actual y el historial de **163 commits**. Salida final 0 en ambos. Se descartaron únicamente identificadores de traducción, IDs públicos `price_*` y el JWT deliberadamente inválido de modo offline, con allowlists estrechas en `.gitleaks.toml`. Un control positivo sintético confirmó que la configuración aún detecta un secreto de prueba. Esto no garantiza ausencia de secretos en binarios o sistemas externos; no se publicaron valores de credenciales.

Se actualizaron transitivas compatibles de shell-quote, ws, lodash, picomatch, yaml y fflate, sin forzar majors. Se añadió PGlite 0.5.15 solo como dependencia de desarrollo para repetir pruebas SQL en CI. Los tests de seguridad generan primero un bundle nuevo del motor, evitando depender de un archivo ignorado previo.

## Riesgos abiertos y límites

10. **SEC-010, crítica según el scanner de dependencias, abierta:** la última auditoría global JSON reportó 71 avisos: 4 bajos, 34 moderados, 32 altos y uno crítico en `tar`. Llega por herramientas como `@expo/cli`/`cacache`; no se confirmó un flujo desde peticiones del juego al extractor vulnerable. npm propone un cambio mayor de Expo para su resolución. No se forzó esa migración ni se declara saneado el repo completo. El reporte acotado con `--workspace=apps/web --omit=dev` quedó en cinco avisos, sin críticos; también incluye dependencias del grafo compartido, no necesariamente del bundle.
11. **SEC-011, media como endurecimiento pendiente:** CSP sigue report-only y por tanto no bloquea XSS. Debe probarse en staging antes de enforcement. Los tokens bearer del SDK siguen accesibles al JavaScript del mismo origen; no se simuló HttpOnly en una SPA.
12. **SEC-012, operativa, abierta:** aplicar migración 010 antes de funciones, configurar orígenes/IP confiable, límites de Auth, limpieza de contadores y recuperación publicada. Los nuevos limitadores fallan cerrado con 503 si sus RPC aún no existen. No desplegar solo frontend/funciones suponiendo que la DB ya cambió.

CSRF se evaluó según el esquema real: bearer explícito, no una cookie de sesión propia enviada automáticamente. CORS no reemplaza autorización. No se añadió un double-submit-cookie sin un backend que use esa cookie. Si se migra a sesiones HttpOnly, hay que diseñar sus controles CSRF junto con esa migración.

No se modificaron DNS, certificados, puertos de VPS o SSH: el despliegue visible es Fly.io con nginx y HTTPS forzado en su proxy. No se reimplementó hashing de contraseñas: lo gestiona Supabase Auth. Su política de contraseñas, TTL, recuperación, revocación y rate limits requieren verificación en el entorno real. No se encontraron endpoints de aplicación que devuelvan passwords o secretos; las consultas revisadas usan columnas explícitas y límites.

No se ejecutó navegador ni contenedor nginx —el daemon Docker no estaba disponible—, pentest externo, carga sobre DB publicada ni soak extendido de dos horas. Los tres errores previos de tipos de móvil siguen fuera de las modificaciones. No se hicieron commits ni despliegues.

## Verificación final

| Comprobación | Resultado |
| --- | --- |
| Motor / web | 252 + 626 = 878 pruebas aprobadas |
| Seguridad backend / SQL / harness | 30 + 7 + 9 = 46 aprobadas; cero omitidas en esta máquina |
| Total unitarias e integración | **924 aprobadas** |
| Lint / build global / tipos motor, UI y web | Aprobados |
| Deno check, cinco funciones | Aprobado |
| Contenido | 1.543 tarjetas y 324 ilustraciones verificadas |
| Gitleaks actual / historial | Aprobados tras clasificación de falsos positivos públicos |
| Carga local final | Seis perfiles aprobados, **1.354 solicitudes**, checks 100%, sin fallos HTTP |

Smoke/load/peak/stress/spike/soak usan targets existentes y resúmenes JSON/HTML reales. La última ejecución por perfil tuvo 25/102/261/485/303/178 solicitudes y p95 entre 1,195 y 1,699 ms. Son mediciones de Node estático en loopback; no de nginx, Supabase, jugadores simultáneos ni del juego renderizado. Los perfiles cortos validan el harness, no horas de resistencia ni el punto de ruptura de producción. Resultados locales en `scripts/security/results/`; instrucciones en [README de pruebas](scripts/security/README.md).

```sh
npm test
npm run test:security
npm run lint
npm run build
npm run verify:content
npm run test:load
```

En CI sin k6, sus tres guard-tests se omiten explícitamente; los demás tests de seguridad y SQL siguen corriendo. La carga real requiere k6 instalado.

## Claude Security y comandos solicitados

`/security-review` nativo se ejecutó dos veces mediante Claude CLI con lectura solamente; la última revisión no confirmó vulnerabilidades medias/altas con su umbral de confianza. No ejecutó tests y usó un solo pase, por lo que no se equipara a un panel independiente ni a una auditoría completa. El resumen automático generaliza algunos controles: **el webhook usa firma Stripe y lectura de cuerpo propio, no bearer de usuario**. Evidencias: [revisión intermedia](docs/security/claude-review-interim.md), [revisión final](docs/security/claude-review-final.md).

El usuario aceptó explícitamente el coste y el escaneo completo con esfuerzo medio. El plugin oficial `claude-security` se ejecutó mediante Claude CLI con Workflow, renderer y redactor. El primer intento se detuvo por los alias rotos de Python de Windows; un launcher temporal, solo para el proceso, permitió usar el Python real existente sin modificar PATH global ni instalar otro intérprete.

Resultado oficial: [CLAUDE-SECURITY-RESULTS.md](CLAUDE-SECURITY-20261108-065217/CLAUDE-SECURITY-RESULTS.md), junto con JSONL, SARIF y sello de revisión `2664bccc7212-dirty`. El renderer registra **`verification.status: verified`**, 32 de 32 investigadores retornados, 18 votos, una ronda de panel y cuatro hallazgos bajos confirmados. El redactor terminó sin advertencias de credenciales sin limpiar. No se editaron fuentes de aplicación ni el índice Git durante el escaneo; no se generaron ni aplicaron parches.

Hallazgos nuevos, corregidos en código por `supabase/migrations/011_ticket_caps_and_private_usernames.sql` y las funciones `start-run`/`claim-run-ticket` (cubiertos por `npm run test:security`; pendiente aplicar en remoto):

- **SEC-013 / F1, baja:** el fallback de username para OAuth deriva de la parte local del email y puede hacerla pública mediante el ranking (`009_anonymous_guests.sql:18`).
- **SEC-014 / F2–F3, baja:** tickets antiguos de invitados pueden reclamarse sin consumir correctamente el cupo diario del destinatario porque conservan `created_at`. F2 y F3 son dos ubicaciones de la misma causa, no dos problemas independientes.
- **SEC-015 / F4, baja:** el cupo gratuito de tres partidas depende de localStorage; el servidor solo aplica un límite general de 30 tickets. El cliente puede eludir ese control de producto.

Corrección: usernames neutros `jugador_<hex>` con backfill de los derivados del email; el ticket reclamado reinicia `created_at` y cuenta contra el cupo del destino; tickets de invitado de más de un día no se reclaman; el servidor aplica 3 tickets diarios sin `full_access` y 30 con él. El contador de localStorage queda solo como indicación de UI.

Cobertura oficial: 325 archivos seguidos por Git, 10 componentes y un barrido adicional. `completeness_check_outcome: checked` significa que los directorios principales fueron contabilizados, no que cada línea se leyó. Dentro de componentes: 111 archivos leídos, 167 bajo exclusiones declaradas. Se apartaron `art` (inputs gráficos, perfiles Chromium/modelos), `.claude` (configuración local) y `docs` (documentación). Tests, contenido gráfico/eventos/i18n y salidas generadas se examinaron parcialmente o solo por búsquedas. No se aplicó la lente de memoria insegura a nueve grupos por su lenguaje. Los archivos nuevos sin seguimiento se leyeron en parte, pero no entran en el conteo ni en la garantía de cobertura del ledger. No se leyeron `.env` ni almacenes de credenciales.

Fue análisis estático: el plugin no ejecutó tests, exploits ni llamadas a backends. Sus cuatro hallazgos bajos no eliminan SEC-010 (`tar`) ni los demás riesgos de la auditoría previa. La aceptación y el resultado completan el paso antes pendiente; [preflight anterior](docs/security/claude-security-preflight.md) se conserva como antecedente.

STRIX se excluyó por instrucción expresa del usuario, incluidos pentests o instalaciones mediante ese proyecto.

## Próxima fase de publicación

1. Revisar el diff y la migración local. Aplicar primero 010 a un entorno de prueba, con respaldo y estado de migraciones comprobados.
2. Configurar `WEB_URL`, orígenes exactos y una cabecera IP que el gateway realmente sobrescriba; revisar límites de Auth. No usar `X-Forwarded-For` arbitrario como identidad.
3. Desplegar funciones con bundle del motor de la misma versión; verificar gateway JWT y firma de webhook en staging.
4. Agregar URL exacta `/reset-password` a la allowlist de Supabase. Probar email, vencimiento, reutilización del enlace y sesiones posteriores al cambio.
5. Programar limpieza administrativa de contadores y revisar constraints legacy antes de validarlas sobre todos los datos.
6. Probar navegador, cabeceras/CSP, dos cuentas reales de prueba, compras en modo test, 429 y persistencia/replay. Resolver dependencia `tar` junto con una actualización probada de la plataforma que la necesita.

Estas acciones remotas no se realizaron en esta revisión.

## Fuentes

- [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security), [validación getUser](https://supabase.com/docs/reference/javascript/auth-getuser) y [límites de Auth](https://supabase.com/docs/guides/auth/rate-limits).
- [OWASP: prevención CSRF](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html).
- [k6: resúmenes reales con handleSummary](https://grafana.com/docs/k6/latest/results-output/end-of-test/custom-summary/).
- [VibeSec-Skill](https://github.com/BehiSecc/VibeSec-Skill/blob/main/SKILL.md), [plugin oficial Claude Security](https://github.com/anthropics/claude-plugins-official/tree/main/plugins/claude-security).
