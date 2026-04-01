import React from 'react';
import { useGameStore } from '../stores/gameStore.js';
import { getAnibalLine } from '@republica/game-engine';

interface Props {
  /** Override the displayed text instead of pulling from store */
  text?: string;
  /** When true: background flashes between crisis-red and crisis-dark */
  isCrisis?: boolean;
}

export function AnibalTicker({ text, isCrisis = false }: Props) {
  const gameState = useGameStore((s) => s.gameState);
  const displayText = text ?? (gameState ? `📻 Aníbal (AM 1010): "${getAnibalLine(gameState)}"` : '');

  if (!displayText) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-30 flex items-center"
      style={{
        height: '28px',
        background: 'var(--crisis-red)',
        animation: isCrisis ? 'crisis-ticker-flash 1s ease-in-out infinite' : undefined,
        borderTop: '2px solid var(--crisis-dark)',
      }}
    >
      {/* Station badge */}
      <div
        style={{
          background: 'var(--crisis-dark)',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          padding: '0 8px',
          flexShrink: 0,
          borderRight: '2px solid rgba(255,255,255,0.3)',
        }}
      >
        <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '6px', color: 'white' }}>
          📻 AM1010
        </span>
      </div>

      {/* Scrolling text */}
      <div style={{ overflow: 'hidden', flex: 1, height: '100%', display: 'flex', alignItems: 'center' }}>
        <span
          className="ticker-text"
          style={{ animationDuration: `${Math.max(12, displayText.length * 0.18)}s` }}
        >
          {displayText}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          {displayText}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </span>
      </div>
    </div>
  );
}
