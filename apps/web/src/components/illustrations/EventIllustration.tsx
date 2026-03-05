import React from 'react';
import type { GameState } from '@republica/game-engine';

interface Props {
  eventCategory: string;
  presidentId: string;
  eventId?: string;
  gameState?: GameState | null | undefined;
  width?: number;
  height?: number;
}

// ── Retro pixel-art palette ──────────────────────────────────────────────────
const C = {
  bg:        '#0d1b2a',
  navy:      '#1e3a5f',
  navyLt:    '#2a5080',
  skin:      '#e8b88a',
  skinLt:    '#ffe0c0',
  suit:      '#1a237e',
  suitMid:   '#283593',
  shirt:     '#e8e8e8',
  gold:      '#d4af37',
  goldBt:    '#f5d020',
  crimson:   '#cc2222',
  crimsonDk: '#700f0f',
  fireOr:    '#ff4400',
  fireYel:   '#ffd700',
  green:     '#2e7d32',
  greenBt:   '#4caf50',
  gray:      '#546e7a',
  grayLt:    '#78909c',
  hair:      '#1a0a00',
  hairBl:    '#8d6e63',
  white:     '#f0f0f0',
  wall:      '#37474f',
  floor:     '#1c2833',
  smoke:     '#607d8b',
  cream:     '#fff9c4',
  brown:     '#6d4c41',
  pink:      '#f8bbd0',
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const R = (x: number, y: number, w: number, h: number, c: string, rx?: number) => (
  <rect x={x} y={y} width={w} height={h} fill={c} rx={rx} />
);

// Pixel-art suited figure with eyes and tie: head at (x, y), ~40px wide, ~88px tall
function Figure({
  x, y, hair = C.hair, skin = C.skin, suitColor = C.suit,
}: { x: number; y: number; hair?: string; skin?: string; suitColor?: string }) {
  return (
    <g>
      {/* Hair */}
      {R(x + 8,  y,      24,  8, hair)}
      {/* Head */}
      {R(x + 8,  y + 8,  24, 16, skin)}
      {/* Eyes */}
      {R(x + 12, y + 11,  4,  4, '#ffffff')}
      {R(x + 13, y + 12,  2,  2, '#111111')}
      {R(x + 20, y + 11,  4,  4, '#ffffff')}
      {R(x + 21, y + 12,  2,  2, '#111111')}
      {/* Neck */}
      {R(x + 16, y + 24,  8,  8, skin)}
      {/* Shoulders */}
      {R(x,      y + 32, 40,  8, suitColor)}
      {/* Torso */}
      {R(x + 8,  y + 40, 24, 24, suitColor)}
      {/* Shirt */}
      {R(x + 16, y + 40,  8, 16, C.shirt)}
      {/* Tie */}
      {R(x + 18, y + 42,  4, 22, '#8b0000')}
      {/* Arms */}
      {R(x,      y + 40,  8, 24, suitColor)}
      {R(x + 32, y + 40,  8, 24, suitColor)}
      {/* Legs */}
      {R(x + 8,  y + 64,  8, 16, C.gray)}
      {R(x + 24, y + 64,  8, 16, C.gray)}
      {/* Shoes */}
      {R(x + 8,  y + 80,  8,  8, C.hair)}
      {R(x + 24, y + 80,  8,  8, C.hair)}
    </g>
  );
}

// ── Scene: Inflation ──────────────────────────────────────────────────────────
function InflationScene({ presidentId }: { presidentId: string }) {
  const isMilei = presidentId === 'ingeniero';
  const bars = [
    { h: 20, c: C.greenBt },
    { h: 30, c: '#9ccc65' },
    { h: 42, c: C.gold },
    { h: 56, c: '#ff8800' },
    { h: 70, c: C.crimson },
  ];

  return (
    <g>
      {R(0, 0, 320, 136, C.bg)}
      {R(0, 136, 320, 24, C.floor)}
      {R(0, 136, 320, 8, C.wall)}

      {/* Bar chart — left half, baseline y=136 */}
      {bars.map((bar, i) => (
        <rect key={i} x={14 + i * 22} y={136 - bar.h} width={16} height={bar.h} fill={bar.c} />
      ))}
      <rect x={8} y={136} width={126} height={3} fill={C.grayLt} />
      <text x="70" y="126" fontSize="7" fill={C.crimson} textAnchor="middle" fontFamily="monospace">$$$↑↑↑</text>

      {/* Printer machine — right */}
      {R(196, 70, 100, 66, C.gray)}
      {R(204, 78, 84,  8, C.wall)}
      {R(204, 94, 84,  8, C.wall)}
      {R(204, 110, 84,  8, C.wall)}
      {R(224, 62, 48, 12, C.grayLt)}

      {/* Bills flying */}
      {[0, 1, 2, 3].map((i) => (
        <g key={i} transform={`translate(${-i * 12},${-i * 14}) rotate(${-8 + i * 9},248,60)`}>
          <rect x={210 + i * 3} y={40 - i * 8} width={28} height={12} fill={C.green} opacity={0.9 - i * 0.15} />
          <text x={224 + i * 3} y={49 - i * 8} fontSize="7" fill={C.greenBt} textAnchor="middle" fontFamily="monospace">$</text>
        </g>
      ))}

      {/* Caputo (bald) at y=60 */}
      <Figure x={136} y={60} hair={C.skin} skin={C.skin} suitColor={C.suit} />
      {/* Bald override */}
      {R(144, 60, 24, 8, C.skin)}

      {/* Milei chainsaw */}
      {isMilei && (
        <g transform="translate(176,110) rotate(-20)">
          {R(0, 0, 44, 12, C.gray)}
          {R(44, -5, 14, 20, C.grayLt)}
        </g>
      )}

      <rect x="0" y="0" width="220" height="22" fill={C.crimsonDk} opacity="0.92" />
      <text x="8" y="15" fontSize="10" fill={C.goldBt} fontFamily="monospace" fontWeight="bold">INFLACION: EL PESO MUERE</text>
    </g>
  );
}

// ── Scene: Congress ───────────────────────────────────────────────────────────
function CongressScene({ presidentId }: { presidentId: string }) {
  const isMilei = presidentId === 'ingeniero';
  const hairColor = presidentId === 'tecnocrata' ? C.hairBl : C.hair;

  return (
    <g>
      {R(0, 0, 320, 160, '#0a0d1a')}
      {R(0, 0, 320, 22, C.navyLt)}
      <ellipse cx="160" cy="11" rx="76" ry="14" fill={C.suitMid} opacity="0.7" />

      {/* Columns */}
      {[20, 284].map((cx, i) => (
        <g key={i}>
          {R(cx, 22, 16, 138, C.wall)}
          {R(cx - 4, 18, 24, 8, C.grayLt)}
        </g>
      ))}

      {/* Deputies — 3 rows × 5 cols, compressed into y=24–82 */}
      {[0, 1, 2].map((row) =>
        [0, 1, 2, 3, 4].map((col) => {
          const dx = 52 + col * 44;
          const dy = 24 + row * 20;
          const depColor = (col + row) % 2 === 0 ? C.suit : C.crimson;
          return (
            <g key={`${row}-${col}`}>
              {R(dx - 4, dy + 10, 24, 6, C.wall)}
              {R(dx, dy + 4, 16, 8, depColor)}
              {R(dx + 4, dy, 8, 6, C.skin)}
              {(col + row) % 3 === 0 && (
                <rect x={dx - 12} y={dy - 8} width={10} height={6} fill={C.white} opacity="0.8"
                  transform={`rotate(-15,${dx},${dy})`} />
              )}
            </g>
          );
        })
      )}

      {/* Podium */}
      {R(120, 90, 80, 8, C.suitMid)}
      {R(128, 98, 64, 38, C.suit)}

      {/* Argentine flag */}
      {R(260, 22, 4, 52, C.grayLt)}
      {R(264, 22, 44, 14, C.navyLt)}
      {R(264, 36, 44, 18, C.white)}
      {R(264, 54, 44, 14, C.navyLt)}
      {R(282, 40,  8,  8, C.goldBt)}

      {/* Microphone */}
      {R(156, 84, 8, 6, C.grayLt)}
      {R(158, 90, 4, 10, C.gray)}

      {/* President at podium */}
      <Figure x={140} y={62} hair={hairColor} />

      {/* Chainsaw */}
      {isMilei && (
        <g transform="translate(183,110) rotate(-10)">
          {R(0, 0, 28, 8, C.gray)}
          {R(26, -4, 10, 14, C.grayLt)}
        </g>
      )}

      <rect x="0" y="0" width="224" height="22" fill="#0a0d1a" opacity="0.9" />
      <text x="8" y="15" fontSize="10" fill="#82b1ff" fontFamily="monospace" fontWeight="bold">SESION EN EL CONGRESO</text>
    </g>
  );
}

// ── Scene: Social Unrest ──────────────────────────────────────────────────────
function SocialScene() {
  const protColors = [C.crimson, C.suit, C.crimsonDk, C.suitMid, C.gray, C.crimson, C.suit];

  return (
    <g>
      {R(0, 0, 320, 132, '#0a0600')}
      {/* Smoke puffs */}
      {[60, 148, 236].map((sx, i) => (
        <ellipse key={i} cx={sx} cy={54} rx={26} ry={12} fill={C.smoke} opacity="0.3" />
      ))}

      {/* Barricade at y=106–132 */}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
        <rect key={i} x={i * 32} y={106 - (i % 3) * 6} width={32}
          height={26 + (i % 3) * 6} fill={i % 2 === 0 ? C.wall : C.gray} />
      ))}

      {R(0, 132, 320, 28, C.floor)}
      {R(0, 132, 320,  8, C.wall)}

      {/* Protesters at py=80 */}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => {
        const px = 10 + i * 44;
        const py = 80;
        return (
          <g key={i}>
            {R(px, py + 6, 16, 18, protColors[i]!)}
            {R(px + 4, py, 8, 8, C.skin)}
            {i % 3 !== 2 ? (
              <>
                <rect x={px + 18} y={py - 18} width={24} height={14} fill={C.white} />
                <text x={px + 30} y={py - 9} fontSize="6" fill={C.crimson} textAnchor="middle" fontFamily="monospace">PAN</text>
                <line x1={px + 18} y1={py - 4} x2={px + 18} y2={py + 14} stroke={C.gray} strokeWidth="2" />
              </>
            ) : (
              <>
                <rect x={px + 18} y={py - 18} width={28} height={14} fill={C.crimsonDk} />
                <text x={px + 32} y={py - 9} fontSize="6" fill={C.white} textAnchor="middle" fontFamily="monospace">SE VAN</text>
                <line x1={px + 18} y1={py - 4} x2={px + 18} y2={py + 14} stroke={C.gray} strokeWidth="2" />
              </>
            )}
          </g>
        );
      })}

      {/* Torches */}
      {[88, 208].map((fx, i) => (
        <g key={i}>
          {R(fx, 98, 12, 18, C.fireOr)}
          {R(fx + 2, 90, 8, 10, C.fireYel)}
        </g>
      ))}

      <rect x="0" y="0" width="228" height="22" fill={C.crimsonDk} opacity="0.92" />
      <text x="8" y="15" fontSize="10" fill={C.white} fontFamily="monospace" fontWeight="bold">EL PUEBLO EN LAS CALLES</text>
    </g>
  );
}

