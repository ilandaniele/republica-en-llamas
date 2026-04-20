/**
 * REP EN LLAMAS — Image Generation Script
 *
 * Usage:
 *   SUPABASE_URL=https://... SUPABASE_SERVICE_ROLE_KEY=sb_secret_... \
 *   npx tsx scripts/generate-images.ts [--force] [--no-gif]
 *
 * Generates editorial-caricature illustrations via Pollinations.ai (free, FLUX-based).
 * Also generates animated GIFs (3 frames) for president×category scenes if
 * `sharp` and `gif-encoder-2` are installed:
 *   npm install -D sharp gif-encoder-2
 *
 * Uploads to Supabase Storage bucket "game-images/illustrations/",
 * then writes apps/web/src/assets/image-manifest.json with public URLs.
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as crypto from 'node:crypto';

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
const MANIFEST_PATH = path.join(__dirname, '../apps/web/src/assets/image-manifest.json');

// ── Style suffixes — 16-bit pixel art, style inspired by Impeached! / SNES political games ─
// Style suffixes kept concise — FLUX-based models weight early tokens most heavily
const STYLE_SUFFIX =
  ', SNES 16-bit pixel art, limited 16-color palette, chunky hard pixels, no anti-aliasing, bold outlines, flat colors, political satire retro game art, no text no watermark';

const PORTRAIT_SUFFIX =
  ', SNES 16-bit pixel art bust portrait, exaggerated caricature, 16 colors, chunky hard pixels, no anti-aliasing, solid dark navy background, retro political game sprite, no text no watermark';

const ACTION_SUFFIX =
  ', SNES 16-bit pixel art scene, 16 colors, chunky pixels, no anti-aliasing, flat saturated colors, Argentine political satire game art, no text no watermark';

// Deterministic seed per image id (so re-runs produce same images unless --force)
function seedForId(id: string, offset = 0): number {
  const hash = crypto.createHash('md5').update(id).digest('hex');
  return (parseInt(hash.slice(0, 8), 16) + offset) % 999_983;
}

// ── Static image definitions ──────────────────────────────────────────────────
const IMAGES: Array<{ id: string; prompt: string }> = [
  // Political scenes
  { id: 'pol_congress',     prompt: 'Argentine congress chamber interior hemicycle, legislators shouting at desks, large dome above, government vs opposition chaos, podium center, Argentine flag' + STYLE_SUFFIX },
  { id: 'pol_scandal',      prompt: 'Argentine politician at chaotic press conference, briefcase bursting open with documents, reporters with cameras surrounding him, spotlight, guilty expression' + STYLE_SUFFIX },
  { id: 'pol_protest',      prompt: 'Massive street protest Buenos Aires obelisk, huge crowd with cacerolazo banging pots, smoke and flags, aerial view, powerful composition' + STYLE_SUFFIX },

  // Economic scenes
  { id: 'eco_inflation',    prompt: 'Argentine supermarket with giant spinning red price-increase arrows, empty shelves, pile of peso bills tumbling, worried customer, hyperinflation chaos' + STYLE_SUFFIX },
  { id: 'eco_reserves',     prompt: 'BCRA bank vault with iron bars, tiny pile of gold bars nearly empty, worried central banker sweating, alarm lights, reserve depletion crisis' + STYLE_SUFFIX },
  { id: 'eco_growth',       prompt: 'Argentine factory with smokestacks, big green rising bar chart, construction cranes, celebrating workers, optimistic economic scene' + STYLE_SUFFIX },

  // Social scenes
  { id: 'soc_strike',       prompt: 'CGT union workers on strike outside factory gate, picket signs, hard hats, fists raised, Hugo Moyano style union boss leading chant' + STYLE_SUFFIX },
  { id: 'soc_unrest',       prompt: 'Urban riots Buenos Aires, burning tires and barricades, riot police in helmets vs protesters, smoky street, water cannon, chaos' + STYLE_SUFFIX },
  { id: 'soc_health',       prompt: 'Overcrowded Argentine public hospital emergency ward, overwhelmed doctors and nurses, patients on stretchers in corridors, health crisis' + STYLE_SUFFIX },

  // International scenes
  { id: 'int_imf',          prompt: 'Argentine minister signing IMF agreement across huge conference table, international flags, formal suits, mountain of loan documents, handshake' + STYLE_SUFFIX },
  { id: 'int_war',          prompt: 'World map with red conflict markers, two opposing diplomats at negotiation table with national flags, globe, tense atmosphere, arms deal documents' + STYLE_SUFFIX },
  { id: 'int_trade',        prompt: 'Argentine cargo ship loaded with soy containers at port, export crane, sunrise, handshake between business partners, economic growth scene' + STYLE_SUFFIX },
  { id: 'int_guerra_ucrania', prompt: 'Ukrainian crisis 2022, blue and yellow flag colors in smoke-filled sky, burning city silhouettes, Argentine diplomat watching conflict map on TV in embassy, tense atmosphere' + STYLE_SUFFIX },
  { id: 'int_conflicto_iran', prompt: 'Middle East crisis, orange oil fire sky, oil derricks, crescent moon, Argentine diplomat at desk with regional maps, missile trail, tense desert atmosphere' + STYLE_SUFFIX },

  // Argentina-specific
  { id: 'arg_mundial',      prompt: 'Argentina winning World Cup, blue and white jersey player lifting golden trophy, euphoric Buenos Aires crowd, confetti avalanche, national celebration' + STYLE_SUFFIX },
  { id: 'arg_corralito',    prompt: 'Argentines 2001 queuing outside locked bank with chains on doors, furious crowd waving withdrawal slips, police barrier, corralito financial crisis scene' + STYLE_SUFFIX },
  { id: 'arg_campo',        prompt: 'Argentine soy farmers blocking Ruta 9 highway with tractors, grain silos, pampas flat landscape, agro lockout protest, country vs city tension' + STYLE_SUFFIX },
  { id: 'arg_dolar',        prompt: 'Giant US dollar bill crashing like a tsunami wave over Buenos Aires skyline, peso coins exploding outward, panicked citizens running, dolarización crisis' + STYLE_SUFFIX },
  { id: 'arg_congreso_ley', prompt: 'Argentine deputies voting in congress, hands raised, fierce debate, session chamber lit dramatically, legislative battle for reform law' + STYLE_SUFFIX },
  { id: 'arg_fmi_negocio',  prompt: 'Argentine official in sweaty negotiation with IMF bankers, stacked loan documents on table, IMF logo on briefcase, tense debt renegotiation scene' + STYLE_SUFFIX },

  // Crisis
  { id: 'crisis',           prompt: 'Argentine hyperinflation apocalypse 1989, wheelbarrow overflowing with useless banknotes, burning city skyline, empty supermarket shelves, desperate queues, red apocalyptic sky' + STYLE_SUFFIX },
  { id: 'crisis_impeachment', prompt: 'Argentine president impeachment trial, furious legislators pointing accusations from all sides, president sweating at podium, judge with gavel, dramatic court scene' + STYLE_SUFFIX },

  // War/crisis scenes
  { id: 'guerra_nuke_explosion', prompt: 'Nuclear mushroom cloud explosion over Buenos Aires skyline, apocalyptic orange shockwave, ruins and silhouettes in foreground, existential crisis scene' + STYLE_SUFFIX },
  { id: 'guerra_nuke_threat',    prompt: 'Ballistic missile launch toward city, red emergency sirens, bomb shelter door, panicked Argentine officials in underground bunker, nuclear threat' + STYLE_SUFFIX },
  { id: 'guerra_join',           prompt: 'Argentine soldiers marching into desert war zone, military airplane overhead, Argentine flag on combat uniform, war declaration ceremony, serious faces' + STYLE_SUFFIX },
  { id: 'eco_dollar_blue',       prompt: 'Informal dollar blue currency exchange on Buenos Aires street corner at night, stacks of dollar bills and pesos, secretive transaction, exchange rate board' + STYLE_SUFFIX },
  { id: 'eco_corte_luz',         prompt: 'Buenos Aires city blackout at night, dark apartment buildings, Argentine family with candles, downed power lines on street, electrical crisis scene' + STYLE_SUFFIX },
  { id: 'soc_housing',           prompt: 'Family evicted from apartment Buenos Aires, furniture and boxes on sidewalk, stern landlord with eviction papers, housing protesters outside, social drama' + STYLE_SUFFIX },
  { id: 'pol_election',          prompt: 'Argentine midterm election day, voting booths with celeste y blanco curtains, ballot box, long voter queue, democracy under pressure, counting tension' + STYLE_SUFFIX },
  { id: 'pol_veto',              prompt: 'Argentine president stamping enormous red VETO on law document, furious legislators watching from congress, official seal, dramatic power scene' + STYLE_SUFFIX },
  { id: 'int_aid',               prompt: 'Foreign aid cargo ship arriving Buenos Aires port, workers unloading labeled humanitarian boxes, officials signing papers on dock, international solidarity' + STYLE_SUFFIX },
  { id: 'malvinas',              prompt: 'Malvinas Falklands crisis, Argentine warship in South Atlantic storm, soldiers on rocky island, Buenos Aires protests for sovereignty, emotional patriotism' + STYLE_SUFFIX },

  // ── Casa Rosada states (replaces SVG in TurnTransitionScreen) ────────────
  { id: 'casa_rosada_normal',  prompt: 'Casa Rosada salmon-pink baroque neoclassical palace facade, ornate white arched columns and balcony, two Argentine flags waving, presidential guards in blue uniform, Plaza de Mayo cobblestones, daylight blue sky, Buenos Aires' + STYLE_SUFFIX },
  { id: 'casa_rosada_quiet',   prompt: 'Casa Rosada salmon-pink palace at dawn, empty Plaza de Mayo, soft golden sunrise light behind the baroque facade, lone guard at gate, peaceful tranquil atmosphere, Buenos Aires morning' + STYLE_SUFFIX },
  { id: 'casa_rosada_mate',    prompt: 'Casa Rosada salmon-pink palace with cheerful citizens in Plaza de Mayo sharing mate, pigeons flying, sunny afternoon, folkloric atmosphere, peaceful popular gathering, Buenos Aires' + STYLE_SUFFIX },
  { id: 'casa_rosada_protest', prompt: 'Casa Rosada salmon-pink palace under siege, Plaza de Mayo packed with cacerolazo protesters, crowd with banners and pots, smoke and megaphones, CGT flags, government besieged' + STYLE_SUFFIX },
  { id: 'casa_rosada_riot',    prompt: 'Casa Rosada salmon-pink palace during riots, burning barricades in Plaza de Mayo, riot police with shields vs protesters, fire and dark red smoky sky, 2001 Argentina crisis' + STYLE_SUFFIX },
  { id: 'casa_rosada_chaos',   prompt: 'Casa Rosada salmon-pink palace in apocalyptic crisis, surrounding buildings on fire, smoke pillars, blackout darkness, abandoned plaza, dystopian Argentina collapse' + STYLE_SUFFIX },
  { id: 'casa_rosada_nuke',    prompt: 'Casa Rosada salmon-pink palace with nuclear mushroom cloud rising behind it, deep red apocalyptic sky, end-of-times Buenos Aires, shockwave light' + STYLE_SUFFIX },

  // ── Character portraits — highly detailed caricatures ───────────────────
  { id: 'char_milei',       prompt: 'SEVEN wild jet-black hair spikes radiating like a crown, anarcho-capitalist president, pale staring manic eyes, thick black sideburns, tiny golden chainsaw, black suit red tie, Javier Milei Argentina caricature' + PORTRAIT_SUFFIX },
  { id: 'char_massa',       prompt: 'ENORMOUSLY wide square jaw dominating the face, two mobile phones in hands, slicked dark oiled hair, drooping eyelids, cunning smile, navy suit red tie, Sergio Massa economy minister Argentina caricature' + PORTRAIT_SUFFIX },
  { id: 'char_bullrich',    prompt: 'Short choppy gray-brown hair, crossed arms with gold security badge, sharp angular cheekbones, thin pursed frown, charcoal blazer, cold intimidating stare, Patricia Bullrich security minister Argentina caricature' + PORTRAIT_SUFFIX },
  { id: 'char_bregman',     prompt: 'ENORMOUS explosion of curly blonde hair filling frame, round thick glasses, hoop earrings, bright crimson red blazer, raised solidarity fist, Myriam Bregman leftist deputy Argentina caricature' + PORTRAIT_SUFFIX },
  { id: 'char_schiaretti',  prompt: 'Shiny bald head with thin gray fringe on sides, holding a mate gourd proudly, wide round cheerful cordobés face, sky blue suit, Juan Schiaretti governor Córdoba Argentina caricature' + PORTRAIT_SUFFIX },
  { id: 'char_larreta',     prompt: 'VERY thick dark bushy eyebrows on pale narrow long face, dramatic under-eye circles, salt-and-pepper hair, exhausted worried expression, charcoal suit light blue tie, Horacio Larreta mayor Buenos Aires caricature' + PORTRAIT_SUFFIX },
  { id: 'char_caputo',      prompt: 'Silver-gray neatly combed hair, sharp angular narrow face, stern cold Wall Street demeanor, dark tailored suit, holding financial spreadsheet, Luis Caputo economy minister Argentina caricature' + PORTRAIT_SUFFIX },
  { id: 'char_moyano',      prompt: 'Thick meaty pointing finger, heavyset bull neck, grey stubbly hair, CGT union jacket with emblem, furious confrontational expression, Hugo Moyano union boss Argentina caricature' + PORTRAIT_SUFFIX },
  { id: 'char_kicillof',    prompt: 'Curly messy dark hair and scraggly beard, round wire professor glasses, open casual shirt no tie, leftist intellectual expression, Axel Kicillof governor Buenos Aires province Argentina caricature' + PORTRAIT_SUFFIX },
  { id: 'char_kirchner',    prompt: 'Pearl necklace AND large golden Peronist cross pendant, dark blow-dried hair, elegant dark pantsuit, confident knowing smile, powerful presence, Cristina Kirchner ex-president Argentina caricature' + PORTRAIT_SUFFIX },
  { id: 'char_georgieva',   prompt: 'Short precise silver-white hair, IMF badge pin on tailored European suit, stern reading glasses, cold diplomatic expression, pen over balance sheet, Kristalina Georgieva IMF director caricature' + PORTRAIT_SUFFIX },
  { id: 'char_macri',       prompt: 'ENORMOUS wide CEO smile showing all teeth, neat dark side-parted hair, Boca Juniors pin on lapel, supremely confident businessman posture, navy suit gold tie, Mauricio Macri ex-president Argentina caricature' + PORTRAIT_SUFFIX },
  { id: 'char_anibal',      prompt: 'GIANT walrus mustache completely hiding the mouth, massive heavyset figure, heavy jowls, squinting menacing small eyes, dark rumpled baggy jacket, imposing presence, Aníbal Fernández minister Argentina caricature' + PORTRAIT_SUFFIX },
  { id: 'char_berni',       prompt: 'Black police beret tilted at sharp angle, full dress uniform covered in medal rows, jutting aggressive chin, fierce military stare, Sergio Berni security minister Buenos Aires caricature' + PORTRAIT_SUFFIX },
  { id: 'char_grabois',     prompt: 'Wild dark curly beard and messy hair halo, plaid flannel shirt no tie, raised clenched solidarity fist, genuine warm smile, piquetero energy, Juan Grabois social movement leader Argentina caricature' + PORTRAIT_SUFFIX },
  { id: 'char_milani',      prompt: 'Full military dress uniform covered in medal ribbons, general star rank on shoulders, closely cropped grey hair, rigid formal military bearing, César Milani army general Argentina caricature' + PORTRAIT_SUFFIX },

  // ── President × Category action scenes (static PNG, president doing card action) ──
  // Milei
  { id: 'pres_milei_economic',      prompt: 'Javier Milei Argentine president with wild spiky hair and chainsaw in presidential palace office, aggressively cutting red-tape economic regulations with chainsaw, peso banknotes flying everywhere, inflation chart on wall, anarcho-capitalist motosierra decision moment' + ACTION_SUFFIX },
  { id: 'pres_milei_political',     prompt: 'Javier Milei with seven spiky hair spikes at Casa Rosada podium microphone, furious libertarian speech, fist raised, Argentine congress deputies reacting with shock and anger behind him' + ACTION_SUFFIX },
  { id: 'pres_milei_social',        prompt: 'Javier Milei with wild hair facing massive piquetero protest crowd, holding austerity reform clipboard, social tension, cuts and benefits debate, Plaza de Mayo confrontation' + ACTION_SUFFIX },
  { id: 'pres_milei_international', prompt: 'Javier Milei with spiky hair at international summit table, shaking hands with IMF director, American flag and Argentine flag behind, debt negotiation scene, foreign policy moment' + ACTION_SUFFIX },
  { id: 'pres_milei_crisis',        prompt: 'Javier Milei with wild hair in presidential crisis room, multiple red emergency phone lights, sweating profusely, shocked staff surrounding him, chaos meters on screens, emergency meeting' + ACTION_SUFFIX },
  // Massa
  { id: 'pres_massa_economic',      prompt: 'Sergio Massa with enormous square jaw as economy minister in Casa Rosada office, holding multiple phones simultaneously, briefcase open with peso plans, printing press visible through window, Peronist economic intervention scene' + ACTION_SUFFIX },
  { id: 'pres_massa_political',     prompt: 'Sergio Massa with wide jaw at political press conference, charming smile, multiple microphones, Peronist backing crowd, political negotiation mastery, coalition building scene' + ACTION_SUFFIX },
  { id: 'pres_massa_social',        prompt: 'Sergio Massa with square jaw at social meeting with CGT union leaders, distributing social benefits plan, workers cheering, Peronist social pact scene in union hall' + ACTION_SUFFIX },
  { id: 'pres_massa_international', prompt: 'Sergio Massa with wide jaw at international finance meeting, New York or Washington DC setting, investment pitch to foreign bankers, Argentine flag, debt restructuring discussion' + ACTION_SUFFIX },
  { id: 'pres_massa_crisis',        prompt: 'Sergio Massa with square jaw in crisis room, juggling three phones at once, sweating, inflation chart exploding upward, emergency economic plan on whiteboard, Peronist crisis management chaos' + ACTION_SUFFIX },
  // Bullrich
  { id: 'pres_bullrich_economic',   prompt: 'Patricia Bullrich with choppy gray hair at economy reform table, hard technocratic reforms blueprint, stern face, cutting spending with scissors, fiscally strict neoliberal program scene' + ACTION_SUFFIX },
  { id: 'pres_bullrich_political',  prompt: 'Patricia Bullrich with sharp cheekbones at security press conference, stern authoritarian presence, microphones, police force visible behind her, law and order political speech' + ACTION_SUFFIX },
  { id: 'pres_bullrich_social',     prompt: 'Patricia Bullrich with choppy hair facing union protest at security headquarters, crossed arms refusing demands, riot police behind, hard-line social confrontation scene' + ACTION_SUFFIX },
  { id: 'pres_bullrich_international', prompt: 'Patricia Bullrich with angular face at NATO or intelligence summit, security briefing, foreign defense ministers, classified documents, Argentina international security partnership' + ACTION_SUFFIX },
  { id: 'pres_bullrich_crisis',     prompt: 'Patricia Bullrich in presidential crisis room, hard stern expression, ordering security operations, crisis command center monitors, security minister decisive emergency action' + ACTION_SUFFIX },
];

// ── Animated GIF definitions (3-frame action sequences per president×category) ──
// Each entry has 3 prompts: [idle, action, reaction]
const GIF_IMAGES: Array<{ id: string; prompts: [string, string, string] }> = [
  {
    id: 'pres_milei_economic_anim',
    prompts: [
      'Javier Milei with seven spiky hair at presidential desk, studying economic documents, thinking pose' + ACTION_SUFFIX,
      'Javier Milei with spiky hair raising chainsaw dramatically over peso banknotes, mid-action cutting motion' + ACTION_SUFFIX,
      'Javier Milei with spiky hair triumphant fist raised, chainsaw done, inflation chart dropping, victorious expression' + ACTION_SUFFIX,
    ],
  },
  {
    id: 'pres_milei_crisis_anim',
    prompts: [
      'Javier Milei with spiky hair looking at crisis alerts on phone screen, concerned expression' + ACTION_SUFFIX,
      'Javier Milei with wild hair in emergency meeting, multiple phones ringing, staff shouting, full chaos' + ACTION_SUFFIX,
      'Javier Milei with spiky hair making dramatic decision gesture, press conference aftermath, media frenzy' + ACTION_SUFFIX,
    ],
  },
  {
    id: 'pres_massa_economic_anim',
    prompts: [
      'Sergio Massa with square jaw reviewing peso currency plans at desk, calm confident pose' + ACTION_SUFFIX,
      'Sergio Massa with wide jaw on two phones at once, negotiating emergency economic measures, intense' + ACTION_SUFFIX,
      'Sergio Massa with square jaw announcing economic plan to cameras, press conference, Peronist tone' + ACTION_SUFFIX,
    ],
  },
  {
    id: 'pres_bullrich_crisis_anim',
    prompts: [
      'Patricia Bullrich with choppy hair at crisis situation map table, cold analytical expression' + ACTION_SUFFIX,
      'Patricia Bullrich with sharp cheekbones issuing security orders, pointing at map, commanding presence' + ACTION_SUFFIX,
      'Patricia Bullrich with stern face at press conference announcing emergency measures, firm resolved look' + ACTION_SUFFIX,
    ],
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

async function sleep(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

async function generateImagePollinations(prompt: string, seed: number): Promise<ArrayBuffer> {
  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?model=flux&width=1024&height=1024&seed=${seed}&nologo=true&enhance=true`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Pollinations error ${res.status}`);
  return res.arrayBuffer();
}

async function uploadToSupabase(id: string, data: ArrayBuffer | Buffer, ext: string = 'png'): Promise<string> {
  const objectPath = `${FOLDER}/${id}.${ext}`;
  const uploadUrl  = `${SUPABASE_URL}/storage/v1/object/${BUCKET}/${objectPath}`;
  const contentType = ext === 'gif' ? 'image/gif' : 'image/png';

  const res = await fetch(uploadUrl, {
    method: 'POST',
    headers: {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      'Content-Type': contentType,
      'x-upsert': 'true',
    },
    body: data instanceof Buffer ? data : Buffer.from(data),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Supabase upload error ${res.status}: ${body}`);
  }

  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${objectPath}`;
}

// Lazy-load GIF deps — gracefully skip if not installed
async function tryLoadGifDeps(): Promise<{ sharp: typeof import('sharp'); GifEncoder: typeof import('gif-encoder-2') } | null> {
  try {
    const [sharpMod, gifMod] = await Promise.all([
      import('sharp'),
      import('gif-encoder-2'),
    ]);
    return { sharp: sharpMod.default as unknown as typeof import('sharp'), GifEncoder: gifMod.default as unknown as typeof import('gif-encoder-2') };
  } catch {
    console.warn('\n⚠️  sharp or gif-encoder-2 not installed — skipping GIF generation.');
    console.warn('   Install with: npm install -D sharp gif-encoder-2\n');
    return null;
  }
}

async function generateAnimatedGif(
  gifDeps: Awaited<ReturnType<typeof tryLoadGifDeps>>,
  id: string,
  prompts: [string, string, string],
): Promise<Buffer | null> {
  if (!gifDeps) return null;
  const { sharp, GifEncoder } = gifDeps;
  const GIF_SIZE = 512;
  const DELAY_MS = 400;

  const frameBuffers: ArrayBuffer[] = [];
  for (let i = 0; i < 3; i++) {
    process.stdout.write(`  [frame ${i + 1}/3] `);
    frameBuffers.push(await generateImagePollinations(prompts[i]!, seedForId(id, i)));
    await sleep(8_000); // Pollinations rate limit buffer between frames
  }

  const encoder = new (GifEncoder as any)(GIF_SIZE, GIF_SIZE);
  encoder.setDelay(DELAY_MS);
  encoder.setRepeat(0); // infinite loop
  encoder.start();

  for (const buf of frameBuffers) {
    const rgba = await (sharp as any)(Buffer.from(buf))
      .resize(GIF_SIZE, GIF_SIZE, { fit: 'cover' })
      .ensureAlpha()
      .raw()
      .toBuffer();
    encoder.addFrame(rgba);
  }

  encoder.finish();
  return (encoder.out as any).getData() as Buffer;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const forceRegen = process.argv.includes('--force');
  const skipGif    = process.argv.includes('--no-gif');

  const totalStatic = IMAGES.length;
  const totalGif    = skipGif ? 0 : GIF_IMAGES.length;
  console.log(`\n🖼  REP EN LLAMAS — Generating ${totalStatic} static images + ${totalGif} animated GIFs\n`);

  let manifest: Record<string, string> = {};
  if (!forceRegen && fs.existsSync(MANIFEST_PATH)) {
    manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
  } else if (forceRegen) {
    console.log('⚡  --force flag: regenerating all images\n');
  }

  let done = 0;
  let skipped = 0;
  const RETRY_DELAYS = [30_000, 60_000, 90_000];

  // ── Static images ──────────────────────────────────────────────────────────
  for (const img of IMAGES) {
    const manifestKey = img.id;
    if (!forceRegen && manifest[manifestKey] && manifest[manifestKey] !== '') {
      console.log(`⏭  skip  ${img.id}`);
      skipped++;
      continue;
    }

    process.stdout.write(`⏳  [${done + skipped + 1}/${totalStatic}] ${img.id} … `);

    let success = false;
    for (let attempt = 0; attempt <= RETRY_DELAYS.length; attempt++) {
      try {
        if (attempt > 0) {
          const wait = RETRY_DELAYS[attempt - 1]!;
          process.stdout.write(`\n  ↩  retry ${attempt} (waiting ${wait / 1000}s) … `);
          await sleep(wait);
        }
        const buffer = await generateImagePollinations(img.prompt, seedForId(img.id));
        const url    = await uploadToSupabase(img.id, buffer);
        manifest[manifestKey] = url;
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

    await sleep(success ? 12_000 : 5_000);
  }

  // ── Animated GIFs (optional) ───────────────────────────────────────────────
  if (!skipGif) {
    const gifDeps = await tryLoadGifDeps();

    for (const gif of GIF_IMAGES) {
      const manifestKey = gif.id;
      if (!forceRegen && manifest[manifestKey] && manifest[manifestKey] !== '') {
        console.log(`⏭  skip  ${gif.id} (gif already generated)`);
        skipped++;
        continue;
      }

      process.stdout.write(`🎞  [GIF] ${gif.id} … `);

      try {
        const gifBuffer = await generateAnimatedGif(gifDeps, gif.id, gif.prompts);
        if (gifBuffer) {
          const url = await uploadToSupabase(gif.id, gifBuffer, 'gif');
          manifest[manifestKey] = url;
          fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));
          console.log(`✅  ${url.split('/').pop()}`);
          done++;
        } else {
          console.log('⏭  skipped (deps not installed)');
          skipped++;
        }
      } catch (err) {
        console.error(`\n❌  GIF failed: ${(err as Error).message.slice(0, 120)}`);
      }

      await sleep(5_000);
    }
  }

  console.log(`\n✅  Done! Generated ${done} images, skipped ${skipped}.`);
  console.log(`📄  Manifest: ${MANIFEST_PATH}\n`);

  // Terminal bell + Windows toast notification
  process.stdout.write('\x07');
  if (process.platform === 'win32') {
    const { execSync } = await import('node:child_process');
    try {
      execSync(
        `powershell -Command "Add-Type -AssemblyName System.Windows.Forms; $n = New-Object System.Windows.Forms.NotifyIcon; $n.Icon = [System.Drawing.SystemIcons]::Information; $n.Visible = $true; $n.ShowBalloonTip(10000, 'Republica en Llamas', 'Generacion completada: ${done} imagenes subidas a Supabase', 'Info'); Start-Sleep 11; $n.Dispose()"`,
        { stdio: 'ignore' }
      );
    } catch { /* non-critical */ }
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
