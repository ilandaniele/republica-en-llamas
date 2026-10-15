import { useEffect } from 'react';
import type { EventCard } from '@republica/game-engine';

const CHOICE_KEYS: Record<string, number> = { '1': 0, '2': 1, '3': 2, '4': 3, a: 0, b: 1, c: 2, d: 3 };

interface ChoiceHotkeysOptions {
  card: EventCard | null;
  enabled: boolean;
  pendingChoiceIndex: number | null;
  selectChoice: (cardId: string, index: number) => void;
  confirmChoice: () => void;
}

/** Keyboard: 1-4 or A-D selects a choice; Enter confirms it. */
export function useChoiceHotkeys({
  card,
  enabled,
  pendingChoiceIndex,
  selectChoice,
  confirmChoice,
}: ChoiceHotkeysOptions) {
  useEffect(() => {
    if (!enabled || !card || card.isLaw) return;
    const onKey = (e: KeyboardEvent) => {
      const idx = CHOICE_KEYS[e.key.toLowerCase()];
      if (idx !== undefined && idx < (card.choices?.length ?? 0)) {
        e.preventDefault();
        selectChoice(card.id, idx);
        return;
      }
      if (e.key === 'Enter' && pendingChoiceIndex !== null) {
        e.preventDefault();
        confirmChoice();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [enabled, card, pendingChoiceIndex, selectChoice, confirmChoice]);
}
