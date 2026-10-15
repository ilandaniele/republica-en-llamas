import { useNavigate } from 'react-router';
import { useGameStore } from '../../stores/gameStore.js';
import { useAuth } from '../../hooks/useAuth.js';
import { useSaveRun } from './useSaveRun.js';
import { prefetchOnIntent } from '../../app/routes.js';

function saveButtonLabel(isSaving: boolean, isSaved: boolean) {
  if (isSaving) return 'GUARDANDO...';
  return isSaved ? '✓ GUARDADO' : '💾 GUARDAR';
}

export function GameOverActions() {
  const navigate = useNavigate();
  const resetGame = useGameStore((s) => s.resetGame);
  const runConfig = useGameStore((s) => s.runConfig);
  const decisions = useGameStore((s) => s.decisions);
  const { user } = useAuth();
  const { mutate: saveRun, isPending: isSaving, isSuccess: isSaved } = useSaveRun();

  const handleSaveScore = () => {
    if (!user || !runConfig || isSaving || isSaved) return;
    saveRun({ config: runConfig, decisions });
  };

  const handlePlayAgain = () => {
    resetGame();
    navigate('/');
  };

  return (
    <>
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          onClick={handlePlayAgain}
          className="pixel-border-crisis flex-1 px-6 py-3 transition-colors"
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: '8px',
            background: 'var(--crisis-red)',
            color: 'white',
          }}
        >
          UNA MÁS ▶
        </button>
        {user && (
          <button
            onClick={handleSaveScore}
            disabled={isSaving || isSaved}
            className="pixel-border-gold px-6 py-3 transition-colors disabled:opacity-50"
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: '6px',
              background: 'var(--gold)',
              color: 'var(--night-blue)',
            }}
          >
            {saveButtonLabel(isSaving, isSaved)}
          </button>
        )}
        <button
          onClick={() => navigate('/history')}
          {...prefetchOnIntent('history')}
          className="pixel-border px-6 py-3 transition-colors hover:bg-navy-800"
          style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: '6px',
            color: '#aaa',
            borderColor: 'var(--celeste-dark)',
          }}
        >
          📊 HISTORIAL
        </button>
      </div>
    </>
  );
}
