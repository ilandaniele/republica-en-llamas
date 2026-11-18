import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useGameStore } from '../../stores/gameStore.js';
import { useAuth } from '../../hooks/useAuth.js';
import { useSaveRun } from './useSaveRun.js';
import { prefetchOnIntent } from '../../app/routes.js';
import { ApiError } from '../../lib/api.js';

function saveButtonLabel(isSaving: boolean, isSaved: boolean) {
  if (isSaving) return 'GUARDANDO...';
  return isSaved ? '✓ GUARDADO' : '💾 GUARDAR';
}

function saveErrorKey(error: Error) {
  return error instanceof ApiError && error.status === 429 ? 'runSave.saveRateLimited' : 'runSave.saveFailed';
}

export function GameOverActions() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const resetGame = useGameStore((s) => s.resetGame);
  const runConfig = useGameStore((s) => s.runConfig);
  const runTicketId = useGameStore((s) => s.runTicketId);
  const runTicketError = useGameStore((s) => s.runTicketError);
  const decisions = useGameStore((s) => s.decisions);
  const { user } = useAuth();
  const { mutate: saveRun, isPending: isSaving, isSuccess: isSaved, error: saveError } = useSaveRun();

  const handleSaveScore = () => {
    if (!runTicketId || !runConfig || isSaving || isSaved) return;
    saveRun({ ticketId: runTicketId, config: runConfig, decisions });
  };

  const handleSignInToSave = () => navigate('/login', { state: { keepRun: true } });

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
            fontFamily: 'var(--font-readable)',
            fontSize: '14px',
            background: 'var(--crisis-red)',
            color: 'white',
          }}
        >
          UNA MÁS ▶
        </button>
        {runTicketId && (
          <button
            onClick={user ? handleSaveScore : handleSignInToSave}
            {...(user ? {} : prefetchOnIntent('login'))}
            disabled={isSaving || isSaved}
            className="pixel-border-gold px-6 py-3 transition-colors disabled:opacity-50"
            style={{
              fontFamily: 'var(--font-readable)',
              fontSize: '14px',
              background: 'var(--gold)',
              color: 'var(--night-blue)',
            }}
          >
            {user ? saveButtonLabel(isSaving, isSaved) : '🔑 INICIÁ SESIÓN PARA GUARDAR'}
          </button>
        )}
        <button
          onClick={() => navigate('/history')}
          {...prefetchOnIntent('history')}
          className="pixel-border px-6 py-3 transition-colors hover:bg-navy-800"
          style={{
            fontFamily: 'var(--font-readable)',
            fontSize: '14px',
            color: '#aaa',
            borderColor: 'var(--celeste-dark)',
          }}
        >
          📊 HISTORIAL
        </button>
      </div>
      {!runTicketId && runTicketError && (
        <p role="status" className="mt-3 text-gold-400">
          {t(`runSave.unsaved.${runTicketError}`)}
        </p>
      )}
      {saveError && (
        <p role="alert" className="mt-3 text-gold-400">
          {t(saveErrorKey(saveError))}
        </p>
      )}
    </>
  );
}