// ── Scene: International ──────────────────────────────────────────────────────
function InternationalScene({ presidentId }: { presidentId: string }) {
  const hairColor = presidentId === 'tecnocrata' ? C.hairBl : C.hair;

  return (
    <g>
      {R(0, 0, 320, 160, '#060d1a')}
      {/* Stars */}
      {[[20, 30], [80, 18], [140, 48], [200, 24], [260, 38], [300, 14], [40, 78], [160, 8]].map(([sx, sy], i) => (
        <rect key={i} x={sx} y={sy} width={2} height={2} fill={C.white} opacity="0.7" />
      ))}

      {/* Globe: cy=70, r=52 */}
      <circle cx="80" cy="70" r="52" fill={C.navy} stroke={C.navyLt} strokeWidth="2" />
      {[-20, -6, 8, 22].map((off, i) => (
        <line key={i} x1={28} y1={70 + off} x2={132} y2={70 + off} stroke={C.navyLt} strokeWidth="1" opacity="0.5" />
      ))}
      {[-16, 0, 16].map((off, i) => (
        <line key={i} x1={80 + off} y1={18} x2={80 + off} y2={122} stroke={C.navyLt} strokeWidth="1" opacity="0.5" />
      ))}
      {/* Argentina highlight */}
      <ellipse cx="66" cy="86" rx="10" ry="14" fill={C.goldBt} opacity="0.55" />

      {/* Argentine flag */}
      {R(172, 20, 4, 52, C.grayLt)}
      {R(176, 20, 44, 14, C.navyLt)}
      {R(176, 34, 44, 18, C.white)}
      {R(176, 52, 44, 14, C.navyLt)}
      {R(193, 38,  8,  8, C.goldBt)}

      {/* US flag */}
      {R(232, 20, 4, 52, C.grayLt)}
      {R(236, 20, 44, 8, C.crimson)}
      {R(236, 28, 44, 8, C.white)}
      {R(236, 36, 44, 8, C.crimson)}
      {R(236, 44, 24, 18, '#0d47a1')}

      {/* FMI placard */}
      <rect x="160" y="100" width="80" height="24" fill={C.gold} rx="3" />
      <text x="200" y="116" fontSize="12" fill={C.bg} textAnchor="middle" fontFamily="monospace" fontWeight="bold">FMI</text>

      {/* Two figures at y=62 */}
      <Figure x={130} y={62} hair={hairColor} />
      <Figure x={218} y={62} hair={C.grayLt} skin={C.skinLt} />

      {/* Phone */}
      {R(178, 110, 12, 18, '#222')}

      <rect x="0" y="0" width="268" height="22" fill="#060d1a" opacity="0.9" />
      <text x="8" y="15" fontSize="10" fill="#82b1ff" fontFamily="monospace" fontWeight="bold">CRISIS INTERNACIONAL: ALERTA</text>
    </g>
  );
}

