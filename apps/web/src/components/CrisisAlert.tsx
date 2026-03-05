import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Crisis } from '@republica/game-engine';

const CRISIS_LABELS: Record<string, string> = {
  debtCrisis: '💸 Crisis de Deuda Soberana',
  hyperinflationSpiral: '📈 Espiral Hiperinflacionaria',
  socialUnrest: '✊ Disturbios Sociales',
  legislativeRebellion: '🏛 Rebelión Legislativa',
  impeachmentAttempt: '⚖ Juicio Político en Curso',
};

interface Props {
  crises: Crisis[];
}

export function CrisisAlert({ crises }: Props) {
  if (crises.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        className="bg-crimson-800 border-2 border-crimson-500 rounded-lg px-4 py-3 animate-pulse"
      >
        <div className="flex items-center gap-2 mb-2">
          <motion.span
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="text-crimson-300 text-lg"
          >
            🚨
          </motion.span>
          <span className="text-crimson-200 font-mono text-xs uppercase tracking-widest font-bold">
            Crisis Activa{crises.length > 1 ? 's' : ''} — Actuá Ya
          </span>
        </div>
        <div className="space-y-2">
          {crises.map((crisis) => {
            const turnsLeft = Math.max(0, crisis.turnsToResolve - crisis.turnsActive);
            const isUrgent = turnsLeft <= 2;
            return (
              <div key={crisis.type} className="bg-crimson-900/60 rounded px-3 py-2">
                <div className="flex justify-between items-center">
                  <span className="text-crimson-200 text-sm font-serif">
                    {CRISIS_LABELS[crisis.type] ?? crisis.type}
                  </span>
                </div>
                <div className={`mt-1 font-mono text-xs font-bold ${isUrgent ? 'text-red-300 animate-pulse' : 'text-gold-400'}`}>
                  TENÉS {turnsLeft} TURNO{turnsLeft !== 1 ? 'S' : ''} PARA RESOLVER ESTO
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
