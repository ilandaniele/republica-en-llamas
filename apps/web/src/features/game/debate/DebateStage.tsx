import { useTranslation } from 'react-i18next';
import { PRESIDENT_LABELS, type DebateState } from '@republica/game-engine';
import { useGameImage } from '../../../hooks/useGameImage.js';

function Candidate({
  id,
  score,
  player,
  speaking,
}: {
  id: string;
  score: number;
  player: boolean;
  speaking: boolean;
}) {
  const { t } = useTranslation();
  const image = useGameImage(`portrait_${id}_neutral`);
  return (
    <div className={`debate-candidate ${speaking ? 'is-speaking' : ''}`}>
      <div className="debate-portrait">
        <img src={image} alt={PRESIDENT_LABELS[id]} width={96} height={96} />
      </div>
      <div className="debate-podium" aria-hidden="true">
        <span>▥</span>
      </div>
      <p className="debate-name">
        {PRESIDENT_LABELS[id]}
        {player ? ` · ${t('debate.you')}` : ''}
      </p>
      <p className="debate-score">{score}/100</p>
    </div>
  );
}

export function DebateStage({ debate, speaker }: { debate: DebateState; speaker?: string }) {
  const { t } = useTranslation();
  return (
    <div className="debate-stage">
      <div className="debate-candidates">
        {debate.candidates.map((id) => (
          <Candidate
            key={id}
            id={id}
            score={debate.scores[id]!}
            player={id === debate.playerId}
            speaking={id === speaker}
          />
        ))}
      </div>
      <p className="debate-audience">{t('debate.audience')}</p>
    </div>
  );
}
