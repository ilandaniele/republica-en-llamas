import React from 'react';

interface Props {
  title: string;
  isWin?: boolean;
}

export function GameOverNewspaper({ title, isWin = false }: Props) {
  return (
    <svg width="100%" height="180" viewBox="0 0 600 180" xmlns="http://www.w3.org/2000/svg">
      <defs>
        {/* Crumpled paper filter */}
        <filter id="paper-crumple">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="5" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="4" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="paper-shadow">
          <feDropShadow dx="2" dy="3" stdDeviation="4" floodColor="#00000040" />
        </filter>
      </defs>

      {/* Paper background */}
      <rect width="600" height="180" rx="4" fill="#f5f0e8" filter="url(#paper-shadow)" />
      {/* Paper texture lines */}
      {[20, 35, 50, 65, 80, 95, 110, 125, 140, 155, 170].map((y) => (
        <line key={y} x1="0" y1={y} x2="600" y2={y} stroke="#e8e0d0" strokeWidth="0.5" opacity="0.6" />
      ))}
      {/* Slight crumple at edges */}
      <path d="M0,0 Q10,5 0,15" fill="#e8dfd0" opacity="0.5" />
      <path d="M600,0 Q590,8 600,18" fill="#e8dfd0" opacity="0.5" />
      <path d="M0,180 Q12,172 0,162" fill="#e8dfd0" opacity="0.5" />
      <path d="M600,180 Q588,172 600,162" fill="#e8dfd0" opacity="0.5" />

      {/* Masthead */}
      <rect x="0" y="0" width="600" height="32" fill="#1a1a1a" />
      <text x="300" y="20" fontSize="14" fill="#f5f0e8" textAnchor="middle" fontFamily="Georgia, serif" fontWeight="bold" letterSpacing="6">
        LA GACETA DE LA REPÚBLICA
      </text>
      <line x1="0" y1="32" x2="600" y2="32" stroke="#8b7355" strokeWidth="2" />

      {/* Date and edition */}
      <text x="12" y="44" fontSize="8" fill="#666" fontFamily="monospace">
        {new Date().toLocaleDateString('es', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' }).toUpperCase()}
      </text>
      <text x="300" y="44" fontSize="8" fill="#666" textAnchor="middle" fontFamily="monospace">EDICIÓN ESPECIAL · PRECIO: PRICELESS</text>
      <text x="588" y="44" fontSize="8" fill="#666" textAnchor="end" fontFamily="monospace">Nro. 1</text>
      <line x1="0" y1="48" x2="600" y2="48" stroke="#8b7355" strokeWidth="1" />

      {/* Decorative separator lines */}
      <line x1="12" y1="52" x2="588" y2="52" stroke="#1a1a1a" strokeWidth="3" />
      <line x1="12" y1="56" x2="588" y2="56" stroke="#1a1a1a" strokeWidth="1" />

      {/* Headline box */}
      <rect x="12" y="62" width="420" height="95" fill={isWin ? '#e8f5e9' : '#fce4ec'} stroke={isWin ? '#2e7d32' : '#c62828'} strokeWidth="2" rx="2" />
      <text
        x="222"
        y="117"
        fontSize="17"
        fill={isWin ? '#1b5e20' : '#b71c1c'}
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontWeight="bold"
        dominantBaseline="middle"
      >
        {title}
      </text>

      {/* Filler text lines (simulated article) */}
      {[130, 142, 154].map((y) => (
        <rect key={y} x="20" y={y} width={Math.random() * 100 + 300} height="6" rx="2" fill="#bbb" opacity="0.5" />
      ))}

      {/* Fallen president avatar (right side) */}
      <g transform="translate(450, 62)">
        {/* Small figure lying down */}
        <circle cx="70" cy="40" r="20" fill="#ffe0b2" />
        {/* Fallen body */}
        <rect x="30" y="55" width="80" height="25" rx="10" fill="#1a237e" />
        {/* Stars circling head (dazed) */}
        {[0, 120, 240].map((deg, i) => (
          <circle
            key={i}
            cx={70 + 28 * Math.cos((deg * Math.PI) / 180)}
            cy={40 + 28 * Math.sin((deg * Math.PI) / 180)}
            r="4"
            fill="#fdd835"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              values={`${deg} 70 40;${deg + 360} 70 40`}
              dur="2s"
              repeatCount="indefinite"
              additive="sum"
            />
          </circle>
        ))}
        {/* Face */}
        <circle cx="70" cy="38" r="6" fill="#ffb74d" />
        {/* X eyes */}
        <text x="66" y="41" fontSize="8" fill="#333">x</text>
        <text x="72" y="41" fontSize="8" fill="#333">x</text>
      </g>
    </svg>
  );
}
