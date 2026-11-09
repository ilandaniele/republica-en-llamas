# Auditoría de seguridad del frontend — 8 de noviembre de 2026

Se revisaron las guías `code-reviewer`, `architect-reviewer`, `accessibility-tester` y `sre-engineer` del ZIP, las referencias React y JavaScript frontend de `security-best-practices`, y la copia de `VibeSec-SKILL.md` indicada por el agente principal. Se aplicaron a React 19 + Vite + Supabase Auth y nginx estático. Las métricas de ejemplo de los prompts no son resultados medidos. STRIX no se ejecutó.

## Resultado ejecutivo

Se corrigieron persistencia de sesión contraria a la elección del usuario, una carrera de inicialización de sesión, retención de caché privada al salir, falta de validación de destino de checkout y errores internos mostrados en la interfaz. Se completó la recuperación de contraseña que antes enviaba emails sin ofrecer una pantalla de cambio. Se endurecieron métodos/cabeceras del servidor estático y se reparó el favicon faltante detectado por el preflight de carga.

No se encontró un flujo directo de HTML no confiable a `innerHTML`, `dangerouslySetInnerHTML`, `eval`, `new Function` o `postMessage` en el código de aplicación revisado. Los textos se renderizan como JSX. Esto no demuestra ausencia total de XSS en dependencias ni sustituye una prueba de navegador.

## Hallazgos corregidos

### FE-01 — Media: “Recordarme” no controlaba la persistencia

Antes, `LoginScreen` mantenía el checkbox pero no lo enviaba al inicio de sesión; Supabase persistía siempre en almacenamiento local. Un usuario que desmarcara la opción podía dejar una sesión persistente en una computadora compartida.

Corrección: `apps/web/src/lib/authStorage.ts:21` y `:31` seleccionan localStorage cuando se recuerda y sessionStorage cuando no; al guardar se elimina la copia de la otra ubicación. Sign-out elimina ambas. `apps/web/src/lib/supabase.ts:73` configura la elección antes de llamar al SDK y el login la transmite. La preferencia es un booleano no secreto; no se duplica un token propio.

Verificación: cinco pruebas de almacenamiento, más una prueba de integración del wrapper de inicio de sesión. Incluye almacenamiento bloqueado: nunca se usa localStorage como alternativa silenciosa a sessionStorage.

Límite: sessionStorage es accesible para JavaScript y algunos navegadores pueden restaurar pestañas cerradas. Esta opción no es una promesa de sesión HttpOnly ni de expiración por tiempo. Una migración a cookies requiere un backend para frontend y controles CSRF acordes; no se simuló una cookie segura desde React.

### FE-02 — Media: sesión vieja podía reaparecer después de un cierre

`AuthProvider` podía aplicar la respuesta tardía de `getSession` después de recibir `SIGNED_OUT`, restaurando en la UI un usuario que acababa de salir. Además, las consultas privadas quedaban residentes en memoria.

Corrección: `apps/web/src/app/AuthProvider.tsx:41` descarta el bootstrap cuando ya se recibió un evento de autenticación; `:43` elimina consultas privadas al salir o cambiar de propietario. El ranking público se conserva. La suscripción al SDK se centraliza en `apps/web/src/lib/supabase.ts:42`, y `subscribeToAuth` permite desmontar los consumidores sin perder eventos tempranos de recuperación.

Verificación: pruebas de una suscripción compartida, respuesta tardía después de sign-out y eliminación de caché privada sin borrar el ranking.

### FE-03 — Media, defensa en profundidad: respuesta de checkout sin validar

El botón enviaba un bearer token con un fetch armado aparte y navegaba directamente a `data.url`. Una respuesta inesperada podía llevar al usuario a otro destino. No se confirmó una fuente remota controlable por atacantes: el endpoint legítimo genera la sesión con Stripe; el riesgo es una frontera cliente sin validar.

Corrección: `apps/web/src/lib/checkout.ts:4` acepta únicamente HTTPS, hostname exacto `checkout.stripe.com`, sin credenciales ni puertos alternativos y con ruta `/c/pay/`. `:23` usa `supabase.functions.invoke` sobre el cliente configurado, sin aceptar una API URL desde el formulario. `BuyButton` navega solo al resultado validado.

Verificación: 13 pruebas con sesión Stripe válida, javascript:, HTTP, dominios parecidos, userinfo, puerto, ruta, URL relativa, valor nulo y error remoto. Si en el futuro se habilita un dominio personalizado de Stripe, se debe agregar explícitamente tras verificarlo; no ampliar a cualquier HTTPS.

### FE-04 — Baja: detalles internos de errores en UI

`translateAuthError` devolvía el texto original para errores desconocidos. Los formularios del menú también reflejaban `err.message` y el checkout mostraba mensajes remotos sin filtrar.

Corrección: `apps/web/src/lib/supabase.ts:60` conserva traducciones de errores conocidos y usa una respuesta genérica para los demás. Login, registro, menú, perfil y checkout usan mensajes controlados. Se añadieron regiones de alerta accesibles al login y pago. No se insertaban errores como HTML; no se reporta esta fuga como un XSS confirmado.

Verificación: prueba negativa con un error de esquema SQL y pruebas de checkout y recuperación con detalles privados ficticios. Las contraseñas y tokens no se imprimen en logs.

### FE-05 — Media: recuperación sin flujo para completar el cambio

El login solicitaba el email de recuperación sin un destino específico; no existía pantalla de actualización ni manejo de recuperación.

