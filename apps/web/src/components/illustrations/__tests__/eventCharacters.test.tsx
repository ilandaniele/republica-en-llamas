import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CARD_REGISTRY } from '@republica/game-engine';
import { EVENT_CHARACTERS, getEventCharacter } from '../characters/eventCharacters.js';
import { EventCharacterBadge } from '../characters/EventCharacterBadge.js';

describe('additional event characters', () => {
  it('assigns eight distinct roles to existing events without overlaps', () => {
    expect(Object.keys(EVENT_CHARACTERS)).toHaveLength(8);
    const events = Object.values(EVENT_CHARACTERS).flatMap(({ events }) => events);
    expect(new Set(events).size).toBe(events.length);
    for (const id of events) expect(CARD_REGISTRY.has(id)).toBe(true);
  });

  it('preserves an existing recurring character', () => {
    expect(getEventCharacter({ id: 'soc_002', characterId: 'ministro' })).toBeUndefined();
    expect(getEventCharacter({ id: 'unknown' })).toBeUndefined();
  });

  it.each(Object.entries(EVENT_CHARACTERS))('renders both moods for %s', (id, role) => {
    const card = { id: role.events[0]! };
    const { container, rerender } = render(<EventCharacterBadge card={card} />);
    expect(container.querySelector('img')).toHaveAttribute('src', `/illustrations/char_${id}_normal.webp`);
    expect(container.querySelector('img')).toHaveAttribute('alt', role.label);
    rerender(<EventCharacterBadge card={card} panic />);
    expect(container.querySelector('img')).toHaveAttribute('src', `/illustrations/char_${id}_panic.webp`);
    expect(container.querySelector('img')).toHaveClass('pixel-portrait-image', 'pixel-portrait-image--panic');
  });
});