// ── Scene: FMI ────────────────────────────────────────────────────────────────
function FMIScene({ presidentId }: { presidentId: string }) {
  const isMilei = presidentId === 'ingeniero';
  const hairColor = presidentId === 'tecnocrata' ? C.hairBl : C.hair;

  return (
    <g>
      {R(0, 0, 320, 160, '#08101a')}

      {/* FMI Building: y=20–160 */}
      {R(0, 20, 148, 140, C.wall)}
      {[8, 32, 56, 80, 104, 128].map((cx, i) => (
        <rect key={i} x={cx} y={28} width={14} height={110} fill={C.floor} />
      ))}
      {R(0, 14, 148, 14, C.suitMid)}
      <text x="74" y="25" fontSize="10" fill={C.gold} textAnchor="middle" fontFamily="monospace" fontWeight="bold">F.M.I.</text>

      {/* Steps: y=136–160 */}
      {[0, 1, 2].map((i) => (
        <rect key={i} x={i * 8} y={136 + i * 8} width={148 - i * 16} height={8} fill={C.grayLt} />
      ))}

      {/* Dollar sign watermark */}
      <text x="252" y="110" fontSize="50" fill={C.green} textAnchor="middle" fontFamily="monospace"
        fontWeight="bold" opacity="0.3">$</text>

      {/* Briefcase */}
      {R(190, 118, 28, 18, C.brown)}
      {R(196, 114, 14,  6, C.brown)}
      {R(190, 126, 28,  4, C.grayLt)}

      {/* President at y=62 */}
      <Figure x={164} y={62} hair={hairColor} />

      {/* IMF Official at y=62 */}
      <Figure x={240} y={62} hair={C.grayLt} skin={C.skinLt} />

      {/* Handshake */}
      {R(210, 118, 24, 8, C.skin)}

      {isMilei && (
        <g transform="translate(156,136) rotate(10)">
          {R(0, 0, 26, 8, C.gray)}
          {R(24, -4, 10, 14, C.grayLt)}
        </g>
      )}

      <rect x="0" y="0" width="228" height="22" fill="#08101a" opacity="0.9" />
      <text x="8" y="15" fontSize="10" fill={C.goldBt} fontFamily="monospace" fontWeight="bold">NEGOCIACION CON EL FMI</text>
    </g>
  );
}

