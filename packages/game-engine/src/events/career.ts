import type { EventCard } from '../types.js';
import { CAREER_TOPICS } from '../careerContent.js';

export const CAREER_CARDS: EventCard[] = Object.entries(CAREER_TOPICS).flatMap(([office, topics]) => [
  ...topics.map(([id], index): EventCard => ({
    id: `career_${office}_${id}`,
    category: 'political',
    careerOffice: office as 'mayor' | 'governor' | 'minister',
    titleKey: `career.${office}.${id}.title`,
    bodyKey: `career.${office}.${id}.body`,
    weight: 1,
    choices: [
      {
        id: `career_${office}_${id}_deliver`,
        textKey: 'career.action.0',
        effects: { popularityDelta: 5, careerManagementDelta: 9, careerBudgetDelta: -10 - index },
      },
      {
        id: `career_${office}_${id}_agree`,
        textKey: 'career.action.1',
        effects: {
          popularityDelta: 3,
          careerManagementDelta: 5,
          careerAlliancesDelta: 7,
          careerBudgetDelta: -4,
          careerIntegrityDelta: 2,
        },
      },
      {
        id: `career_${office}_${id}_audit`,
        textKey: 'career.action.2',
        effects: {
          popularityDelta: -2,
          careerManagementDelta: 2,
          careerAlliancesDelta: -3,
          careerBudgetDelta: 7,
          careerIntegrityDelta: 8,
        },
      },
      {
        id: `career_${office}_${id}_patronage`,
        textKey: 'career.action.3',
        effects: {
          popularityDelta: 8,
          careerManagementDelta: 3,
          careerAlliancesDelta: 10,
          careerBudgetDelta: -6,
          careerIntegrityDelta: -14,
        },
      },
    ],
  })),
  {
    id: `career_${office}_promotion`,
    category: 'political',
    careerOffice: office as 'mayor' | 'governor' | 'minister',
    titleKey: 'career.promotion.title',
    bodyKey: 'career.promotion.body',
    weight: 1,
    choices: [
      { id: `career_${office}_run`, textKey: 'career.promotion.run', effects: {} },
      {
        id: `career_${office}_prepare`,
        textKey: 'career.promotion.prepare',
        effects: {
          popularityDelta: 1,
          careerManagementDelta: 3,
          careerAlliancesDelta: 2,
          careerBudgetDelta: -1,
        },
      },
      {
        id: `career_${office}_pact`,
        textKey: 'career.promotion.pact',
        effects: {
          popularityDelta: 2,
          careerAlliancesDelta: 6,
          careerBudgetDelta: -4,
          careerIntegrityDelta: 2,
        },
      },
      { id: `career_${office}_retire`, textKey: 'career.promotion.retire', effects: {} },
    ],
  } satisfies EventCard,
]);
