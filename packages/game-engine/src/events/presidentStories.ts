import type { EventCard, ChoiceEffect } from '../types.js';
import { PRESIDENT_STORIES, STORY_PROFILES } from './presidentStoryData.js';

export const PRESIDENT_STORY_ES: Record<string, string> = {};
export const PRESIDENT_STORY_EN: Record<string, string> = {};

function choices(id: string, effects: ChoiceEffect[]) {
  return effects.map((effect, index) => ({
    id: `${id}_${'abc'[index]}`,
    textKey: `event.${id}.choice_${'abc'[index]}`,
    effects: effect,
  }));
}

export const PRESIDENT_STORY_CARDS: EventCard[] = PRESIDENT_STORIES.flatMap((story, index) => {
  const profile = STORY_PROFILES[story.profile];
  const id = story.id;
  const sequel = `${id}_followup`;
  const start = 1 + (index % 5) * 3;
  for (const language of ['es', 'en'] as const) {
    const dictionary = language === 'es' ? PRESIDENT_STORY_ES : PRESIDENT_STORY_EN;
    dictionary[`event.${id}.title`] = story.title[language];
    dictionary[`event.${id}.body`] =
      language === 'es'
        ? `Tu equipo propone ${story.proposal.es}. ${profile.cost}`
        : `Your team proposes to ${story.proposal.en}. ${profile.costEn}`;
    dictionary[`event.${sequel}.title`] =
      language === 'es' ? `LA SIGUIENTE ETAPA: ${story.title.es}` : `THE NEXT STAGE: ${story.title.en}`;
    dictionary[`event.${sequel}.body`] =
      language === 'es'
        ? `El plan para ${story.proposal.es} entra en ejecución tras tu decisión. ${profile.follow[0]}`
        : `The plan to ${story.proposal.en} enters implementation following your decision. ${profile.follow[1]}`;
    story.choices[language].forEach((text, i) => {
      dictionary[`event.${id}.choice_${'abc'[i]}`] = text;
    });
    for (let i = 0; i < 3; i++)
      dictionary[`event.${sequel}.choice_${'abc'[i]}`] =
        profile.options[i * 2 + (language === 'en' ? 1 : 0)]!;
  }
  const common = { category: profile.category, requiredPresident: story.president };
  return [
    {
      ...common,
      id,
      titleKey: `event.${id}.title`,
      bodyKey: `event.${id}.body`,
      weight: 8,
      minTurn: start,
      choices: choices(id, story.effects ?? profile.effects),
    },
    {
      ...common,
      id: sequel,
      titleKey: `event.${sequel}.title`,
      bodyKey: `event.${sequel}.body`,
      weight: 9,
      minTurn: start + 3,
      requiredChoice: { cardId: id, choiceIndexes: [0, 1], minTurnsAfter: 2 },
      choices: choices(sequel, profile.followEffects),
    },
  ];
});
