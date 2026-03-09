/**
 * República en Llamas — App Store / Play Store listing copy
 * Run: npx ts-node scripts/print-store-copy.ts
 */

const APP_NAME = 'República en Llamas';
const SUBTITLE = 'Sé presidente. Sobrevivir a la crisis.';

const APP_STORE = {
  name: APP_NAME,
  subtitle: SUBTITLE,
  description: `
¿Podés salvar a Argentina del colapso económico?

REPÚBLICA EN LLAMAS te pone en el sillón presidencial durante los años más turbulentos de la historia argentina. Cada decisión desencadena consecuencias reales: la inflación se dispara, el Congreso vota tus leyes (o las rechaza), y el pueblo exige respuestas.

🗳 GOBIERNA BAJO FUEGO
— 50 turnos de pura tensión política y económica
— Decenas de eventos basados en hechos históricos reales
— Mecánica de inflación hiperrealista con ajuste por expectativas

🏛 GESTIONA EL CONGRESO
— Votaciones de ley con coaliciones independientes
— Revelar el voto del bloque independiente para negociar mejor

📊 VARIABLES VIVAS
— Popularidad, estabilidad social, déficit, confianza del mercado
— Cada indicador puede detonar la caída del gobierno

🧠 MÚLTIPLES PRESIDENTES
— Ingeniero tecnocrático (gratis)
— Populista carismático, Tecnócrata puro y más (premium)
— Cada perfil tiene líneas de diálogo únicas

⚡ MODOS DE JUEGO
— Normal, Fácil, Difícil
— Crisis Express: más eventos, menos tiempo (premium)
— Modo Histórico: escenarios basados en hechos reales (premium)

♾ 3 PARTIDAS DIARIAS GRATIS
Sin límites con el acceso completo.

DESCARGÁ Y PROBÁ. La primera crisis es gratis.
`.trim(),

  keywords: [
    'argentina', 'política', 'simulador', 'inflación', 'presidente',
    'historia', 'congreso', 'estrategia', 'economía', 'crisis',
  ].join(', '),

  categories: ['Games', 'Strategy', 'Simulation'],

  whatsNew: `
v1.0
— Lanzamiento inicial
— 5 presidentes, 3 modos de juego
— Leaderboard global
— Sistema de compras in-app
`.trim(),
};

const PLAY_STORE = {
  title: APP_NAME,
  shortDescription: 'Simulador político-económico argentina. ¿Podés sobrevivir 50 turnos?',
  fullDescription: APP_STORE.description,
  tags: APP_STORE.keywords,
};

const IN_APP_PRODUCTS = [
  { id: 'presidents_pack', title: 'Pack Presidentes', price: '$2.99', description: 'Desbloquea el Populista y el Tecnócrata. Dos estilos de gobierno radicalmente distintos.' },
  { id: 'opposition_pack', title: 'Pack Oposición', price: '$1.99', description: 'Revelá el voto del bloque independiente en el Congreso. Información vale poder.' },
  { id: 'mode_crisis_express', title: 'Modo Crisis Express', price: '$1.99', description: 'Partidas ultra-intensas con más crisis y menos márgen de maniobra.' },
  { id: 'mode_historical', title: 'Modo Histórico', price: '$1.99', description: 'Escenarios basados en eventos reales de la historia argentina.' },
  { id: 'remove_ads', title: 'Sin publicidad', price: '$2.99', description: 'Eliminá todos los anuncios para siempre. Jugá sin interrupciones.' },
  { id: 'full_access', title: 'Acceso Completo', price: '$5.99', description: 'Todo incluido: todos los presidentes, todos los modos, sin anuncios, sin límite de partidas.' },
];

// ── Print ───────────────────────────────────────────────────────────────────

console.log('═'.repeat(60));
console.log('APP STORE LISTING');
console.log('═'.repeat(60));
console.log(`\nNAME: ${APP_STORE.name}`);
console.log(`SUBTITLE: ${APP_STORE.subtitle}`);
console.log(`\nDESCRIPTION:\n${APP_STORE.description}`);
console.log(`\nKEYWORDS: ${APP_STORE.keywords}`);
console.log(`\nWHAT'S NEW:\n${APP_STORE.whatsNew}`);

console.log('\n' + '═'.repeat(60));
console.log('GOOGLE PLAY LISTING');
console.log('═'.repeat(60));
console.log(`\nTITLE: ${PLAY_STORE.title}`);
console.log(`SHORT DESCRIPTION: ${PLAY_STORE.shortDescription}`);
console.log(`\nFULL DESCRIPTION:\n${PLAY_STORE.fullDescription}`);
console.log(`\nTAGS: ${PLAY_STORE.tags}`);

console.log('\n' + '═'.repeat(60));
console.log('IN-APP PRODUCTS');
console.log('═'.repeat(60));
IN_APP_PRODUCTS.forEach((p) => {
  console.log(`\n[${p.id}]`);
  console.log(`  Title:       ${p.title}`);
  console.log(`  Price:       ${p.price}`);
  console.log(`  Description: ${p.description}`);
});

console.log('\n✅ Store copy complete.\n');
