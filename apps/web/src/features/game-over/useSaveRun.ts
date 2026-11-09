import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiSend, isOfflineMode } from '../../lib/api.js';
import type { RunConfig, TurnDecision } from '@republica/game-engine';
import { isPlaytestMode } from '../../lib/playtest.js';

interface SavedRun {
  id: string | null;
  score: number;
  duplicate?: boolean;
}

export function useSaveRun() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      ticketId,
      config,
      decisions,
    }: {
      ticketId: string;
      config: RunConfig;
      decisions: TurnDecision[];
    }): Promise<SavedRun | null> => {
      if (isPlaytestMode || isOfflineMode || config.careerStart) return null;

      return apiSend<SavedRun>('submit-run', { ticketId, config, decisions });
    },
    onSuccess: async (saved) => {
      if (!saved) return;
      await Promise.all(
        ['leaderboard', 'run-history', 'recent-runs'].map((key) =>
          queryClient.invalidateQueries({ queryKey: [key] }),
        ),
      );
    },
  });
}
