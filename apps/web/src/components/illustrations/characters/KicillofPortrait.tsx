import React from 'react';

interface Props { size?: number }

export function KicillofPortrait({ size = 80 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Axel Kicillof">
      <circle cx="40" cy="40" r="40" fill="#0a1a0a" />
      {/* Body — casual jacket, peronist governor */}
      <ellipse cx="40" cy="80" rx="28" ry="22" fill="#1b5e20" />
      <rect x="33" y="60" width="14" height="18" fill="#eceff1" rx="2" />
      <polygon points="33,62 26,74 33,68" fill="#1b5e20" opacity="0.9" />
      <polygon points="47,62 54,74 47,68" fill="#1b5e20" opacity="0.9" />
      {/* Neck */}
      <rect x="35" y="52" width="10" height="12" fill="#ffcc88" rx="2" />
      {/* Head */}
      <ellipse cx="40" cy="37" rx="20" ry="23" fill="#ffcc88" />
      <ellipse cx="20" cy="39" rx="3.5" ry="5" fill="#ffcc88" />
      <ellipse cx="60" cy="39" rx="3.5" ry="5" fill="#ffcc88" />
      {/* Hair — curly, younger professor look */}
      <path d="M20,27 Q22,12 40,10 Q58,12 60,27 Q56,17 40,15 Q24,17 20,27 Z" fill="#1a0a00" />
      {/* Curly detail */}
      <path d="M60,25 Q64,18 62,12" stroke="#1a0a00" strokeWidth="3" fill="none" />
      <path d="M20,25 Q16,18 18,12" stroke="#1a0a00" strokeWidth="3" fill="none" />
      {/* Eyes */}
      <circle cx="33" cy="37" r="4" fill="white" />
      <circle cx="47" cy="37" r="4" fill="white" />
      <circle cx="33" cy="38" r="2.5" fill="#2c1a0a" />
      <circle cx="47" cy="38" r="2.5" fill="#2c1a0a" />
      <circle cx="34" cy="37" r="0.8" fill="white" />
      <circle cx="48" cy="37" r="0.8" fill="white" />
      {/* Eyebrows — slightly raised, questioning */}
      <path d="M28,30 Q33,26 38,30" stroke="#1a0a00" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M42,30 Q47,26 52,30" stroke="#1a0a00" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      {/* Nose */}
      <path d="M40,42 Q37,48 34,50 Q40,52 46,50 Q43,48 40,42 Z" fill="#dda070" opacity="0.7" />
      {/* Mouth — thoughtful, slight frown */}
      <path d="M33,57 Q40,55 47,57" stroke="#a0522d" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      {/* BsAs province outline small badge */}
      <rect x="58" y="55" width="14" height="10" rx="2" fill="#1b5e20" opacity="0.8" />
      <text x="65" y="62" textAnchor="middle" fontSize="4" fill="#fff">BsAs</text>
      {/* Name */}
      <text x="40" y="76" textAnchor="middle" fontSize="5.5" fill="#ffe082" fontFamily="serif">Kicillof</text>
    </svg>
  );
}