// ── Scene: Crisis ─────────────────────────────────────────────────────────────
function CrisisScene({ presidentId }: { presidentId: string }) {
  const isMilei = presidentId === 'ingeniero';
  const hairColor = presidentId === 'tecnocrata' ? C.hairBl : C.hair;

  return (
    <g>
      {R(0, 0, 320, 132, '#180000')}
      <rect x="0" y="100" width="320" height="32" fill="#3a0a00" />

      {/* Casa Rosada: x=100, y=8, scaled to fit 160px height */}
      {R(100, 8, 216, 124, C.pink)}
      {[108, 130, 152, 174, 196, 218, 240, 262, 284].map((cx, i) => (
        <rect key={i} x={cx} y={16} width={10} height={100} fill="#f8d7da" />
      ))}
      {R(100, 2, 216, 12, '#e8a8b8')}
      {/* Windows with fire */}
      {[0, 1].map((row) =>
        [0, 1, 2, 3].map((col) => (
          <rect key={`${row}-${col}`} x={108 + col * 28} y={22 + row * 28} width={18} height={16}
            fill={C.fireOr} opacity="0.85" />
        ))
      )}

      {/* Ground */}
      {R(0, 132, 320, 28, C.floor)}
      {R(0, 132, 320,  8, C.wall)}

      {/* Flames at ground level */}
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => {
        const fx = i * 32;
        const fh = 22 + (i % 3) * 12;
        return (
          <g key={i}>
            <rect x={fx} y={132 - fh} width={22} height={fh} fill={C.fireOr} opacity="0.88" />
            <rect x={fx + 3} y={132 - fh - 10} width={14} height={Math.round(fh * 0.6)} fill={C.fireYel} opacity="0.7" />
          </g>
        );
      })}

      {/* Smoke */}
      {[72, 160, 248].map((sx, i) => (
        <ellipse key={i} cx={sx} cy={40} rx={24} ry={12} fill={C.smoke} opacity="0.42" />
      ))}

      {/* President running at y=48 */}
      <g transform="rotate(-12,52,90)">
        {R(32, 68, 34, 26, C.suit)}
        {R(38, 68, 20, 18, C.shirt)}
        {R(36, 52, 20, 16, C.skin)}
        {isMilei
          ? <><rect x={36} y={44} width={7} height={10} fill={C.hair} /><rect x={36} y={44} width={20} height={6} fill={C.hair} /></>
          : R(36, 44, 20, 8, hairColor)}
        {R(34, 94, 10, 18, C.gray)}
        {R(52, 90, 10, 18, C.gray)}
        {R(22, 72, 10, 16, C.suit)}
        {R(66, 68, 10, 16, C.suit)}
      </g>

      {/* Ash */}
      {[[36, 30], [98, 24], [158, 36], [218, 28], [278, 20]].map(([ax, ay], i) => (
        <rect key={i} x={ax} y={ay} width={4} height={4} fill={C.smoke} opacity="0.5" />
      ))}

      <rect x="0" y="0" width="156" height="22" fill={C.crimsonDk} opacity="0.95" />
      <text x="8" y="15" fontSize="10" fill="#ff8a80" fontFamily="monospace" fontWeight="bold">⚠ CRISIS TOTAL</text>
    </g>
  );
}

