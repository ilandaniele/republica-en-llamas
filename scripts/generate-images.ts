/**
 * REP EN LLAMAS — Image Generation Script
 *
 * Usage:
 *   HF_TOKEN=hf_... SUPABASE_URL=https://... SUPABASE_SERVICE_ROLE_KEY=sb_secret_... \
 *   npx tsx scripts/generate-images.ts
 *
 * Or create a .env.generate file and export vars before running.
 *
 * Generates 28 editorial-cartoon illustrations via Hugging Face SDXL,
 * uploads each to Supabase Storage bucket "game-images/illustrations/",
 * then writes apps/web/src/assets/image-manifest.json with public URLs.
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ── Config ────────────────────────────────────────────────────────────────────
const HF_TOKEN             = process.env.HF_TOKEN             ?? '';
const SUPABASE_URL         = process.env.SUPABASE_URL         ?? process.env.VITE_SUPABASE_URL ?? '';
const SERVICE_ROLE_KEY     = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';

if (!HF_TOKEN || !SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing env vars: HF_TOKEN, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const BUCKET       = 'game-images';
const FOLDER       = 'illustrations';
const HF_MODEL     = 'stabilityai/stable-diffusion-xl-base-1.0';
const HF_BASE_URL  = 'https://router.huggingface.co';
const STYLE_SUFFIX = ', editorial cartoon illustration, Argentine political satire, bold black outlines, flat bright colors, newspaper caricature style, white background, no text, no words, no letters, no watermarks';
const MANIFEST_PATH = path.join(__dirname, '../apps/web/src/assets/image-manifest.json');
const RETRY_WAIT_MS = 25_000;

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
];

// ── Helpers ───────────────────────────────────────────────────────────────────

async function sleep(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

async function generateImage(prompt: string): Promise<ArrayBuffer> {
  const url = `${HF_BASE_URL}/hf-inference/models/${HF_MODEL}`;
  let attempt = 0;
  while (attempt < 3) {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${HF_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: { num_inference_steps: 30, guidance_scale: 7.5, width: 1024, height: 576 },
      }),
    });

    if (res.status === 503) {
      const body = await res.text();
      const waitSec = (() => {
        try { return (JSON.parse(body) as { estimated_time?: number }).estimated_time ?? 30; } catch { return 30; }
      })();
      console.log(`  Model loading (${Math.ceil(waitSec)}s)… waiting ${RETRY_WAIT_MS / 1000}s`);
      await sleep(RETRY_WAIT_MS);
      attempt++;
      continue;
    }

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`HF API error ${res.status}: ${body}`);
    }

    return res.arrayBuffer();
  }
  throw new Error(`Failed after ${attempt} attempts`);
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

    // Small courtesy delay between requests
    await sleep(1500);
  }

  console.log(`\n✅  Done! Generated ${done} new images, skipped ${skipped}.`);
  console.log(`📄  Manifest saved to: ${MANIFEST_PATH}\n`);
}

main().catch((e) => { console.error(e); process.exit(1); });
