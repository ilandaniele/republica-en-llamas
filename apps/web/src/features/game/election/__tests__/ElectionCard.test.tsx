import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { drawNextCard, initGame, ELECTION_COUNT_STEPS, ELECTION_DISTRICTS } from '@republica/game-engine';
import { ElectionCard } from '../../debate/ElectionCard.js';
import { initI18n } from '../../../../lib/i18n.js';
import { COUNT_INTERVAL_MS } from '../useElectionCount.js';
import geography from '../../../../assets/argentina-pixel-map.json';
import { districtMargin } from '../countFormat.js';
import { getElectionNight } from '@republica/game-engine';

let reducedMotion = false;
vi.mock('framer-motion', () => ({ useReducedMotion: () => reducedMotion }));
beforeEach(async () => {
  reducedMotion = false;
  localStorage.setItem('language', 'es');
  await initI18n();
  vi.useFakeTimers();
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

function mountElection() {
  const initial = initGame('normal', 42, 'es', undefined, 'milei');
  const state = { ...initial, turn: 40, political: { ...initial.political, popularity: 70 } };
  const onSelect = vi.fn();
  const onConfirm = vi.fn();
  return {
    ...render(
      <ElectionCard
        state={state}
        card={drawNextCard(state)}
        selectedIndex={null}
        onSelect={onSelect}
        onConfirm={onConfirm}
      />,
    ),
    onSelect,
    onConfirm,
  };
}

describe('animated Argentine election map', () => {
  it('starts with neutral districts and counts without resolving the turn automatically', () => {
    const { container, onSelect, onConfirm } = mountElection();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0');
    expect(container.querySelector('[data-choices-disabled="true"]')).not.toBeNull();
    expect(container.querySelectorAll('[data-district]')).toHaveLength(24);
    expect(container.querySelectorAll('[data-party="pending"]')).toHaveLength(24);
    expect(screen.queryByText('EL ELECTORADO RENUEVA TU MANDATO')).toBeNull();
    expect(vi.getTimerCount()).toBe(1);
    act(() => vi.advanceTimersByTime(COUNT_INTERVAL_MS * ELECTION_COUNT_STEPS));
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
    expect(container.querySelector('[data-choices-disabled="true"]')).toBeNull();
    expect(screen.getByText('EL ELECTORADO RENUEVA TU MANDATO')).toBeTruthy();
    expect(vi.getTimerCount()).toBe(0);
    expect(onSelect).not.toHaveBeenCalled();
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it('can skip the count and inspect a province using keyboard or select', () => {
    const { container } = mountElection();
    fireEvent.click(screen.getByRole('button', { name: 'Ver resultado completo' }));
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
    fireEvent.keyDown(container.querySelector('[data-district="14"]')!, { key: 'Enter' });
    expect(screen.getByRole('combobox', { name: /Consultar distrito/ })).toHaveValue('14');
    fireEvent.change(screen.getByRole('combobox', { name: /Consultar distrito/ }), {
      target: { value: '94' },
    });
    expect(container.querySelector('[data-district="94"]')).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('region', { name: 'Resultados del distrito seleccionado' })).toHaveTextContent(
      'Tierra del Fuego',
    );
    expect(vi.getTimerCount()).toBe(0);
  });

  it('stops the count when the scene unmounts', () => {
    const { unmount } = mountElection();
    act(() => vi.advanceTimersByTime(COUNT_INTERVAL_MS * 2));
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('pauses the actual card, changes speed, and resumes from the same point', () => {
    mountElection();
    act(() => vi.advanceTimersByTime(COUNT_INTERVAL_MS * 2));
    const progress = screen.getByRole('progressbar').getAttribute('aria-valuenow');
    fireEvent.click(screen.getByRole('button', { name: 'Pausar recuento' }));
    act(() => vi.advanceTimersByTime(5000));
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', progress);
    fireEvent.change(screen.getByRole('combobox', { name: /Velocidad/ }), { target: { value: '2' } });
    fireEvent.click(screen.getByRole('button', { name: 'Reanudar recuento' }));
    act(() => vi.advanceTimersByTime(COUNT_INTERVAL_MS / 2));
    expect(Number(screen.getByRole('progressbar').getAttribute('aria-valuenow'))).toBeGreaterThan(
      Number(progress),
    );
  });

  it('compares all districts by margin and selects the same district on the map', () => {
    const { container } = mountElection();
    fireEvent.click(screen.getByRole('button', { name: 'Ver resultado completo' }));
    fireEvent.click(container.querySelector('summary')!);
    fireEvent.change(screen.getByRole('combobox', { name: /Ordenar distritos/ }), {
      target: { value: 'close' },
    });
    const table = screen.getByRole('table', { name: 'Comparar los 24 distritos' });
    const rows = within(table).getAllByRole('row').slice(1);
    expect(rows).toHaveLength(24);
    const initial = initGame('normal', 42, 'es', undefined, 'milei');
    const state = { ...initial, turn: 40, political: { ...initial.political, popularity: 70 } };
    const expected = [...getElectionNight(state).frames.at(-1)!.districts].sort(
      (a, b) => districtMargin(a) - districtMargin(b),
    );
    expect(rows[0]).toHaveTextContent(expected[0]!.name);
    fireEvent.click(within(table).getByRole('button', { name: 'Córdoba' }));
    expect(container.querySelector('[data-district="14"]')).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('combobox', { name: /Consultar distrito/ })).toHaveValue('14');
    expect(screen.getByRole('button', { name: 'Descargar resultados CSV' })).toBeTruthy();
  });

  it('honors reduced motion by displaying the completed result immediately', () => {
    reducedMotion = true;
    mountElection();
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
    expect(screen.queryByRole('button', { name: 'Ver resultado completo' })).toBeNull();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('retains all official district identifiers and keeps every pixel in the map bounds', () => {
    expect(geography.provinces.map((province) => province.id).sort()).toEqual(
      ELECTION_DISTRICTS.map(([id]) => id).sort(),
    );
    for (const province of geography.provinces) {
      expect(province.runs.length).toBeGreaterThan(0);
      expect(
        province.runs.every(
          ([x, y, w]) => x! >= 0 && y! >= 0 && w! > 0 && x! + w! <= geography.width && y! < geography.height,
        ),
      ).toBe(true);
    }
  });
});
