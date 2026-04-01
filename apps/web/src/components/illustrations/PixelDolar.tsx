import React from 'react';

interface Props {
  floating?: boolean;
  width?: number;
  height?: number;
}

export function PixelDolar({ floating = false, width = 30, height = 40 }: Props) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 30 40"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        imageRendering: 'pixelated',
        display: 'block',
        animation: floating ? 'dolar-float-up 1.5s ease-out forwards' : undefined,
      }}
    >
      {/* Bill background */}
      <rect x="2"  y="6"  width="26" height="28" fill="#2E7D32" />
      <rect x="4"  y="8"  width="22" height="24" fill="#388E3C" />
      {/* Inner border */}
      <rect x="6"  y="10" width="18" height="20" fill="none" stroke="#1B5E20" strokeWidth="1" />
      {/* $ sign — pixel art letters */}
      {/* Center vertical bar */}
      <rect x="14" y="12" width="2" height="16" fill="#1B5E20" />
      {/* Top half of S */}
      <rect x="10" y="12" width="8"  height="2"  fill="#1B5E20" />
      <rect x="10" y="14" width="2"  height="4"  fill="#1B5E20" />
      <rect x="10" y="18" width="8"  height="2"  fill="#1B5E20" />
      {/* Bottom half of S */}
      <rect x="16" y="20" width="2"  height="4"  fill="#1B5E20" />
      <rect x="10" y="24" width="8"  height="2"  fill="#1B5E20" />
      {/* Corner ornaments */}
      <rect x="6"  y="10" width="4"  height="2"  fill="#FFFFFF" opacity="0.3" />
      <rect x="20" y="26" width="4"  height="2"  fill="#FFFFFF" opacity="0.3" />
    </svg>
  );
}
