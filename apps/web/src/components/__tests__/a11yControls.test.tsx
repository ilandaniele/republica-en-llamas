import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { MemoryRouter, useNavigate } from 'react-router';
import { AccessibilitySettings } from '../AccessibilitySettings.js';
import { RouteFocus } from '../RouteFocus.js';
import { SoundProvider } from '../SoundManager.js';
import { usePreferencesStore } from '../../stores/preferencesStore.js';
import { REDUCE_MOTION_CLASS, prefersReducedMotion } from '../../lib/reducedMotion.js';

afterEach(() => {
  cleanup();
  usePreferencesStore.setState({ reduceMotion: false, hotkeysEnabled: true, extendedTime: false });
  document.documentElement.classList.remove(REDUCE_MOTION_CLASS);
});

describe('AccessibilitySettings', () => {
  it('exposes toggle state with aria-pressed and applies reduced motion', () => {
    render(<AccessibilitySettings />);
    const reduce = screen.getByRole('button', { name: 'Reducir animaciones' });
    expect(reduce).toHaveAttribute('aria-pressed', 'false');
    fireEvent.click(reduce);
    expect(reduce).toHaveAttribute('aria-pressed', 'true');
    expect(prefersReducedMotion()).toBe(true);
    const hotkeys = screen.getByRole('button', { name: /Atajos de teclado/ });
    expect(hotkeys).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(hotkeys);
    expect(usePreferencesStore.getState().hotkeysEnabled).toBe(false);
  });
});

describe('SoundProvider toggle', () => {
  it('has an accessible name and pressed state', () => {
    render(
      <SoundProvider>
        <span />
      </SoundProvider>,
    );
    const toggle = screen.getByRole('button', { name: 'Sonido' });
    const initial = toggle.getAttribute('aria-pressed');
    fireEvent.click(toggle);
    expect(toggle.getAttribute('aria-pressed')).not.toBe(initial);
  });
});

function GoToRanking() {
  const navigate = useNavigate();
  return <button onClick={() => navigate('/leaderboard')}>Ir</button>;
}

describe('RouteFocus', () => {
  it('updates the document title and focuses the new heading on navigation', async () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <RouteFocus />
        <GoToRanking />
        <h1>Ranking</h1>
      </MemoryRouter>,
    );
    expect(document.title).toBe('Inicio · República en Llamas');
    fireEvent.click(screen.getByText('Ir'));
    expect(document.title).toBe('Ranking · República en Llamas');
    await act(() => new Promise((resolve) => requestAnimationFrame(() => resolve(undefined))));
    expect(screen.getByRole('heading', { name: 'Ranking' })).toHaveFocus();
  });
});
