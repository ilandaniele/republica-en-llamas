import { useTranslation } from 'react-i18next';
import { keyDecisions } from '@republica/game-engine';
import type { TurnEvent } from '@republica/game-engine';

export function NewspaperRecap({ history }: { history: readonly TurnEvent[] }) {
  const { t } = useTranslation();
  const decisions = keyDecisions(history);
  if (decisions.length === 0) return null;

  return (
    <section className="mx-6 mt-4 border-y border-smoke-400 py-3" aria-labelledby="newspaper-recap-title">
      <h3
        id="newspaper-recap-title"
        className="mb-2 text-xs uppercase tracking-widest text-smoke-600"
        style={{ fontFamily: 'var(--font-readable)' }}
      >
        Las decisiones que marcaron el mandato
      </h3>
      <ol className="space-y-2" style={{ fontFamily: 'var(--font-readable)' }}>
        {decisions.map((decision) => (
          <li key={decision.turn} className="text-sm leading-snug text-smoke-900">
            <span className="font-bold">Turno {decision.turn}.</span> {t(decision.titleKey)}:{' '}
            <span className="text-smoke-700 italic">«{t(decision.choiceKey)}»</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
