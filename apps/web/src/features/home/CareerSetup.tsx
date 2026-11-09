import { useTranslation } from 'react-i18next';
import { CAREER_START_OFFICES, type CareerStartOffice } from '@republica/game-engine';

export function CareerSetup({
  office,
  onChange,
  active,
}: {
  office: CareerStartOffice | null;
  active: boolean;
  onChange: (office: CareerStartOffice) => void;
}) {
  const { t } = useTranslation();
  if (!active) return null;
  return (
    <section className="pixel-border mb-5 bg-navy-800 p-4" aria-label={t('career.mode')}>
      <p className="mb-4 text-xl text-celeste-light">{t('career.intro')}</p>
      <fieldset>
        <legend className="mb-3 text-lg text-gold-400">{t('career.start')}</legend>
        <div className="grid gap-3 sm:grid-cols-3">
          {CAREER_START_OFFICES.map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={(office ?? 'mayor') === value}
              className={`min-h-14 border-2 p-3 text-lg ${(office ?? 'mayor') === value ? 'border-gold-400 text-gold-400' : 'border-celeste-dark text-smoke-100'}`}
              onClick={() => onChange(value)}
            >
              {t(`career.office.${value}`)}
            </button>
          ))}
        </div>
      </fieldset>
      <p className="mt-4 text-base text-smoke-300">{t('career.localOnly')}</p>
    </section>
  );
}
