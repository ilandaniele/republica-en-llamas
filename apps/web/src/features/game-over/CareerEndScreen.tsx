import { useTranslation } from 'react-i18next';
import type { GameState } from '@republica/game-engine';
import { CareerJourney, CareerMetrics } from '../../components/career/CareerOverview.js';
import { CareerOfficeScene } from '../../components/career/CareerOfficeScene.js';
import { GameOverActions } from './GameOverActions.js';

export function CareerEndScreen({ state }: { state: GameState }) {
  const { t } = useTranslation();
  const career = state.career!;
  return (
    <main className="mx-auto max-w-4xl p-5">
      <h1 className="my-5 text-3xl text-gold-400">{t('career.end')}</h1>
      <CareerJourney career={career} />
      <CareerOfficeScene office={career.office} />
      <p className="my-4 text-xl">{t(`career.${career.lastOutcome ?? 'failed'}`)}</p>
      <p className="mb-4 text-xl">
        {t('career.summary', {
          office: t(`career.office.${career.office}`),
          count: career.promotions.length,
        })}
      </p>
      <CareerMetrics state={state} />
      <p className="my-4 text-2xl">{state.score} pts</p>
      <GameOverActions />
    </main>
  );
}
