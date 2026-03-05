import React from 'react';

interface Props { size?: number }

export function CristinaPPortrait({ size = 80 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Cristina Pérez">
      <circle cx="40" cy="40" r="40" fill="#0d1b2a" />
      {/* Body */}
      <ellipse cx="40" cy="80" rx="28" ry="22" fill="#1b1b3a" />
      <rect x="33" y="60" width="14" height="18" fill="#fff8e1" rx="2" />
      <polygon points="33,62 26,74 33,68" fill="#1b1b3a" opacity="0.9" />
      <polygon points="47,62 54,74 47,68" fill="#1b1b3a" opacity="0.9" />
      {/* Neck */}
      <rect x="35" y="52" width="10" height="12" fill="#ffcc88" rx="2" />
      {/* Head */}
      <ellipse cx="40" cy="37" rx="20" ry="23" fill="#ffcc88" />
      <ellipse cx="20" cy="39" rx="3.5" ry="5" fill="#ffcc88" />
      <ellipse cx="60" cy="39" rx="3.5" ry="5" fill="#ffcc88" />
      {/* Hair — styled, broadcast-ready */}
      <path d="M20,28 Q22,12 40,11 Q58,12 60,28 Q56,18 40,16 Q24,18 20,28 Z" fill="#3e1a00" />
      {/* Slight wave on the side */}
      <path d="M20,28 Q16,38 18,48" stroke="#3e1a00" strokeWidth="4" fill="none" />
      {/* Eyes — sharp, professional */}
      <circle cx="33" cy="37" r="4" fill="white" />
      <circle cx="47" cy="37" r="4" fill="white" />
      <circle cx="33" cy="38" r="2.5" fill="#2c1a0a" />
      <circle cx="47" cy="38" r="2.5" fill="#2c1a0a" />
      <circle cx="34" cy="37" r="0.8" fill="white" />
      <circle cx="48" cy="37" r="0.8" fill="white" />
      {/* Eyebrows — elegant */}
      <path d="M28,31 Q33,27 38,30" stroke="#3e1a00" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M42,30 Q47,27 52,31" stroke="#3e1a00" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      {/* Nose */}
      <path d="M40,42 Q37,48 34,50 Q40,52 46,50 Q43,48 40,42 Z" fill="#dda070" opacity="0.7" />
      {/* Mouth */}
      <path d="M33,56 Q40,61 47,56" stroke="#c62828" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      {/* Microphone in hand */}
      <g transform="translate(54, 58)">
        <rect x="0" y="0" width="3" height="12" rx="1.5" fill="#888" />
        <circle cx="1.5" cy="-3" r="4" fill="#666" />
      </g>
      {/* Name */}
      <text x="40" y="76" textAnchor="middle" fontSize="5.5" fill="#ffe082" fontFamily="serif">C. Pérez</text>
    </svg>
  );
}
