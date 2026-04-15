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
const REPLICATE_TOKEN  = process.env.REPLICATE_API_TOKEN        ?? '';

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing env vars: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}
if (!REPLICATE_TOKEN) {
  console.error('Missing env var: REPLICATE_API_TOKEN');
  process.exit(1);
}

const BUCKET        = 'game-images';
const FOLDER        = 'illustrations';
// Scene illustrations — 512×512 uniform, pixel_art LoRA trigger word required
const STYLE_SUFFIX  = ', pixel_art, retro 16-bit pixel art, Super Nintendo SNES sprite style, chunky visible pixel grid, each pixel is a large solid square, bold flat color blocks with hard pixel edges, zero dithering, maximum 8 solid colors, no anti-aliasing, no gradients, no blurring, Argentine political satire, dark navy blue background, no text no letters no watermark';
// Character portrait sprites — 512×512 chunky pixel bust
const PORTRAIT_SUFFIX = ', pixel_art, retro 16-bit pixel art character bust portrait, frontal facing centered, very large chunky visible pixels, bold flat solid color blocks, hard pixel edges, Super Nintendo RPG character sprite style, zero dithering, limited 8-color palette, solid black background, no text no letters no watermark';
const MANIFEST_PATH = path.join(__dirname, '../apps/web/src/assets/image-manifest.json');