// ── Scene: Scandal ────────────────────────────────────────────────────────────
function ScandalScene({ presidentId }: { presidentId: string }) {
  const hairColor = presidentId === 'tecnocrata' ? C.hairBl : C.hair;

  return (
    <g>
      {R(0, 0, 320, 160, '#08081a')}

      {/* Spotlight cones */}
      <polygon points="0,0 60,160 0,160" fill="#ffffaa" opacity="0.055" />
      <polygon points="320,0 260,160 320,160" fill="#ffffaa" opacity="0.055" />

      {/* Flash burst */}
      <circle cx="160" cy="60" r="36" fill={C.white} opacity="0.10" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        return (
          <line key={i} x1="160" y1="60"
            x2={160 + Math.cos(rad) * 72} y2={60 + Math.sin(rad) * 72}
            stroke={C.goldBt} strokeWidth="2" opacity="0.30" />
        );
      })}

      {/* Tabloid: y=14–148 */}
      <rect x="36" y="14" width="248" height="134" fill={C.white} rx="4" />
      <rect x="36" y="14" width="248" height="26" fill={C.crimson} rx="4" />
      <text x="160" y="32" fontSize="11" fill={C.white} textAnchor="middle" fontFamily="monospace" fontWeight="bold">REPUBLICA EN LLAMAS</text>
      <text x="160" y="57" fontSize="13" fill={C.crimsonDk} textAnchor="middle" fontFamily="monospace" fontWeight="bold">!ESCANDALO!</text>
      <line x1="52" y1="64" x2="268" y2="64" stroke="#ccc" strokeWidth="1" />

      {/* Photo box: y=66–138 */}
      <rect x="44" y="66" width="90" height="72" fill={C.wall} />
      {/* Figure inside photo at y=62 */}
      <Figure x={48} y={62} hair={hairColor} />

      {/* Text columns */}
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={142} y={72 + i * 16} width={120} height={8} fill="#ddd" rx="2" />
      ))}

      <text x="38" y="68" fontSize="12">📷</text>
      <text x="270" y="68" fontSize="10">📷</text>

      <rect x="0" y="138" width="248" height="22" fill="#08081a" opacity="0.9" />
      <text x="8" y="154" fontSize="10" fill="#ff8a80" fontFamily="monospace" fontWeight="bold">ESCANDALO EN EL GOBIERNO</text>
    </g>
  );
}

