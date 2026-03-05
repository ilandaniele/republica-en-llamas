import React from 'react';

interface Props { size?: number }

export function KristalinaPortrait({ size = 80 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Kristalina Georgieva">
      <circle cx="40" cy="40" r="40" fill="#0a0d1a" />
      {/* Body — formal IMF suit */}
      <ellipse cx="40" cy="80" rx="28" ry="22" fill="#1a237e" />
      <rect x="33" y="60" width="14" height="18" fill="#e8eaf6" rx="2" />
      <polygon points="33,62 26,74 33,68" fill="#1a237e" opacity="0.9" />
      <polygon points="47,62 54,74 47,68" fill="#1a237e" opacity="0.9" />
      {/* IMF badge */}
      <rect x="26" y="64" width="14" height="10" rx="2" fill="#fff" opacity="0.8" />
      <text x="33" y="70" textAnchor="middle" fontSize="4" fill="#1a237e">FMI</text>
      {/* Neck */}
      <rect x="35" y="52" width="10" height="12" fill="#ffe0c0" rx="2" />
      {/* Head */}
      <ellipse cx="40" cy="37" rx="20" ry="23" fill="#ffe0c0" />
      <ellipse cx="20" cy="39" rx="3.5" ry="5" fill="#ffe0c0" />
      <ellipse cx="60" cy="39" rx="3.5" ry="5" fill="#ffe0c0" />
      {/* Hair — silver-grey, authoritative */}
      <path d="M20,27 Q22,12 40,10 Q58,12 60,27 Q56,17 40,15 Q24,17 20,27 Z" fill="#9e9e9e" />
      {/* Eyes — controlled, analytical */}
      <circle cx="33" cy="37" r="4" fill="white" />
      <circle cx="47" cy="37" r="4" fill="white" />
      <circle cx="33" cy="38" r="2.5" fill="#4a2c0a" />
      <circle cx="47" cy="38" r="2.5" fill="#4a2c0a" />
      <circle cx="34" cy="37" r="0.8" fill="white" />
      <circle cx="48" cy="37" r="0.8" fill="white" />
      {/* Eyebrows */}
      <path d="M28,31 Q33,27 38,30" stroke="#9e9e9e" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M42,30 Q47,27 52,31" stroke="#9e9e9e" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      {/* Nose */}
      <path d="M40,42 Q37,48 34,50 Q40,52 46,50 Q43,48 40,42 Z" fill="#cca882" opacity="0.7" />
      {/* Mouth — measured */}
      <line x1="32" y1="56" x2="48" y2="56" stroke="#a08060" strokeWidth="1.8" strokeLinecap="round" />
      {/* Reading glasses */}
      <circle cx="33" cy="37" r="5" fill="none" stroke="#888" strokeWidth="1" />
      <circle cx="47" cy="37" r="5" fill="none" stroke="#888" strokeWidth="1" />
      <line x1="38" y1="37" x2="42" y2="37" stroke="#888" strokeWidth="1" />
      {/* Name */}
      <text x="40" y="76" textAnchor="middle" fontSize="5.5" fill="#ffe082" fontFamily="serif">Kristalina</text>
    </svg>
  );
}
