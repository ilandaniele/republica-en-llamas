# Backend: auditoría y correcciones de seguridad

Fecha: 8 de noviembre de 2026. Alcance: las cinco funciones Edge, sus helpers y migraciones SQL. Se aplicaron las guías `security-auditor`, `security-engineer`, `database-administrator` y `penetration-tester` del ZIP, las reglas del proyecto y VibeSec. STRIX no se ejecutó. No se hicieron ataques externos, compras, escrituras remotas, migraciones remotas ni despliegues.

## Resumen

Se cerraron en código comprobaciones incompletas de compras de modos, límites de solicitudes/cuerpos, CORS permisivo para desarrollo, allowlist de precios con propiedades heredadas y guardado de partidas no atómico. Las funciones ahora verifican métodos y orígenes, conservan autenticación de Supabase y responden sin datos internos. Se preparó la migración `010_api_security.sql`; estas protecciones nuevas no están activas en producción hasta aplicar la migración y desplegar funciones.

**Verificación local:** 30 pruebas de handlers/helpers, 7 pruebas con PostgreSQL embebido PGlite y `deno check` real de las cinco funciones aprobados. Los servicios Auth/Stripe/HTTP externos están simulados en los tests de handlers; las pruebas SQL sí ejecutan funciones y políticas reales. Esto no equivale a probar el entorno remoto ni a certificar cumplimiento normativo.

## Hallazgos y estado

### B-01 — Alta: autorización incompleta de modos comprados

- Ubicación actual: `supabase/functions/submit-run/index.ts:64`, `supabase/functions/_shared/requestPolicy.ts:73`.
- Antes: la comprobación de compras se hacía solo para presidentes de pago; un usuario podía enviar una configuración de Crisis Express o histórica con un presidente gratuito sin verificar esos permisos.
- Impacto: guardar puntajes con un modo comprado no adquirido, incluyendo el multiplicador de Express.
- Corrección: consultar permisos si la configuración usa cualquier función de pago y exigir acceso al presidente y a todos los modos seleccionados; `full_access` habilita ambos. La carrera sigue fuera del ranking.
- Evidencia: tests invocan el handler real con ticket válido y modos no comprados; reciben 403 antes del replay y de persistir.
- Estado: corregido localmente; requiere desplegar.

### B-02 — Media: ausencia de límites por minuto y tamaño real del cuerpo

- Ubicaciones: `supabase/functions/_shared/rateLimit.ts:5`, `supabase/functions/_shared/requestPolicy.ts:20`, `supabase/migrations/010_api_security.sql:10`.
- Antes: solo existía el cupo diario de tickets. Cuerpos JSON/webhook se leían completos antes de validar estructura.
- Corrección: contador compartido en Postgres, no memoria de una instancia. Por usuario y minuto: inicio 10, guardado 15, checkout 5, reclamo 10. Respuestas 429 incluyen `Retry-After: 60`; fallos del limitador cierran con 503.
- Cuerpos: checkout 4 KiB, reclamo 16 KiB, guardado y webhook 256 KiB. El lector cuenta bytes del stream aunque falte o mienta `Content-Length`, cancela al exceder el máximo o al pasar 15 segundos y rechaza codificaciones de cuerpo no soportadas. Usa un buffer acotado para evitar acumulación de objetos por fragmentos de un byte. JSON exige `application/json` y devuelve errores 400/408/413/415 según corresponda. El test de deadline usa un stream incompleto y confirma su cancelación.
- Estado: corregido localmente. El límite por IP está preparado a 120/minuto por función, pero **solo se activa** con `TRUSTED_CLIENT_IP_HEADER` configurada a una cabecera que el gateway sobrescriba. No se confía por defecto en `X-Forwarded-For` enviado por el cliente. Sin esa configuración, no se declara protegido por IP el backend.

### B-03 — Media: CORS de desarrollo permitido en producción

- Ubicación: `supabase/functions/_shared/http.ts:8`, `supabase/functions/_shared/http.ts:48`.
- Antes: `origin.startsWith('http://localhost:')` se aceptaba siempre; un origen ajeno no impedía ejecutar el handler, aunque el navegador no pudiera leer la respuesta.
- Corrección: solo `WEB_URL` y los orígenes explícitos de `ALLOWED_ORIGINS`; comparación exacta. Un origen no admitido devuelve 403 antes de Auth/DB. Métodos distintos de POST/OPTIONS reciben 405. El preflight declara POST/OPTIONS y las respuestas llevan `no-store` y `nosniff`.
- Pruebas: dominios con sufijo engañoso, origen `null`, localhost no configurado, origen válido, métodos, preflight y rechazo antes de cualquier trabajo de DB.
- Límite: CORS no sustituye autenticación ni frena clientes no navegador. Solicitudes sin Origin siguen permitidas para móvil y comunicaciones entre servidores, con JWT o firma según el endpoint.
- Estado: corregido localmente; requiere desplegar. Desarrollo conectado a Supabase debe agregar explícitamente el origen usado.

