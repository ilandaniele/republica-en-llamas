# Continuación con Claude — 8 de noviembre de 2026

Leer primero `CLAUDE.md`, después este archivo y `security_best_practices_report.md`.

## Estado del proyecto

Rama de trabajo: `feat/casa-rosada-diorama`. Motor TypeScript puro, web React 19/Vite 8, Supabase Edge/Postgres. La app móvil se conserva sin cambios funcionales de esta iteración.

Quedaron integrados el diorama animado y sus imágenes, doce personajes, agendas y escenarios, mejoras de fuentes, Congreso, inflación, debate presidencial, escrutinio con mapa real y modo Carrera: intendente → gobernador → ministro nacional → presidente. Carrera permite elegir tres cargos iniciales y guarda progreso local, fuera del ranking competitivo.

Las imágenes necesarias para jugar están en `apps/web/public/illustrations/` y las fuentes locales/licencias en `apps/web/public/fonts/`. Los originales de `art/raw/`, cachés, node_modules, builds y resultados temporales permanecen locales e ignorados; no hacen falta para ejecutar la web. No modificar `art/prompts.json` ni `art/PROMPTS.md` sin un pedido nuevo.

## Preparar y probar

Usar Node de `.nvmrc` y npm workspaces desde la raíz:

```sh
npm ci --legacy-peer-deps
npm run playtest --workspace=apps/web
```

Playtest abre en `http://127.0.0.1:5174/`. Es un modo de desarrollo sin tickets, compras reales, ranking remoto ni analytics. Producción no habilita esas excepciones. Milei, Massa y Kicillof son gratuitos; los demás requieren compra según las reglas compartidas.

Verificaciones:

```sh
npm run lint
npm run type-check --workspace=packages/game-engine
npm run type-check --workspace=packages/ui
npm run type-check --workspace=apps/web
npm test
npm run test:security
npm run verify:content
npm run build
```

Último resultado previo al commit: 252 pruebas del motor, 626 web y 46 de seguridad/SQL/harness, 924 en total. Los tipos de motor/UI/web y el build global pasan. `npm run type-check` global conserva tres errores anteriores en móvil: tipos de propiedades de analytics y referencia inexistente `restoreFromTurn`. No confundir el build global con un build de Expo: móvil no define tarea `build`.

`test:security` genera un bundle nuevo del motor antes de ejecutar handlers con servicios externos simulados y SQL real en PGlite. No necesita Docker. Sin k6 se omiten explícitamente tres guard-tests; con k6 también puede correrse `npm run test:load`. Los seis perfiles cortos pasaron con 1.354 solicitudes locales; no prueban capacidad real de Supabase, navegador ni nginx. No se ejecutó soak de dos horas.

## Seguridad y orden de publicación

Las correcciones están en código; **no se aplicaron migraciones ni se desplegaron funciones/web**. Antes de publicar:

1. Revisar y aplicar `supabase/migrations/010_api_security.sql` en staging antes de desplegar las funciones que usan sus RPC. Sin esos RPC, los limitadores nuevos fallan cerrado con 503.
2. Configurar orígenes exactos, límites de Supabase Auth y cabecera IP saneada por el gateway. No confiar en un `X-Forwarded-For` arbitrario. Programar limpieza administrativa de contadores.
3. Agregar la URL exacta `/reset-password` a la allowlist de Supabase y probar expiración, uso único y revocación de sesiones. La UI no configura el vencimiento del servidor.
4. Desplegar funciones con el bundle actual del motor y verificar JWT del gateway y firma Stripe. Después probar web, dos cuentas, compras en modo test, tickets y replay.

CSP permanece report-only; su enforcement requiere pruebas publicadas. Los tokens de la SPA siguen administrados por Supabase en Web Storage según Recordarme, no son HttpOnly. La dependencia `tar` del toolchain de Expo/cacache conserva un aviso crítico; no se forzaron upgrades mayores de Expo. Quedan cinco avisos en el reporte acotado a web, sin críticos, y 71 en el reporte global de la última auditoría.

## Claude Security oficial

Se ejecutó el pipeline oficial completo con esfuerzo medio tras aceptación expresa del coste. Informe y artefactos en `CLAUDE-SECURITY-20261108-065217/`: Markdown, JSONL, SARIF y sello `2664bccc7212-dirty`. Se incluyen expresamente en el commit para que estén disponibles al abrir el repo en otro entorno; la carpeta mantiene su `.gitignore` original.

El renderer registra `verified`, 32/32 investigadores retornados y cuatro hallazgos bajos. Son tres causas aún pendientes:

- F1: username OAuth derivado del email puede exponer su parte local en el ranking.
- F2/F3: la antigüedad de tickets invitados permite eludir el cupo al reclamarlos; dos ubicaciones de una misma causa.
- F4: el cupo gratuito de tres partidas depende de localStorage y no coincide con el límite general de 30 tickets del servidor.

Ese informe describe el árbol **antes de este commit**, incluyendo cambios locales; el hash antiguo de su sello es evidencia histórica, no una afirmación de haber auditado el commit de entrega. No se aplicaron sus parches. La cobertura no garantiza lectura de todos los archivos nuevos sin seguimiento. Arte, configuración local y docs fueron apartados; varios archivos de contenido/tests/salidas solo se buscaron parcialmente. El escaneo fue estático, sin exploits ni tráfico al backend.

STRIX quedó excluido por el usuario: no ejecutarlo. No repetir el escaneo costoso por rutina; ya hay resultados para trabajar. Si se necesita otra ejecución en esta máquina, el Python real existe, pero sus alias de Windows pueden estar rotos; el último escaneo usó un launcher temporal por proceso, sin cambiar PATH global.

## Documentación de apoyo

- `docs/playtest.md`: recorridos para probar.
- `docs/carrera-politica.md`, `docs/debate-presidencial.md`, `docs/escrutinio-presidencial.md`: reglas y verificación de las funciones nuevas.
- `docs/security/backend-audit.md`, `frontend-audit.md`, `testing-audit.md`: cambios, pruebas y límites.
- `docs/architecture-plan.md`: decisión previa C, híbrida liviana; no migrar toda la arquitectura sin un pedido nuevo.
- `docs/buenas-practicas-2026-11-08.md`: auditoría previa; algunas cifras son antecedentes y quedan superadas por este cierre.

La revisión visual real en navegador, nginx en contenedor y los servicios publicados siguen pendientes. No describirlos como probados por los tests jsdom ni por las mediciones de loopback.
