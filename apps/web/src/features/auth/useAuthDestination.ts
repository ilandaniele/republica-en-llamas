import { useLocation, useNavigate } from 'react-router';
import type { Difficulty } from '@republica/game-engine';
import { useGameStore } from '../../stores/gameStore.js';
import { claimRunTicket, currentAnonymousToken } from '../../lib/runTicket.js';

export interface AuthRouteState {
  difficulty?: Difficulty;
  keepRun?: boolean;
}

// Login and register either start a new game or, with keepRun, return a guest to their finished run.
export function useAuthDestination() {
  const navigate = useNavigate();
  const location = useLocation();
  const routeState = (location.state as AuthRouteState | null) ?? {};
  const startNewGame = useGameStore((s) => s.startNewGame);
  const runTicketId = useGameStore((s) => s.runTicketId);
  const clearRunTicket = useGameStore((s) => s.clearRunTicket);

  const captureGuestToken = () => (routeState.keepRun ? currentAnonymousToken() : Promise.resolve(null));

  const keepGuestRun = async (guestToken: string | null) => {
    const claimed = guestToken && runTicketId ? await claimRunTicket(guestToken, runTicketId) : false;
    if (!claimed) clearRunTicket();
    navigate('/gameover');
  };

  const continueAfterAuth = async (guestToken: string | null) => {
    if (routeState.keepRun) return keepGuestRun(guestToken);
    await startNewGame(routeState.difficulty ?? 'normal');
    navigate('/president');
  };

  return { routeState, captureGuestToken, continueAfterAuth };
}
