import { useMutation } from '@tanstack/react-query';
import { supabase, isOfflineMode } from '../../lib/supabase.js';
import type { RunConfig, TurnDecision } from '@republica/game-engine';

interface SavedRun {
  id: string | null;
  score: number;
  duplicate?: boolean;
}

export function useSaveRun() {
  return useMutation({
    mutationFn: async ({
      config,
      decisions,
    }: {
      config: RunConfig;
      decisions: TurnDecision[];
    }): Promise<SavedRun | null> => {
      if (isOfflineMode) return null;

      const { data, error } = await supabase.functions.invoke<SavedRun>('submit-run', {
        body: { config, decisions },
      });
      if (error) throw error;
      return data;
    },
  });
}