// ── Scene: Law ────────────────────────────────────────────────────────────────
function LawScene({ presidentId }: { presidentId: string }) {
  const hairColor = presidentId === 'tecnocrata' ? C.hairBl : C.hair;

  return (
    <g>
      {R(0, 0, 320, 160, '#080c18')}

      {/* Parchment: y=10–130 */}
      <rect x="44" y="10" width="232" height="120" fill={C.cream} rx="8" />
      <rect x="44" y="10" width="232" height="22" fill={C.gold} rx="8" />
      <text x="160" y="25" fontSize="10" fill={C.bg} textAnchor="middle" fontFamily="monospace" fontWeight="bold">PROYECTO DE LEY</text>

      {/* Scroll curls */}
      {[[44, 10], [276, 10], [44, 130], [276, 130]].map(([cx, cy], i) => (
        <ellipse key={i} cx={cx} cy={cy} rx="9" ry="9" fill={C.gold} />
      ))}

      {/* Document lines */}
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={64} y={42 + i * 16} width={i % 3 === 2 ? 90 : 170} height={6} rx="2" fill="#c8c0a0" />
      ))}

      {/* Congress seal */}
      <circle cx="160" cy="100" r="22" fill={C.suit} />
      <circle cx="160" cy="100" r="17" fill={C.navy} />
      <text x="160" y="97" fontSize="6" fill={C.white} textAnchor="middle" fontFamily="monospace">CONGRESO</text>
      <text x="160" y="107" fontSize="6" fill={C.goldBt} textAnchor="middle" fontFamily="monospace">NACION</text>

      {/* Gavel: y=56–110 */}
      {R(218, 56, 40, 16, C.brown)}
      {R(232, 72,  8, 40, C.brown)}

      {/* Pen */}
      <line x1="84" y1="130" x2="112" y2="108" stroke="#111" strokeWidth="4" />
      <rect x="80" y="127" width="8" height="6" fill={C.gold} />

      {/* President signing at y=62 */}
      <Figure x={118} y={62} hair={hairColor} />

      <rect x="0" y="138" width="248" height="22" fill="#080c18" opacity="0.9" />
      <text x="8" y="154" fontSize="10" fill={C.goldBt} fontFamily="monospace" fontWeight="bold">SESION EXTRAORDINARIA</text>
    </g>
  );
}

// ── Scene selector ────────────────────────────────────────────────────────────
function selectScene(category: string, eventId: string, gameState: GameState | null | undefined): string {
  if (category === 'crisis') return 'crisis';
  if (category === 'international') {
    if (eventId?.includes('fmi') || eventId?.includes('emb')) return 'fmi';
    return 'international';
  }
  if (category === 'economic') return 'inflation';
  if (category === 'social') return 'social';
  if (category === 'political') {
    if (eventId?.startsWith('law_')) return 'law';
    if (eventId?.startsWith('scan_') || eventId?.startsWith('arg_')) return 'scandal';
    const popularity = gameState?.political.popularity ?? 50;
    return popularity < 30 ? 'crisis' : 'congress';
  }
  return 'congress';
}

export function EventIllustration({ eventCategory, presidentId, eventId = '', gameState, width = 320, height = 160 }: Props) {
  const scene = selectScene(eventCategory, eventId, gameState);

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 320 160"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%', display: 'block' }}
      preserveAspectRatio="xMidYMid meet"
      shapeRendering="crispEdges"
      role="img"
      aria-label={`Ilustración: ${eventCategory}`}
    >
      <rect width="320" height="160" fill="#0d1b2a" />
      {scene === 'inflation'     && <InflationScene presidentId={presidentId} />}
      {scene === 'congress'      && <CongressScene presidentId={presidentId} />}
      {scene === 'social'        && <SocialScene />}
      {scene === 'international' && <InternationalScene presidentId={presidentId} />}
      {scene === 'fmi'           && <FMIScene presidentId={presidentId} />}
      {scene === 'crisis'        && <CrisisScene presidentId={presidentId} />}
      {scene === 'scandal'       && <ScandalScene presidentId={presidentId} />}
      {scene === 'law'           && <LawScene presidentId={presidentId} />}
    </svg>
  );
}
