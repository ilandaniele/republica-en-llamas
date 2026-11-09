import { useLocation, useNavigate } from 'react-router';
import type { Difficulty } from '@republica/game-engine';
import { useGameStore } from '../../stores/gameStore.js';

export interface AuthRouteState {
  difficulty?: Difficulty;
  keepRun?: boolean;
}

// Login and register either start a new game or, with keepRun, return a guest to their finished run.
// The server moves the guest's run ticket to the account when the anonymous session is linked.
export function useAuthDestination() {
  const navigate = useNavigate();
  const location = useLocation();
  const routeState = (location.state as AuthRouteState | null) ?? {};
  const startNewGame = useGameStore((s) => s.startNewGame);

  const continueAfterAuth = async () => {
    if (routeState.keepRun) {
      navigate('/gameover');
      return;
    }
    await startNewGame(routeState.difficulty ?? 'normal');
    navigate('/president');
  };

  return { routeState, continueAfterAuth };
}
