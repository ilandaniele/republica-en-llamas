import { useTranslation } from 'react-i18next';
import { getDebateRound, PRESIDENT_LABELS, type EventCard, type GameState } from '@republica/game-engine';
import { DebateStage } from './DebateStage.js';
import './debate.css';

interface Props {
  state: GameState;
  card: EventCard;
  selectedIndex: number | null;
  onSelect: (id: string, index: number) => void;
  onConfirm: () => void;
}

export function DebateCard({ state, card, selectedIndex, onSelect, onConfirm }: Props) {
  const { t } = useTranslation();
  const round = getDebateRound(state);
  if (!round) return null;
  const previous = state.debate?.rounds.at(-1);
  return (
    <section className="debate-card pixel-border" aria-labelledby="debate-title">
      <header className="debate-header">
        <p className="debate-live">{t('debate.live')}</p>
        <h2 id="debate-title">{t(card.titleKey)}</h2>
        <p>{t('debate.round', { round: round.round })}</p>
      </header>
      <DebateStage debate={round.standings} speaker={round.exchanges[2]!.speaker} />
      {previous && (
        <aside className="debate-feedback" role="status">
          <strong>{t('debate.previous')}: </strong>
          {t(previous.feedbackKey)}
        </aside>
      )}
      <div className="debate-content">
        <p className="debate-topic">{t(card.bodyKey)}</p>
        <ol className="debate-exchanges">
          {round.exchanges.map((exchange, index) => (
            <li key={`${exchange.speaker}-${exchange.target}`} className={index === 2 ? 'debate-attack' : ''}>
              <p className="debate-speaker">
                {PRESIDENT_LABELS[exchange.speaker]} → {PRESIDENT_LABELS[exchange.target]}
              </p>
              <p>«{t(exchange.textKey)}»</p>
            </li>
          ))}
        </ol>
        <h3 className="mb-3 mt-5">{t('debate.replyPrompt')}</h3>
        <p className="mb-3 text-celeste-light">
          {t('debate.context', {
            inflation: state.economic.inflation.toFixed(1),
            deficit: Math.round(state.economic.publicDeficit),
            credibility: Math.round(state.political.mediaCredibility),
          })}
        </p>
        <div className="debate-options" role="group" aria-label={t('debate.replyPrompt')}>
          {round.replies.map((reply, index) => (
            <button
              key={reply.strategy}
              type="button"
              className={`debate-option ${selectedIndex === index ? 'selected' : ''}`}
              aria-pressed={selectedIndex === index}
              onClick={() => onSelect(card.id, index)}
            >
              <span className="debate-key" aria-hidden="true">
                {String.fromCharCode(65 + index)}
              </span>
              <span>{t(reply.textKey, { target: reply.target ? PRESIDENT_LABELS[reply.target] : '' })}</span>
            </button>
          ))}
        </div>
        <button
          type="button"
          className="debate-confirm"
          disabled={selectedIndex === null}
          onClick={onConfirm}
        >
          {t('debate.confirm')}
        </button>
      </div>
    </section>
  );
}
