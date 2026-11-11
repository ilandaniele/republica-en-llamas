# Auditoría de buenas prácticas — 8 de noviembre de 2026

> **Note (2026-11-09):** the backend moved to Cloudflare Workers + D1 and Better Auth; Supabase, Fly.io and nginx are gone. References below to Supabase, Edge functions and nginx (gzip, cache headers) describe the state on 2026-11-08 and are historical measurements, not current deployment instructions. See `docs/CLAUDE-HANDOFF.md`.

Se leyeron `BASE_CLAUDE.md` y `Buenas practicas.docx` de la carpeta de desarrollo indicada. El texto completo del archivo base ya está incorporado en `CLAUDE.md`; se comprobó su presencia sin duplicarlo. Sus criterios de simplicidad, responsabilidades, nombres claros, cambios puntuales y verificación se aplican a esta revisión.

El DOCX pide investigación, auditoría y alternativas antes de una reorganización general. Este trabajo corrige fallos concretos y presenta opciones. No reemplaza la arquitectura elegida previamente ni aplica una migración general.

## Alcance y evidencia

Inventario inicial: 328 archivos TypeScript/TSX y 41.218 líneas entre web, motor y funciones. Se revisaron configuración, límites de módulos, rutas, estado, guardado, consultas y escrituras remotas, índices, assets, caché y carga diferida. Lint, tipos, tests y verificación de contenido cubren el código correspondiente; no equivalen a una revisión manual exhaustiva de cada línea.

`/ultrareview` no está expuesto como herramienta en esta sesión. No se ejecutó ni se presenta esta auditoría como resultado de ese comando.

No se hicieron compras, escrituras remotas, despliegues, migraciones ni commits. No se modificó la app móvil. La configuración de build y el lockfile compartidos sí recibieron cambios.

## Correcciones realizadas

| Hallazgo | Corrección | Verificación |
| --- | --- | --- |
| Build global bloqueado: `packages/ui` no tenía `tsconfig.json` | Configuración heredada de la base, con salida en `dist` | `npm run build` y tipos de UI aprobados |
| Guardar puntajes dejaba historial, perfil y ranking con datos anteriores | Invalidación de `run-history`, `recent-runs` y `leaderboard` después de guardar; también al recibir un duplicado | Cinco tests: éxito, duplicado, error, offline y carrera |
| Una descarga especulativa fallida podía generar un rechazo sin manejar | El prefetch opcional absorbe su error; navegar sigue usando el manejo normal de rutas | Test de fallo de descarga |
| Precarga programada sobrevivía al desmontaje de App | Cleanup para `requestIdleCallback` y su alternativa con temporizador | Dos tests de cancelación |
| Cache de build ignoraba cambios en `VITE_POSTHOG_KEY` | Variable incluida en `turbo.json` | Configuración revisada y build aprobado |
| Compresión sin variar por soporte del cliente | `gzip_vary on` en nginx | Revisión de configuración; pendiente ejecutar contenedor |
| Guía de Copilot todavía indicaba React 18 y fuentes pequeñas antiguas | Versiones y fuentes actualizadas a React 19, Vite 8 y Pixelify Sans | Contraste con dependencias y estilos actuales |
| Dependencia de analytics arrastraba `protobufjs` vulnerable | PostHog actualizado de 1.360.0 a 1.447.3 dentro de la versión mayor permitida; nueva cadena elimina `protobufjs` | Audit, tests, tipos y build posteriores |

La actualización de analytics agrega dos paquetes transitivos y elimina 28. No se instalaron herramientas adicionales de arquitectura: ESLint, TypeScript, Prettier, Vitest, Testing Library, Husky, lint-staged y commitlint ya cubren las necesidades actuales.

## Checklist solicitado en el DOCX

