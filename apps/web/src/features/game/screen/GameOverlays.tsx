import { m, AnimatePresence } from 'framer-motion';
import type { GameState } from '@republica/game-engine';
import { PixelDolar } from '../../../components/illustrations/PixelDolar.js';

export function MilestoneToast({ message: milestoneToast }: { message: string | null }) {
  return (
    <AnimatePresence>
      {milestoneToast && (
        <m.div
          key="milestone-toast"
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          className="pixel-border-gold fixed left-1/2 top-4 z-50 bg-navy-900 px-4 py-3 text-center text-gold-400"
          style={{
            transform: 'translateX(-50%)',
            fontFamily: "'Press Start 2P', monospace",
            fontSize: '7px',
            maxWidth: '80vw',
          }}
        >
          ⭐ {milestoneToast}
        </m.div>
      )}
    </AnimatePresence>
  );
}

interface EasterEggOverlaysProps {
  showDolarFloat: boolean;
  showCrowd: boolean;
  showConfetti: boolean;
}

export function EasterEggOverlays({ showDolarFloat, showCrowd, showConfetti }: EasterEggOverlaysProps) {
  return (
    <>
      {showDolarFloat && (
        <div className="pointer-events-none fixed inset-0 z-40 flex items-center justify-center">
          <PixelDolar floating />
        </div>
      )}
      {showCrowd && (
        <div className="pointer-events-none fixed bottom-0 left-0 right-0 z-40 flex items-end justify-around pb-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="pixel-crowd-torches h-8 w-2 bg-orange-500"
              style={{ animationDelay: `${i * 0.12}s` }}
            />
          ))}
        </div>
      )}
      {showConfetti && (
        <div className="pointer-events-none fixed inset-0 z-40">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="pixel-confetti-piece absolute"
              style={{
                left: `${5 + i * 9}%`,
                top: `${15 + (i % 4) * 8}%`,
                background: i % 2 === 0 ? 'var(--celeste)' : 'white',
                animationDelay: `${i * 0.08}s`,
              }}
            />
          ))}
        </div>
      )}
    </>
  );
}

export function ActiveShocks({ shocks }: { shocks: GameState['activeShocks'] }) {
  if (shocks.length === 0) return null;
  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {shocks.map((shock) => (
        <span
          key={shock.id}
          className="pixel-border bg-orange-900/50 px-3 py-1 font-mono text-xs text-orange-300"
        >
          ⚡ {shock.name} ({shock.turnsRemaining} turnos)
        </span>
      ))}
    </div>
  );
}