// ── Image definitions ─────────────────────────────────────────────────────────
const IMAGES: Array<{ id: string; prompt: string }> = [
  // Political scenes
  { id: 'pol_congress',     prompt: 'Argentine congress chamber interior hemicycle, legislators at desks, large dome above, two-tone seats government opposition, podium center' + STYLE_SUFFIX },
  { id: 'pol_scandal',      prompt: 'Argentine politician at press conference looking nervous, open briefcase with documents on podium, reporters with cameras and microphones surrounding him, spotlight center stage' + STYLE_SUFFIX },
  { id: 'pol_protest',      prompt: 'Street protest Buenos Aires, crowd marching, cacerolazo people banging pots, obelisk monument background, smoke' + STYLE_SUFFIX },

  // Economic scenes
  { id: 'eco_inflation',    prompt: 'Supermarket shelves empty, giant red upward price arrow, peso bills scattered, worried character in store aisle' + STYLE_SUFFIX },
  { id: 'eco_reserves',     prompt: 'Bank vault underground, gold bars stacked, iron bars gate, BCRA sign on wall, worried banker character foreground' + STYLE_SUFFIX },
  { id: 'eco_growth',       prompt: 'Factory building with smokestacks, bar chart rising green bars, construction crane, worker silhouette celebrating' + STYLE_SUFFIX },

  // Social scenes
  { id: 'soc_strike',       prompt: 'Union workers on strike outside factory, picket signs, hard hats, fists raised, CGT banner' + STYLE_SUFFIX },
  { id: 'soc_unrest',       prompt: 'Urban unrest in Buenos Aires, burning tires, riot police in helmets, smoky street, cacerolazo' + STYLE_SUFFIX },
  { id: 'soc_health',       prompt: 'Overcrowded Argentine public hospital emergency, worried doctors and nurses, patients on stretchers' + STYLE_SUFFIX },

  // International scenes
  { id: 'int_imf',          prompt: 'Argentine minister shaking hands with IMF officials at conference table, flags, formal suits, pile of documents' + STYLE_SUFFIX },
  { id: 'int_war',          prompt: 'World map with red alert markers on multiple countries, two diplomats at conference table with national flags, globe and papers, tense negotiation room' + STYLE_SUFFIX },
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
  { id: 'crisis',           prompt: 'Argentine hyperinflation apocalypse, wheelbarrow overflowing with banknotes, burning city skyline, queues outside empty shops, red sky chaos' + STYLE_SUFFIX },
  { id: 'crisis_impeachment', prompt: 'Argentine president impeachment trial in congress chamber, angry legislators pointing, president sweating at podium, judge gavel, dramatic red lighting' + STYLE_SUFFIX },

  // New pixel-art scenes (missing from original HF batch)
  { id: 'guerra_nuke_explosion', prompt: 'nuclear mushroom cloud explosion over Buenos Aires skyline, apocalyptic orange sky, massive shockwave, ruins silhouettes foreground' + STYLE_SUFFIX },
  { id: 'guerra_nuke_threat',    prompt: 'ballistic missile launching toward city, red emergency siren, bomb shelter door, panicked Argentine officials in bunker' + STYLE_SUFFIX },
  { id: 'guerra_join',           prompt: 'Argentine soldiers marching in desert, military airplane overhead, trench warfare, Argentine flag, war declaration ceremony' + STYLE_SUFFIX },
  { id: 'eco_dollar_blue',       prompt: 'informal currency exchange Buenos Aires street corner, stacks of dollar bills on table, secretive transaction, exchange rate board with numbers, night scene' + STYLE_SUFFIX },
  { id: 'eco_corte_luz',         prompt: 'city blackout night scene, dark buildings, Argentine family with candles, downed power lines, electrical failure' + STYLE_SUFFIX },
  { id: 'soc_housing',           prompt: 'family evicted from apartment Buenos Aires, boxes on sidewalk, angry landlord with papers, housing crisis protesters outside' + STYLE_SUFFIX },
  { id: 'pol_election',          prompt: 'Argentine election voting booths, ballot box with fingerprint ink, long voter queue, celeste y blanco flag, democracy' + STYLE_SUFFIX },
  { id: 'pol_veto',              prompt: 'Argentine president stamping VETO in red on law document, furious legislators in congress, official seal stamp' + STYLE_SUFFIX },
  { id: 'int_aid',               prompt: 'cargo ship arriving Buenos Aires port, workers unloading labeled boxes from containers, officials signing documents on dock, cranes and national flags' + STYLE_SUFFIX },
  { id: 'malvinas',              prompt: 'Malvinas Falkland Islands map with Argentine flag, warship South Atlantic, political debate Buenos Aires congress' + STYLE_SUFFIX },

  // Character portraits (editorial caricature style)
  { id: 'char_milei',       prompt: 'Javier Milei pixel bust, seven black spiky wild hair sticking up, thick black sideburns, wide staring eyes, red tie dark suit, small chainsaw in hand, anarcho-capitalist Argentine president' + PORTRAIT_SUFFIX },
  { id: 'char_massa',       prompt: 'Sergio Massa pixel bust, flat slicked-back dark brown hair, very wide square jaw, heavy drooping eyelids, navy suit red tie, holding briefcase, Argentine Peronist economy minister' + PORTRAIT_SUFFIX },
  { id: 'char_bullrich',    prompt: 'Patricia Bullrich pixel bust, short choppy auburn-gray hair, angular bony face, thin pressed lips, charcoal blazer, gold star security badge on lapel, cold stern expression, Argentine security minister' + PORTRAIT_SUFFIX },
  { id: 'char_bregman',     prompt: 'Myriam Bregman pixel bust, large voluminous curly blonde hair, round glasses, hoop earrings, bright red blazer, raised fist, leftist Argentine politician FIT' + PORTRAIT_SUFFIX },
  { id: 'char_schiaretti',  prompt: 'Juan Schiaretti pixel bust, bald head with thin gray hair on sides, wide round face, blue suit, Argentine Cordoba governor, holding mate cup' + PORTRAIT_SUFFIX },
  { id: 'char_larreta',     prompt: 'Horacio Larreta pixel bust, salt-and-pepper short neat hair, pale narrow face, very thick dark eyebrows, dark under-eye bags, light blue tie charcoal suit, tired worried expression, Buenos Aires mayor' + PORTRAIT_SUFFIX },
  { id: 'char_caputo',      prompt: 'Luis Caputo pixel bust, combed gray hair, angular narrow face, dark suit white shirt, serious stern expression, holding financial documents, Argentine economy minister' + PORTRAIT_SUFFIX },
  { id: 'char_moyano',      prompt: 'Hugo Moyano pixel bust, grey stubbly hair, heavyset wide neck, Teamsters-style jacket with union logo, angry pointing gesture, Argentine union boss' + PORTRAIT_SUFFIX },
  { id: 'char_kicillof',    prompt: 'Axel Kicillof pixel bust, curly unkempt black hair, scruffy dark beard, open-collar casual shirt, professor glasses, Argentine leftist Kirchnerist governor' + PORTRAIT_SUFFIX },
  { id: 'char_kirchner',    prompt: 'Cristina Kirchner pixel bust, dark dyed hair blown out, pearl necklace, Peronist cross pendant, charcoal pantsuit, sharp confident expression, Argentine former president' + PORTRAIT_SUFFIX },
  { id: 'char_georgieva',   prompt: 'Kristalina Georgieva pixel bust, short silver-white hair, European suit with IMF pin badge, reading glasses, stern diplomatic expression, IMF director' + PORTRAIT_SUFFIX },
  { id: 'char_macri',       prompt: 'Mauricio Macri pixel bust, neat side-parted dark hair, wide CEO smile showing teeth, navy suit gold tie, Boca Juniors pin, confident businessman posture, Argentine PRO party former president' + PORTRAIT_SUFFIX },
  { id: 'char_anibal',      prompt: 'Anibal Fernandez pixel bust, giant walrus mustache covering mouth, heavy jowls, squinting menacing eyes, dark rumpled jacket, large imposing heavyset figure, Argentine security minister' + PORTRAIT_SUFFIX },
  { id: 'char_berni',       prompt: 'Sergio Berni pixel bust, black police beret tilted sideways, police dress uniform with rows of medals, jutting aggressive chin, short dark hair, fierce intimidating stare, Buenos Aires security minister' + PORTRAIT_SUFFIX },
  { id: 'char_grabois',     prompt: 'Juan Grabois pixel bust, unkempt dark curly beard and messy hair, round friendly face, plaid flannel shirt no tie, raised solidarity fist gesture, Argentine social movement piquetero leader' + PORTRAIT_SUFFIX },
  { id: 'char_milani',      prompt: 'Cesar Milani pixel bust, full Argentine military dress uniform, gold general star rank insignia on shoulders, rows of medal ribbons on chest, grey short hair, stern formal military expression' + PORTRAIT_SUFFIX },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

async function sleep(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

async function generateImage(prompt: string, _width = 512, _height = 512): Promise<ArrayBuffer> {
  // Replicate nerijs/pixel-art-xl — sync mode (Prefer: wait=60), poll if still processing
  const createRes = await fetch('https://api.replicate.com/v1/models/nerijs/pixel-art-xl/predictions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${REPLICATE_TOKEN}`,
      'Content-Type': 'application/json',
      'Prefer': 'wait=60',
    },
    body: JSON.stringify({
      input: {
        prompt,
        width: 512,
        height: 512,
        num_inference_steps: 30,
      },
    }),
  });

  if (!createRes.ok) {
    throw new Error(`Replicate create error ${createRes.status}: ${await createRes.text()}`);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let prediction: any = await createRes.json();

  // Poll if not yet succeeded
  while (prediction.status !== 'succeeded' && prediction.status !== 'failed' && prediction.status !== 'canceled') {
    await sleep(3_000);
    const pollRes = await fetch(`https://api.replicate.com/v1/predictions/${prediction.id}`, {
      headers: { 'Authorization': `Bearer ${REPLICATE_TOKEN}` },
    });
    if (!pollRes.ok) throw new Error(`Replicate poll error ${pollRes.status}: ${await pollRes.text()}`);
    prediction = await pollRes.json();
  }

  if (prediction.status !== 'succeeded' || !prediction.output?.[0]) {
    throw new Error(`Replicate prediction failed: ${prediction.error ?? prediction.status}`);
  }

  const imageUrl: string = prediction.output[0];
  const imgRes = await fetch(imageUrl);
  if (!imgRes.ok) throw new Error(`Image fetch error ${imgRes.status}: ${imageUrl}`);
  return imgRes.arrayBuffer();
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
  const RETRY_DELAYS = [30_000, 60_000, 90_000]; // backoff on 429 / network errors

  for (const img of IMAGES) {
    if (manifest[img.id] && manifest[img.id] !== '') {
      console.log(`⏭  skip  ${img.id} (already generated)`);
      skipped++;
      continue;
    }

    process.stdout.write(`⏳  [${done + skipped + 1}/${IMAGES.length}] ${img.id} … `);

    // All images: 512×512 uniform resolution for consistent pixel density
    const [w, h] = [512, 512];

    let success = false;
    for (let attempt = 0; attempt <= RETRY_DELAYS.length; attempt++) {
      try {
        if (attempt > 0) {
          const wait = RETRY_DELAYS[attempt - 1];
          process.stdout.write(`\n  ↩  retry ${attempt} (waiting ${wait / 1000}s) … `);
          await sleep(wait);
        }
        const buffer = await generateImage(img.prompt, w, h);
        const url    = await uploadToSupabase(img.id, buffer);
        manifest[img.id] = url;
        fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
        console.log(`✅  ${url.split('/').pop()}`);
        done++;
        success = true;
        break;
      } catch (err) {
        const msg = (err as Error).message;
        if (attempt < RETRY_DELAYS.length) {
          process.stdout.write(`⚠️  ${msg.slice(0, 60)} — retrying…`);
        } else {
          console.error(`\n❌  Failed after ${attempt + 1} attempts: ${msg.slice(0, 120)}`);
        }
      }
    }

    // Pause between requests — 15s after success, 5s after final failure
    await sleep(success ? 15_000 : 5_000);
  }

  console.log(`\n✅  Done! Generated ${done} new images, skipped ${skipped}.`);
  console.log(`📄  Manifest saved to: ${MANIFEST_PATH}\n`);
}

main().catch((e) => { console.error(e); process.exit(1); });
