import type { ChoiceEffect, EventCard } from '../types.js';
import { STORY_PROFILES } from './presidentStoryData.js';
import { EXPANSION_TOPICS } from './expansionTopics.js';
import { EXPANSION_AGENDAS } from './expansionAgendas.js';

export const PRESIDENT_EXPANSION_ES: Record<string, string> = {};
export const PRESIDENT_EXPANSION_EN: Record<string, string> = {};
type ExpansionScene = (typeof STORY_PROFILES)[keyof typeof STORY_PROFILES]['scene'];
export const PRESIDENT_EXPANSION_ART: Record<string, ExpansionScene> = {};

const NEGOTIATE = {
  fiscal: ['Negociar una transición presupuestaria', 'Negotiate a budget transition'],
  investment: ['Comenzar con una obra piloto', 'Start with a pilot project'],
  regulation: ['Acordar reglas con revisión independiente', 'Agree rules with independent review'],
  social: ['Priorizar hogares con mayor necesidad', 'Prioritize households in greatest need'],
  labor: ['Acordar una transición entre las partes', 'Agree a transition between the parties'],
  security: ['Desplegar con supervisión civil independiente', 'Deploy with independent civilian oversight'],
  coalition: ['Ofrecer un convenio acotado y público', 'Offer a limited public agreement'],
  diplomacy: ['Negociar garantías antes de firmar', 'Negotiate safeguards before signing'],
  transparency: ['Abrir una revisión independiente por etapas', 'Open a phased independent review'],
  science: ['Financiar una etapa experimental evaluable', 'Fund an evaluable experimental phase'],
} as const;

function combineEffects(base: ChoiceEffect, adjustment: ChoiceEffect): ChoiceEffect {
  const result = { ...base };
  for (const key of Object.keys(adjustment) as (keyof ChoiceEffect)[]) {
    result[key] = (result[key] ?? 0) + (adjustment[key] ?? 0);
  }
  return result;
}

function makeChoices(id: string, effects: ChoiceEffect[]) {
  return effects.map((effect, index) => ({
    id: `${id}_${'abc'[index]}`,
    textKey: `event.${id}.choice_${'abc'[index]}`,
    effects: effect,
  }));
}

export const PRESIDENT_EXPANSION_CARDS: EventCard[] = EXPANSION_AGENDAS.flatMap((agenda) =>
  EXPANSION_TOPICS.flatMap((topic, topicIndex) => {
    const profile = STORY_PROFILES[topic.profile];
    const id = `exp_${agenda.id}_${topic.id}`;
    const sequel = `${id}_followup`;
    const minTurn = 1 + (topicIndex % 5) * 4;
    PRESIDENT_EXPANSION_ART[id] = profile.scene;
    PRESIDENT_EXPANSION_ART[sequel] = profile.scene;
    for (const language of [0, 1] as const) {
      const dictionary = language === 0 ? PRESIDENT_EXPANSION_ES : PRESIDENT_EXPANSION_EN;
      const title = `${agenda.name}: ${topic.title[language]}`.toUpperCase();
      dictionary[`event.${id}.title`] = title;
      dictionary[`event.${id}.body`] = `${topic.situation[language]} ${agenda.priority[language]}`;
      dictionary[`event.${id}.choice_a`] = agenda.action[language];
      dictionary[`event.${id}.choice_b`] = NEGOTIATE[topic.profile][language];
      dictionary[`event.${id}.choice_c`] =
        language === 0 ? 'Mantener el esquema actual' : 'Keep the current system';
      dictionary[`event.${sequel}.title`] =
        `${language === 0 ? 'IMPLEMENTACIÓN' : 'IMPLEMENTATION'} / ${title}`;
      dictionary[`event.${sequel}.body`] = topic.followup[language];
      for (let i = 0; i < 3; i++)
        dictionary[`event.${sequel}.choice_${'abc'[i]}`] = profile.options[i * 2 + language]!;
    }
    const common = { category: profile.category, requiredPresident: agenda.id };
    return [
      {
        ...common,
        id,
        titleKey: `event.${id}.title`,
        bodyKey: `event.${id}.body`,
        weight: 2,
        minTurn,
        choices: makeChoices(id, [
          combineEffects(profile.effects[0]!, agenda.tradeoff),
          { ...profile.effects[1]! },
          { ...profile.effects[2]! },
        ]),
      },
      {
        ...common,
        id: sequel,
        titleKey: `event.${sequel}.title`,
        bodyKey: `event.${sequel}.body`,
        weight: 3,
        minTurn: minTurn + 2,
        requiredChoice: { cardId: id, choiceIndexes: [0, 1], minTurnsAfter: 2 },
        choices: makeChoices(
          sequel,
          profile.followEffects.map((effect) => ({ ...effect })),
        ),
      },
    ];
  }),
);
