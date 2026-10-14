import React from 'react';
import { m } from 'framer-motion';
import { useGameStore } from '../../stores/gameStore.js';

const CRISIS_INFO: Record<string, { title: string; description: string; icon: string }> = {
  debtCrisis: {
    title: 'Crisis de Deuda Soberana',
    description:
      'Los mercados han cerrado el crédito al país. El déficit es insostenible. Actúa antes de que todo colapse.',
    icon: '💸',
  },
  hyperinflationSpiral: {
    title: 'Espiral Hiperinflacionaria',
    description:
      'Los precios se disparan sin control. La moneda pierde valor hora a hora. La sociedad exige estabilidad.',
    icon: '🔥',
  },
  socialUnrest: {
    title: 'Estallido Social',
    description:
      'Las calles están ardiendo. La paciencia del pueblo se agotó. Cada turno sin resolución empeora la situación.',
    icon: '✊',
  },
  legislativeRebellion: {
    title: 'Rebelión Legislativa',
    description:
      'El Congreso se rebela. No tienes mayoría para gobernar. La parálisis institucional amenaza la democracia.',
    icon: '🏛',
  },
  impeachmentAttempt: {
    title: 'Juicio Político',
    description:
      'La oposición busca destituirte. Tienes pocos turnos para revertir la situación antes de que sea demasiado tarde.',
    icon: '⚖',
  },
};

export default function CrisisScreen() {
  const gameState = useGameStore((s) => s.gameState);
  const dismissCrisisScreen = useGameStore((s) => s.dismissCrisisScreen);

  if (!gameState) return null;

  const activeCrises = gameState.activeCrises;

  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-crimson-900/95 fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-sm"
    >
      <div className="crisis-vignette" />

      <m.div
        initial={{ scale: 0.8, y: 40 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="relative w-full max-w-xl animate-pulse-red rounded-xl border-2 border-crimson-500 bg-navy-900 p-8 shadow-2xl"
      >
        <div className="mb-6 text-center">
          <m.div
            animate={{ rotate: [0, -5, 5, -5, 5, 0] }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-4 text-6xl"
          >
            ⚠
          </m.div>
          <h1 className="text-shadow-crimson font-serif text-3xl font-black text-crimson-400">¡CRISIS!</h1>
          <p className="mt-2 font-mono text-sm text-smoke-400">La situación requiere atención inmediata</p>
        </div>

        <div className="mb-8 space-y-4">
          {activeCrises.map((crisis) => {
            const info = CRISIS_INFO[crisis.type];
            const turnsLeft = crisis.turnsToResolve - crisis.turnsActive;
            return (
              <div key={crisis.type} className="bg-crimson-900/50 rounded-lg border border-crimson-700 p-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{info?.icon ?? '⚠'}</span>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <h3 className="text-crimson-300 font-serif font-bold">{info?.title ?? crisis.type}</h3>
                      <span className="bg-crimson-900 rounded px-2 py-0.5 font-mono text-sm text-crimson-400">
                        {turnsLeft}t
                      </span>
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-smoke-400">{info?.description}</p>
                    {/* Timer bar */}
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-navy-700">
                      <div
                        className="h-full rounded-full bg-crimson-500 transition-all duration-500"
                        style={{
                          width: `${((crisis.turnsToResolve - crisis.turnsActive) / crisis.turnsToResolve) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={dismissCrisisScreen}
          className="w-full rounded-lg bg-crimson-600 py-4 font-serif text-lg font-bold uppercase tracking-wider text-smoke-100 transition-colors hover:bg-crimson-500"
        >
          Afrontar la Crisis →
        </button>
      </m.div>
    </m.div>
  );
}
