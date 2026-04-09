import React from 'react';

interface Props {
  width?: number;
  height?: number;
}

export function PixelAsado({ width = 120, height = 80 }: Props) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      style={{ imageRendering: 'pixelated', display: 'block' }}
    >
      {/* Smoke particles — rise above grill */}
      <rect x="24" y="0"  width="4" height="4" fill="#888" opacity="0.45"
        style={{ animation: 'pixel-rise 1.5s ease-out infinite', animationDelay: '0s' }} />
      <rect x="46" y="0"  width="4" height="4" fill="#888" opacity="0.40"
        style={{ animation: 'pixel-rise 1.5s ease-out infinite', animationDelay: '0.35s' }} />
      <rect x="64" y="0"  width="4" height="4" fill="#888" opacity="0.35"
        style={{ animation: 'pixel-rise 1.5s ease-out infinite', animationDelay: '0.7s' }} />
      <rect x="84" y="0"  width="4" height="4" fill="#888" opacity="0.30"
        style={{ animation: 'pixel-rise 1.5s ease-out infinite', animationDelay: '1.05s' }} />
      {/* Meat on grill — choripanes + costillas */}
      <rect x="10" y="22" width="14" height="8"  fill="#8B2E00" />
      <rect x="12" y="24" width="10" height="4"  fill="#A83800" />
      <rect x="28" y="20" width="18" height="10" fill="#7A2200" />
      <rect x="30" y="22" width="14" height="6"  fill="#9B3000" />
      <rect x="50" y="22" width="14" height="8"  fill="#8B2E00" />
      <rect x="68" y="20" width="18" height="10" fill="#7A2200" />
      <rect x="70" y="22" width="14" height="6"  fill="#9B3000" />
      <rect x="88" y="22" width="14" height="8"  fill="#8B2E00" />
      {/* Char marks on meat */}
      <rect x="14" y="24" width="2" height="4" fill="#4A1000" />
      <rect x="34" y="22" width="2" height="6" fill="#4A1000" />
      <rect x="54" y="24" width="2" height="4" fill="#4A1000" />
      <rect x="74" y="22" width="2" height="6" fill="#4A1000" />
      <rect x="92" y="24" width="2" height="4" fill="#4A1000" />
      {/* Grill top bars (horizontal) */}
      <rect x="6"  y="30" width="108" height="4"  fill="#555" />
      <rect x="6"  y="36" width="108" height="4"  fill="#555" />
      {/* Grill vertical bars */}
      {[12,22,32,42,52,62,72,82,92,100].map(x => (
        <rect key={x} x={x} y={28} width={3} height={14} fill="#666" />
      ))}
      {/* Grill body frame */}
      <rect x="4"  y="28" width="112" height="16" fill="#333" opacity="0.5" />
      <rect x="4"  y="28" width="112" height="3"  fill="#444" />
      <rect x="4"  y="41" width="112" height="3"  fill="#444" />
      {/* Fire — 5 columns */}
      <rect x="10" y="14" width="10" height="14" fill="#FF5500" />
      <rect x="10" y="10" width="10" height="6"  fill="#FF7700" />
      <rect x="12" y="8"  width="6"  height="4"  fill="#FFAA00" />
      <rect x="14" y="6"  width="2"  height="2"  fill="#FFDD00" />

      <rect x="28" y="12" width="12" height="16" fill="#FF6600" />
      <rect x="28" y="8"  width="12" height="6"  fill="#FF8800" />
      <rect x="30" y="6"  width="8"  height="4"  fill="#FFAA00" />
      <rect x="32" y="4"  width="4"  height="2"  fill="#FFDD00" />

      <rect x="48" y="14" width="10" height="14" fill="#FF4400" />
      <rect x="48" y="10" width="10" height="6"  fill="#FF7700" />
      <rect x="50" y="8"  width="6"  height="4"  fill="#FFCC00" />

      <rect x="68" y="12" width="12" height="16" fill="#FF6600" />
      <rect x="68" y="8"  width="12" height="6"  fill="#FF8800" />
      <rect x="70" y="6"  width="8"  height="4"  fill="#FFAA00" />
      <rect x="72" y="4"  width="4"  height="2"  fill="#FFDD00" />

      <rect x="88" y="14" width="10" height="14" fill="#FF5500" />
      <rect x="88" y="10" width="10" height="6"  fill="#FF7700" />
      <rect x="90" y="8"  width="6"  height="4"  fill="#FFAA00" />
      {/* Grill body (under fire) */}
      <rect x="4"  y="44" width="112" height="12" fill="#2A2A2A" />
      {/* Side handles */}
      <rect x="0"  y="44" width="6"   height="8"  fill="#333" />
      <rect x="114" y="44" width="6"  height="8"  fill="#333" />
      {/* Grill legs */}
      <rect x="12" y="56" width="6"   height="24" fill="#444" />
      <rect x="28" y="56" width="4"   height="20" fill="#3A3A3A" />
      <rect x="86" y="56" width="4"   height="20" fill="#3A3A3A" />
      <rect x="102" y="56" width="6"  height="24" fill="#444" />
      {/* Leg feet (stabilizer bars) */}
      <rect x="8"  y="76" width="14"  height="4"  fill="#333" />
      <rect x="98" y="76" width="14"  height="4"  fill="#333" />
      {/* Ash tray underneath */}
      <rect x="18" y="56" width="84"  height="6"  fill="#1A1A1A" />
      <rect x="22" y="58" width="76"  height="2"  fill="#555" opacity="0.5" />
    </svg>
  );
}
