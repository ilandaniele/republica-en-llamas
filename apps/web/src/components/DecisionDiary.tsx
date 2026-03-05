import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import type { TurnEvent } from '@republica/game-engine';
import { useGameStore } from '../stores/gameStore.js';

const EFFECT_SUMMARIES: Record<string, (val: number) => string> = {
  popularityDelta: (v) => `Popularidad ${v > 0 ? '+' : ''}${Math.round(v)}%`,
  stabilityDelta: (v) => `Estabilidad ${v > 0 ? '+' : ''}${Math.round(v)}`,
  inflationDelta: (v) => `Inflación ${v > 0 ? '+' : ''}${Math.round(v)}%`,
  marketConfidenceDelta: (v) => `Mercados ${v > 0 ? '+' : ''}${Math.round(v)}`,
  deficitDelta: (v) => `Déficit ${v > 0 ? '+' : ''}${Math.round(v)}`,
  foreignReservesDelta: (v) => `Reservas ${v > 0 ? '+' : ''}${Math.round(v)}`,
};

function formatEffect(effects: TurnEvent['effectsApplied']): string {
  const parts: string[] = [];
  for (const [key, val] of Object.entries(effects)) {
    if (val !== undefined && Math.abs(val as number) >= 1 && key in EFFECT_SUMMARIES) {
      parts.push(EFFECT_SUMMARIES[key]!(val as number));
    }
  }
  return parts.slice(0, 2).join(', ') || 'Sin cambios significativos';
}

function isFatalTurn(event: TurnEvent, fatalTurn: number | null): boolean {
  return event.turn === fatalTurn;
}

interface DiaryEntryProps {
  event: TurnEvent;
  isFatal: boolean;
}

function DiaryEntry({ event, isFatal }: DiaryEntryProps) {
  const effectStr = formatEffect(event.effectsApplied);
  const hasBadEffect =
    (event.effectsApplied.popularityDelta ?? 0) < -10 ||
    (event.effectsApplied.stabilityDelta ?? 0) < -10 ||
    (event.effectsApplied.inflationDelta ?? 0) > 10;

  return (
    <div
      className={`flex gap-3 py-2 border-b border-navy-700/50 text-xs ${
        isFatal ? 'bg-crimson-900/20 border-crimson-800 rounded px-2' : ''
      }`}
    >
      <span className={`font-mono shrink-0 ${isFatal ? 'text-crimson-400 font-bold' : 'text-smoke-600'}`}>
        T{event.turn}
      </span>
      <div className="flex-1">
        <div className={`font-mono ${hasBadEffect ? 'text-gold-400' : 'text-smoke-300'}`}>
          {effectStr}
          {isFatal && <span className="ml-2 text-crimson-400 font-bold text-xs">← DECISIÓN FATAL</span>}
        </div>
        {event.crisisTriggered && (
          <div className="text-crimson-400 font-mono text-xs mt-0.5">⚠ Desencadenó crisis</div>
        )}
        {event.crisisResolved && (
          <div className="text-emerald-400 font-mono text-xs mt-0.5">✓ Crisis resuelta</div>
        )}
      </div>
    </div>
  );
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function DecisionDiary({ isOpen, onClose }: Props) {
  const gameState = useGameStore((s) => s.gameState);

  if (!gameState) return null;

  const history = gameState.history;
  // Find the fatal turn (biggest negative impact)
  const fatalTurn = history.reduce<number | null>((worst, event) => {
    const impact =
      -(event.effectsApplied.popularityDelta ?? 0) +
      -(event.effectsApplied.stabilityDelta ?? 0) +
      (event.effectsApplied.inflationDelta ?? 0);
    const prevImpact = worst !== null
      ? (() => {
          const prev = history.find((e) => e.turn === worst);
          if (!prev) return 0;
          return -(prev.effectsApplied.popularityDelta ?? 0) +
            -(prev.effectsApplied.stabilityDelta ?? 0) +
            (prev.effectsApplied.inflationDelta ?? 0);
        })()
      : 0;
    if (impact > prevImpact) return event.turn;
    return worst;
  }, null);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-navy-900/70"
            onClick={onClose}
          />
          {/* Panel */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed left-0 top-0 bottom-0 z-50 w-80 bg-navy-900 border-r border-navy-600 overflow-hidden flex flex-col"
          >
            <div className="p-4 border-b border-navy-600 flex items-center justify-between">
              <h2 className="font-serif text-gold-400 font-bold text-base">
                📋 Diario de Gestión
              </h2>
              <button
                onClick={onClose}
                className="text-smoke-500 hover:text-smoke-300 font-mono text-sm"
              >
                ✕
              </button>
            </div>
            <div className="p-3">
              <p className="font-mono text-xs text-smoke-500 uppercase tracking-widest">
                Turno actual: {gameState.turn}
              </p>
            </div>
            <div className="flex-1 overflow-y-auto px-4 pb-4">
              {history.length === 0 ? (
                <p className="text-smoke-600 font-mono text-xs italic mt-4">
                  El diario está vacío. Tomá decisiones para ver el registro.
                </p>
              ) : (
                <div>
                  {[...history].reverse().map((event) => (
                    <DiaryEntry
                      key={`${event.turn}-${event.cardId}`}
                      event={event}
                      isFatal={isFatalTurn(event, fatalTurn)}
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