| Criterio | Estado actual | Límite / siguiente verificación |
| --- | --- | --- |
| Respuesta inmediata de interfaz | Las decisiones se resuelven localmente; no esperan backend. Inicio, autenticación, guardado y pagos tienen estados pendientes | No simular compras ni puntajes aceptados antes de validación del servidor. Medir latencia real de inicio |
| JSON comprimido | nginx habilita gzip para JSON y assets de texto; ahora incluye `Vary: Accept-Encoding` | No prueba compresión de Supabase ni de cuerpos enviados por el navegador. Medir cabeceras y bytes en entorno publicado |
| HTML sin regeneración por visita | Vite genera SPA estática servida por nginx | No introducir SSR para cumplir un requisito que ya satisface el despliegue actual |
| Escrituras por lote | `submit-run` inserta los eventos con un único array; webhook usa upsert por lote | Persiste el problema de atomicidad descrito abajo |
| Consultas sin N+1 | Historial carga eventos anidados con columnas explícitas; límites de 20 partidas y 10 eventos. Perfil lanza consultas independientes | No se observó un bucle de una consulta por fila en las rutas revisadas. Se necesitan planes reales de Postgres |
| Cuellos de botella | Motor local, rutas e idiomas diferidos, analytics fuera del chunk inicial | No hay captura nueva de DNS/TCP/TLS/TTFB ni perfil de CPU en navegador; no se atribuye 90% de latencia sin medir |
| RAM de pestaña | Precargas cancelables, imágenes WebP, cleanup de timers en los recorridos probados | Sin medición nueva de RAM total/heap/GPU; no se declara cumplido el objetivo de menos de medio GB |
| Índices | Ya existen índices compuestos de historial, parciales de ranking, tickets y claves únicas | No agregar índices duplicados. Usar `EXPLAIN (ANALYZE, BUFFERS)` e `index_advisor` con datos representativos |
| Caché cliente | TanStack Query, ranking persistido público por un día, consultas por usuario y limpieza al cambiar sesión | Corregida invalidación posterior al guardado. No cachear pagos o permisos como datos públicos |
| Caché servidor | Assets con hash: un año e immutable; HTML revalidable; ilustraciones: una hora | nginx sirve archivos; no agregar Redis sin una carga que lo justifique. Verificar cabeceras reales después del despliegue |
| Prefetch | Hover/focus y precarga de selección/partida en idle | Errores opcionales controlados y cleanup probado |

Las 324 ilustraciones WebP ocupan 15.457.400 bytes de archivos. El mayor buffer RGBA estimado por dimensiones es 8.294.400 bytes (`soc_unrest.webp`, 1920×1080). Son tamaños de assets y estimaciones por imagen, no una medición de memoria de pestaña. La actualización de analytics también aumenta su chunk diferido; el build reporta aproximadamente 117 kB gzip para ese módulo. Conviene controlar ese costo cuando se mida la primera carga con analytics activo.

## Hallazgos pendientes

1. **Persistencia remota no atómica.** `supabase/functions/submit-run/index.ts` guarda `game_runs` y luego `run_events` en solicitudes separadas. Si falla la segunda, responde éxito con una partida sin eventos; un reintento duplicado no los reconstruye. Propuesta: una función SQL transaccional e idempotente, manteniendo el replay y la autorización en servidor. Verificar rollback y solicitudes concurrentes antes de desplegar. No se aplicó una migración remota en esta revisión.
2. **Dependencias con avisos pendientes.** `npm audit --workspace=apps/web --omit=dev` pasó de 24 avisos (uno crítico) a 10 (7 altos, 3 moderados, ninguno crítico) tras actualizar analytics. El grafo compartido incluye dependencias de Expo/React Native; por ejemplo, `zod` llega por `babel-preset-expo`. Ese total no demuestra que las diez estén incluidas o sean explotables en el bundle web. La última ejecución global de `npm audit`, incluyendo desarrollo y móvil, reportó 77 avisos: 4 bajos, 36 moderados, 35 altos y 2 críticos (`shell-quote` y `tar`). Para `tar`, npm propone cambiar Expo de versión mayor. No se declara saneado el repositorio completo. Hace falta clasificar el alcance y actualizar por grupos con pruebas; no se usó `audit fix --force`.
3. **Tipos de móvil bloquean el comando global.** `npm run type-check` encuentra tres errores previos: dos incompatibilidades de propiedades de PostHog en `apps/mobile/src/lib/analytics.ts` y una referencia a `restoreFromTurn` inexistente en `apps/mobile/src/screens/GameOverScreen.tsx`. Motor, UI compartida y web pasan. Móvil queda fuera de las modificaciones de este encargo conforme a las instrucciones del repo.
4. **Verificación publicada pendiente.** Supabase, Stripe, cabeceras nginx, memoria total, fluidez y accesibilidad visual requieren probar un entorno de destino. Los tests jsdom no miden layout, FPS ni consumo de GPU. No se reutiliza una medición histórica como resultado actual.
5. **Modularidad restante.** `ScenarioIllustration.tsx` tiene 916 líneas; `PixelCharacter.tsx`, 722; `gameLoop.ts`, 658; `HomeScreen.tsx`, 560. Priorizar extracción por responsabilidades cuando se modifiquen esas funciones. Los archivos grandes de datos y traducciones no son, por su tamaño solo, lógica espagueti.
6. **Analytics ante descarga fallida.** `lib/analytics.ts` conserva una cola de eventos mientras carga el SDK y no maneja el rechazo de ese import. Conviene acotar la cola y degradar sin afectar la partida; requiere pruebas específicas con SDK fallido.

## Opciones de arquitectura

Prácticas vigentes consultadas en noviembre de 2026; no se cambia de framework por el año. La [decisión histórica C](architecture-plan.md) ya está registrada en el repo.

