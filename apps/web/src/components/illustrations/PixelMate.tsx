import React from 'react';

interface Props {
  steaming?: boolean;
  width?: number;
  height?: number;
}

export function PixelMate({ steaming = false, width = 80, height = 100 }: Props) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 80 100"
      xmlns="http://www.w3.org/2000/svg"
      style={{ imageRendering: 'pixelated', display: 'block' }}
    >
      {/* Bombilla straw — tapered top */}
      <rect x="36" y="8"  width="6"  height="4"  fill="#C8C8C8" />
      <rect x="34" y="4"  width="10" height="4"  fill="#D0D0D0" />
      <rect x="32" y="0"  width="14" height="4"  fill="#D8D8D8" />
      {/* Bombilla pipe body */}
      <rect x="36" y="12" width="6"  height="28" fill="#A8A8A8" />
      {/* Bombilla filter bulb at bottom */}
      <rect x="34" y="40" width="10" height="6"  fill="#B8B8B8" />
      <rect x="32" y="44" width="14" height="4"  fill="#A8A8A8" />
      {/* Rim / lip of gourd */}
      <rect x="20" y="36" width="38" height="4"  fill="#A0522D" />
      <rect x="22" y="32" width="34" height="4"  fill="#C8855A" />
      {/* Gourd upper body */}
      <rect x="16" y="40" width="46" height="16" fill="#8B4513" />
      <rect x="14" y="52" width="50" height="4"  fill="#7A3B0F" />
      {/* Gourd belly (widest part) */}
      <rect x="12" y="56" width="54" height="20" fill="#7A3B0F" />
      {/* Gourd lower taper */}
      <rect x="16" y="76" width="46" height="8"  fill="#6B3410" />
      <rect x="22" y="84" width="34" height="6"  fill="#6B3410" />
      <rect x="28" y="90" width="22" height="4"  fill="#5a2a0a" />
      {/* Dark vertical panel line decorations */}
      <rect x="26" y="40" width="3"  height="50" fill="rgba(0,0,0,0.15)" />
      <rect x="50" y="40" width="3"  height="50" fill="rgba(0,0,0,0.15)" />
      {/* Highlight streak */}
      <rect x="18" y="44" width="4"  height="24" fill="rgba(255,255,255,0.18)" />
      {/* Steam particles */}
      {steaming && (
        <>
          <rect x="26" y="0"  width="4" height="4" fill="white" opacity="0.6"
            style={{ animation: 'pixel-rise 1.2s ease-out infinite', animationDelay: '0s' }} />
          <rect x="38" y="0"  width="4" height="4" fill="white" opacity="0.5"
            style={{ animation: 'pixel-rise 1.2s ease-out infinite', animationDelay: '0.4s' }} />
          <rect x="50" y="0"  width="4" height="4" fill="white" opacity="0.4"
            style={{ animation: 'pixel-rise 1.2s ease-out infinite', animationDelay: '0.8s' }} />
        </>
      )}
    </svg>
  );
}
