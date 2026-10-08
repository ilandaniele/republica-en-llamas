import React from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../stores/gameStore.js';

const TUTORIAL_STEPS = [
  {
    title: 'Bienvenido a República en Llamas',
    body: 'Eres el presidente. Cada turno recibirás una situación crítica y deberás tomar una decisión que afectará el destino de la nación.',
    target: null,
  },
  {
    title: 'Panel de Variables',
    body: 'A la izquierda verás el estado de la república: popularidad, estabilidad social, inflación y más. Mantén el equilibrio.',
    target: 'variables',
  },
  {
    title: 'Cartas de Evento',
    body: 'En el centro aparece el evento del turno. Lee la situación con cuidado antes de decidir. Las consecuencias son reales.',
    target: 'card',
  },
  {
    title: 'Congreso',
    body: 'Algunas decisiones requieren votación. Si no tienes mayoría, puedes negociar: pactos políticos, concesiones presupuestarias o decretos de emergencia.',
    target: 'congress',
  },
  {
    title: 'Crisis',
    body: 'Cuando los indicadores colapsan, se desatan crisis que tienen un tiempo límite para resolverse. ¡Ignóralas y el juego termina!',
    target: 'crisis',
  },
];

export function TutorialOverlay() {
  const tutorialComplete = useGameStore((s) => s.tutorialComplete);
  const tutorialStep = useGameStore((s) => s.tutorialStep);
  const completeTutorialStep = useGameStore((s) => s.completeTutorialStep);
  const completeTutorial = useGameStore((s) => s.completeTutorial);

  if (tutorialComplete) return null;

  const step = TUTORIAL_STEPS[tutorialStep];
  if (!step) return null;

  const isLast = tutorialStep === TUTORIAL_STEPS.length - 1;

  return (
    <AnimatePresence>
      <m.div
        key={tutorialStep}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        onClick={(e) => e.target === e.currentTarget && completeTutorialStep()}
      >
        <div className="pixel-border glow-celeste mx-4 max-w-md bg-navy-800 p-8 shadow-2xl">
          <div
            style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '6px' }}
            className="mb-3 uppercase text-gold-400"
          >
            TUTORIAL {tutorialStep + 1}/{TUTORIAL_STEPS.length}
          </div>
          <h2
            style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '8px', lineHeight: '1.8' }}
            className="mb-3 text-smoke-100"
          >
            {step.title}
          </h2>
          <p
            style={{ fontFamily: "'VT323', monospace", fontSize: '18px' }}
            className="text-smoke-300 mb-6 leading-relaxed"
          >
            {step.body}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              {TUTORIAL_STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`h-2 w-2 rounded-full ${i <= tutorialStep ? 'bg-gold-400' : 'bg-navy-600'}`}
                />
              ))}
            </div>
            <button
              onClick={isLast ? completeTutorial : completeTutorialStep}
              className="pixel-border-gold bg-gold-500 px-6 py-2 font-bold text-navy-900 transition-colors hover:bg-gold-400"
              style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '7px' }}
            >
              {isLast ? 'COMENZAR' : 'SIGUIENTE ▶'}
            </button>
          </div>
        </div>
      </m.div>
    </AnimatePresence>
  );
}
