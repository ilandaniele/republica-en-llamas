# Pruebas locales de carga y fiabilidad

Requiere Node y k6 en PATH. Usa únicamente un servidor Node estático creado por el runner en un puerto aleatorio de `127.0.0.1`. No admite URL remota, no llama al Worker de Cloudflare ni a D1 y no envía datos de usuarios, credenciales ni escrituras. No usa STRIX.

Desde la raíz:

```sh
npm run build --workspace=apps/web
node --test scripts/security/load.test.mjs scripts/security/k6-guards.test.mjs
node scripts/security/run-load.mjs
```

El runner inspecciona `apps/web/dist/index.html`, comprueba las rutas que referencia y agrega dos ilustraciones WebP existentes. Falla si faltan assets antes de iniciar la carga. No inventa `/health` ni rutas de API genéricas. Los perfiles descargan HTML y assets; no ejecutan React ni simulan decisiones del jugador.

| Perfil | Versión corta | VUs máximos | Versión extendida | Métrica adicional |
| --- | ---: | ---: | ---: | --- |
| smoke | 2 s | 1 | 30 s | Contenido y disponibilidad |
| load | 5 s | 4 | 150 s | Carga sostenida moderada |
| peak | 6 s | 12 | 180 s | Latencia de recuperación después del pico |
| stress | 6 s | 24 | 180 s | Latencia y muestras por escalón de concurrencia |
| spike | 5 s | 24 | 150 s | Ráfaga mayor y recuperación |
| soak | 8 s | 4 | 2 h | Latencia primera/segunda mitad y muestreo de memoria del servidor Node |

La versión corta comprueba funcionamiento del perfil; no demuestra capacidad de producción ni resistencia durante horas. Las cantidades son presupuestos conservadores de laboratorio, no una estimación validada de usuarios del juego.

Ejemplos:

```sh
node scripts/security/run-load.mjs smoke
node scripts/security/run-load.mjs peak spike stress
node scripts/security/run-load.mjs soak --extended
```

`--extended` aumenta duración. No se ejecutó en la revisión inicial. El runner impide destinos externos incluso en ese modo. Para medir staging real hace falta un diseño separado con autorización, credenciales de prueba, límite de tráfico y datos descartables; no se debe quitar la protección loopback sin reemplazar esas condiciones.

Cada perfil exporta JSON y HTML reales con `handleSummary` a `scripts/security/results/`. También se guardan los manifests usados y un `run-summary.json` de la última invocación, con muestras de memoria del proceso Node. Los resultados locales están ignorados por git. Los archivos por perfil se sobrescriben al repetirlo; los reportes antiguos se eliminan antes de iniciar ese perfil para impedir usar un éxito anterior por error.

Los umbrales exigen HTTP fallido menor a 1%, checks de contenido al 100%, al menos una solicitud y p95 menor a 500 ms / p99 menor a 1500 ms. Stress permite p95 menor a 1500 ms / p99 menor a 3000 ms y conserva el resto de comprobaciones. Peak/spike exigen muestras de recuperación; soak exige muestras de la segunda mitad. Las solicitudes tienen timeout de 3 s y no siguen redirecciones. Un fallo de k6, reporte vacío o umbral incumplido produce salida distinta de cero.

Los tests de guardas ejecutan k6 local real cuando está instalado. Si falta, tres tests se marcan explícitamente como omitidos; los seis tests del harness no requieren k6. La prueba negativa de HTML 200 como asset debe fallar en k6 con salida 99; el test pasa solo si detecta ese fallo y el JSON contiene `passed: false`.

Los tiempos y memoria obtenidos pertenecen al servidor Node y al tráfico local. No prueban nginx, compresión real de producción, TLS, latencia de internet, autorización remota, capacidad de Postgres, memoria de pestaña, layout, FPS ni ejecución de JavaScript en navegador.

## Carga de la API del Worker

`api-load.k6.js` prueba el Worker de Cloudflare (`/api/*`) con los mismos perfiles (smoke/load/peak/stress/spike/soak, mismos escalones de VUs). Mezcla: mayoría de `GET /api/leaderboard` (con y sin `?difficulty=`) y, una de cada cinco iteraciones, un flujo de invitado por VU: `POST /api/auth/sign-in/anonymous` y luego `POST /api/start-run` con la cookie de sesión.

El runner no inicia el Worker: debe estar escuchando antes. Solo admite `http://localhost:<puerto>` o `http://127.0.0.1:<puerto>` (el runner y el script k6 rechazan cualquier otro destino; no hay modo producción). El header `Origin` es la propia URL base, que debe estar en `WEB_URL`/`ALLOWED_ORIGINS` del Worker (en local, `http://localhost:8787`).

```sh
npm run dev --workspace=apps/api              # wrangler dev en http://localhost:8787
npm run test:load:api -- smoke                # equivale a node scripts/security/run-api-load.mjs smoke
API_LOAD_URL=http://127.0.0.1:8787 node scripts/security/run-api-load.mjs peak spike
```

Un 429 (límite por IP/usuario, límite de Better Auth o tope diario de tickets) es resultado esperado: no cuenta como HTTP fallido, se mide en `api_rate_limited` y el flujo de invitado lo acepta. Umbrales: p95/p99 como el perfil estático, HTTP fallido inesperado menor a 1%, `api_server_errors` (5xx o sin respuesta) menor a 0,1% y checks al 100%. Salida en `scripts/security/results/api-<perfil>.json|html`, manifests `api-<perfil>-manifest.json` y `api-run-summary.json`.

Mide el Worker y D1 local de miniflare, no producción, D1 remoto, límites del borde de Cloudflare ni `CF-Connecting-IP` real (en local todos los VUs comparten el bucket de IP `unknown`).

Referencia de la implementación: [resúmenes personalizados de k6](https://grafana.com/docs/k6/latest/results-output/end-of-test/custom-summary/) y [ramping VUs](https://grafana.com/docs/k6/latest/using-k6/scenarios/executors/ramping-vus/).
