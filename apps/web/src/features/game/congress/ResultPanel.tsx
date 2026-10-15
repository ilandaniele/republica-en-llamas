import { m } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import type { ChoiceEffect, EventCard } from '@republica/game-engine';

type ResultMode = 'pass' | 'fail' | 'decree';

const RESULT_STYLES: Record<ResultMode, { banner: string; icon: string; titleColor: string; title: string }> =
  {
    decree: {
      banner: 'border-orange-600 bg-orange-900/30',
      icon: '📋',
      titleColor: 'text-orange-300',
      title: 'DECRETO DE NECESIDAD Y URGENCIA',
    },
    pass: {
      banner: 'border-emerald-600 bg-emerald-900/20',
      icon: '✅',
      titleColor: 'text-emerald-300',
      title: 'LEY APROBADA',
    },
    fail: {
      banner: 'bg-crimson-900/20 border-crimson-600',
      icon: '❌',
      titleColor: 'text-crimson-300',
      title: 'LEY RECHAZADA',
    },
  };

function anibalQuote(mode: ResultMode, margin: number): string {
  if (mode === 'pass') return `Zafaron por ${margin} votos. La próxima no van a tener tanta suerte.`;
  if (mode === 'fail') return `El gobierno perdió en el Congreso. ¿Alguien avisó al Presidente?`;
  return `Gobernar por decreto. Clásico argentino. Alguien dígale que esto tiene consecuencias.`;
}

function DeltaLine({
  label,
  delta,
  lowerIsBetter = false,
  unit = '',
}: {
  label: string;
  delta: number;
  lowerIsBetter?: boolean | undefined;
  unit?: string | undefined;
}) {
  const good = lowerIsBetter ? delta < 0 : delta > 0;
  const sign = good !== lowerIsBetter ? '+' : '-';
  return (
    <p className={good ? 'text-green-400' : 'text-crimson-400'}>
      {good ? '▲' : '▼'} {label} {sign}
      {Math.abs(delta)}
      {unit}
    </p>
  );
}

function EffectsList({ effects }: { effects: ChoiceEffect }) {
  const lines = [
    { label: 'Popularidad', delta: effects.popularityDelta },
    { label: 'Estabilidad', delta: effects.stabilityDelta },
    { label: 'Mercados', delta: effects.marketConfidenceDelta },
    { label: 'Déficit', delta: effects.deficitDelta, lowerIsBetter: true, unit: '%' },
    { label: 'Reservas', delta: effects.foreignReservesDelta },
  ];
  return (
    <div className="space-y-1">
      {lines.map(({ label, delta, lowerIsBetter, unit }) =>
        delta === undefined ? null : (
          <DeltaLine key={label} label={label} delta={delta} lowerIsBetter={lowerIsBetter} unit={unit} />
        ),
      )}
      {effects.lawsPassedDelta !== undefined && effects.lawsPassedDelta > 0 && (
        <p className="text-green-400">✓ Ley promulgada</p>
      )}
    </div>
  );
}

function VoteSummary({
  mode,
  finalYes,
  total,
  margin,
}: {
  mode: ResultMode;
  finalYes: number;
  total: number;
  margin: number;
}) {
  if (mode === 'decree') {
    return <p className="font-mono text-sm text-orange-400">Promulgada sin votación parlamentaria</p>;
  }
  return (
    <p className="font-mono text-sm text-smoke-400">
      {finalYes} votos a favor — {total - finalYes} en contra
      {mode === 'pass' ? ` — aprobada por ${margin} votos` : ` — faltaron ${margin} para la mayoría`}
    </p>
  );
}

interface ResultPanelProps {
  card: EventCard;
  finalYes: number;
  total: number;
  required: number;
  usedDecree: boolean;
  lawPassed: boolean;
  choiceIndex: number;
  onContinue: () => void;
}

export function ResultPanel({
  card,
  finalYes,
  total,
  required,
  usedDecree,
  lawPassed,
  choiceIndex,
  onContinue,
}: ResultPanelProps) {
  const { t } = useTranslation();
  const margin = Math.abs(finalYes - required);
  const mode: ResultMode = usedDecree ? 'decree' : lawPassed ? 'pass' : 'fail';
  const style = RESULT_STYLES[mode];
  const choice = card.choices[choiceIndex];

  return (
    <m.div
      key="result"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-4"
    >
      <div className={`rounded-xl border-2 p-6 text-center ${style.banner}`}>
        <p className="mb-3 text-4xl">{style.icon}</p>
        <h2 className={`mb-2 font-serif text-2xl font-black ${style.titleColor}`}>{style.title}</h2>
        <p className="mb-1 font-serif text-lg text-smoke-100">{t(card.titleKey)}</p>
        <VoteSummary mode={mode} finalYes={finalYes} total={total} margin={margin} />
      </div>

      <div className="rounded-lg border border-navy-600 bg-navy-800 px-4 py-3">
        <p className="text-smoke-500 mb-2 font-mono text-sm uppercase tracking-widest">
          Consecuencias inmediatas
        </p>
        <div className="text-smoke-300 font-mono text-sm">
          {choice && <EffectsList effects={choice.effects} />}
        </div>
      </div>

      <div className="flex items-start gap-2 rounded border border-navy-700 bg-navy-800/60 px-4 py-3">
        <span className="mt-0.5 shrink-0 font-mono text-xs text-gold-500">📻</span>
        <p className="font-mono text-xs italic text-smoke-400">
          "{anibalQuote(mode, margin)}" —{' '}
          <span className="text-smoke-500">El Gordo Aníbal, Radio AM 1010</span>
        </p>
      </div>

      <button
        onClick={onContinue}
        className={`w-full rounded-md px-6 py-3 font-serif font-bold uppercase tracking-wider transition-colors ${
          mode === 'fail'
            ? 'border border-navy-500 bg-navy-700 text-smoke-200 hover:bg-navy-600'
            : 'bg-gold-500 text-navy-900 hover:bg-gold-400'
        }`}
      >
        Continuar con el gobierno →
      </button>
    </m.div>
  );
}
