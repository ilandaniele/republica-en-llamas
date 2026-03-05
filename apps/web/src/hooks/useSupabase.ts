import { useMutation } from '@tanstack/react-query';
import { supabase, isOfflineMode } from '../lib/supabase.js';
import type { GameState } from '@republica/game-engine';

export function useSaveRun() {
  return useMutation({
    mutationFn: async ({
      state,
      userId,
    }: {
      state: GameState;
      userId: string;
    }) => {
      if (isOfflineMode) return null;

      const { data: run, error: runError } = await supabase
        .from('game_runs')
        .insert({
          user_id: userId,
          difficulty: state.difficulty,
          seed: state.seed,
          score: state.score,
          turns_survived: state.turn,
          game_over_reason: state.gameOverReason,
          is_win: state.gameOverReason === 'term_complete',
          final_state: state,
          language: state.language,
          completed_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (runError) throw runError;

      // Save turn events
      if (state.history.length > 0 && run) {
        const events = state.history.map((ev) => ({
          run_id: run.id as string,
          turn_number: ev.turn,
          card_id: ev.cardId,
          choice_index: ev.choiceIndex,
          negotiation: ev.negotiationUsed ?? null,
          effects_json: ev.effectsApplied,
        }));

        const { error: evError } = await supabase
          .from('run_events')
          .insert(events);

        if (evError) console.error('Failed to save events:', evError);
      }

      return run;
    },
  });
}
