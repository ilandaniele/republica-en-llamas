import React from 'react';

type CaricatureState = 'good' | 'regular' | 'bad' | 'crisis';

interface Props {
  state: CaricatureState;
  width?: number;
  height?: number;
}

export function BullrichCaricature({ state, width = 280, height = 320 }: Props) {
  const isGood = state === 'good';
  const isBad = state === 'bad' || state === 'crisis';
  const isCrisis = state === 'crisis';

  const bgColor = isCrisis ? '#1a1a00' : isBad ? '#0d0a00' : '#0d1b2a';
  const faceColor = isBad ? '#ffe0c0' : '#ffcc99';
  const hairColor = '#6d4c41';
  const blazerColor = isBad ? '#4a2800' : '#ffd54f';

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 280 320"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Caricatura de Patricia Bullrich"
    >
      <rect width="280" height="320" fill={bgColor} rx="12" />

      {/* Eagle (PRO symbol) when good */}
      {isGood && (
        <text x="230" y="75" fontSize="22" opacity="0.4">🦅</text>
      )}

      {/* Body / blazer */}
      <ellipse cx="140" cy="295" rx="70" ry="50" fill={blazerColor} />
      {/* Shirt / blouse */}
      <rect x="122" y="238" width="36" height="44" fill="#fff9c4" rx="3" />
      {/* Scarf/lapel detail */}
      <polygon points="122,240 108,262 122,252" fill={blazerColor} opacity="0.9" />
      <polygon points="158,240 172,262 158,252" fill={blazerColor} opacity="0.9" />
      {/* Neck */}
      <rect x="128" y="218" width="24" height="24" fill={faceColor} rx="4" />

      {/* Head */}
      <ellipse cx="140" cy="152" rx="52" ry="58" fill={faceColor} />
      <ellipse cx="88" cy="156" rx="9" ry="12" fill={faceColor} />
      <ellipse cx="192" cy="156" rx="9" ry="12" fill={faceColor} />

      {/* Hair — practical, short-ish style */}
      {isGood ? (
        <path d="M88,132 Q95,98 140,90 Q185,98 192,132 Q185,108 140,103 Q95,108 88,132 Z" fill={hairColor} />
      ) : isBad ? (
        <>
          <path d="M88,132 Q95,98 140,90 Q185,98 192,132 Q185,108 140,103 Q95,108 88,132 Z" fill={hairColor} />
          <path d="M90,125 Q85,112 88,105" stroke={hairColor} strokeWidth="3" fill="none" />
        </>
      ) : (
        <path d="M88,132 Q95,98 140,90 Q185,98 192,132 Q185,108 140,103 Q95,108 88,132 Z" fill={hairColor} />
      )}

      {/* Eyes — sharp, determined */}
      <circle cx="118" cy="152" r="8.5" fill="white" />
      <circle cx="162" cy="152" r="8.5" fill="white" />
      <circle cx="119" cy="153" r="5.5" fill="#3e2723" />
      <circle cx="163" cy="153" r="5.5" fill="#3e2723" />
      <circle cx="121" cy="151" r="1.8" fill="white" />
      <circle cx="165" cy="151" r="1.8" fill="white" />
      {isBad && (
        <>
          <path d="M109,160 Q118,163 127,160" stroke="#c9a882" strokeWidth="1.5" fill="none" />
          <path d="M153,160 Q162,163 171,160" stroke="#c9a882" strokeWidth="1.5" fill="none" />
        </>
      )}

      {/* Eyebrows — firm, stern */}
      <path d={isGood ? "M109,139 Q119,134 128,138" : "M109,138 Q119,132 128,136"} stroke={hairColor} strokeWidth="3" fill="none" strokeLinecap="round" />
      <path d={isGood ? "M152,138 Q162,133 171,139" : "M152,136 Q162,131 171,137"} stroke={hairColor} strokeWidth="3" fill="none" strokeLinecap="round" />

      {/* Nose */}
      <path d="M140,160 Q136,172 130,177 Q138,179 140,177 Q142,179 150,177 Q144,172 140,160 Z" fill="#dda070" opacity="0.8" />

      {/* Mouth — stern straight line or thin smile */}
      {isGood
        ? <path d="M122,194 Q140,204 158,194" stroke="#a0522d" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        : isBad
          ? <path d="M122,196 Q140,190 158,196" stroke="#a0522d" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          : <line x1="122" y1="195" x2="158" y2="195" stroke="#a0522d" strokeWidth="2.5" strokeLinecap="round" />
      }

      {/* Badge / ID card — mano dura prop */}
      {!isBad && (
        <g transform="translate(80, 248)">
          <rect x="0" y="0" width="28" height="20" rx="3" fill="#fff9c4" stroke="#ffd54f" strokeWidth="1.5" />
          <text x="14" y="8" textAnchor="middle" fontSize="5" fill="#555">SEGURIDAD</text>
          <text x="14" y="15" textAnchor="middle" fontSize="5" fill="#333">PATRICIA B.</text>
        </g>
      )}

      {/* Fist raised (good state) */}
      {isGood && (
        <text x="188" y="248" fontSize="22" opacity="0.7">✊</text>
      )}

      {/* Sweat drops when bad */}
      {isBad && (
        <>
          <ellipse cx="95" cy="145" rx="4" ry="6" fill="#4fc3f7" opacity="0.7" />
          <ellipse cx="185" cy="145" rx="4" ry="6" fill="#4fc3f7" opacity="0.7" />
        </>
      )}

      {/* Name label */}
      <text x="140" y="310" textAnchor="middle" fontSize="12" fill="#ffe082" fontFamily="serif" fontWeight="bold">
        Patricia Bullrich
      </text>
    </svg>
  );
}
