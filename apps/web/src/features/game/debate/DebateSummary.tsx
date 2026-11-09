import { useTranslation } from 'react-i18next';
import type { DebateState } from '@republica/game-engine';
import { DebateStage } from './DebateStage.js';
import './debate.css';

export function DebateSummary({ debate }: { debate: DebateState }) {
  const { t } = useTranslation();
  const latest = debate.rounds.at(-1);
  if (!latest) return null;
  return (
    <section className="debate-summary pixel-border mb-4 p-4" aria-label={t('debate.title')}>
      <h2>{t(debate.outcome ? `debate.outcome.${debate.outcome}` : 'debate.title')}</h2>
      <p className="my-3">{t(latest.feedbackKey)}</p>
      <p>{t('debate.points', { points: `${latest.points > 0 ? '+' : ''}${latest.points}` })}</p>
      <p className="my-3">
        {t('debate.impact', {
          popularity: `${latest.popularityDelta > 0 ? '+' : ''}${latest.popularityDelta}`,
          bonus: debate.scoreBonus,
        })}
      </p>
      <DebateStage debate={debate} />
      {debate.outcome && <p className="mt-3">{t('debate.nextElection')}</p>}
    </section>
  );
}
