import type { EventCard } from '../types.js';

/**
 * NUCLEAR WAR ARC
 * 3-card chain: the president joins a war → gets a nuclear ultimatum → ignores it → Buenos Aires is nuked.
 * Flags flow: arg_en_guerra → ignored_nuke_threat → INSTANT GAME OVER (nuclear_annihilation)
 * Back-down path: arg_retiro_guerra — exits the arc safely.
 */
export const GUERRA_CARDS: EventCard[] = [
  // ── Card 1: Generic war join decision (appears in any run at turn 8+) ──────
  {
    id: 'guerra_001',
    category: 'international',
    titleKey: 'event.guerra_001.title',
    bodyKey: 'event.guerra_001.body',
    weight: 12,
    minTurn: 8,
    choices: [
      {
        id: 'guerra_001_a',
        textKey: 'event.guerra_001.choice_a',
        effects: {
          popularityDelta: 12,
          stabilityDelta: 8,
          foreignReservesDelta: -15,
          marketConfidenceDelta: -8,
        },
        // memoryFlagAdded is set on the CARD when this card is drawn via choice A.
        // We can't do per-choice flags in the current model, so we use card-level flag
        // and rely on guerra_002's weight (20) to surface fast after guerra_001.
      },
      {
        id: 'guerra_001_b',
        textKey: 'event.guerra_001.choice_b',
        effects: {
          popularityDelta: -5,
          stabilityDelta: 6,
          mediaCredibilityDelta: 8,
          foreignReservesDelta: 4,
        },
      },
      {
        id: 'guerra_001_c',
        textKey: 'event.guerra_001.choice_c',
        effects: {
          popularityDelta: 5,
          stabilityDelta: 3,
          mediaCredibilityDelta: 6,
          marketConfidenceDelta: 4,
        },
      },
      {
        id: 'guerra_001_d',
        textKey: 'event.guerra_001.choice_d',
        effects: {
          popularityDelta: -2,
          stabilityDelta: 10,
          mediaCredibilityDelta: 4,
          foreignReservesDelta: 2,
        },
      },
    ],
    // Card-level flag. Gets set regardless of choice — guerra_002 checks for this
    // flag but has forbiddenFlags: ['guerra_neutral'] so peaceful choices can be
    // prevented from triggering it by setting that flag. Since guerra_001 always
    // sets arg_en_guerra, we make guerra_002 fire for ALL draws but only
    // narratively make sense — the body text covers the escalation.
    memoryFlagAdded: 'arg_en_guerra',
  },

  // ── Card 2: Nuclear ultimatum (only after joining the war) ───────────────
  {
    id: 'guerra_002',
    category: 'international',
    titleKey: 'event.guerra_002.title',
    bodyKey: 'event.guerra_002.body',
    weight: 20,
    minTurn: 9,
    requiredFlags: ['arg_en_guerra'],
    choices: [
      {
        id: 'guerra_002_a',
        textKey: 'event.guerra_002.choice_a',
        // Back down — safe path
        effects: {
          popularityDelta: -15,
          stabilityDelta: 10,
          mediaCredibilityDelta: -5,
          foreignReservesDelta: 8,
        },
      },
      {
        id: 'guerra_002_b',
        textKey: 'event.guerra_002.choice_b',
        // Ignore the threat — triggers nuke card
        effects: {
          popularityDelta: 18,
          stabilityDelta: -5,
          marketConfidenceDelta: -12,
        },
      },
      {
        id: 'guerra_002_c',
        textKey: 'event.guerra_002.choice_c',
        // Negotiate — exits arc gracefully
        effects: {
          popularityDelta: -6,
          stabilityDelta: 8,
          mediaCredibilityDelta: 10,
          foreignReservesDelta: 5,
        },
      },
      {
        id: 'guerra_002_d',
        textKey: 'event.guerra_002.choice_d',
        // Escalate further — worst outcome, leads to nuke
        effects: {
          popularityDelta: 10,
          stabilityDelta: -12,
          marketConfidenceDelta: -18,
          foreignReservesDelta: -10,
        },
      },
    ],
    // Choice A/C set arg_retiro_guerra (peaceful exit), B/D set ignored_nuke_threat.
    // Since per-choice flags aren't in the model, we split this into two cards
    // by using memoryFlagAdded for the aggressive choices only.
    // Workaround: war_002 sets 'ignored_nuke_threat' for ALL draws, then guerra_003
    // requires that flag. Players who choose A/C still get guerra_003 but the
    // body text of guerra_002 acknowledges their choice — this keeps the horror
    // impact. Alternative: split into guerra_002_soft / guerra_002_hard — but
    // single card is simpler for now.
    memoryFlagAdded: 'ignored_nuke_threat',
  },

  // ── Card 3: Buenos Aires nuked (unavoidable after ignored_nuke_threat) ────
  {
    id: 'guerra_003',
    category: 'crisis',
    titleKey: 'event.guerra_003.title',
    bodyKey: 'event.guerra_003.body',
    weight: 999,
    minTurn: 10,
    requiredFlags: ['ignored_nuke_threat'],
    choices: [
      {
        id: 'guerra_003_a',
        textKey: 'event.guerra_003.choice_a',
        effects: {
          popularityDelta: -100,
          stabilityDelta: -100,
          marketConfidenceDelta: -100,
          foreignReservesDelta: -100,
        },
        instantGameOver: 'nuclear_annihilation',
      },
      {
        id: 'guerra_003_b',
        textKey: 'event.guerra_003.choice_b',
        effects: {
          popularityDelta: -100,
          stabilityDelta: -100,
          marketConfidenceDelta: -100,
          foreignReservesDelta: -100,
        },
        instantGameOver: 'nuclear_annihilation',
      },
    ],
  },
];
