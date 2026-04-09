import React from 'react';
import type { GameState } from '@republica/game-engine';

interface Props {
  state: GameState;
  size?: number;
}

// P=4: 30x30 tile grid in 120x120 viewBox
function px4(c: number, r: number, w: number, h: number, fill: string, opacity?: number): React.ReactElement {
  return opacity != null
    ? <rect x={c * 4} y={r * 4} width={w * 4} height={h * 4} fill={fill} opacity={opacity} />
    : <rect x={c * 4} y={r * 4} width={w * 4} height={h * 4} fill={fill} />;
}

export function PresidentAvatar({ state, size = 120 }: Props) {
  const pop       = state.political.popularity;
  const inf       = state.economic.inflation;
  const hasCrisis = state.activeCrises.length > 0;

  const mood = pop > 60 ? 0 : pop >= 30 ? 1 : 2; // 0=happy 1=tired 2=panic

  const SUIT = mood === 0 ? '#1a237e' : mood === 1 ? '#37474f' : '#4a0000';
  const DARK = mood === 0 ? '#0d1545' : mood === 1 ? '#263238' : '#2a0000';
  const SKIN = mood === 2 ? '#ffccbc' : '#ffe0b2';
  const HAIR = '#4a2c0a';
  const TIE  = mood === 2 ? '#cc0000' : '#c62828';
  const BG   = hasCrisis  ? '#7f0000' : '#0d1b2a';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      xmlns="http://www.w3.org/2000/svg"
      style={{ imageRendering: 'pixelated', display: 'block' }}
    >
      {px4(0, 0, 30, 30, BG)}

      {hasCrisis && (
        <>
          {px4( 1,  1, 4, 3, '#444', 0.55)}
          {px4( 4,  3, 3, 2, '#555', 0.40)}
          {px4(22,  1, 4, 3, '#444', 0.55)}
          {px4(25,  2, 3, 3, '#333', 0.35)}
        </>
      )}

      {/* Suit */}
      {px4( 3, 17, 24, 13, SUIT)}
      {px4( 3, 17,  8,  9, DARK)}
      {px4(19, 17,  8,  9, DARK)}
      {px4(11, 17,  8,  8, '#eceff1')}
      {px4(13, 17,  4,  8, TIE)}
      {px4(12, 17,  6,  2, TIE)}

      {/* Neck */}
      {px4(12, 15, 6, 3, SKIN)}

      {/* Head + ears */}
      {px4( 9,  3, 12, 13, SKIN)}
      {px4( 7,  6,  3,  4, SKIN)}
      {px4(20,  6,  3,  4, SKIN)}

      {/* Hair */}
      {mood === 0 && (
        <>
          {px4( 9, 3, 12, 3, HAIR)}
          {px4( 7, 5,  2, 2, HAIR)}
          {px4(21, 5,  2, 2, HAIR)}
        </>
      )}
      {mood === 1 && (
        <>
          {px4( 9, 3, 12, 2, HAIR)}
          {px4(18, 2,  4, 3, HAIR)}
          {px4( 7, 5,  2, 2, HAIR)}
          {px4(21, 5,  2, 2, HAIR)}
        </>
      )}
      {mood === 2 && (
        <>
          {px4( 9, 2, 3, 4, HAIR)}
          {px4(12, 1, 3, 5, HAIR)}
          {px4(15, 2, 3, 4, HAIR)}
          {px4(18, 1, 3, 5, HAIR)}
          {px4( 7, 3, 2, 4, HAIR)}
          {px4(21, 2, 2, 5, HAIR)}
        </>
      )}

      {/* Eyebrows */}
      {mood < 2 ? (
        <>{px4(10, 8, 4, 1, HAIR)}{px4(16, 8, 4, 1, HAIR)}</>
      ) : (
        <>{px4(10, 7, 4, 1, HAIR)}{px4(16, 7, 4, 1, HAIR)}{px4(10, 8, 1, 1, HAIR)}{px4(19, 8, 1, 1, HAIR)}</>
      )}

      {/* Eye whites */}
      {px4(10, 9, 4, 3, '#ffffff')}
      {px4(16, 9, 4, 3, '#ffffff')}
      {mood === 1 && <>{px4(10, 9, 4, 1, SKIN)}{px4(16, 9, 4, 1, SKIN)}</>}

      {/* Pupils */}
      {mood === 0 && (
        <>
          {px4(11, 10, 2, 2, '#1a0a00')}
          {px4(17, 10, 2, 2, '#1a0a00')}
          {px4(12, 10, 1, 1, '#ffffff', 0.7)}
          {px4(18, 10, 1, 1, '#ffffff', 0.7)}
        </>
      )}
      {mood === 1 && (
        <>{px4(11, 11, 2, 2, '#1a0a00')}{px4(17, 11, 2, 2, '#1a0a00')}</>
      )}
      {mood === 2 && (
        <>
          {px4(10,  9, 2, 3, '#1a0a00')}
          {px4(17,  9, 2, 3, '#1a0a00')}
          {px4(12, 10, 1, 1, '#cc0000', 0.55)}
          {px4(18, 10, 1, 1, '#cc0000', 0.55)}
        </>
      )}

      {/* Nose */}
      {px4(14, 12, 2, 3, '#cc8855')}

      {/* Mouth */}
      {mood === 0 && (
        <>{px4(11, 15, 1, 1, '#a0522d')}{px4(12, 14, 5, 1, '#a0522d')}{px4(17, 15, 1, 1, '#a0522d')}</>
      )}
      {mood === 1 && px4(11, 15, 8, 1, '#a0522d')}
      {mood === 2 && (
        <>{px4(11, 14, 1, 1, '#a0522d')}{px4(12, 15, 5, 1, '#a0522d')}{px4(17, 14, 1, 1, '#a0522d')}</>
      )}

      {/* Floating money at high inflation */}
      {inf > 50 && (
        <g className="gsap-primary">
          {px4( 1,  7, 4, 2, '#4caf50')}
          {px4( 2,  8, 2, 1, '#1b5e20')}
          {px4(24,  8, 4, 2, '#4caf50')}
          {px4(25,  9, 2, 1, '#1b5e20')}
          {px4( 0, 12, 3, 2, '#81c784', 0.7)}
          {px4(26, 13, 3, 2, '#81c784', 0.7)}
        </g>
      )}
    </svg>
  );
}
