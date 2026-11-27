import { ALL_CARDS } from '@republica/game-engine';
import type { CardCategory } from '@republica/game-engine';
import { EVENT_ART } from './eventArt.js';

type DedicatedArt = (typeof EVENT_ART)[string];

const CATEGORY_EFFECT: Record<CardCategory, DedicatedArt['effect']> = {
  political: 'flash',
  economic: 'signal',
  social: 'smoke',
  international: 'signal',
  crisis: 'embers',
};

const isHistoricalCard = (id: string) => /^hist_[a-z]+_\d+$/.test(id);

/** One scene per historical-scenario card, named `event_<card id>`; specs live in `art/historical-art-pack.json`. */
export const HISTORICAL_ART: Record<string, DedicatedArt> = Object.fromEntries(
  ALL_CARDS.filter((card) => isHistoricalCard(card.id)).map((card) => [
    card.id,
    { scene: `event_${card.id}`, category: card.category, effect: CATEGORY_EFFECT[card.category] },
  ]),
);

export const DEDICATED_ART: Record<string, DedicatedArt> = { ...EVENT_ART, ...HISTORICAL_ART };
