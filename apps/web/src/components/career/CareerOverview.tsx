import { useTranslation } from 'react-i18next';
import {
  CAREER_START_OFFICES,
  getCareerRequirements,
  type GameState,
  type CareerState,
} from '@republica/game-engine';

export function CareerJourney({ career }: { career: CareerState }) {
  const { t } = useTranslation();
  const offices = [...CAREER_START_OFFICES, 'president'] as const;
  const start = offices.indexOf(career.startOffice);
  const current = offices.indexOf(career.office);
  return (
    <section className="pixel-border mb-4 bg-navy-800 p-3" aria-label={t('career.journey')}>
      <p className="mb-2 text-lg text-gold-400">{t('career.mode')}</p>
      <ol className="flex flex-wrap gap-3 text-lg">
        {offices.slice(start).map((office, index) => (
          <li
            key={office}
            aria-current={office === career.office ? 'step' : undefined}
            className={office === career.office ? 'text-gold-400' : 'text-celeste-light'}
          >
            {index + start < current ? '✓ ' : ''}
            {t(`career.office.${office}`)}
            {office !== 'president' ? ' →' : ''}
          </li>
        ))}
      </ol>
    </section>
  );
}

export function CareerMetrics({ state }: { state: GameState }) {
  const { t } = useTranslation();
  const career = state.career!;
  const values = {
    support: state.political.popularity,
    management: career.management,
    alliances: career.alliances,
    budget: career.budget,
    integrity: career.integrity,
  };
  return (
    <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
      {Object.entries(values).map(([key, value]) => (
        <div key={key} className="border-2 border-celeste-dark bg-navy-800 p-3">
          <p className="text-base text-celeste-light">{t(`career.stat.${key}`)}</p>
          <p className="text-2xl text-gold-400">{value.toFixed(1)}</p>
          <div
            role="progressbar"
            aria-label={t(`career.stat.${key}`)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={value}
            className="h-2 bg-navy-900"
          >
            <div className="h-full bg-celeste" style={{ width: `${value}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function CareerRequirements({ state }: { state: GameState }) {
  const { t } = useTranslation();
  return (
    <aside className="pixel-border mb-4 bg-navy-800 p-4">
      <h3 className="mb-2 text-xl text-celeste-light">{t('career.requirements')}</h3>
      <ul className="flex flex-wrap gap-4 text-lg">
        {getCareerRequirements(state).map((item) => (
          <li key={item.key} className={item.value >= item.required ? 'text-green-300' : 'text-smoke-200'}>
            {item.value >= item.required ? '✓' : '○'} {t(`career.stat.${item.key}`)}: {item.value.toFixed(1)}/
            {item.required}
          </li>
        ))}
      </ul>
    </aside>
  );
}
