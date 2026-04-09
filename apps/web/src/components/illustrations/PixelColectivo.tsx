import React from 'react';

interface Props {
  width?: number;
  height?: number;
  /** If true, applies a continuous translateX loop animation */
  moving?: boolean;
}

export function PixelColectivo({ width = 160, height = 80, moving = false }: Props) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 160 80"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        imageRendering: 'pixelated',
        display: 'block',
        animation: moving ? 'colectivo-move 30s linear infinite' : undefined,
      }}
    >
      {/* Bus body — main red */}
      <rect x="8"   y="12"  width="144" height="52" fill="#CC1100" />
      {/* Yellow stripe mid-body */}
      <rect x="8"   y="36"  width="144" height="8"  fill="#FFD600" />
      {/* Front face (right end) */}
      <rect x="138" y="12"  width="14"  height="52" fill="#AA0D00" />
      {/* Windshield */}
      <rect x="126" y="14"  width="14"  height="20" fill="#88CCFF" />
      {/* Windshield frame */}
      <rect x="124" y="12"  width="18"  height="2"  fill="#880000" />
      <rect x="126" y="34"  width="14"  height="2"  fill="#880000" />
      {/* Side windows — 4 large */}
      <rect x="14"  y="14"  width="20"  height="16" fill="#88CCFF" />
      <rect x="42"  y="14"  width="20"  height="16" fill="#88CCFF" />
      <rect x="70"  y="14"  width="20"  height="16" fill="#88CCFF" />
      <rect x="98"  y="14"  width="20"  height="16" fill="#88CCFF" />
      {/* Window frames */}
      {[14,42,70,98].map(x=>(
        <rect key={x} x={x-2} y={12} width={24} height={2} fill="#880000" />
      ))}
      {/* Passenger silhouettes */}
      <rect x="18"  y="16"  width="8"   height="8"  fill="#0D1B2A" />
      <rect x="46"  y="16"  width="8"   height="8"  fill="#0D1B2A" />
      <rect x="74"  y="16"  width="8"   height="8"  fill="#0D1B2A" />
      <rect x="102" y="16"  width="6"   height="8"  fill="#0D1B2A" />
      {/* Extra passenger detail — heads */}
      <rect x="22"  y="14"  width="4"   height="4"  fill="#D4956A" />
      <rect x="50"  y="14"  width="4"   height="4"  fill="#D4956A" />
      <rect x="78"  y="14"  width="4"   height="4"  fill="#D4956A" />
      {/* Headlights */}
      <rect x="148" y="22"  width="8"   height="8"  fill="#FFEE88" />
      <rect x="148" y="42"  width="8"   height="8"  fill="#FF8800" />
      {/* Door */}
      <rect x="116" y="36"  width="10"  height="28" fill="#AA0D00" />
      <rect x="118" y="36"  width="1"   height="28" fill="rgba(0,0,0,0.3)" />
      {/* Route number */}
      <text x="10" y="50" fontFamily="'Press Start 2P', monospace" fontSize="8" fill="#FFD600">60</text>
      {/* Bumper */}
      <rect x="8"   y="60"  width="144" height="6"  fill="#880000" />
      {/* Undercarriage */}
      <rect x="8"   y="66"  width="144" height="4"  fill="#550000" />
      {/* Wheels — doubled size with hub detail */}
      <rect x="20"  y="64"  width="26"  height="16" fill="#1A1A1A" />
      <rect x="24"  y="66"  width="8"   height="8"  fill="#333" />
      <rect x="28"  y="68"  width="4"   height="4"  fill="#888" />
      {/* Rear wheel */}
      <rect x="112" y="64"  width="26"  height="16" fill="#1A1A1A" />
      <rect x="116" y="66"  width="8"   height="8"  fill="#333" />
      <rect x="120" y="68"  width="4"   height="4"  fill="#888" />
      {/* Exhaust pipe detail */}
      <rect x="8"   y="56"  width="4"   height="8"  fill="#550000" />
      <rect x="4"   y="58"  width="6"   height="4"  fill="#444" />
    </svg>
  );
}
