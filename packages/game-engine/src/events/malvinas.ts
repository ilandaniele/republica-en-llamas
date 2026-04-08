import type { EventCard } from '../types.js';

/**
 * MALVINAS CONFLICT ARC
 * 4-card chain: sovereignty claim → UK fleet → armed conflict → naval defeat
 * Flags: malvinas_reclamado → malvinas_tension → malvinas_guerra → military_defeat (instant game over)
 * Back-down path: malvinas_retirado exits arc safely at step 2.
 *
 * Also available as a standalone card in the malvinas_1982 historical scenario.
 */
export const MALVINAS_CARDS: EventCard[] = [
  // ── Card 1: Sovereignty claim surfaces in Congress ────────────────────────
  {
    id: 'malvinas_001',
    category: 'political',
    titleKey: 'event.malvinas_001.title',
    bodyKey: 'event.malvinas_001.body',
    weight: 10,
    minTurn: 6,
    choices: [
      {
        id: 'malvinas_001_a',
        textKey: 'event.malvinas_001.choice_a',
        // Formal diplomatic claim — starts the arc
        effects: {
          popularityDelta: 16,
          stabilityDelta: 5,
          mediaCredibilityDelta: 8,
          foreignReservesDelta: -3,
        },
      },
      {
        id: 'malvinas_001_b',
        textKey: 'event.malvinas_001.choice_b',
        // Quiet diplomacy — no arc started
        effects: {
          popularityDelta: 4,
          stabilityDelta: 6,
          mediaCredibilityDelta: 6,
          marketConfidenceDelta: 3,
        },
      },
      {
        id: 'malvinas_001_c',
        textKey: 'event.malvinas_001.choice_c',
        // Ignore — small popularity hit
        effects: {
          popularityDelta: -8,
          stabilityDelta: 2,
          mediaCredibilityDelta: -5,
        },
      },
      {
        id: 'malvinas_001_d',
        textKey: 'event.malvinas_001.choice_d',
        // Submit to OAS — multilateral path
        effects: {
          popularityDelta: 6,
          stabilityDelta: 4,
          mediaCredibilityDelta: 10,
          foreignReservesDelta: -2,
        },
      },
    ],
    memoryFlagAdded: 'malvinas_reclamado',
  },

  // ── Card 2: UK deploys fleet to South Atlantic ────────────────────────────
  {
    id: 'malvinas_002',
    category: 'international',
    titleKey: 'event.malvinas_002.title',
    bodyKey: 'event.malvinas_002.body',
    weight: 18,
    minTurn: 7,
    requiredFlags: ['malvinas_reclamado'],
    choices: [
      {
        id: 'malvinas_002_a',
        textKey: 'event.malvinas_002.choice_a',
        // Stand firm — escalates to armed conflict
        effects: {
          popularityDelta: 20,
          stabilityDelta: -5,
          foreignReservesDelta: -12,
          marketConfidenceDelta: -15,
        },
      },
      {
        id: 'malvinas_002_b',
        textKey: 'event.malvinas_002.choice_b',
        // Back down — arc exits safely
        effects: {
          popularityDelta: -20,
          stabilityDelta: 8,
          marketConfidenceDelta: 10,
          foreignReservesDelta: 6,
          mediaCredibilityDelta: -8,
        },
      },
      {
        id: 'malvinas_002_c',
        textKey: 'event.malvinas_002.choice_c',
        // UN mediation — requires vote, buys time
        effects: {
          popularityDelta: -5,
          stabilityDelta: 10,
          mediaCredibilityDelta: 14,
          foreignReservesDelta: 2,
        },
        requiresVote: true,
        voteChance: 0.55,
      },
      {
        id: 'malvinas_002_d',
        textKey: 'event.malvinas_002.choice_d',
        // Ask US to mediate — moderate outcome
        effects: {
          popularityDelta: -8,
          stabilityDelta: 6,
          marketConfidenceDelta: 5,
          foreignReservesDelta: 3,
        },
      },
    ],
    memoryFlagAdded: 'malvinas_tension',
  },

  // ── Card 3: Armed conflict begins in the islands ─────────────────────────
  {
    id: 'malvinas_003',
    category: 'international',
    titleKey: 'event.malvinas_003.title',
    bodyKey: 'event.malvinas_003.body',
    weight: 20,
    minTurn: 8,
    requiredFlags: ['malvinas_tension'],
    choices: [
      {
        id: 'malvinas_003_a',
        textKey: 'event.malvinas_003.choice_a',
        // Full naval engagement — leads to defeat card
        effects: {
          popularityDelta: 22,
          stabilityDelta: -8,
          foreignReservesDelta: -20,
          marketConfidenceDelta: -20,
          deficitDelta: 15,
        },
      },
      {
        id: 'malvinas_003_b',
        textKey: 'event.malvinas_003.choice_b',
        // Negotiate ceasefire — embarrassing but safe
        effects: {
          popularityDelta: -25,
          stabilityDelta: 5,
          foreignReservesDelta: 10,
          marketConfidenceDelta: 8,
          mediaCredibilityDelta: -10,
        },
      },
      {
        id: 'malvinas_003_c',
        textKey: 'event.malvinas_003.choice_c',
        // Limited engagement — some costs, some glory, still leads to defeat
        effects: {
          popularityDelta: 12,
          stabilityDelta: -5,
          foreignReservesDelta: -12,
          marketConfidenceDelta: -10,
          deficitDelta: 8,
        },
      },
      {
        id: 'malvinas_003_d',
        textKey: 'event.malvinas_003.choice_d',
        // Emergency diplomacy at last minute
        effects: {
          popularityDelta: -10,
          stabilityDelta: 8,
          mediaCredibilityDelta: 12,
          foreignReservesDelta: 4,
        },
      },
    ],
    memoryFlagAdded: 'malvinas_guerra',
  },

  // ── Card 4: UK destroys the Argentine fleet — instant military defeat ─────
  {
    id: 'malvinas_004',
    category: 'crisis',
    titleKey: 'event.malvinas_004.title',
    bodyKey: 'event.malvinas_004.body',
    weight: 999,
    minTurn: 9,
    requiredFlags: ['malvinas_guerra'],
    choices: [
      {
        id: 'malvinas_004_a',
        textKey: 'event.malvinas_004.choice_a',
        effects: {
          popularityDelta: -100,
          stabilityDelta: -100,
          marketConfidenceDelta: -100,
        },
        instantGameOver: 'military_defeat',
      },
      {
        id: 'malvinas_004_b',
        textKey: 'event.malvinas_004.choice_b',
        effects: {
          popularityDelta: -100,
          stabilityDelta: -100,
          marketConfidenceDelta: -100,
        },
        instantGameOver: 'military_defeat',
      },
    ],
  },
];
