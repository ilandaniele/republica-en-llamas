import React from 'react';

interface Props {
  steaming?: boolean;
  width?: number;
  height?: number;
}

export function PixelMate({ steaming = false, width = 40, height = 50 }: Props) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 40 50"
      xmlns="http://www.w3.org/2000/svg"
      style={{ imageRendering: 'pixelated', display: 'block' }}
    >
      {/* Gourd body — pixel stack */}
      <rect x="12" y="34" width="16" height="2" fill="#8B4513" />
      <rect x="10" y="26" width="20" height="8" fill="#8B4513" />
      <rect x="8"  y="20" width="24" height="6" fill="#6B3410" />
      <rect x="10" y="18" width="20" height="2" fill="#6B3410" />
      <rect x="12" y="16" width="16" height="2" fill="#6B3410" />
      {/* Rim highlight */}
      <rect x="10" y="18" width="20" height="2" fill="#A0522D" />
      {/* Bombilla (straw) */}
      <rect x="19" y="6"  width="3"  height="14" fill="#A8A8A8" />
      <rect x="18" y="4"  width="5"  height="4"  fill="#C0C0C0" />
      <rect x="17" y="2"  width="7"  height="2"  fill="#C0C0C0" />
      {/* Steam particles — shown when steaming */}
      {steaming && (
        <>
          <rect
            x="14" y="0" width="2" height="2" fill="white" opacity="0.6"
            style={{ animation: 'pixel-rise 1.2s ease-out infinite', animationDelay: '0s' }}
          />
          <rect
            x="20" y="0" width="2" height="2" fill="white" opacity="0.5"
            style={{ animation: 'pixel-rise 1.2s ease-out infinite', animationDelay: '0.4s' }}
          />
          <rect
            x="26" y="0" width="2" height="2" fill="white" opacity="0.4"
            style={{ animation: 'pixel-rise 1.2s ease-out infinite', animationDelay: '0.8s' }}
          />
        </>
      )}
    </svg>
  );
}
