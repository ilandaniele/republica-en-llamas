/**
 * REP EN LLAMAS — Image Generation Script
 *
 * Usage:
 *   REPLICATE_API_TOKEN=r8_... SUPABASE_URL=https://... SUPABASE_SERVICE_ROLE_KEY=sb_secret_... \
 *   npx tsx scripts/generate-images.ts
 *
 * Generates pixel-art illustrations via Replicate nerijs/pixel-art-xl,
 * uploads each to Supabase Storage bucket "game-images/illustrations/",
 * then writes apps/web/src/assets/image-manifest.json with public URLs.
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── Config ────────────────────────────────────────────────────────────────────
const SUPABASE_URL     = process.env.SUPABASE_URL               ?? process.env.VITE_SUPABASE_URL ?? '';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY  ?? '';

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing env vars: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const BUCKET        = 'game-images';
const FOLDER        = 'illustrations';
const STYLE_SUFFIX  = ', pixel art style, 16-bit sprites, crisp pixels, Argentine political scene, dark navy blue background, no text, no words, no letters';
const MANIFEST_PATH = path.join(__dirname, '../apps/web/src/assets/image-manifest.json');

// ── Image definitions ─────────────────────────────────────────────────────────
const IMAGES: Array<{ id: string; prompt: string }> = [
  // Political scenes
  { id: 'pol_congress',     prompt: 'Argentine congress chamber, politicians debating at wooden desks, classical columns, dramatic lighting' + STYLE_SUFFIX },
  { id: 'pol_scandal',      prompt: 'Argentine politician caught in scandal, briefcase spilling money, journalists with microphones, flashbulbs' + STYLE_SUFFIX },
  { id: 'pol_protest',      prompt: 'Crowd of protesters in Buenos Aires street, banging pots pans, holding signs, obelisk in background' + STYLE_SUFFIX },

  // Economic scenes
  { id: 'eco_inflation',    prompt: 'Shopping cart overflowing with price tags, shelves with triple-digit price labels, worried shopper, Argentine supermarket' + STYLE_SUFFIX },
  { id: 'eco_reserves',     prompt: 'Argentine central bank vault, gold bars behind iron bars, empty shelves, worried banker in suit' + STYLE_SUFFIX },
  { id: 'eco_growth',       prompt: 'Argentine factory workers, rising stock chart, construction cranes, green upward arrows, celebration' + STYLE_SUFFIX },

  // Social scenes
  { id: 'soc_strike',       prompt: 'Union workers on strike outside factory, picket signs, hard hats, fists raised, CGT banner' + STYLE_SUFFIX },
  { id: 'soc_unrest',       prompt: 'Urban unrest in Buenos Aires, burning tires, riot police in helmets, smoky street, cacerolazo' + STYLE_SUFFIX },
  { id: 'soc_health',       prompt: 'Overcrowded Argentine public hospital emergency, worried doctors and nurses, patients on stretchers' + STYLE_SUFFIX },

  // International scenes
  { id: 'int_imf',          prompt: 'Argentine minister shaking hands with IMF officials at conference table, flags, formal suits, pile of documents' + STYLE_SUFFIX },
  { id: 'int_war',          prompt: 'World map showing global conflict zones, red hotspots, concerned diplomats watching TV screen showing explosions' + STYLE_SUFFIX },
  { id: 'int_trade',        prompt: 'Argentine cargo ship at port loaded with soy soybeans, containers, export crane, sunrise, handshake in foreground' + STYLE_SUFFIX },
  { id: 'int_guerra_ucrania', prompt: 'Ukraine crisis 2022, blue and yellow Ukrainian flag colors dominating sky, burning city silhouettes at night, military tank foreground, Argentine diplomat in suit watching a conflict map on TV screen, dark war atmosphere, explosion glow on horizon' + STYLE_SUFFIX },
  { id: 'int_conflicto_iran', prompt: 'Iran conflict 2024, fiery orange oil-fire sky, oil derricks silhouette, crescent moon symbol, Argentine diplomat at desk with Middle-East maps, missile trail in sky, tense negotiation atmosphere, desert landscape' + STYLE_SUFFIX },

  // Argentina-specific
  { id: 'arg_mundial',      prompt: 'Argentina winning World Cup soccer celebration, blue white jersey player lifting golden trophy, confetti, Buenos Aires crowd' + STYLE_SUFFIX },
  { id: 'arg_corralito',    prompt: 'Argentines queuing outside locked bank, chains on bank door, angry crowd with withdrawal slips, 2001 crisis scene' + STYLE_SUFFIX },
  { id: 'arg_campo',        prompt: 'Argentine farmers blocking highway with tractors, grain silos in background, agro protest, pampas landscape' + STYLE_SUFFIX },
  { id: 'arg_dolar',        prompt: 'Giant US dollar bill crashing like tsunami over Buenos Aires skyline, peso coins falling, currency crisis chaos' + STYLE_SUFFIX },
  { id: 'arg_congreso_ley', prompt: 'Argentine congress voting session, hands raised voting, deputies arguing, session chamber from above' + STYLE_SUFFIX },
  { id: 'arg_fmi_negocio',  prompt: 'Argentine official signing debt agreement with foreign bankers, stacks of loan documents, IMF logo on briefcase' + STYLE_SUFFIX },

  // Crisis
  { id: 'crisis',           prompt: 'Argentina hyperinflation, store shelves empty, wheelbarrow full of banknotes, apocalyptic cityscape, people panicking' + STYLE_SUFFIX },
  { id: 'crisis_impeachment', prompt: 'Argentine president impeachment trial, congress podium, angry legislators pointing, president sweating, gavel' + STYLE_SUFFIX },

  // New pixel-art scenes (missing from original HF batch)
  { id: 'guerra_nuke_explosion', prompt: 'nuclear mushroom cloud explosion over Buenos Aires skyline, apocalyptic orange sky, massive shockwave, ruins silhouettes foreground' + STYLE_SUFFIX },
  { id: 'guerra_nuke_threat',    prompt: 'ballistic missile launching toward city, red emergency siren, bomb shelter door, panicked Argentine officials in bunker' + STYLE_SUFFIX },
  { id: 'guerra_join',           prompt: 'Argentine soldiers marching in desert, military airplane overhead, trench warfare, Argentine flag, war declaration ceremony' + STYLE_SUFFIX },
  { id: 'eco_dollar_blue',       prompt: 'black market currency exchange dark alley Buenos Aires, stacks of dollar bills, hooded figure, unofficial exchange board' + STYLE_SUFFIX },
  { id: 'eco_corte_luz',         prompt: 'city blackout night scene, dark buildings, Argentine family with candles, downed power lines, electrical failure' + STYLE_SUFFIX },
  { id: 'soc_housing',           prompt: 'family evicted from apartment Buenos Aires, boxes on sidewalk, angry landlord with papers, housing crisis protesters outside' + STYLE_SUFFIX },
  { id: 'pol_election',          prompt: 'Argentine election voting booths, ballot box with fingerprint ink, long voter queue, celeste y blanco flag, democracy' + STYLE_SUFFIX },
  { id: 'pol_veto',              prompt: 'Argentine president stamping VETO in red on law document, furious legislators in congress, official seal stamp' + STYLE_SUFFIX },
  { id: 'int_aid',               prompt: 'international humanitarian aid arriving Buenos Aires port, UN flags, aid workers unloading crates, food packages relief' + STYLE_SUFFIX },
  { id: 'malvinas',              prompt: 'Malvinas Falkland Islands map with Argentine flag, warship South Atlantic, political debate Buenos Aires congress' + STYLE_SUFFIX },

  // Character portraits (editorial caricature style)
  { id: 'char_milei',       prompt: 'Javier Milei caricature portrait bust, seven wild black hair spikes pointing upward, thick black mutton-chop sideburns, wide staring eyes, red necktie, holding a chainsaw, anarcho-capitalist libertarian Argentina president, plain white background' + STYLE_SUFFIX },
  { id: 'char_massa',       prompt: 'Sergio Massa caricature portrait bust, flat slicked-back dark hair, very wide square jaw, hooded drooping eyelids, navy blue suit red tie, politician smirk one side, Argentine economy minister peronist, plain white background' + STYLE_SUFFIX },
  { id: 'char_bullrich',    prompt: 'Patricia Bullrich caricature portrait bust, short straight gray hair, angular bony face, extremely thin pressed lips, charcoal blazer teal blouse, gold security badge on lapel, cold stern expression, Argentine security minister PRO party, plain white background' + STYLE_SUFFIX },
  { id: 'char_bregman',     prompt: 'Myriam Bregman caricature portrait bust, large voluminous curly dark hair, round glasses green tinted lenses, golden hoop earrings, bright red blazer, determined raised fist, Argentine leftist FIT-Unidad Trotskyist politician, plain white background' + STYLE_SUFFIX },
  { id: 'char_schiaretti',  prompt: 'Juan Schiaretti caricature portrait bust, completely bald shiny head zero hair on top, thin gray fringe only on the sides above ears, very wide fat round face, heavy jowls, conservative gray suit blue tie, Argentine Cordoba province governor, plain white background' + STYLE_SUFFIX },
  { id: 'char_larreta',     prompt: 'Horacio Rodriguez Larreta caricature portrait bust, salt and pepper short hair with neat side part, slim narrow face, dark under-eye bags tired look, light blue tie charcoal slim suit, exhausted worried expression, Buenos Aires mayor Argentine PRO party technocrat, plain white background' + STYLE_SUFFIX },
  { id: 'char_caputo',      prompt: 'Luis Caputo caricature portrait, grey hair, dark suit, Argentine economy minister, serious face, spreadsheets, white background' + STYLE_SUFFIX },
  { id: 'char_moyano',      prompt: 'Hugo Moyano caricature portrait, grey hair, union leader Argentina, Teamsters jacket, powerful stout figure, white background' + STYLE_SUFFIX },
  { id: 'char_kicillof',    prompt: 'Axel Kicillof caricature portrait, curly black hair, scruffy beard, leftist economics professor Argentina, white background' + STYLE_SUFFIX },
  { id: 'char_kirchner',    prompt: 'Cristina Kirchner caricature portrait, dark dyed hair, pantsuit, Peronist cross necklace, Argentina former president, white background' + STYLE_SUFFIX },
  { id: 'char_georgieva',   prompt: 'Kristalina Georgieva caricature portrait, short grey hair, IMF director badge, stern look, conference room, European diplomat, white background' + STYLE_SUFFIX },
  { id: 'char_macri',       prompt: 'Mauricio Macri caricature portrait bust, neat dark hair side-parted, CEO smile wide teeth, navy suit gold tie, Boca Juniors pin on lapel, confident businessman posture, Argentina PRO party former president, plain white background' + STYLE_SUFFIX },
  { id: 'char_anibal',      prompt: 'Anibal Fernandez caricature portrait bust, large thick walrus mustache dominating lower face, heavy jowls, squinting eyes menacing gaze, dark rumpled suit, Argentine Peronist security minister, imposing heavyset figure, plain white background' + STYLE_SUFFIX },
  { id: 'char_berni',       prompt: 'Sergio Berni caricature portrait bust, black police beret tilted, police uniform with medals, aggressive jutting chin, short dark hair, fierce stare, Buenos Aires province security minister Argentina, plain white background' + STYLE_SUFFIX },
  { id: 'char_grabois',     prompt: 'Juan Grabois caricature portrait bust, unkempt dark beard and hair, round face, casual rumpled plaid shirt no tie, raised fist gesture solidarity, Argentine social activist piquetero movement leader, plain white background' + STYLE_SUFFIX },
  { id: 'char_milani',      prompt: 'Cesar Milani caricature portrait bust, full dress military uniform Argentina, general rank insignia gold stars on shoulders, rows of medal ribbons on chest, stern formal expression, grey hair short, plain white background' + STYLE_SUFFIX },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

async function sleep(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

async function generateImage(prompt: string): Promise<ArrayBuffer> {
  // Pollinations.ai — free, no auth, FLUX-based
  const encoded = encodeURIComponent(prompt);
  const url = `https://image.pollinations.ai/prompt/${encoded}?width=1024&height=576&nologo=true&enhance=true&model=flux`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Pollinations error ${res.status}: ${await res.text()}`);
  return res.arrayBuffer();
}

async function uploadToSupabase(id: string, data: ArrayBuffer): Promise<string> {
  const objectPath = `${FOLDER}/${id}.png`;
  const uploadUrl  = `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${objectPath}`;

  const res = await fetch(uploadUrl, {
    method: 'POST',
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      'Content-Type': 'image/png',
      'x-upsert': 'true',
    },
    body: data,
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Supabase upload error ${res.status}: ${body}`);
  }

  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${objectPath}`;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n🖼  REP EN LLAMAS — Generating ${IMAGES.length} images\n`);

  // Load existing manifest so we can skip already-generated images
  // Pass --force to clear the manifest and regenerate everything
  const forceRegen = process.argv.includes('--force');
  let manifest: Record<string, string> = {};
  if (!forceRegen && fs.existsSync(MANIFEST_PATH)) {
    manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
  } else if (forceRegen) {
    console.log('⚡  --force flag detected — regenerating all images\n');
  }

  let done = 0;
  let skipped = 0;

  for (const img of IMAGES) {
    if (manifest[img.id] && manifest[img.id] !== '') {
      console.log(`⏭  skip  ${img.id} (already generated)`);
      skipped++;
      continue;
    }

    process.stdout.write(`⏳  [${done + skipped + 1}/${IMAGES.length}] ${img.id} … `);
    try {
      const buffer  = await generateImage(img.prompt);
      const url     = await uploadToSupabase(img.id, buffer);
      manifest[img.id] = url;
      fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
      console.log(`✅  ${url.split('/').pop()}`);
      done++;
    } catch (err) {
      console.error(`\n❌  Failed: ${(err as Error).message}`);
    }

    // Courtesy delay between requests — Replicate free tier: 6 req/min
    await sleep(11000);
  }

  console.log(`\n✅  Done! Generated ${done} new images, skipped ${skipped}.`);
  console.log(`📄  Manifest saved to: ${MANIFEST_PATH}\n`);
}

main().catch((e) => { console.error(e); process.exit(1); });
