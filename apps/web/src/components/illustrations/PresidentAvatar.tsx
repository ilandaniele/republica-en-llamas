import React from 'react';
import type { GameState } from '@republica/game-engine';

interface Props {
  state: GameState;
  size?: number;
}

export function PresidentAvatar({ state, size = 120 }: Props) {
  const pop = state.political.popularity;
  const inf = state.economic.inflation;
  const hasCrisis = state.activeCrises.length > 0;

  // Mood: 0=happy, 1=tired, 2=panic
  const mood = pop > 60 ? 0 : pop >= 30 ? 1 : 2;

  // Colors
  const suitColor = mood === 0 ? '#1a237e' : mood === 1 ? '#37474f' : '#4a0000';
  const faceColor = mood === 2 ? '#ffccbc' : '#ffe0b2';
  const bgColor = hasCrisis ? '#7f0000' : '#0d1b2a';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      xmlns="http://www.w3.org/2000/svg"
      style={{ borderRadius: '50%' }}
    >
      {/* Background */}
      <circle cx="60" cy="60" r="60" fill={bgColor} />
      {hasCrisis && (
        <>
          {/* Smoke */}
          <ellipse cx="30" cy="20" rx="8" ry="6" fill="#555" opacity="0.5">
            <animateTransform attributeName="transform" type="translate" values="0,0;-2,-8;0,0" dur="3s" repeatCount="indefinite" />
          </ellipse>
          <ellipse cx="90" cy="25" rx="6" ry="5" fill="#555" opacity="0.4">
            <animateTransform attributeName="transform" type="translate" values="0,0;3,-6;0,0" dur="2.5s" repeatCount="indefinite" />
          </ellipse>
        </>
      )}

      {/* Body / suit */}
      <ellipse cx="60" cy="110" rx="32" ry="28" fill={suitColor} />
      {/* Shirt */}
      <rect x="52" y="82" width="16" height="20" fill="#eceff1" rx="2" />
      {/* Tie */}
      <polygon points="60,84 57,100 60,104 63,100" fill={mood === 2 ? '#cc0000' : '#c62828'} opacity={mood === 2 ? 0.6 : 1} />
      {/* Jacket lapels */}
      <polygon points="52,82 44,95 52,90" fill={suitColor} stroke="#000" strokeWidth="0.5" opacity="0.8" />
      <polygon points="68,82 76,95 68,90" fill={suitColor} stroke="#000" strokeWidth="0.5" opacity="0.8" />

      {/* Neck */}
      <rect x="54" y="70" width="12" height="14" fill={faceColor} rx="3" />

      {/* Head */}
      <ellipse cx="60" cy="55" rx="22" ry="26" fill={faceColor} />

      {/* Ears */}
      <ellipse cx="38" cy="56" rx="5" ry="7" fill={faceColor} />
      <ellipse cx="82" cy="56" rx="5" ry="7" fill={faceColor} />

      {/* Hair */}
      {mood === 0 && (
        /* Neat hair */
        <path d="M38,38 Q60,22 82,38 Q80,30 60,26 Q40,30 38,38 Z" fill="#4a2c0a" />
      )}
      {mood === 1 && (
        /* Slightly messy */
        <>
          <path d="M38,38 Q60,22 82,38 Q80,30 60,26 Q40,30 38,38 Z" fill="#4a2c0a" />
          <path d="M75,30 Q80,24 82,28" stroke="#4a2c0a" strokeWidth="3" fill="none" />
        </>
      )}
      {mood === 2 && (
        /* Wild hair */
        <>
          <path d="M38,40 Q60,20 82,40 Q78,28 60,24 Q42,28 38,40 Z" fill="#4a2c0a" />
          <path d="M40,36 Q35,25 38,22" stroke="#4a2c0a" strokeWidth="3" fill="none" />
          <path d="M80,36 Q85,25 82,22" stroke="#4a2c0a" strokeWidth="3" fill="none" />
          <path d="M60,30 Q58,18 62,16" stroke="#4a2c0a" strokeWidth="3" fill="none" />
        </>
      )}

      {/* Eyes */}
      {mood === 0 && (
        <>
          <circle cx="52" cy="55" r="4" fill="white" />
          <circle cx="68" cy="55" r="4" fill="white" />
          <circle cx="53" cy="55" r="2.5" fill="#333" />
          <circle cx="69" cy="55" r="2.5" fill="#333" />
          {/* Happy sparkle */}
          <circle cx="54" cy="54" r="0.8" fill="white" />
          <circle cx="70" cy="54" r="0.8" fill="white" />
        </>
      )}
      {mood === 1 && (
        <>
          <circle cx="52" cy="55" r="4" fill="white" />
          <circle cx="68" cy="55" r="4" fill="white" />
          <circle cx="53" cy="56" r="2.5" fill="#333" />
          <circle cx="69" cy="56" r="2.5" fill="#333" />
          {/* Bags under eyes */}
          <path d="M48,60 Q52,62 56,60" stroke="#c9a882" strokeWidth="1.5" fill="none" />
          <path d="M64,60 Q68,62 72,60" stroke="#c9a882" strokeWidth="1.5" fill="none" />
        </>
      )}
      {mood === 2 && (
        <>
          <circle cx="52" cy="55" r="4" fill="white" />
          <circle cx="68" cy="55" r="4" fill="white" />
          <circle cx="52" cy="56" r="2.8" fill="#333" />
          <circle cx="68" cy="56" r="2.8" fill="#333" />
          {/* Panic spiral */}
          <circle cx="53" cy="55" r="1" fill="red" opacity="0.6" />
          <circle cx="69" cy="55" r="1" fill="red" opacity="0.6" />
        </>
      )}

      {/* Mouth */}
      {mood === 0 && <path d="M52,68 Q60,74 68,68" stroke="#a0522d" strokeWidth="2" fill="none" strokeLinecap="round" />}
      {mood === 1 && <path d="M52,68 Q60,70 68,68" stroke="#a0522d" strokeWidth="2" fill="none" strokeLinecap="round" />}
      {mood === 2 && <path d="M52,70 Q60,65 68,70" stroke="#a0522d" strokeWidth="2" fill="none" strokeLinecap="round" />}

      {/* Torn suit mark for panic */}
      {mood === 2 && (
        <path d="M44,88 L48,96 L44,94" stroke="#000" strokeWidth="1" fill="none" opacity="0.5" />
      )}

      {/* Loose tie for panic */}
      {mood === 2 && (
        <path d="M60,84 Q65,92 62,100" stroke="#cc0000" strokeWidth="2" fill="none" opacity="0.7" />
      )}

      {/* Money bills flying when high inflation */}
      {inf > 50 && (
        <>
          <rect x="20" y="35" width="14" height="8" rx="2" fill="#4caf50" opacity="0.8" stroke="#2e7d32" strokeWidth="0.5">
            <animateTransform attributeName="transform" type="translate" values="0,0;-5,-10;0,0" dur="2s" repeatCount="indefinite" />
          </rect>
          <text x="22" y="42" fontSize="5" fill="#1b5e20">$$$</text>
          <rect x="88" y="40" width="12" height="7" rx="2" fill="#4caf50" opacity="0.8" stroke="#2e7d32" strokeWidth="0.5">
            <animateTransform attributeName="transform" type="translate" values="0,0;4,-8;0,0" dur="1.7s" repeatCount="indefinite" />
          </rect>
          <text x="90" y="46" fontSize="5" fill="#1b5e20">$$</text>
        </>
      )}
    </svg>
  );
}
