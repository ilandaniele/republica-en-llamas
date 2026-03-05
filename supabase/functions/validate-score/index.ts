import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Import game engine scoring logic (Deno-compatible bundle)
// In production, bundle the game-engine with deno bundle or use esm.sh

interface RequestBody {
  runId: string;
  claimedScore: number;
}

interface RunEvent {
  turn_number: number;
  card_id: string;
  choice_index: number;
  negotiation: string | null;
  effects_json: Record<string, number>;
}

interface GameRun {
  user_id: string;
  difficulty: string;
  seed: number;
  turns_survived: number;
  game_over_reason: string | null;
  is_win: boolean;
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Simplified score recalculation matching scoring.ts
function recalculateScore(
  events: RunEvent[],
  run: GameRun
): number {
  let popularity = 50;
  let socialStability = 55;
  let marketConfidence = 50;
  let inflation = 12;
  let publicDeficit = 40;
  let lawsPassed = 0;
  let emergencyDecrees = 0;

  for (const ev of events) {
    const effects = ev.effects_json;
    popularity = Math.max(0, Math.min(100, popularity + (effects['popularityDelta'] ?? 0)));
    socialStability = Math.max(0, Math.min(100, socialStability + (effects['stabilityDelta'] ?? 0)));
    marketConfidence = Math.max(0, Math.min(100, marketConfidence + (effects['marketConfidenceDelta'] ?? 0)));
    inflation = Math.max(0, Math.min(200, inflation + (effects['inflationDelta'] ?? 0)));
    publicDeficit = Math.max(0, Math.min(100, publicDeficit + (effects['deficitDelta'] ?? 0)));
    lawsPassed += effects['lawsPassedDelta'] ?? 0;
    emergencyDecrees += effects['emergencyDecreeDelta'] ?? 0;
  }

  const score = Math.round(
    run.turns_survived * 100
    + popularity * 2
    + socialStability * 1.5
    + marketConfidence * 1.5
    + lawsPassed * 50
    - emergencyDecrees * 75
    - inflation * 10
    - publicDeficit * 5
  );

  return score;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Authenticate request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

    const body: RequestBody = await req.json();
    const { runId, claimedScore } = body;

    if (!runId || typeof claimedScore !== 'number') {
      return new Response(JSON.stringify({ error: 'Missing runId or claimedScore' }), {
        status: 400,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

    // Fetch the run
    const { data: run, error: runError } = await supabaseAdmin
      .from('game_runs')
      .select('*')
      .eq('id', runId)
      .eq('user_id', user.id)
      .single();

    if (runError || !run) {
      return new Response(JSON.stringify({ error: 'Run not found' }), {
        status: 404,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

    // Fetch run events
    const { data: events, error: eventsError } = await supabaseAdmin
      .from('run_events')
      .select('*')
      .eq('run_id', runId)
      .order('turn_number');

    if (eventsError) {
      return new Response(JSON.stringify({ error: 'Failed to fetch events' }), {
        status: 500,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

    // Recalculate score server-side
    const serverScore = recalculateScore(events as RunEvent[], run as GameRun);
    const delta = Math.abs(claimedScore - serverScore) / Math.max(1, Math.abs(serverScore));

    if (delta > 0.05) {
      // Score differs by more than 5% — reject
      console.warn(`Score mismatch for run ${runId}: claimed=${claimedScore}, server=${serverScore}`);
      return new Response(
        JSON.stringify({
          valid: false,
          claimedScore,
          serverScore,
          error: 'Score validation failed',
        }),
        {
          status: 400,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        }
      );
    }

    // Update with validated score
    const { error: updateError } = await supabaseAdmin
      .from('game_runs')
      .update({ score: serverScore })
      .eq('id', runId);

    if (updateError) {
      return new Response(JSON.stringify({ error: 'Failed to update score' }), {
        status: 500,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

    return new Response(
      JSON.stringify({ valid: true, serverScore, claimedScore }),
      {
        status: 200,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      {
        status: 500,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      }
    );
  }
});