### B-04 — Media: partida y eventos se guardaban por separado

- Ubicaciones: `supabase/functions/submit-run/index.ts:86`, `supabase/migrations/010_api_security.sql:60`.
- Antes: un fallo al guardar eventos podía dejar una partida sin historial y responder éxito. Un reintento duplicado devolvía el puntaje recién calculado, no necesariamente el ya almacenado.
- Corrección: `save_validated_run` inserta la partida y sus eventos en una sola transacción; valida pertenencia y semilla del ticket, bloquea su fila y devuelve el registro almacenado para duplicados. Solamente `service_role` puede ejecutar el RPC. El estado sigue calculándose mediante replay en Edge; el body no elige puntaje ni usuario.
- Pruebas SQL reales: fallo de evento revierte la partida; reintentos no agregan filas; un duplicado devuelve ID/puntaje existentes; otro propietario no puede usar el ticket; anon/authenticated no pueden llamar al RPC.
- Estado: corregido localmente; requiere migración antes de funciones.

### B-05 — Baja: allowlist de precios aceptaba propiedades heredadas

- Ubicación: `supabase/functions/create-checkout/index.ts:39`.
- Antes: indexar un objeto normal con `__proto__` o `constructor` podía superar una comprobación de valor truthy. No se demostró una compra gratuita: Stripe rechaza un precio que no es válido.
- Corrección: comprobar tipo string y `Object.hasOwn` antes de obtener el precio. Checkout exige una cuenta registrada, porque los invitados no tienen perfil al cual conceder la compra. Precios y URLs de retorno siguen determinados por servidor.
- Pruebas: nombres heredados/objetos/null reciben 400; precio enviado por cliente se ignora; invitado recibe 401; producto válido usa `price_*` del servidor.
- Estado: corregido localmente.

### B-06 — Media: campos de perfil sin límites del lado de DB

- Ubicación: `supabase/migrations/010_api_security.sql:120`.
- Riesgo: saltar el formulario permitía persistir nombres y URLs desproporcionados, que luego podían aparecer en respuestas públicas del ranking.
- Corrección: nombre no vacío de hasta 64 caracteres y URL de avatar hasta 2048, conservando Unicode y nombres ya admitidos. Los checks `NOT VALID` no bloquean la migración por filas antiguas; sí se aplican a nuevas escrituras. El RPC de disponibilidad devuelve falso para nombres fuera de rango.
- Pruebas SQL: un usuario autenticado haciendo una escritura directa no puede superar ambos límites; el RPC rechaza un nombre de 65 caracteres.
- Pendiente operativo: revisar y corregir filas antiguas fuera de límites antes de validar las constraints; no se modificaron datos existentes.

### B-07 — Baja: dependencias Edge no reproducibles

- Ubicación: `supabase/functions/_shared/http.ts:1`.
- Antes: SDK de Supabase importado con `@2`, versión variable entre despliegues.
- Corrección: fijado a 2.119.0, versión efectivamente resuelta y comprobada por Deno en esta revisión; Stripe ya tenía versión fija. Webhook reutiliza el cliente compartido.
- Límite: se sigue usando esm.sh como distribuidor de dependencias. Revisar dependencias y guardar un lock de Deno como parte de una política de releases si el equipo lo adopta.

## Inventario de endpoints

| Endpoint | Autenticación/autorización | Entrada/límite | Resultado sensible |
| --- | --- | --- | --- |
| `start-run` | JWT validado por `auth.getUser`, admite invitado real | POST, guard de tamaño declarado 4 KiB; no interpreta body; cupo diario y por minuto | ID y semilla de su ticket |
| `claim-run-ticket` | JWT registrado y segundo JWT anónimo verificados; RPC comprueba propietario origen/destino | JSON 16 KiB, UUID válido | Booleano, sin tokens |
| `submit-run` | JWT no anónimo, pertenencia del ticket, compras, replay y estado final | JSON 256 KiB, configuración y cada decisión validadas, máximo 200 decisiones | ID y puntaje calculado por servidor |
| `create-checkout` | JWT registrado, producto/precio definidos por servidor | JSON 4 KiB, allowlist propia | URL de Checkout de Stripe, sin claves |
| `stripe-webhook` | Firma Stripe sobre cuerpo original, secreto solo servidor; no JWT de usuario | POST, 256 KiB; solo concede una compra pagada, usuario UUID y entitlement conocido | Acuse genérico; sin sesión ni datos de pago |

`supabase/config.toml` deja `verify_jwt=true` para APIs de usuario y `false` solo para webhook, cuya autenticación es la firma de Stripe. El test del SDK Stripe usa una firma simulada: la criptografía real depende del SDK y del secreto configurado; no se enviaron eventos a Stripe remoto.

## RLS, consultas e índices

