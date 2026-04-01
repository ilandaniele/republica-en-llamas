import React from 'react';
import { PixelColectivo } from './PixelColectivo.js';

export function BuenosAiresBackground() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.15 }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 800 400"
        preserveAspectRatio="xMidYMid slice"
        width="100%"
        height="100%"
        xmlns="http://www.w3.org/2000/svg"
        style={{ imageRendering: 'pixelated' }}
      >
        {/* ── Night sky gradient ── */}
        <defs>
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#0D1B2A" />
            <stop offset="100%" stopColor="#1a2a4a" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="800" height="400" fill="url(#skyGrad)" />

        {/* ── Stars (2×2px, some blinking) ── */}
        {[
          [60,20,0],[130,35,0.3],[200,15,0.7],[280,40,0.1],[350,22,0.5],
          [420,10,0.9],[500,28,0.2],[570,18,0.6],[650,32,0.4],[720,12,0.8],
          [80,55,0.15],[170,48,0.55],[260,58,0.95],[380,50,0.35],[460,45,0.75],
          [540,60,0.05],[620,52,0.45],[700,42,0.85],[740,30,0.25],[760,65,0.65],
        ].map(([x, y, delay], i) => (
          <rect
            key={i}
            x={x} y={y} width="2" height="2"
            fill="white"
            style={{ animation: `blink-star 2s ease-in-out infinite`, animationDelay: `${delay}s` }}
          />
        ))}

        {/* ── casa rosada (left) ── */}
        {/* Main building */}
        <rect x="20"  y="220" width="160" height="110" fill="#E8A0A0" />
        {/* Upper story */}
        <rect x="30"  y="190" width="140" height="30"  fill="#D08080" />
        {/* Roof cornice */}
        <rect x="20"  y="180" width="160" height="12"  fill="#C06060" />
        {/* Arches ground floor */}
        {[0,1,2,3,4].map((i) => (
          <rect key={i} x={28 + i * 28} y="258" width="16" height="24" fill="#C06060" />
        ))}
        {/* Windows upper */}
        {[0,1,2,3].map((i) => (
          <rect key={i} x={42 + i * 32} y="200" width="12" height="16" fill="#88AACC" />
        ))}
        {/* Argentine flag on top */}
        <rect x="95"  y="148" width="2"   height="34"  fill="#888" />
        <rect x="97"  y="150" width="22"  height="6"   fill="#74ACDF" />
        <rect x="97"  y="156" width="22"  height="6"   fill="#F4F4F0" />
        <rect x="97"  y="162" width="22"  height="6"   fill="#74ACDF" />

        {/* ── obelisco (center-right) ── */}
        {/* Base steps */}
        <rect x="480" y="300" width="40"  height="10"  fill="#DDDDCC" />
        <rect x="486" y="290" width="28"  height="10"  fill="#CCCCBB" />
        <rect x="490" y="280" width="20"  height="10"  fill="#CCCCBB" />
        {/* Shaft */}
        <rect x="494" y="140" width="12"  height="140" fill="#E8E8D8" />
        {/* Tip */}
        <rect x="496" y="128" width="8"   height="14"  fill="#D8D8C8" />
        <rect x="498" y="118" width="4"   height="12"  fill="#C8C8B8" />
        <rect x="499" y="110" width="2"   height="10"  fill="#C0C0B0" />

        {/* ── buildings (background skyline) ── */}
        <rect x="620" y="200" width="60" height="150" fill="#1a2a3a" />
        <rect x="680" y="220" width="50" height="130" fill="#162030" />
        <rect x="730" y="240" width="70" height="110" fill="#1a2a3a" />
        {/* Windows in buildings */}
        {[0,1,2].map((col) =>
          [0,1,2,3,4].map((row) => (
            <rect key={`${col}-${row}`} x={628 + col * 16} y={208 + row * 20} width="8" height="10" fill="#FFEE88" opacity="0.6" />
          ))
        )}
        {/* More buildings left of Obelisco */}
        <rect x="300" y="230" width="80" height="120" fill="#162030" />
        <rect x="380" y="250" width="60" height="100" fill="#1a2a3a" />
        {[0,1].map((col) =>
          [0,1,2,3].map((row) => (
            <rect key={`b${col}-${row}`} x={312 + col * 30} y={240 + row * 22} width="10" height="12" fill="#FFEE88" opacity="0.5" />
          ))
        )}

        {/* ── Asado smoke (right side) ── */}
        {/* Grill */}
        <rect x="740" y="318" width="50" height="20" fill="#333" />
        <rect x="736" y="316" width="58" height="4"  fill="#555" />
        {[0,1,2,3,4].map((i) => (
          <rect key={i} x={740 + i * 10} y="316" width="2" height="20" fill="#555" />
        ))}
        {/* Flames */}
        <rect x="742" y="310" width="6"  height="8"  fill="#FF6600" />
        <rect x="752" y="308" width="6"  height="10" fill="#FF8800" />
        <rect x="762" y="310" width="6"  height="8"  fill="#FF6600" />
        <rect x="772" y="308" width="6"  height="10" fill="#FFAA00" />
        {/* Smoke pixels */}
        {[750,762,774].map((x, i) => (
          <rect
            key={i}
            x={x} y="300" width="4" height="4"
            fill="#AAAAAA" opacity="0.6"
            style={{ animation: 'pixel-rise 2s ease-out infinite', animationDelay: `${i * 0.6}s` }}
          />
        ))}

        {/* ── Mate cup bottom-left ── */}
        <rect x="10"  y="360" width="30" height="20" fill="#8B4513" />
        <rect x="8"   y="356" width="34" height="6"  fill="#6B3410" />
        <rect x="24"  y="340" width="4"  height="22" fill="#A8A8A8" />
        <rect x="22"  y="338" width="8"  height="4"  fill="#C0C0C0" />

        {/* ── Street ── */}
        <rect x="0"   y="370" width="800" height="30" fill="#1a1a1a" />
        {/* Center dashed line */}
        {[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19].map((i) => (
          <rect key={i} x={i * 44} y="384" width="24" height="4" fill="#FFFFFF" opacity="0.5" />
        ))}
      </svg>

      {/* ── Colectivo 60 — CSS translateX loop placed outside SVG ── */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          animation: 'colectivo-move 30s linear infinite',
          willChange: 'transform',
        }}
      >
        <PixelColectivo width={80} height={30} />
      </div>
    </div>
  );
}
