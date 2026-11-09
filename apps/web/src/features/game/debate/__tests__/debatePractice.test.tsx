import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import DebatePracticeScreen from '../DebatePracticeScreen.js';
import { initI18n } from '../../../../lib/i18n.js';
import { useGameStore } from '../../../../stores/gameStore.js';

vi.mock('../../../../lib/playtest.js', () => ({ isPlaytestMode: true }));
beforeEach(async () => {
  localStorage.setItem('language', 'es');
  await initI18n();
});
afterEach(cleanup);

describe('isolated local debate practice', () => {
  it('opens the electoral preview directly and changes the player party without touching a run', () => {
    const original = useGameStore.getState().gameState;
    render(
      <MemoryRouter initialEntries={['/debate?view=elecciones']}>
        <DebatePracticeScreen />
      </MemoryRouter>,
    );
    expect(screen.getByRole('progressbar')).toBeTruthy();
    expect(screen.queryByText('Cruce 1 de 3')).toBeNull();
    fireEvent.change(screen.getAllByRole('combobox')[0]!, { target: { value: 'kicillof' } });
    const skip = screen.queryByRole('button', { name: 'Ver resultado completo' });
    if (skip) fireEvent.click(skip);
    expect(screen.getByText('Axel Kicillof · Vos')).toBeTruthy();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
    expect(useGameStore.getState().gameState).toBe(original);
  });
  it.each([
    [/Defender mi gestión/, 'Victoria electoral: nuevo mandato.'],
    [/Devolverle el ataque/, 'Derrota electoral: comienza la transición.'],
  ] as const)('can finish with either electoral outcome using %s', (reply, result) => {
    const runBefore = useGameStore.getState().gameState;
    const decisionsBefore = useGameStore.getState().decisions;
    render(
      <MemoryRouter>
        <DebatePracticeScreen />
      </MemoryRouter>,
    );
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'bregman' } });
    for (let round = 1; round <= 3; round++) {
      expect(screen.getByText(`Cruce ${round} de 3`)).toBeTruthy();
      fireEvent.click(screen.getByRole('button', { name: reply }));
      fireEvent.click(screen.getByRole('button', { name: 'Responder en el debate' }));
      fireEvent.click(
        screen.getByRole('button', { name: round === 3 ? 'Ir a las elecciones' : 'Siguiente cruce' }),
      );
    }
    const skipCount = screen.queryByRole('button', { name: 'Ver resultado completo' });
    if (skipCount) fireEvent.click(skipCount);
    fireEvent.click(screen.getByRole('button', { name: /Aceptar el nuevo mandato|Reconocer el resultado/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar el escrutinio' }));
    expect(screen.getByText(result)).toBeTruthy();
    expect(useGameStore.getState().gameState).toBe(runBefore);
    expect(useGameStore.getState().decisions).toBe(decisionsBefore);
  });
});
