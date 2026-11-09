import type { EventCard, GameState } from '../types.js';
import { canonicalPresident } from '../presidents.js';

export function matchesStoryRequirements(card: EventCard, state: GameState): boolean {
  return createStoryMatcher(state)(card);
}

export function createStoryMatcher(state: GameState): (card: EventCard) => boolean {
  const president = canonicalPresident(state.presidentId);
  const decisions = new Map(state.history.map((event) => [event.cardId, event]));
  return (card) => {
    if (card.requiredPresident && card.requiredPresident !== president) return false;
    const requirement = card.requiredChoice;
    if (!requirement) return true;
    const decision = decisions.get(requirement.cardId);
    return (
      decision !== undefined &&
      requirement.choiceIndexes.includes(decision.choiceIndex) &&
      state.turn - decision.turn >= (requirement.minTurnsAfter ?? 0)
    );
  };
}