| Opción | Estructura | Beneficio | Costo y encaje |
| --- | --- | --- | --- |
| A. Feature-Sliced Design | app, pages, widgets, features, entities, shared; APIs públicas por slice | Convención y límites compartidos para equipos grandes | Reordenamiento importante, más capas; útil si aparecen varios equipos |
| B. Hexagonal más estricta | Dominio puro, casos de uso, puertos de persistencia/pagos y adaptadores de plataforma | Sustituir servicios y probar fallos remotos sin UI | Más interfaces e indirección; útil si web/móvil comparten más casos de uso o se cambia backend |
| C. Híbrida liviana, recomendada | Motor puro compartido; web por features; clientes externos pequeños y explícitos; datos remotos con Query | Conserva replay, aislamiento y estructura existente con menor costo | Requiere mantener límites de imports y extraer responsabilidades al crecer; es la opción ya elegida |

No propongo microservicios, Next.js, un segundo store ni un caché distribuido para este juego sin un problema medido. Tampoco trasladar pagos o acceso a personajes a decisiones optimistas del cliente.

## Plan de continuación

1. **Cerrar riesgos de publicación.** Clasificar dependencias residuales; preparar persistencia transaccional. Aceptación: audit con alcance documentado, tests de rollback, reintentos e idempotencia, sin partidas parcialmente guardadas.
2. **Medir antes de optimizar.** En build de producción: inicio, 40 decisiones, Congreso, debate, elección, guardado, salir y volver diez veces. Registrar DNS, conexión/TLS, TTFB, descarga, tareas largas, heap y memoria total cuando esté disponible. Aceptación: sin crecimiento retenido al repetir recorridos; objetivo inicial de heap menor a 150 MB y pestaña menor a 500 MB, aún sin verificar.
3. **Refactor por responsabilidad según la opción que se mantenga o elija.** En C: extraer inicio/autenticación del menú y separar composición de escenas; mantener cambios de estado en motor y adaptador de store. Aceptación: suite y replay idénticos, sin imports entre features. Evitar interfaces genéricas para una sola implementación.
4. **Validar despliegue de prueba.** Web y función con la misma versión del motor; prueba de auth, ticket, pago de prueba y guardado. Aceptación: headers/caché/compresión comprobados, permisos reales y resultado idéntico del replay. Este informe no publica esos cambios.

## Resultados ejecutados

- `npm run lint`: aprobado, sin errores ni advertencias.
- `npm run build`: aprobado, incluidos motor, UI compartida y web; móvil no define tarea `build`.
- Tipos de motor, UI compartida y web: aprobados. Comando global: bloqueado por los tres errores de móvil detallados.
- `npm test`: 252 pruebas del motor y 593 de la web, 845 en total, aprobadas.
- `npm run verify:content`: 1.543 tarjetas y 324 ilustraciones verificadas; 522 textos ingleses anteriores conservan respaldo español.
- `npm run bundle:engine`: aprobado.
- Diff sin errores de espacios. Revisión visual en navegador y contenedor nginx: pendientes.

## Fuentes consultadas

- [Claude Code: buenas prácticas](https://code.claude.com/docs/en/best-practices): contexto de proyecto, comprobaciones reproducibles y reglas verificables.
- [React: estructura del estado](https://react.dev/learn/choosing-the-state-structure): evitar estado redundante y contradictorio.
- [TanStack Query v5: actualizaciones optimistas](https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates): cuándo usar feedback optimista y cómo tratar fallos; aplicado con cautela a operaciones que valida el servidor.
- [Supabase: optimización de consultas](https://supabase.com/docs/guides/database/query-optimization): índices alineados con consultas y planes reales.
- [nginx: gzip](https://nginx.org/en/docs/http/ngx_http_gzip_module.html): compresión y `gzip_vary`.
- [Feature-Sliced Design: estructura oficial](https://feature-sliced.design/docs/get-started/overview): alternativa A.
- [Modularizing React Applications](https://martinfowler.com/articles/modularizing-react-apps.html): separación de vista, lógica y acceso externo según necesidades.
- [Clean Code, Robert C. Martin, catálogo editorial](https://www.oreilly.com/library/view/clean-code-a/9780136083238/): referencia solicitada. No se obtuvo ni reprodujo el texto completo del libro; se aplican nombres claros, responsabilidades y pruebas junto con documentación específica del stack.
- [Advisory de protobufjs](https://github.com/protobufjs/protobuf.js/security/advisories/GHSA-xq3m-2v4x-88gg): aviso sobre generación de código con descriptores controlados por atacantes. Su presencia en dependencias no prueba explotación en este juego; la actualización elimina esa dependencia de analytics.
