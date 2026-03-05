import React from 'react';

interface Props { size?: number }

export function CaputoPortrait({ size = 80 }: Props) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Luis Caputo">
      <circle cx="40" cy="40" r="40" fill="#0d1b2a" />
      {/* Suit */}
      <ellipse cx="40" cy="80" rx="28" ry="22" fill="#1a237e" />
      <rect x="33" y="60" width="14" height="18" fill="#f5f5f5" rx="2" />
      <polygon points="33,62 26,74 33,68" fill="#1a237e" opacity="0.9" />
      <polygon points="47,62 54,74 47,68" fill="#1a237e" opacity="0.9" />
      {/* Neck */}
      <rect x="35" y="52" width="10" height="12" fill="#ffcc88" rx="2" />
      {/* Head */}
      <ellipse cx="40" cy="38" rx="20" ry="24" fill="#ffcc88" />
      <ellipse cx="20" cy="40" rx="4" ry="5" fill="#ffcc88" />
      <ellipse cx="60" cy="40" rx="4" ry="5" fill="#ffcc88" />
      {/* Hair — very neat, dark */}
      <path d="M20,28 Q22,14 40,12 Q58,14 60,28 Q56,18 40,16 Q24,18 20,28 Z" fill="#2c1a0a" />
      {/* Eyes */}
      <circle cx="33" cy="37" r="4" fill="white" />
      <circle cx="47" cy="37" r="4" fill="white" />
      <circle cx="33" cy="38" r="2.5" fill="#333" />
      <circle cx="47" cy="38" r="2.5" fill="#333" />
      <circle cx="34" cy="37" r="0.8" fill="white" />
      <circle cx="48" cy="37" r="0.8" fill="white" />
      {/* Eyebrows */}
      <path d="M28,31 Q33,28 38,31" stroke="#2c1a0a" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M42,31 Q47,28 52,31" stroke="#2c1a0a" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      {/* Nose */}
      <path d="M40,42 Q37,48 34,50 Q40,52 46,50 Q43,48 40,42 Z" fill="#dda070" opacity="0.7" />
      {/* Smile — confident */}
      <path d="M33,56 Q40,62 47,56" stroke="#a0522d" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      {/* Tie */}
      <polygon points="40,62 38,72 40,74 42,72" fill="#c62828" />
      {/* Name */}
      <text x="40" y="76" textAnchor="middle" fontSize="5.5" fill="#ffe082" fontFamily="serif">Caputo</text>
    </svg>
  );
}