- Migraciones 004 y 006 ya restringían perfiles/partidas/eventos/compras a su propietario y cerraban escrituras directas de puntajes y permisos. Los tests SQL aplican estas políticas, se identifican como dos usuarios y verifican aislamiento y denegación de escrituras.
- Tickets y contadores tienen RLS sin políticas cliente. Los RPC sensibles revocan ejecución de `public`, `anon` y `authenticated` y la conceden solo a `service_role`.
- La vista `leaderboard` es deliberadamente pública, con columnas de resultados y perfil públicas; no expone `final_state`, decisiones, emails, claves ni contraseñas. No se cambió a `security_invoker` porque impediría el ranking público global.
- Las consultas usan UUIDs y parámetros del SDK/SQL, sin concatenar entradas como SQL. No se necesita eliminar caracteres como comillas para evitar inyección: se valida estructura y se conserva la parametrización.
- Índices existentes: historial `(user_id, created_at desc)`, ranking por score y dificultad, ticket único, deduplicación de partidas y eventos por turno. El contador usa su clave primaria para un UPSERT atómico y un índice por `window_start` para limpieza. No se agregaron índices redundantes.
- Backups, restauración, estadísticas y `EXPLAIN` con volumen real requieren el entorno de destino; no se afirma disponibilidad ni rendimiento de la DB remota.

## CSRF, tokens, errores y secretos

- APIs de usuario utilizan `Authorization: Bearer` y no leen cookies de sesión. Un formulario externo no puede fabricar ese encabezado ni obtener el token de otro origen. Se conserva validación remota de JWT con `getUser`, no decodificación local como prueba de identidad. No se añadió un token CSRF duplicado a una API que no usa cookies ambientales.
- El parser exige un JWT acotado antes de consultar Auth. JWT inválido, expirado o revocado depende de la respuesta de Supabase y se rechaza. La sesión y recuperación de contraseña del proveedor deben verificarse/configurarse en Supabase; este código no puede demostrar su TTL remoto.
- Errores públicos son mensajes fijos; se quitaron objetos de DB/Stripe y contenido no confiable de logs de errores. Las respuestas no devuelven claves ni credenciales.
- Credenciales de servicio y Stripe siguen en variables de entorno de Edge, nunca `VITE_*`. IDs de precios son identificadores públicos, no secretos. Los tests usan tokens/secretos falsos de fixture.
- No se agregó Helmet: este backend es Deno Edge y el frontend ya usa nginx; no hay servidor Express al que aplicarlo.

## Reproducción local

```sh
node --import tsx --test scripts/security/backend.test.mjs
node --test scripts/security/backend-sql.test.mjs
npx --yes deno check --no-lock supabase/functions/start-run/index.ts supabase/functions/claim-run-ticket/index.ts supabase/functions/create-checkout/index.ts supabase/functions/stripe-webhook/index.ts supabase/functions/submit-run/index.ts
```

El test SQL utiliza `@electric-sql/pglite` 0.5.15. Crea fixtures de `auth.users`, `auth.uid()` y roles; ejecuta migraciones 001 y 003–010. Omite 002 porque corresponde a Storage; sustituye solo la extensión UUID por una función equivalente y elimina BOM de lectura. No inicia Supabase completo. PGlite no prueba concurrencia distribuida real entre instancias Edge.

## Orden de publicación y pendientes

1. Respaldar/revisar DB destino, preparar migraciones pendientes y aplicar 010 en staging. No desplegar estas funciones antes de crear los dos RPC: el limitador falla cerrado con 503 si falta.
2. Configurar `WEB_URL`, orígenes adicionales exactos necesarios y secretos normales de Supabase/Stripe. No introducir claves de servicio en el frontend.
3. Configurar límites por IP en Supabase Auth/gateway para cubrir también intentos anónimos y autenticación. Si se usa `TRUSTED_CLIENT_IP_HEADER`, demostrar que el proxy la elimina/sobrescribe; no activarla con una cabecera que controle el atacante. Los hashes de IP no constituyen anonimización irreversible.
4. Programar `select public.prune_api_rate_limits()` desde una tarea administrativa/service-role para eliminar contadores mayores a un día, en lotes de hasta 10.000 filas por ejecución. Función, índice y test SQL están incluidos; no se activó un cron remoto. Definir también retención de tickets conforme al volumen. El cliente público no puede ejecutar la limpieza y los contadores activos se preservan.
5. Generar el bundle del motor y desplegar APIs/webhook con el mismo release; comprobar CORS, 401/403/405/413/429, firma real, compra de prueba y guardar/reintentar una partida.
6. Revisar configuración remota de expiración de recuperación, límites de Auth, sesiones, TLS, backups y monitoreo. DNS/VPS/SSH no se modificaron: el despliegue registrado es Fly.io + Supabase y no se proporcionó acceso a un VPS propio.

Estos pasos quedan preparados/documentados; no se ejecutaron sobre producción.
