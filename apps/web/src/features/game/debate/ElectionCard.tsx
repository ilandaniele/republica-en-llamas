import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';
import {
  calculateElectionResult,
  getElectionNight,
  ELECTION_COUNT_STEPS,
  type EventCard,
  type GameState,
} from '@republica/game-engine';
import { ElectionTally } from '../election/ElectionTally.js';
import { useElectionCount } from '../election/useElectionCount.js';
import './debate.css';

interface Props {
  state: GameState;
  card: EventCard;
  selectedIndex: number | null;
  onSelect: (id: string, index: number) => void;
  onConfirm: () => void;
}

export function ElectionCard(props: Props) {
  const { state } = props;
  return (
    <ElectionSession
      key={`${state.id}:${state.presidentId}:${state.political.popularity}:${state.economic.marketConfidence}`}
      {...props}
    />
  );
}

function ElectionSession({ state, card, selectedIndex, onSelect, onConfirm }: Props) {
  const { t } = useTranslation();
  const night = useMemo(() => getElectionNight(state), [state]);
  const { step, complete, finish, paused, userPaused, speed, setSpeed, togglePause } =
    useElectionCount(ELECTION_COUNT_STEPS);
  const { won } = calculateElectionResult(state);
  const resultIndex = won ? 0 : 1;
  return (
    <section
      className="debate-card pixel-border p-5"
      aria-labelledby="election-title"
      data-choices-disabled={!complete}
    >
      <p className="debate-live">{t(card.titleKey)}</p>
      <h2 id="election-title" className="my-4 text-gold-400">
        {t(complete ? (won ? 'election.won' : 'election.lost') : 'count.live')}
      </h2>
      <p className="mb-5">{t(complete ? 'election.explanation' : 'count.intro')}</p>
      <ElectionTally night={night} frame={night.frames[step]!} />
      {!complete && (
        <div className="election-controls" role="group" aria-label={t('count.controls')}>
          <button type="button" className="election-skip" aria-pressed={userPaused} onClick={togglePause}>
            {t(userPaused ? 'count.resume' : 'count.pause')}
          </button>
          <label>
            {t('count.speed')}{' '}
            <select value={speed} onChange={(event) => setSpeed(event.target.value === '2' ? 2 : 1)}>
              <option value={1}>1×</option>
              <option value={2}>2×</option>
            </select>
          </label>
          <button type="button" className="election-skip" onClick={finish}>
            {t('count.skip')}
          </button>
          {paused && <p role="status">{t('count.paused')}</p>}
        </div>
      )}
      {state.debate?.outcome && <p className="mb-5">{t(`debate.outcome.${state.debate.outcome}`)}</p>}
      {complete && (
        <>
          <button
            type="button"
            className={`debate-option ${selectedIndex === resultIndex ? 'selected' : ''}`}
            aria-pressed={selectedIndex === resultIndex}
            onClick={() => onSelect(card.id, resultIndex)}
          >
            {t(won ? 'election.winAction' : 'election.loseAction')}
          </button>
          <button
            type="button"
            className="debate-confirm"
            disabled={selectedIndex !== resultIndex}
            onClick={onConfirm}
          >
            {t('election.confirm')}
          </button>
        </>
      )}
    </section>
  );
}