Corrección: `apps/web/src/features/auth/LoginScreen.tsx:58` usa `${window.location.origin}/reset-password`. `apps/web/src/lib/supabase.ts:39` conserva únicamente en memoria el usuario del evento `PASSWORD_RECOVERY` emitido por el SDK, incluso si sucede antes de cargar rutas o idioma. El estado se limpia al salir o iniciar sesión normalmente; no se confía en `?recovery=true` ni en flags persistidos.

`apps/web/src/features/auth/PasswordResetScreen.tsx:14` exige usuario y ese estado de recuperación; `:30` envía solo `{ password }` al SDK. La UI requiere 12–128 caracteres y confirmación. El backend sigue siendo responsable de validar la sesión y su política de contraseña. Después del éxito se borran los campos y se solicita sign-out global (`:38`); si falla la revocación se advierte al usuario. La revocación de refresh tokens no convierte automáticamente en inválidos todos los access tokens JWT ya emitidos antes de su expiración.

Verificación: seis tests de pantalla: flag URL falso, contraseña corta/no coincidente, éxito, token expirado rechazado por backend, doble envío y fallo de revocación. Una prueba adicional valida captura temprana de `PASSWORD_RECOVERY`, usuario diferente y limpieza en sign-out.

Pendiente de configuración publicada: agregar el destino exacto de recuperación a la allowlist de Supabase, comprobar expiración de enlaces OTP y uso único, correo entregado y límites de Auth. No se modificó el dashboard ni se inventó una expiración local. Recargar la pantalla sin un evento de recuperación vigente solicita otro enlace.

### FE-06 — Baja: cabeceras heredadas incompletas en nginx

Los bloques `location` tenían `add_header` propios y por ello no heredaban todas las cabeceras del nivel servidor. En particular, `Permissions-Policy` faltaba en las respuestas de la SPA; assets e ilustraciones tampoco recibían varias cabeceras declaradas globalmente.

Corrección: `apps/web/nginx.conf:5` oculta versión, `:6` limita cuerpos a 16 KiB para este servidor de archivos, y los bloques de assets, ilustraciones y SPA permiten solo GET/HEAD. Se repiten Referrer-Policy, X-Frame-Options y Permissions-Policy donde la herencia de nginx lo requiere. Esto no limita los cuerpos o solicitudes al dominio independiente de Supabase; sus límites corresponden al backend.

No se agregó Helmet: no existe un servidor Express en este despliegue. Tampoco se cambió DNS, TLS del proxy de Fly.io, puertos de un VPS ni acceso SSH desde el repo.

Verificación: revisión de sintaxis/contextos de configuración y build de la aplicación. No se ejecutó nginx en contenedor en esta tarea; cabeceras y métodos requieren validación en el entorno publicado.

## Controles y límites restantes

### FE-07 — Baja: éxito de compra indicado por un parámetro URL

La notificación de `apps/web/src/App.tsx` afirmaba compra exitosa y contenido desbloqueado solo por `purchase_success=1`. No otorgaba permisos, pero comunicaba un resultado no verificado. Ahora muestra verificación/pending y confirma acceso solo cuando `refetch` devuelve el entitlement desde servidor. Los fallos de red no se presentan como éxito; las respuestas tardías se ignoran si se desmonta el componente. Tres pruebas cubren parámetro sin permiso, confirmación real y fallo sin reflejar detalles internos.

## Riesgos residuales

- **CSP report-only:** `apps/web/nginx.conf:20` y `:52` mantienen la política en observación. No bloquea XSS. Antes de enforcement, revisar violaciones en un entorno de prueba, incluyendo SDK analytics y recursos locales; no habilitar ciegamente `unsafe-eval` ni ampliar orígenes para silenciar errores. Clickjacking dispone de X-Frame-Options DENY en HTML.
- **Sesiones bearer en SPA:** tokens administrados por Supabase siguen en almacenamiento accesible por JavaScript. Se necesita reducir XSS y configurar TTL, refresh y reautenticación en Supabase. No se agregaron secretos al frontend.
- **CSRF:** las operaciones Supabase usan Authorization bearer explícito, no cookies de sesión propias enviadas automáticamente. Un sitio externo no puede leer Web Storage de este origen para fabricar ese header. CORS no reemplaza autenticación ni autorización; el backend debe validar token, origen/método y propiedad. No corresponde añadir double-submit-cookie a una API que no autentica con esa cookie.
- **Permisos:** controles de personajes y compras en UI sirven a UX; autorización, precios y puntaje deben seguir en servidor. Cambiar localStorage o código del cliente no debe conceder un entitlement remoto. RLS y endpoints se revisan en el informe de backend.
- **Accesibilidad:** labels y autocomplete del login, alertas y formulario de recuperación son verificables en jsdom. No se certifica WCAG AA, contraste completo, lectores de pantalla o navegación visual sin pruebas reales.
- **SRE:** sin medición nueva de disponibilidad, MTTR, memoria total o latencia publicada. Los objetivos 99.9%/80% de los prompts son ejemplos, no resultados de esta revisión.

## Comprobaciones

- Tests focalizados de checkout, persistencia, auth y recuperación pasan; el recorrido jsdom de carrera/inicio sigue pasando.
- Tipos de web y lint aprobados después de los cambios.
- Compilación de producción aprobada; incluye `favicon.svg` que antes faltaba y hacía fallar el preflight de carga.
- Suite completa de web: 623 pruebas aprobadas antes del último ajuste de notificación de compra; sus tres pruebas adicionales focalizadas también pasan (626 pruebas web en total). Build aprobado. El agente principal vuelve a comprobar la integración final. No se ejecutó Chrome/Edge, pentest externo, compra, escritura remota, despliegue ni STRIX.
