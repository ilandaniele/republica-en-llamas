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
        className="pixel-border-crisis bg-crimson-800 px-4 py-3 animate-pulse"
      >
        <div className="flex items-center gap-2 mb-2">
          <motion.span
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="text-crimson-300 text-lg"
          >
            🚨
          </motion.span>
          <span
            className="text-crimson-200 uppercase"
            style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '7px' }}
          >
            CRISIS ACTIVA{crises.length > 1 ? 'S' : ''} — ACTUA YA
          </span>
        </div>
        <div className="space-y-2">
          {crises.map((crisis) => {
            const turnsLeft = Math.max(0, crisis.turnsToResolve - crisis.turnsActive);
            const isUrgent = turnsLeft <= 2;
            return (
              <div key={crisis.type} className="bg-crimson-900/60 px-3 py-2" style={{ border: '1px solid var(--crisis-dark)' }}>
                <div className="flex justify-between items-center">
                  <span style={{ fontFamily: "'VT323', monospace", fontSize: '16px' }} className="text-crimson-200">
                    {CRISIS_LABELS[crisis.type] ?? crisis.type}
                  </span>
                </div>
                <div
                  className={`mt-1 font-bold ${isUrgent ? 'text-red-300 animate-pulse' : 'text-gold-400'}`}
                  style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '6px' }}
                >
                  TENES {turnsLeft} TURNO{turnsLeft !== 1 ? 'S' : ''} PARA RESOLVERLO
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
