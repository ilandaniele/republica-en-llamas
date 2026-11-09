import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, relative } from 'node:path';
import { ALL_CARDS, es, en } from '../packages/game-engine/src/index.js';

const manifest = JSON.parse(readFileSync('apps/web/src/assets/image-manifest.json', 'utf8')) as Record<
  string,
  string
>;
const publicDirectory = resolve('apps/web/public');
const failures: string[] = [];
for (const font of readdirSync(resolve(publicDirectory, 'fonts')).filter((file) => file.endsWith('.woff2'))) {
  if (readFileSync(resolve(publicDirectory, 'fonts', font)).subarray(0, 4).toString() !== 'wOF2')
    failures.push(`Invalid font: ${font}`);
}
const ids = new Set<string>();
const englishFallbacks = new Set<string>();
for (const card of ALL_CARDS) {
  if (ids.has(card.id)) failures.push(`Duplicate card: ${card.id}`);
  ids.add(card.id);
  if (card.choices.length < 2 || card.choices.length > 4) failures.push(`Invalid choices: ${card.id}`);
  for (const [language, dictionary] of [
    ['es', es],
    ['en', en],
  ] as const) {
    for (const key of [card.titleKey, card.bodyKey, ...card.choices.map((choice) => choice.textKey)])
      if (!dictionary[key]?.trim()) {
        if (language === 'en' && es[key]?.trim()) englishFallbacks.add(key);
        else failures.push(`Missing ${language}: ${key}`);
      }
  }
  if (card.requiredChoice && !ALL_CARDS.some((source) => source.id === card.requiredChoice!.cardId))
    failures.push(`Missing predecessor: ${card.id}`);
}
for (const [id, url] of Object.entries(manifest)) {
  const file = resolve(publicDirectory, `.${url}`);
  if (
    !url.startsWith('/illustrations/') ||
    relative(publicDirectory, file).startsWith('..') ||
    !existsSync(file)
  )
    failures.push(`Missing illustration: ${id} (${url})`);
}
if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else {
  console.log(
    `Verified ${ALL_CARDS.length} cards with complete Spanish text and ${Object.keys(manifest).length} illustration files.`,
  );
  if (englishFallbacks.size)
    console.warn(`${englishFallbacks.size} legacy English strings use the Spanish fallback.`);
}
