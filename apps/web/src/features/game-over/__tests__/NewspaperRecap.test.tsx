import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key }) }));

const { NewspaperRecap } = await import('../newspaper/NewspaperRecap.js');

describe('NewspaperRecap', () => {
  it('prints the key decisions with their card and choice', () => {
    render(
      <NewspaperRecap
        history={[{ turn: 7, cardId: 'eco_001', choiceIndex: 1, effectsApplied: { inflationDelta: 12 } }]}
      />,
    );
    expect(screen.getByText('Las decisiones que marcaron el mandato')).toBeTruthy();
    expect(screen.getByText('Turno 7.')).toBeTruthy();
    expect(screen.getByText('«event.eco_001.choice_b»')).toBeTruthy();
  });

  it('renders nothing without decisions', () => {
    const { container } = render(<NewspaperRecap history={[]} />);
    expect(container.innerHTML).toBe('');
  });
});
