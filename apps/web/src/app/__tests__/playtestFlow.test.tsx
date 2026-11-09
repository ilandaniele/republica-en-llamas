import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LazyMotion, domAnimation } from 'framer-motion';
import { replayRun } from '@republica/game-engine';
import App from '../../App.js';
import { AuthProvider } from '../AuthProvider.js';
import { useGameStore } from '../../stores/gameStore.js';
import { initI18n } from '../../lib/i18n.js';

vi.mock('../../lib/playtest.js', () => ({ isPlaytestMode: true }));
vi.mock('@gsap/react', () => ({ useGSAP: vi.fn() }));
vi.mock('../../lib/analytics.js', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../../lib/analytics.js')>()),
  initAnalytics: vi.fn(),
}));

function mountGame() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <AuthProvider>
        <LazyMotion features={domAnimation}>
          <App />
        </LazyMotion>
      </AuthProvider>
    </QueryClientProvider>,
  );
}

beforeEach(async () => {
  localStorage.clear();
  localStorage.setItem('soundEnabled', 'false');
  window.history.replaceState(null, '', '/');
  useGameStore.getState().resetGame();
  useGameStore.setState({
    tutorialComplete: true,
    presidentId: 'populista',
    isCrisisExpress: false,
    scenarioId: null,
    careerStart: null,
  });
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({
      matches: true,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  );
  await initI18n();
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('local playable review', () => {
  it('ends a corrupt local administration without showing a presidential ending', async () => {
    mountGame();
    fireEvent.click(await screen.findByRole('button', { name: 'CARRERA' }));
    fireEvent.click(screen.getByRole('button', { name: /Nueva Partida|Jugar como invitado/i }));
    fireEvent.click(await screen.findByRole('button', { name: /Asumir como/ }));
    await screen.findByRole('progressbar', { name: 'Gestión' }, { timeout: 5000 });
    for (let decision = 0; decision < 4; decision++) {
      const choice = document.querySelectorAll('[aria-pressed]');
      fireEvent.click(choice[3]!);
      fireEvent.click(screen.getByRole('button', { name: 'Confirmar decisión' }));
      if (decision < 3) fireEvent.click(screen.getByRole('button', { name: 'Continuar la carrera' }));
    }
    expect(await screen.findByRole('heading', { name: 'FIN DE ESTA CARRERA' })).toBeTruthy();
    expect(useGameStore.getState().gameState?.gameOverReason).toBe('impeachment');
    expect(screen.queryByText('Termómetro nacional')).toBeNull();
    expect(useGameStore.getState().runTicketId).toBeNull();
  });

  it.each([
    ['mayor', 'Intendente'],
    ['governor', 'Gobernador'],
    ['minister', 'Ministro nacional'],
  ] as const)(
    'starts, saves and resumes a career from %s',
    async (office, label) => {
      const apiFetch = vi.spyOn(globalThis, 'fetch');
      const view = mountGame();
      fireEvent.click(await screen.findByRole('button', { name: 'CARRERA' }));
      fireEvent.click(screen.getByRole('button', { name: label }));
      fireEvent.click(screen.getByRole('button', { name: /^Fácil/ }));
      fireEvent.click(screen.getByRole('button', { name: /Nueva Partida|Jugar como invitado/i }));
      fireEvent.click(await screen.findByRole('button', { name: /Javier Milei.*La Motosierra/ }));
      expect(screen.queryByRole('button', { name: /Crisis Express/ })).toBeNull();
      fireEvent.click(screen.getByRole('button', { name: /Asumir como Javier Milei/ }));
      await screen.findByRole('progressbar', { name: 'Gestión' }, { timeout: 5000 });
      expect(useGameStore.getState().runConfig?.careerStart).toBe(office);
      expect(useGameStore.getState().gameState?.career?.office).toBe(office);
      expect(useGameStore.getState().runTicketId).toBeNull();
      expect(screen.queryByText('Termómetro nacional')).toBeNull();
      fireEvent.click(screen.getByRole('button', { name: /Acordar la implementación/ }));
      fireEvent.click(screen.getByRole('button', { name: 'Confirmar decisión' }));
      const resume = await screen.findByRole('button', { name: 'Continuar la carrera' });
      expect(resume).toHaveFocus();
      fireEvent.click(resume);
      const committed = useGameStore.getState();
      expect(committed.decisions).toHaveLength(1);
      expect(committed.gameState).toEqual(replayRun(committed.runConfig!, committed.decisions));
      view.unmount();
      await act(async () => {
        await useGameStore.persist.rehydrate();
      });
      mountGame();
      await screen.findByRole('progressbar', { name: 'Gestión' }, { timeout: 5000 });
      expect(useGameStore.getState().gameState).toEqual(committed.gameState);
      expect(useGameStore.getState().gameState?.career?.officeTurn).toBe(2);
      expect(apiFetch).not.toHaveBeenCalledWith(expect.stringContaining('/api/'), expect.anything());
      apiFetch.mockRestore();
    },
    30000,
  );

  it('plays the full local career and hands over to the presidential interface', async () => {
    mountGame();
    fireEvent.click(await screen.findByRole('button', { name: 'CARRERA' }));
    fireEvent.click(screen.getByRole('button', { name: /Nueva Partida|Jugar como invitado/i }));
    fireEvent.click(await screen.findByRole('button', { name: /Sergio Massa.*El Candidato/ }));
    fireEvent.click(screen.getByRole('button', { name: /Asumir como Sergio Massa/ }));
    await screen.findByRole('progressbar', { name: 'Gestión' }, { timeout: 5000 });
    while (useGameStore.getState().gameState?.career?.office !== 'president') {
      const store = useGameStore.getState();
      const promotion = store.currentCard!.id.endsWith('_promotion');
      const text = promotion
        ? /Postularme al próximo cargo/
        : store.gameState!.career!.officeTurn % 5 === 0
          ? /Auditar gastos/
          : /Acordar la implementación/;
      fireEvent.click(screen.getByRole('button', { name: text }));
      fireEvent.click(screen.getByRole('button', { name: 'Confirmar decisión' }));
      if (useGameStore.getState().gameState?.career?.office !== 'president')
        fireEvent.click(screen.getByRole('button', { name: 'Continuar la carrera' }));
    }
    expect(await screen.findByText('LLEGASTE A LA PRESIDENCIA')).toBeTruthy();
    expect(useGameStore.getState().gameState?.turn).toBe(1);
    expect(useGameStore.getState().gameState?.career?.previousHistory).toHaveLength(18);
    expect(useGameStore.getState().gameState?.career?.promotions).toHaveLength(3);
    fireEvent.click(screen.getByRole('button', { name: /CONTINUAR ▶/ }));
    await waitFor(() => expect(document.querySelectorAll('.pixel-choice-card').length).toBeGreaterThan(0));
    expect(useGameStore.getState().gameState).toEqual(
      replayRun(useGameStore.getState().runConfig!, useGameStore.getState().decisions),
    );
    expect(screen.getByText('Termómetro nacional')).toBeTruthy();
  }, 30000);
  it('opens the isolated debate from home without starting or submitting a run', async () => {
    const apiFetch = vi.spyOn(globalThis, 'fetch');
    const stateBefore = useGameStore.getState().gameState;
    mountGame();
    fireEvent.click(await screen.findByRole('button', { name: 'Probar debate presidencial' }));
    expect(await screen.findByRole('heading', { name: 'Prueba del debate presidencial' })).toBeTruthy();
    expect(await screen.findByText('Cruce 1 de 3')).toBeTruthy();
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'macri' } });
    fireEvent.click(screen.getByRole('button', { name: /Defender mi gestión/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Responder en el debate' }));
    expect(useGameStore.getState().gameState).toBe(stateBefore);
    expect(useGameStore.getState().decisions).toHaveLength(0);
    expect(apiFetch).not.toHaveBeenCalledWith(expect.stringContaining('/api/'), expect.anything());
    apiFetch.mockRestore();
  });
  it('offers three free presidents and sends a paid candidate to the pack without changing selection', async () => {
    mountGame();
    fireEvent.click(await screen.findByRole('button', { name: /Nueva Partida|Jugar como invitado/i }));
    await screen.findByRole('button', { name: /Axel Kicillof.*La gestión federal/i });
    expect(screen.getAllByText('Gratis')).toHaveLength(3);
    expect(screen.getAllByText('🔒', { exact: true })).toHaveLength(9);
    for (const name of [
      /Javier Milei.*La Motosierra/i,
      /Sergio Massa.*El Candidato/i,
      /Axel Kicillof.*La gestión federal/i,
    ]) {
      fireEvent.click(screen.getByRole('button', { name }));
      expect(screen.getByRole('button', { name })).toHaveAttribute('aria-pressed', 'true');
    }
    fireEvent.click(screen.getByRole('button', { name: /Juan Grabois.*Tierra, techo y trabajo/i }));
    expect(
      await screen.findByText('Desbloqueá los nueve presidentes adicionales, incluido Juan Grabois.'),
    ).toBeTruthy();
    expect(screen.getByRole('button', { name: /Asumir como Axel Kicillof/i })).toBeTruthy();
    expect(useGameStore.getState().gameState?.presidentId).toBe('populista');
  }, 30000);

  it('starts from home, chooses a new president, confirms a decision, and resumes the same run', async () => {
    const apiFetch = vi.spyOn(globalThis, 'fetch');
    const view = mountGame();
    const start = await screen.findByRole(
      'button',
      { name: /Nueva Partida|Jugar como invitado/i },
      { timeout: 10000 },
    );
    fireEvent.click(start);
    const kicillof = await screen.findByRole(
      'button',
      { name: /Axel Kicillof.*La gestión federal/i },
      { timeout: 10000 },
    );
    fireEvent.click(kicillof);
    fireEvent.click(screen.getByRole('button', { name: /Asumir como Axel Kicillof/i }));
    await waitFor(() => expect(document.querySelectorAll('.pixel-choice-card').length).toBeGreaterThan(0), {
      timeout: 10000,
    });
    expect(useGameStore.getState().gameState?.presidentId).toBe('kicillof');
    expect(useGameStore.getState().runTicketId).toBeNull();
    fireEvent.click(document.querySelector('.pixel-choice-card')!);
    expect(document.querySelector('.pixel-choice-card')).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(await screen.findByRole('button', { name: /CONFIRMAR TURNO/i }));
    await screen.findByRole('button', { name: /CONTINUAR ▶/i });
    const committed = useGameStore.getState();
    expect(committed.decisions).toHaveLength(1);
    expect(committed.gameState).toEqual(replayRun(committed.runConfig!, committed.decisions));
    view.unmount();
    await act(async () => {
      await useGameStore.persist.rehydrate();
    });
    mountGame();
    await waitFor(() => expect(document.querySelectorAll('.pixel-choice-card').length).toBeGreaterThan(0), {
      timeout: 10000,
    });
    expect(useGameStore.getState().decisions).toHaveLength(1);
    expect(useGameStore.getState().gameState).toEqual(committed.gameState);
    expect(screen.getByText(/VERSIÓN DE PRUEBA/)).toBeTruthy();
    expect(apiFetch).not.toHaveBeenCalledWith(expect.stringContaining('/api/'), expect.anything());
    apiFetch.mockRestore();
  }, 30000);
});
