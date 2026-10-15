import { useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import type { EventCard, GameState, CongressActionId } from '@republica/game-engine';
import { NEG_ACTIONS } from './congressData.js';

interface NegotiationPanelProps {
  card: EventCard;
  congress: GameState['congress'];
  projectedYes: number;
  projectedNo: number;
  required: number;
  actionPoints: number;
  actionsUsed: CongressActionId[];
  onAction: (action: (typeof NEG_ACTIONS)[number]) => void;
  onVote: () => void;
}

export function NegotiationPanel({
  card,
  congress,
  projectedYes,
  projectedNo,
  required,
  actionPoints,
  actionsUsed,
  onAction,
  onVote,
}: NegotiationPanelProps) {
  const { t } = useTranslation();
  const [hoveredAction, setHoveredAction] = useState<string | null>(null);

  return (
    <m.div
      key="negotiation"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-4"
    >
      {/* Header */}
      <div className="text-center">
        <p className="text-smoke-500 mb-1 font-mono text-xs uppercase tracking-widest">
          Sesión ordinaria del Congreso
        </p>
        <h2 className="font-serif text-xl font-bold text-smoke-100">{t(card.titleKey)}</h2>
        <p className="mx-auto mt-1 max-w-lg text-sm leading-relaxed text-smoke-400">{t(card.bodyKey)}</p>
      </div>

      {/* Seat count */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="rounded-lg border border-purple-700 bg-purple-900/40 px-3 py-2">
          <p className="font-mono text-xs uppercase text-purple-400">Oficialismo</p>
          <p className="font-mono text-lg font-bold text-purple-200">{congress.governmentSeats}</p>
        </div>
        <div className="rounded-lg border border-navy-600 bg-navy-800 px-3 py-2">
          <p className="text-smoke-500 font-mono text-xs uppercase">Independientes</p>
          <p className="font-mono text-lg font-bold text-smoke-200">{congress.independentSeats}</p>
        </div>
        <div className="rounded-lg border border-blue-700 bg-blue-900/40 px-3 py-2">
          <p className="font-mono text-xs uppercase text-blue-400">Oposición</p>
          <p className="font-mono text-lg font-bold text-blue-200">{congress.oppositionSeats}</p>
        </div>
      </div>

      {/* Projected votes */}
      <div className="rounded-lg border border-navy-600 bg-navy-800 px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-smoke-500 font-mono text-xs">Proyección actual</span>
            <p className="font-mono font-bold text-smoke-100">
              <span className="text-emerald-400">{projectedYes} SÍ</span>
              <span className="mx-2 text-smoke-600">|</span>
              <span className="text-crimson-400">{projectedNo} NO</span>
            </p>
          </div>
          <div className="text-right">
            <span className="text-smoke-500 font-mono text-xs">Se necesitan</span>
            <p className="font-mono text-lg font-bold text-gold-400">{required}</p>
          </div>
        </div>
        {projectedYes >= required ? (
          <p className="mt-1 font-mono text-xs text-emerald-400">✓ Con votos suficientes para pasar</p>
        ) : (
          <p className="mt-1 font-mono text-xs text-crimson-400">
            ⚠ Faltan {required - projectedYes} votos para la mayoría
          </p>
        )}
      </div>

      {/* Action points */}
      <div className="flex items-center gap-2">
        <span className="text-smoke-500 font-mono text-xs">Acciones disponibles:</span>
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className={`h-3 w-3 rounded-full border ${i < actionPoints ? 'border-gold-300 bg-gold-400' : 'border-navy-600 bg-navy-700'}`}
          />
        ))}
        <span className="text-smoke-500 ml-1 font-mono text-xs">({actionPoints} restantes)</span>
      </div>

      {/* Negotiation buttons */}
      <div className="space-y-2">
        {NEG_ACTIONS.map((action) => {
          const used = actionsUsed.includes(action.id);
          const canUse = !used && (action.isDecree || actionPoints > 0);
          const isHovered = hoveredAction === action.id;

          return (
            <m.button
              key={action.id}
              onClick={() => onAction(action)}
              onMouseEnter={() => setHoveredAction(action.id)}
              onMouseLeave={() => setHoveredAction(null)}
              disabled={!canUse}
              className={`w-full rounded-lg border px-4 py-3 text-left transition-all duration-150 ${
                used
                  ? 'cursor-not-allowed border-navy-700 bg-navy-800/40 opacity-40'
                  : action.isDecree
                    ? 'bg-crimson-900/30 hover:bg-crimson-900/50 cursor-pointer border-crimson-700'
                    : 'cursor-pointer border-navy-600 bg-navy-800 hover:border-gold-500 hover:bg-navy-700'
              } ${!canUse && !used ? 'cursor-not-allowed opacity-50' : ''}`}
              whileHover={canUse ? { x: 2 } : {}}
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 shrink-0 text-lg">{action.icon}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`font-mono text-sm font-bold ${used ? 'text-smoke-600 line-through' : action.isDecree ? 'text-crimson-300' : 'text-smoke-200'}`}
                    >
                      {action.label}
                    </span>
                    {!action.isDecree && !used && (
                      <span className="shrink-0 font-mono text-xs text-emerald-400">
                        +{action.voteRange[0]}–{action.voteRange[1]} votos
                      </span>
                    )}
                    {used && <span className="font-mono text-xs text-smoke-600">Utilizada</span>}
                  </div>
                  <AnimatePresence>
                    {isHovered && !used && (
                      <m.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="mt-1 text-xs text-smoke-400">{action.preview}</p>
                        <p className="mt-0.5 font-mono text-xs text-crimson-400">Costo: {action.costLabel}</p>
                      </m.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </m.button>
          );
        })}
      </div>

      {/* Go to vote button */}
      <button
        onClick={onVote}
        className="w-full rounded-md bg-gold-500 px-6 py-3 font-serif font-bold uppercase tracking-wider text-navy-900 transition-colors hover:bg-gold-400"
      >
        🏛 Llamar a votar →
      </button>
    </m.div>
  );
}
