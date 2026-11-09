import { useTranslation } from 'react-i18next';
import { useEffect, useRef } from 'react';
import { Link } from 'react-router';
import {
  canAdvanceCareer,
  getCareerChoicePreview,
  PRESIDENT_LABELS,
  canonicalPresident,
  type GameState,
} from '@republica/game-engine';
import { useGameStore } from '../../../stores/gameStore.js';
import {
  CareerJourney,
  CareerMetrics,
  CareerRequirements,
} from '../../../components/career/CareerOverview.js';
import { CareerOfficeScene } from '../../../components/career/CareerOfficeScene.js';
import { useChoiceHotkeys } from '../screen/useChoiceHotkeys.js';

export default function CareerGameScreen({ state }: { state: GameState }) {
  const { t } = useTranslation();
  const card = useGameStore((s) => s.currentCard);
  const pending = useGameStore((s) => s.pendingChoiceIndex);
  const selectChoice = useGameStore((s) => s.selectChoice);
  const confirmChoice = useGameStore((s) => s.confirmChoice);
  const showTransition = useGameStore((s) => s.showTransition);
  const isAnimating = useGameStore((s) => s.isAnimating);
  const dismiss = useGameStore((s) => s.dismissTransition);
  const continueRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (showTransition) continueRef.current?.focus();
  }, [showTransition]);
  useChoiceHotkeys({
    card,
    enabled: !showTransition && !isAnimating,
    pendingChoiceIndex: pending,
    selectChoice,
    confirmChoice,
  });
  const career = state.career!;
  const promotion = card?.id.endsWith('_promotion');
  return (
    <main className="mx-auto w-full max-w-6xl p-4 pb-16 font-sans">
      <Link to="/" className="text-celeste-light">
        ← {t('career.mode')}
      </Link>
      <h1 className="my-4 text-3xl text-gold-400">
        {t(`career.office.${career.office}`)} ·{' '}
        {PRESIDENT_LABELS[canonicalPresident(state.presidentId) ?? 'milei']}
      </h1>
      <CareerJourney career={career} />
      <p className="mb-3 text-lg">
        {t('career.turn', { turn: career.officeTurn })} · {t('career.total', { turn: state.turn })} ·{' '}
        {state.currentYear}
      </p>
      <CareerMetrics state={state} />
      <CareerRequirements state={state} />
      {card && (
        <section className="pixel-border bg-navy-800">
          <CareerOfficeScene office={career.office} />
          <div className="p-4">
            <h2 className="mb-3 text-2xl text-gold-400">{t(card.titleKey)}</h2>
            <p className="mb-4 text-xl">{t(card.bodyKey)}</p>
            {promotion && canAdvanceCareer(state) && (
              <p className="mb-4 text-green-300">✓ {t('career.eligible')}</p>
            )}
            <div className="grid gap-3 md:grid-cols-2">
              {card.choices.map((choice, index) => (
                <button
                  key={choice.id}
                  type="button"
                  disabled={showTransition || isAnimating}
                  aria-pressed={pending === index}
                  className={`min-h-20 border-2 bg-navy-900 p-4 text-left text-xl ${pending === index ? 'border-gold-400' : 'border-celeste-dark'}`}
                  onClick={() => selectChoice(card.id, index)}
                >
                  <span className="mr-3 text-gold-400">{String.fromCharCode(65 + index)}</span>
                  {t(choice.textKey)}
                  {!showTransition && !isAnimating && (
                    <span className="mt-2 block text-base text-celeste-light">
                      {getCareerChoicePreview(state, card.id, index)
                        .map(
                          (item) =>
                            `${t(`career.stat.${item.key}`)} ${item.delta > 0 ? '+' : ''}${item.delta.toFixed(1)}`,
                        )
                        .join(' · ')}
                    </span>
                  )}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="mt-4 min-h-12 w-full bg-gold-400 p-3 text-xl font-bold text-navy-900 disabled:opacity-40"
              disabled={pending === null || showTransition || isAnimating}
              onClick={confirmChoice}
            >
              {t('career.confirm')}
            </button>
          </div>
        </section>
      )}
      <p className="my-4 text-base text-celeste-light">{t('career.rules')}</p>
      <p className="text-base text-smoke-400">{t('career.localOnly')}</p>
      {showTransition && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/95 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={t('career.applied')}
        >
          <div className="pixel-border w-full max-w-2xl bg-navy-800 p-5">
            <h2 className="mb-4 text-2xl text-gold-400">
              {t(career.lastOutcome ? `career.${career.lastOutcome}` : 'career.applied')}
            </h2>
            <CareerJourney career={career} />
            <CareerMetrics state={state} />
            <button
              ref={continueRef}
              type="button"
              onClick={dismiss}
              onKeyDown={(event) => {
                if (event.key === 'Tab') event.preventDefault();
              }}
              className="min-h-12 w-full bg-gold-400 p-3 text-xl text-navy-900"
            >
              {t('career.continue')}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
