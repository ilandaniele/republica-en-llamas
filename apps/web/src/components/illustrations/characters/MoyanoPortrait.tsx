import React from 'react';

interface Props { size?: number }

export function MoyanoPortrait({ size = 80 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Pablo Moyano">
      <circle cx="40" cy="40" r="40" fill="#1a0000" />
      {/* Body — union jacket */}
      <ellipse cx="40" cy="80" rx="30" ry="22" fill="#4a0000" />
      <rect x="32" y="60" width="16" height="18" fill="#eceff1" rx="2" />
      <polygon points="32,62 24,74 32,68" fill="#4a0000" opacity="0.9" />
      <polygon points="48,62 56,74 48,68" fill="#4a0000" opacity="0.9" />
      {/* Neck */}
      <rect x="34" y="52" width="12" height="12" fill="#ffcc88" rx="2" />
      {/* Head — larger, rounder */}
      <ellipse cx="40" cy="37" rx="22" ry="25" fill="#ffcc88" />
      <ellipse cx="18" cy="39" rx="4" ry="5" fill="#ffcc88" />
      <ellipse cx="62" cy="39" rx="4" ry="5" fill="#ffcc88" />
      {/* Hair — short, dark */}
      <path d="M18,26 Q22,12 40,10 Q58,12 62,26 Q56,16 40,14 Q24,16 18,26 Z" fill="#1a0a00" />
      {/* Eyebrows — thick, furrowed */}
      <path d="M25,28 Q33,24 40,28" stroke="#1a0a00" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M40,28 Q47,24 55,28" stroke="#1a0a00" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      {/* Eyes — intense */}
      <circle cx="32" cy="36" r="4.5" fill="white" />
      <circle cx="48" cy="36" r="4.5" fill="white" />
      <circle cx="32" cy="37" r="3" fill="#2c1a0a" />
      <circle cx="48" cy="37" r="3" fill="#2c1a0a" />
      {/* Nose — broad */}
      <path d="M40,42 Q36,49 32,51 Q40,53 48,51 Q44,49 40,42 Z" fill="#dda070" opacity="0.7" />
      {/* Mouth — set firmly */}
      <line x1="32" y1="56" x2="48" y2="56" stroke="#a0522d" strokeWidth="2" strokeLinecap="round" />
      {/* Fist emoji */}
      <text x="60" y="48" fontSize="10" opacity="0.8">✊</text>
      {/* Name */}
      <text x="40" y="76" textAnchor="middle" fontSize="5.5" fill="#ffe082" fontFamily="serif">Moyano</text>
    </svg>
  );
}
