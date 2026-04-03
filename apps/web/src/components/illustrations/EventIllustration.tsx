import React from 'react';
import type { GameState } from '@republica/game-engine';
import { useGameImage } from '../../hooks/useGameImage.js';

interface Props {
  eventCategory: string;
  presidentId: string;
  eventId?: string;
  gameState?: GameState | null | undefined;
}

// ── Flat editorial cartoon palette ──────────────────────────────────────────
const C = {
  skyDay:   '#b8d4f0',
  skyNight: '#1a1a2e',
  wallCrm:  '#f5e6c8',
  wallGray: '#d0cfc8',
  wallBlue: '#4a6fa5',
  floorDk:  '#3d3228',
  skin:     '#f4c08a',
  skinDk:   '#c8855a',
  hair:     '#2c1a08',
  hairBlk:  '#111111',
  hairBlnd: '#d4a017',
  suitDk:   '#1a237e',
  suitNvy:  '#283593',
  shirtWh:  '#f0f0f0',
  tieRed:   '#c62828',
  tieBlue:  '#0d47a1',
  gold:     '#f9a825',
  goldDk:   '#e65100',
  red:      '#c62828',
  redLt:    '#ef5350',
  green:    '#2e7d32',
  greenLt:  '#66bb6a',
  orange:   '#e65100',
  white:    '#f8f8f8',
  black:    '#1a1a1a',
  smoke:    '#78909c',
  smokeLt:  '#b0bec5',
  brown:    '#5d4037',
  brownLt:  '#8d6e63',
  fire:     '#ff5722',
  fireLt:   '#ffcc02',
  dolar:    '#2e7d32',
  bankWall: '#e8dcc8',
};

const OL = '#1a1a1a';

// ── Primitive helpers ─────────────────────────────────────────────────────────
function R(x: number, y: number, w: number, h: number, fill: string, rx = 0, stroke?: string, sw = 2) {
  return stroke
    ? <rect x={x} y={y} width={w} height={h} fill={fill} rx={rx} stroke={stroke} strokeWidth={sw} />
    : <rect x={x} y={y} width={w} height={h} fill={fill} rx={rx} />;
}
function Circ(cx: number, cy: number, r: number, fill: string, stroke?: string, sw = 2) {
  return stroke
    ? <circle cx={cx} cy={cy} r={r} fill={fill} stroke={stroke} strokeWidth={sw} />
    : <circle cx={cx} cy={cy} r={r} fill={fill} />;
}

// ── Person component ──────────────────────────────────────────────────────────
interface PersonProps {
  cx: number; baseY: number;
  skinColor?: string; hairColor?: string; suitColor?: string;
  shirtColor?: string; tieColor?: string; hatColor?: string;
  mouthOpen?: boolean; armL?: number; armR?: number;
}
function Person({ cx, baseY, skinColor = C.skin, hairColor = C.hair, suitColor = C.suitDk,
  shirtColor = C.shirtWh, tieColor = C.tieRed, hatColor, mouthOpen = false, armL = 0, armR = 0 }: PersonProps) {
  const bx = cx - 14;
  const by = baseY - 88;
  return (
    <g>
      <rect x={bx + 6} y={by + 64} width={8} height={24} fill={suitColor} rx={2} />
      <rect x={bx + 14} y={by + 64} width={8} height={24} fill={suitColor} rx={2} />
      <rect x={bx + 4} y={by + 85} width={12} height={6} fill={C.black} rx={2} />
      <rect x={bx + 12} y={by + 85} width={12} height={6} fill={C.black} rx={2} />
      <rect x={bx + 2} y={by + 32} width={24} height={34} fill={suitColor} rx={3}
        stroke={OL} strokeWidth={2} />
      <rect x={bx + 11} y={by + 32} width={6} height={28} fill={shirtColor} />
      <polygon points={`${bx + 13},${by + 34} ${bx + 15},${by + 34} ${bx + 14},${by + 55}`} fill={tieColor} />
      <rect x={bx - 2} y={by + 33} width={6} height={22} fill={suitColor} rx={2}
        stroke={OL} strokeWidth={1.5}
        transform={armL !== 0 ? `rotate(${armL},${bx + 1},${by + 33})` : undefined} />
      <rect x={bx + 24} y={by + 33} width={6} height={22} fill={suitColor} rx={2}
        stroke={OL} strokeWidth={1.5}
        transform={armR !== 0 ? `rotate(${armR},${bx + 27},${by + 33})` : undefined} />
      <rect x={bx + 10} y={by + 26} width={8} height={8} fill={skinColor} />
      <rect x={bx + 4} y={by + 8} width={20} height={20} fill={skinColor} rx={6}
        stroke={OL} strokeWidth={2} />
      {!hatColor
        ? <rect x={bx + 4} y={by + 6} width={20} height={8} fill={hairColor} rx={4} />
        : <rect x={bx + 2} y={by + 4} width={24} height={10} fill={hatColor} rx={3}
            stroke={OL} strokeWidth={1.5} />}
      <circle cx={bx + 10} cy={by + 16} r={2} fill={C.black} />
      <circle cx={bx + 18} cy={by + 16} r={2} fill={C.black} />
      {mouthOpen
        ? <ellipse cx={bx + 14} cy={by + 22} rx={3} ry={2} fill={C.black} />
        : <rect x={bx + 10} y={by + 22} width={8} height={2} fill={C.skinDk} rx={1} />}
    </g>
  );
}

// ── Worker component ──────────────────────────────────────────────────────────
function Worker({ cx, baseY, armUp = false }: { cx: number; baseY: number; armUp?: boolean }) {
  const bx = cx - 12;
  const by = baseY - 80;
  return (
    <g>
      <rect x={bx + 4} y={by + 56} width={8} height={24} fill="#1565c0" rx={2} />
      <rect x={bx + 14} y={by + 56} width={8} height={24} fill="#1565c0" rx={2} />
      <rect x={bx + 2} y={by + 26} width={22} height={32} fill="#1565c0" rx={3} stroke={OL} strokeWidth={2} />
      <rect x={bx + 8} y={by + 26} width={10} height={18} fill="#1976d2" />
      <rect x={bx - 2} y={by + 27} width={6} height={20} fill="#1565c0" rx={2} stroke={OL} strokeWidth={1.5} />
      <rect x={bx + 22} y={by + 27} width={6} height={20} fill="#1565c0" rx={2} stroke={OL} strokeWidth={1.5}
        transform={armUp ? `rotate(-90,${bx + 25},${by + 27})` : undefined} />
      <rect x={bx + 6} y={by + 18} width={14} height={10} fill={C.skin} rx={4} stroke={OL} strokeWidth={1.5} />
      <rect x={bx + 4} y={by + 10} width={18} height={9} fill="#f9a825" rx={3} stroke={OL} strokeWidth={2} />
      <rect x={bx + 3} y={by + 17} width={20} height={4} fill="#e65100" rx={1} />
      <circle cx={bx + 10} cy={by + 22} r={1.5} fill={C.black} />
      <circle cx={bx + 16} cy={by + 22} r={1.5} fill={C.black} />
    </g>
  );
}

// ── Protester component ───────────────────────────────────────────────────────
function Protester({ cx, baseY, shirtColor = C.red, signColor = C.red, hatColor }: {
  cx: number; baseY: number; shirtColor?: string; signColor?: string; hatColor?: string;
}) {
  const bx = cx - 10;
  const by = baseY - 80;
  return (
    <g>
      <rect x={bx + 4} y={by + 56} width={7} height={24} fill="#37474f" rx={2} />
      <rect x={bx + 12} y={by + 56} width={7} height={24} fill="#37474f" rx={2} />
      <rect x={bx} y={by + 24} width={22} height={34} fill={shirtColor} rx={3} stroke={OL} strokeWidth={2} />
      <rect x={bx + 18} y={by + 5} width={6} height={22} fill={shirtColor} rx={2} stroke={OL} strokeWidth={1.5} />
      <rect x={bx + 12} y={by + 2} width={14} height={10} fill={signColor} rx={2} stroke={OL} strokeWidth={1.5} />
      <rect x={bx - 4} y={by + 26} width={6} height={18} fill={shirtColor} rx={2} />
      <rect x={bx + 6} y={by + 16} width={12} height={10} fill={C.skin} rx={3} stroke={OL} strokeWidth={1.5} />
      {hatColor
        ? <rect x={bx + 3} y={by + 9} width={18} height={8} fill={hatColor} rx={3} stroke={OL} strokeWidth={1.5} />
        : <rect x={bx + 5} y={by + 10} width={14} height={7} fill={C.hair} rx={3} />}
      <circle cx={bx + 10} cy={by + 20} r={1.5} fill={C.black} />
      <circle cx={bx + 16} cy={by + 20} r={1.5} fill={C.black} />
    </g>
  );
}

// ── SCENE: pol_congress ───────────────────────────────────────────────────────
function ScenePolCongress({ presidentId }: { presidentId: string }) {
  const hairColor = presidentId === 'tecnocrata' ? C.hairBlnd : presidentId === 'ingeniero' ? '#2c1208' : C.hairBlk;
  return (
    <g>
      {R(0, 0, 320, 180, '#1a2535')}
      {R(0, 20, 320, 130, '#2c3a50')}
      {R(0, 150, 320, 30, '#3d3228')}
      {R(218, 22, 60, 16, '#4a6fa5')} {R(218, 38, 60, 16, '#f8f8f8')} {R(218, 54, 60, 16, '#4a6fa5')}
      {Circ(248, 46, 7, '#f9a825')}
      {R(215, 18, 4, 90, '#b0bec5')}
      {[0, 1, 2].map((row) => (
        <rect key={row} x={12 + row * 4} y={80 + row * 22} width={180 - row * 8} height={10}
          fill="#4a3f2f" rx={5} stroke={OL} strokeWidth={1.5} />
      ))}
      {[28, 58, 88, 118, 148].map((x, i) => (
        <g key={i}>
          {R(x - 4, 70, 12, 8, i % 2 === 0 ? C.suitDk : C.red, 2, OL, 1.5)}
          {Circ(x + 2, 68, 5, C.skin, OL, 1.5)}
          {R(x, 64, 8, 5, i % 2 === 0 ? C.hairBlk : C.hair, 2)}
          {i === 2 && <rect x={x - 6} y={54} width={12} height={16} fill={C.red} rx={2} stroke={OL} strokeWidth={1.5} />}
          {i === 2 && Circ(x + 0, 51, 5, C.skin, OL, 1.5)}
        </g>
      ))}
      {R(238, 108, 62, 42, '#5d4037', 4, OL, 2)}
      {R(246, 103, 46, 10, '#6d4c41', 3, OL, 1.5)}
      {R(265, 98, 4, 13, '#90a4ae')}
      {Circ(267, 97, 5, '#546e7a', OL, 1.5)}
      <Person cx={267} baseY={148} skinColor={C.skin} hairColor={hairColor}
        suitColor={C.suitDk} mouthOpen={true} armL={10} armR={-10} />
      {R(0, 20, 14, 160, '#475a6e', 0, OL, 2)} {R(306, 20, 14, 160, '#475a6e', 0, OL, 2)}
      {R(-4, 16, 22, 7, '#5e7080', 2)} {R(302, 16, 22, 7, '#5e7080', 2)}
    </g>
  );
}

// ── SCENE: pol_scandal ────────────────────────────────────────────────────────
function ScenePolScandal({ presidentId }: { presidentId: string }) {
  const hairColor = presidentId === 'tecnocrata' ? C.hairBlnd : C.hair;
  return (
    <g>
      {R(0, 0, 320, 180, '#1a0a0a')}
      {Circ(210, 68, 48, '#fffde7')} {Circ(210, 68, 36, '#fff9c4')}
      {[155, 195, 235, 265].map((x, i) => (
        <g key={i}>
          {Circ(x, 148 - i * 4, 10, '#f8f8f8', OL, 1.5)}
          {R(x - 5, 138 - i * 4, 10, 20, '#37474f', 2, OL, 1.5)}
          {R(x - 1, 128 - i * 4, 2, 8, '#ffeb3b')}
        </g>
      ))}
      {[18, 50, 80, 118].map((x, i) => (
        <g key={i}>
          {R(x, 118 + (i % 2) * 8, 22, 62, '#222', 3)}
          {Circ(x + 11, 115 + (i % 2) * 8, 11, '#333', OL, 1)}
        </g>
      ))}
      <Person cx={118} baseY={175} skinColor={C.skin} hairColor={hairColor}
        suitColor={C.suitDk} mouthOpen={true} />
      {Circ(93, 93, 4, '#88b8f0')} {Circ(88, 104, 3, '#88b8f0')}
      <Person cx={198} baseY={175} skinColor={C.skin} hairColor={C.hairBlk}
        suitColor="#37474f" mouthOpen={false} armR={-30} />
      {R(210, 108, 8, 18, '#546e7a', 2, OL, 2)}
      {Circ(214, 105, 7, '#455a64', OL, 2)}
      <path d="M 214 123 Q 198 138 193 158" stroke="#546e7a" strokeWidth={2} fill="none" />
    </g>
  );
}

// ── SCENE: pol_protest ────────────────────────────────────────────────────────
function ScenePolProtest() {
  return (
    <g>
      {R(0, 0, 320, 180, '#7d8b96')}
      {Circ(60, 28, 22, '#b0bec5')} {Circ(82, 23, 26, '#cfd8dc')} {Circ(106, 30, 18, '#b0bec5')}
      {Circ(198, 26, 24, '#b0bec5')} {Circ(222, 20, 20, '#cfd8dc')} {Circ(244, 28, 16, '#b0bec5')}
      {R(148, 58, 132, 92, '#f48fb1', 4, OL, 2)}
      {[172, 202, 232].map((x) => (
        <path key={x} d={`M ${x} 78 Q ${x + 10} 62 ${x + 20} 78`} stroke={OL} strokeWidth={2} fill="#f06292" />
      ))}
      {[174, 202, 232].map((x) => [86, 114].map((y, j) => R(x, y, 14, 18, '#90caf9', 2, OL, 1.5)))}
      {R(208, 33, 3, 33, '#90a4ae')}
      {R(211, 33, 22, 13, '#4a6fa5')} {R(211, 46, 22, 7, '#f8f8f8')} {R(211, 53, 22, 7, '#4a6fa5')}
      {[58, 103, 148].map((x) => (
        <g key={x}>
          <Person cx={x} baseY={178} suitColor="#1a237e" hairColor={C.hairBlk} hatColor="#0d47a1" armL={5} armR={5} />
          {R(x + 14, 128, 14, 22, '#1565c0', 2, OL, 2)}
          {R(x + 16, 131, 10, 6, '#90caf9', 1)}
        </g>
      ))}
      <Protester cx={10} baseY={178} shirtColor={C.red} signColor={C.red} />
      <Protester cx={40} baseY={178} shirtColor="#e65100" signColor="#e65100" />
      {R(0, 158, 320, 22, '#5d4037')}
      {[8, 40, 72, 104, 136, 168, 200, 232, 264, 296].map((x, i) => R(x, 161 + (i % 2) * 4, 24, 8, '#4e342e', 2))}
    </g>
  );
}

// ── SCENE: eco_inflation ──────────────────────────────────────────────────────
function SceneEcoInflation() {
  return (
    <g>
      {R(0, 0, 320, 180, '#e3f2fd')}
      {R(0, 148, 320, 32, '#e0e0e0')}
      {[0, 40, 80, 120, 160, 200, 240, 280].map((x, i) => R(x, 148, 38, 32, i % 2 === 0 ? '#eeeeee' : '#e0e0e0'))}
      {R(0, 38, 100, 112, '#8d6e63', 2, OL, 2)}
      {[48, 73, 98].map((y) => <rect key={y} x={0} y={y} width={100} height={5} fill="#a1887f" />)}
      {[4, 28, 58, 68].map((x, i) => R(x, 39 + (i % 2) * 26, 18, 22, ['#ef5350','#42a5f5','#66bb6a','#ffa726'][i]!, 3, OL, 1))}
      {R(220, 38, 100, 112, '#8d6e63', 2, OL, 2)}
      {[48, 73, 98].map((y) => <rect key={y} x={220} y={y} width={100} height={5} fill="#a1887f" />)}
      {R(222, 39, 18, 22, '#ab47bc', 3, OL, 1)} {R(248, 39, 18, 22, '#26a69a', 3, OL, 1)}
      {R(128, 52, 82, 56, '#f8f8f8', 4, OL, 2.5)}
      {R(128, 52, 82, 18, '#c62828', 4, OL, 2.5)}
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={141 + i * 16} y={57} width={4} height={11} fill="#ffeb3b" />
          <rect x={138 + i * 16} y={61} width={10} height={2} fill="#ffeb3b" />
          <rect x={138 + i * 16} y={66} width={10} height={2} fill="#ffeb3b" />
        </g>
      ))}
      {R(138, 74, 62, 28, '#fff9c4', 2, C.red, 2)}
      {R(146, 78, 46, 6, C.red, 1)} {R(146, 88, 46, 6, C.red, 1)} {R(146, 98, 32, 6, C.red, 1)}
      <Person cx={198} baseY={175} skinColor={C.skin} hairColor="#4a148c"
        suitColor="#7e57c2" shirtColor="#ede7f6" mouthOpen={true} armR={-20} />
      {R(213, 118, 18, 12, '#8d6e63', 2, OL, 2)}
      {R(213, 118, 18, 4, '#6d4c41', 2)}
    </g>
  );
}

// ── SCENE: eco_reserves ───────────────────────────────────────────────────────
function SceneEcoReserves() {
  return (
    <g>
      {R(0, 0, 320, 180, C.bankWall)}
      {R(0, 148, 320, 32, '#d7ccc8')}
      {[0, 80, 160, 240].map((x, i) => R(x, 148, 78, 32, i % 2 === 0 ? '#d7ccc8' : '#bcaaa4'))}
      {R(38, 28, 112, 122, '#546e7a', 6, OL, 3)}
      {R(44, 34, 100, 110, '#455a64', 4)}
      {Circ(58, 89, 16, '#90a4ae', OL, 2.5)} {Circ(58, 89, 10, '#78909c', OL, 2)}
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <line key={a}
          x1={58 + Math.cos(a * Math.PI / 180) * 14} y1={89 + Math.sin(a * Math.PI / 180) * 14}
          x2={58 - Math.cos(a * Math.PI / 180) * 14} y2={89 - Math.sin(a * Math.PI / 180) * 14}
          stroke="#37474f" strokeWidth={2.5} />
      ))}
      {R(154, 28, 102, 122, '#e8e0d0', 2, OL, 2)}
      {Circ(193, 78, 3, '#d7ccc8')} {Circ(218, 98, 4, '#d7ccc8')} {Circ(228, 58, 2, '#d7ccc8')}
      {[0, 1, 2].map((i) => (
        <g key={i} opacity={0.4 - i * 0.1}>
          <rect x={160 + i * 30} y={53} width={4} height={30} fill={C.dolar} rx={1} />
          <rect x={156 + i * 30} y={60} width={12} height={3} fill={C.dolar} rx={1} />
          <rect x={156 + i * 30} y={70} width={12} height={3} fill={C.dolar} rx={1} />
        </g>
      ))}
      <Person cx={138} baseY={178} skinColor={C.skin} hairColor={C.hairBlk}
        suitColor="#1a237e" shirtColor={C.shirtWh} mouthOpen={true}
        armL={-100} armR={100} />
    </g>
  );
}

// ── SCENE: eco_growth ─────────────────────────────────────────────────────────
function SceneEcoGrowth() {
  return (
    <g>
      {R(0, 0, 320, 180, C.skyDay)}
      {R(0, 143, 320, 37, '#4caf50')}
      {R(28, 58, 132, 87, '#8d6e63', 4, OL, 2.5)}
      {[43, 83, 123].map((x) => (
        <g key={x}>
          {R(x, 70, 20, 24, '#90caf9', 3, OL, 1.5)}
          <line x1={x + 10} y1={70} x2={x + 10} y2={94} stroke="#546e7a" strokeWidth={1.5} />
          <line x1={x} y1={82} x2={x + 20} y2={82} stroke="#546e7a" strokeWidth={1.5} />
        </g>
      ))}
      {R(78, 110, 30, 33, '#5d4037', 4, OL, 2)}
      {[48, 98, 128].map((x) => (
        <g key={x}>
          {R(x, 28, 18, 34, '#546e7a', 2, OL, 2)}
          {Circ(x + 9, 23, 10, '#cfd8dc', OL, 1)} {Circ(x + 15, 16, 8, '#eceff1', OL, 1)}
          {Circ(x + 5, 12, 7, '#cfd8dc', OL, 1)}
        </g>
      ))}
      {R(208, 48, 90, 90, '#f8f8f8', 4, OL, 2.5)}
      {R(208, 48, 90, 12, '#1565c0', 4, OL, 2.5)}
      {R(246, 138, 6, 42, '#78909c')}
      {[{x:218,h:28,c:'#ef5350'},{x:238,h:44,c:'#ffa726'},{x:258,h:58,c:'#66bb6a'},{x:278,h:70,c:'#4caf50'}].map((b, i) => (
        <rect key={i} x={b.x} y={128 - b.h} width={14} height={b.h} fill={b.c} rx={2} stroke={OL} strokeWidth={1} />
      ))}
      <polyline points="223,126 243,102 263,88 283,66" stroke="#4caf50" strokeWidth={3} fill="none" strokeDasharray="4,2" />
      <Worker cx={176} baseY={178} armUp={true} />
    </g>
  );
}

// ── SCENE: soc_strike ─────────────────────────────────────────────────────────
function SceneSocStrike() {
  return (
    <g>
      {R(0, 0, 320, 180, '#607d8b')}
      {R(0, 0, 320, 38, '#78909c')}
      {R(0, 38, 320, 112, '#5d4037', 0, OL, 2)}
      {R(118, 58, 82, 92, '#37474f', 4, OL, 2)}
      {R(148, 68, 22, 82, '#263238', 2, OL, 2)}
      {R(118, 58, 82, 10, '#455a64', 2, OL, 2)}
      {[0, 10, 20, 30].map((dy) => R(151, 102 + dy, 16, 7, '#b0bec5', 2, OL, 1.5))}
      {Circ(159, 101, 9, '#90a4ae', OL, 2)}
      {R(152, 122, 12, 14, '#b0bec5', 3, OL, 2)}
      <path d="M 155 122 Q 155 114 159 114 Q 163 114 163 122" stroke="#546e7a" strokeWidth={3} fill="none" />
      {R(0, 148, 320, 32, '#4e342e')}
      <Protester cx={48} baseY={178} shirtColor="#1565c0" signColor="#ef5350" />
      <Protester cx={88} baseY={178} shirtColor="#37474f" signColor="#f9a825" />
      <Worker cx={238} baseY={178} armUp={false} />
      <Worker cx={273} baseY={178} armUp={true} />
    </g>
  );
}

// ── SCENE: soc_unrest ─────────────────────────────────────────────────────────
function SceneSocUnrest() {
  return (
    <g>
      {R(0, 0, 320, 180, C.skyNight)}
      {[0, 68, 138, 208, 258].map((x, i) => R(x, 18 + (i % 3) * 14, 58 + (i % 2) * 20, 132 - (i % 3) * 10, '#0d1117', 0, OL, 1))}
      {[14, 44, 84, 94, 154, 188, 224, 278].map((x, i) => R(x, 28 + (i % 4) * 18, 10, 8, '#ffd54f', 1))}
      {R(0, 146, 320, 34, '#2c2218')} {R(0, 150, 320, 10, '#37302a')}
      {Circ(160, 146, 22, '#1a1a1a', OL, 2)} {Circ(160, 146, 14, '#2c2218')}
      <polygon points="148,146 152,118 158,143 162,116 168,146 172,123 174,146" fill={C.fire} opacity={0.9} />
      <polygon points="152,146 155,126 160,143 165,122 168,146" fill={C.fireLt} opacity={0.8} />
      {Circ(160, 138, 34, '#ff570022')}
      {[38, 218, 268].map((x) => (
        <g key={x}>{R(x, 116, 16, 34, '#111', 3)}{Circ(x + 8, 113, 9, '#1a1a1a', OL, 1)}</g>
      ))}
      {[58, 88].map((x) => (
        <g key={x}>
          <Person cx={x} baseY={178} suitColor="#1a237e" hairColor={C.hairBlk} hatColor="#0d47a1" armL={5} armR={-5} />
          {R(x + 14, 126, 14, 24, '#1565c0', 2, OL, 2)}
        </g>
      ))}
    </g>
  );
}

// ── SCENE: soc_health ─────────────────────────────────────────────────────────
function SceneSocHealth() {
  return (
    <g>
      {R(0, 0, 320, 180, '#fafafa')}
      {R(0, 0, 14, 180, '#e8f5e9')} {R(306, 0, 14, 180, '#e8f5e9')}
      {R(0, 148, 320, 32, '#e0e0e0')}
      {[0, 80, 160, 240].map((x) => R(x, 148, 78, 32, x % 160 === 0 ? '#eeeeee' : '#e8e8e8'))}
      {R(143, 8, 30, 8, '#ef5350', 2)} {R(154, 2, 8, 20, '#ef5350', 2)}
      {R(238, 28, 72, 102, '#f8f8f8', 4, OL, 2.5)}
      {R(238, 28, 72, 14, '#e8f5e9', 4, OL, 2.5)}
      {[53, 78, 98].map((y) => R(242, y, 64, 4, '#e0e0e0'))}
      {R(246, 58, 16, 18, '#ef5350', 3, OL, 1.5)}
      {[38, 118].map((x) => (
        <g key={x}>
          {R(x, 128, 70, 18, '#b0bec5', 4, OL, 2)}
          {R(x + 2, 120, 66, 12, '#e8eaf6', 3, OL, 2)}
          {R(x + 8, 113, 50, 10, C.skin, 4, OL, 1.5)}
          {Circ(x + 12, 112, 8, C.skin, OL, 1.5)}
          {Circ(x + 12, 148, 6, '#78909c', OL, 1.5)} {Circ(x + 56, 148, 6, '#78909c', OL, 1.5)}
        </g>
      ))}
      <Person cx={193} baseY={178} skinColor={C.skin} hairColor={C.hairBlk}
        suitColor="#ffffff" shirtColor="#e3f2fd" tieColor="#e3f2fd"
        mouthOpen={true} armL={-20} armR={20} />
      {R(181, 83, 24, 8, '#f8f8f8', 2, OL, 1.5)}
      {R(188, 81, 10, 4, '#ef5350', 1)}
    </g>
  );
}

// ── SCENE: int_imf ────────────────────────────────────────────────────────────
function SceneIntImf({ presidentId }: { presidentId: string }) {
  const hairColor = presidentId === 'tecnocrata' ? C.hairBlnd : presidentId === 'ingeniero' ? '#2c1208' : C.hairBlk;
  return (
    <g>
      {R(0, 0, 320, 180, '#1a1a2e')}
      {R(38, 98, 242, 30, '#5d4037', 6, OL, 2.5)}
      {R(38, 98, 242, 8, '#8d6e63', 6)}
      {R(46, 128, 8, 32, '#4e342e', 2)} {R(266, 128, 8, 32, '#4e342e', 2)}
      {Circ(160, 34, 26, '#1565c0', OL, 2.5)} {Circ(160, 34, 20, '#0d47a1')}
      {[0, 30, 60, 90, 120, 150].map((a) => (
        <line key={a}
          x1={160 + Math.cos(a * Math.PI / 180) * 20} y1={34 + Math.sin(a * Math.PI / 180) * 20}
          x2={160 - Math.cos(a * Math.PI / 180) * 20} y2={34 - Math.sin(a * Math.PI / 180) * 20}
          stroke="#1976d2" strokeWidth={1} />
      ))}
      {R(118, 90, 82, 16, '#f8f8f8', 3, OL, 2)}
      {R(126, 95, 66, 3, '#ccc', 1)} {R(126, 100, 66, 3, '#ccc', 1)}
      <Person cx={78} baseY={178} skinColor="#e8c09a" hairColor="#888888"
        suitColor="#1a237e" shirtColor={C.shirtWh} tieColor="#1565c0"
        mouthOpen={false} armR={-30} />
      {Circ(88, 103, 5, '#1565c0', OL, 1.5)}
      <Person cx={228} baseY={178} skinColor={C.skin} hairColor={hairColor}
        suitColor={C.suitDk} mouthOpen={false} armL={-20} />
      {R(190, 88, 20, 5, '#37474f', 2, OL, 1.5)} {R(206, 86, 6, 8, '#f9a825', 2)}
      {Circ(216, 103, 5, '#4a6fa5', OL, 1.5)}
    </g>
  );
}

// ── SCENE: int_war ────────────────────────────────────────────────────────────
function SceneIntWar() {
  return (
    <g>
      {R(0, 0, 320, 180, '#1a1a1a')}
      {R(18, 8, 282, 132, '#0a1628', 4, OL, 2.5)} {R(18, 8, 282, 8, '#1565c0', 4)}
      {[58, 98, 138, 178, 218, 258].map((x) => (
        <line key={x} x1={x} y1={16} x2={x} y2={138} stroke="#1565c0" strokeWidth={0.5} opacity={0.4} />
      ))}
      {[38, 58, 78, 98, 118].map((y) => (
        <line key={y} x1={18} y1={y} x2={300} y2={y} stroke="#1565c0" strokeWidth={0.5} opacity={0.4} />
      ))}
      <polygon points="48,48 78,38 88,63 68,78 43,68" fill="#2e7d32" opacity={0.7} />
      <polygon points="98,33 138,28 153,53 143,73 108,68 93,48" fill="#2e7d32" opacity={0.7} />
      <polygon points="163,38 188,33 198,58 183,73 163,63" fill="#1b5e20" opacity={0.7} />
      <polygon points="218,43 253,38 263,53 256,68 223,66 213,56" fill="#2e7d32" opacity={0.7} />
      {Circ(178, 53, 22, '#c6282833')} {Circ(178, 53, 14, '#c62828')}
      <polygon points="170,46 186,46 178,36" fill="#ef5350" />
      <Person cx={78} baseY={178} skinColor={C.skin} hairColor={C.hairBlk}
        suitColor="#263238" shirtColor="#37474f" mouthOpen={false} armR={-40} />
      {[178, 238].map((x, i) => (
        <Person key={i} cx={x} baseY={178} skinColor={C.skin}
          hairColor={i === 0 ? C.hair : C.hairBlk} suitColor="#1a237e" mouthOpen={false} />
      ))}
      {R(118, 146, 182, 16, '#4e342e', 4, OL, 2)}
    </g>
  );
}

// ── SCENE: int_trade ──────────────────────────────────────────────────────────
function SceneIntTrade() {
  return (
    <g>
      {R(0, 0, 320, 180, '#b3e5fc')}
      {R(0, 118, 320, 62, '#0277bd', 0, OL, 1.5)}
      {[0, 40, 80, 120, 160, 200, 240].map((x, i) => (
        <path key={i} d={`M ${x} ${126 + (i % 2) * 4} Q ${x + 20} ${122 + (i % 2) * 4} ${x + 40} ${126 + (i % 2) * 4}`}
          stroke="#01579b" strokeWidth={1.5} fill="none" />
      ))}
      <polygon points="38,116 282,116 292,133 28,133" fill="#546e7a" stroke={OL} strokeWidth={2} />
      {R(48, 98, 222, 20, '#455a64', 2, OL, 2)}
      {R(198, 68, 62, 32, '#37474f', 3, OL, 2)}
      {[53, 98, 143, 183].map((x, i) => (
        <g key={i}>
          {R(x, 76, 38, 24, ['#ef5350','#42a5f5','#66bb6a','#ffa726'][i]!, 2, OL, 2)}
          {[5,10,15,20,25,30].map((dx) => (
            <line key={dx} x1={x + dx} y1={76} x2={x + dx} y2={100} stroke="rgba(0,0,0,0.2)" strokeWidth={1} />
          ))}
        </g>
      ))}
      {R(274, 38, 8, 102, '#78909c', 0, OL, 2)} {R(238, 38, 44, 8, '#78909c', 0, OL, 2)}
      <line x1={254} y1={38} x2={282} y2={58} stroke="#546e7a" strokeWidth={2} />
      <Person cx={128} baseY={178} skinColor={C.skin} hairColor={C.hairBlk}
        suitColor="#1a237e" mouthOpen={false} armR={-10} />
      <Person cx={173} baseY={178} skinColor="#c8855a" hairColor="#111"
        suitColor="#1b5e20" mouthOpen={false} armL={10} />
      {R(145, 128, 14, 8, C.skin, 3, OL, 2)}
      {Circ(139, 103, 5, '#4a6fa5', OL, 1.5)} {Circ(181, 103, 5, '#2e7d32', OL, 1.5)}
    </g>
  );
}

// ── SCENE: arg_mundial ────────────────────────────────────────────────────────
function SceneArgMundial() {
  return (
    <g>
      {R(0, 0, 320, 180, '#1565c0')}
      {[8, 28, 48, 68, 98, 128, 148, 178, 198, 228, 258, 288].map((x, i) => (
        <rect key={i} x={x} y={(i * 17) % 78 + 8} width={8} height={14}
          fill={['#f44336','#f9a825','#4caf50','#2196f3','#9c27b0','#ffffff'][i % 6]!}
          rx={2} transform={`rotate(${(i * 25) % 60 - 30},${x + 4},${(i * 17) % 78 + 15})`} />
      ))}
      {R(0, 18, 320, 52, '#0d47a1', 0, OL, 1)}
      {[23, 40, 56].map((y) =>
        [0, 16, 32, 48, 64, 80, 96, 112, 128, 144, 160, 176, 192, 208, 224, 240, 256, 272, 288].map((x, i) => (
          <circle key={`${y}-${i}`} cx={x + 8} cy={y} r={5}
            fill={i % 3 === 0 ? '#f8f8f8' : i % 3 === 1 ? '#4a6fa5' : '#f9a825'} />
        ))
      )}
      {[18, 78, 158, 238].map((x) => (
        <g key={x}>
          {R(x, 18, 3, 30, '#b0bec5')}
          {R(x + 3, 20, 22, 7, '#4a6fa5')} {R(x + 3, 27, 22, 7, '#f8f8f8')} {R(x + 3, 34, 22, 7, '#4a6fa5')}
          {Circ(x + 14, 30, 4, '#f9a825')}
        </g>
      ))}
      {R(0, 108, 320, 72, '#2e7d32', 0, OL, 1)}
      {[0, 40, 80, 120, 160, 200, 240, 280].map((x) => R(x, 108, 38, 72, x % 80 === 0 ? '#2e7d32' : '#388e3c'))}
      {R(8, 118, 30, 30, 'none', 0, '#ffffff', 3)} {R(282, 118, 30, 30, 'none', 0, '#ffffff', 3)}
      {R(146, 78, 26, 30, C.gold, 4, OL, 2.5)}
      {R(138, 106, 42, 8, C.gold, 2, OL, 2)} {R(142, 114, 34, 6, '#e65100', 2, OL, 2)}
      {Circ(142, 88, 8, C.gold, OL, 2)} {Circ(178, 88, 8, C.gold, OL, 2)}
      <polygon points="159,68 161.5,74.5 168,74.5 162.5,78.5 164.5,85 159,81 153.5,85 155.5,78.5 150,74.5 156.5,74.5"
        fill={C.gold} stroke={OL} strokeWidth={1.5} />
      <Person cx={98} baseY={178} skinColor={C.skin} hairColor={C.hair}
        suitColor="#eeeeee" shirtColor="#4a6fa5" tieColor="#4a6fa5" armR={-60} mouthOpen={true} />
      <Person cx={218} baseY={178} skinColor={C.skin} hairColor={C.hairBlk}
        suitColor="#4a6fa5" shirtColor="#f8f8f8" tieColor="#f8f8f8" armL={60} mouthOpen={true} />
    </g>
  );
}

// ── SCENE: arg_corralito ──────────────────────────────────────────────────────
function SceneArgCorralito() {
  return (
    <g>
      {R(0, 0, 320, 180, '#90a4ae')}
      {R(0, 18, 202, 132, C.wallCrm, 0, OL, 2.5)}
      {[14, 48, 98, 133].map((x) => R(x, 18, 14, 100, '#d7ccc8', 0, OL, 2))}
      {R(0, 126, 202, 8, '#c8b898', 0, OL, 1)} {R(0, 134, 202, 6, '#bca888', 0, OL, 1)}
      {R(63, 48, 62, 82, '#3e2723', 4, OL, 2.5)}
      {R(58, 43, 72, 16, '#c62828', 4, OL, 2.5)}
      {[68, 78, 88, 98, 108].map((x) => (
        <line key={x} x1={x} y1={48} x2={x} y2={130} stroke="#546e7a" strokeWidth={4} />
      ))}
      {[0, 12, 24, 36, 48].map((dx) => R(64 + dx, 86, 14, 8, '#b0bec5', 2, OL, 1.5))}
      {Circ(93, 90, 9, '#90a4ae', OL, 2)}
      {R(0, 140, 320, 40, '#78909c')}
      {[208, 238, 263, 283].map((x, i) => (
        <Protester key={i} cx={x} baseY={178} shirtColor={['#ef5350','#37474f','#1565c0','#8d6e63'][i]!}
          signColor={C.red} />
      ))}
      <path d="M 208 158 L 208 173 Q 208 178 203 178 L 48 178" stroke={C.red} strokeWidth={2} fill="none" strokeDasharray="6,3" />
    </g>
  );
}

// ── SCENE: arg_campo ──────────────────────────────────────────────────────────
function SceneArgCampo() {
  return (
    <g>
      {R(0, 0, 320, 180, '#e3f2fd')}
      {R(0, 93, 320, 87, '#8bc34a')}
      {R(0, 108, 320, 72, '#7cb342')} {R(0, 128, 320, 52, '#689f38')}
      {[28, 138, 238].map((x) => (
        <g key={x}>
          {Circ(x, 28, 18, '#ffffff', OL, 1)} {Circ(x + 18, 24, 22, '#f5f5f5', OL, 1)}
          {Circ(x + 36, 30, 16, '#ffffff', OL, 1)}
        </g>
      ))}
      {R(218, 48, 40, 92, '#9e9e9e', 4, OL, 2.5)}
      <ellipse cx={238} cy={48} rx={20} ry={10} fill="#bdbdbd" stroke={OL} strokeWidth={2} />
      {[58, 73, 88, 103].map((y) => <line key={y} x1={218} y1={y} x2={258} y2={y} stroke="#757575" strokeWidth={1.5} />)}
      {R(58, 116, 80, 40, '#e65100', 6, OL, 2.5)}
      {R(98, 98, 38, 20, '#bf360c', 4, OL, 2)}
      {R(106, 101, 22, 12, '#b3e5fc', 3, OL, 1.5)}
      {Circ(78, 158, 22, '#37474f', OL, 2.5)} {Circ(78, 158, 12, '#546e7a')}
      {Circ(126, 154, 16, '#37474f', OL, 2.5)} {Circ(126, 154, 8, '#546e7a')}
      {R(132, 93, 8, 14, '#546e7a', 2)}
      <Person cx={112} baseY={128} skinColor={C.skin} hairColor={C.hair}
        hatColor="#795548" suitColor="#4e342e" shirtColor="#ff8a65" tieColor="#4e342e" />
      {R(173, 93, 4, 57, '#795548')}
      {R(160, 93, 30, 22, '#f8f8f8', 2, OL, 2)}
      {[99, 106].map((y) => R(164, y, 22, 4, C.red, 1))}
    </g>
  );
}

// ── SCENE: crisis ─────────────────────────────────────────────────────────────
function SceneCrisis({ presidentId }: { presidentId: string }) {
  return (
    <g>
      {R(0, 0, 320, 180, '#1a0800')}
      {R(78, 28, 162, 112, '#c62828', 4, OL, 2.5)}
      {[98, 138, 178, 218].map((x, i) => (
        <g key={i}>
          {R(x, 48 + (i % 2) * 20, 20, 22, '#ff8f00', 3, OL, 1.5)}
          {R(x + 3, 48 + (i % 2) * 20, 14, 22, C.fire)}
        </g>
      ))}
      <polygon points="58,138 98,98 118,133 148,88 178,133 208,93 238,138 278,98 320,138 320,180 0,180 0,138" fill={C.fire} opacity={0.9} />
      <polygon points="78,138 108,106 138,134 168,98 198,134 228,103 258,138" fill={C.fireLt} opacity={0.75} />
      <Person cx={58} baseY={156} skinColor={C.skin}
        hairColor={presidentId === 'tecnocrata' ? C.hairBlnd : presidentId === 'ingeniero' ? '#2c1208' : C.hairBlk}
        suitColor={C.suitDk} mouthOpen={true} armL={30} armR={-60} />
      {[78, 158, 238].map((x, i) => <ellipse key={i} cx={x} cy={28} rx={22} ry={12} fill="#37474f" opacity={0.5} />)}
    </g>
  );
}

// ── Scene selector ────────────────────────────────────────────────────────────
function selectScene(category: string, eventId: string, gameState: GameState | null | undefined): string {
  // Specific event IDs
  if (eventId === 'arg_015' || eventId?.includes('mundial') || eventId?.includes('campeon')) return 'arg_mundial';
  if (eventId === 'arg_002' || eventId?.includes('corralito')) return 'arg_corralito';
  if (eventId === 'arg_003' || eventId?.includes('campo')) return 'arg_campo';
  if (eventId?.includes('impeach') || eventId?.includes('juicio_politico')) return 'crisis_impeachment';
  if (eventId?.includes('dolar') || eventId?.includes('dollar') || eventId?.includes('devalua') || eventId?.includes('tipo_cambio')) return 'arg_dolar';
  if (eventId?.includes('fmi_deal') || eventId?.includes('imf_deal') || eventId?.includes('fmi_neg')) return 'arg_fmi_negocio';
  if (eventId?.startsWith('session_law_') || eventId?.startsWith('law_')) return 'arg_congreso_ley';

  if (category === 'crisis') return 'crisis';

  if (category === 'international') {
    if (eventId?.includes('fmi') || eventId?.includes('emb') || eventId?.includes('imf')) return 'int_imf';
    if (eventId?.includes('war') || eventId?.includes('guerra') || eventId?.includes('conflict')) return 'int_war';
    if (eventId?.includes('trade') || eventId?.includes('export') || eventId?.includes('comercio')) return 'int_trade';
    return 'int_imf';
  }

  if (category === 'economic') {
    if (eventId?.includes('reserv')) return 'eco_reserves';
    if (eventId?.includes('growth') || eventId?.includes('pib') || eventId?.includes('gdp') || eventId?.includes('crecim')) return 'eco_growth';
    return 'eco_inflation';
  }

  if (category === 'social') {
    if (eventId?.includes('huelga') || eventId?.includes('strike') || eventId?.includes('sind')) return 'soc_strike';
    if (eventId?.includes('health') || eventId?.includes('salud') || eventId?.includes('hospital')) return 'soc_health';
    return 'soc_unrest';
  }

  if (category === 'political') {
    if (eventId?.startsWith('scan_') || eventId?.includes('scandal') || eventId?.includes('escandalos')) return 'pol_scandal';
    if (eventId?.includes('protest') || eventId?.includes('marcha') || eventId?.includes('piquete')) return 'pol_protest';
    if (eventId?.startsWith('arg_') && eventId !== 'arg_015') return 'pol_scandal';
    const popularity = gameState?.political.popularity ?? 50;
    if (popularity < 25) return 'crisis';
    return 'pol_congress';
  }

  return 'pol_congress';
}

// ── Export ─────────────────────────────────────────────────────────────────────
export function EventIllustration({
  eventCategory, presidentId, eventId = '', gameState,
}: Props) {
  const scene = selectScene(eventCategory, eventId, gameState);
  const imageUrl = useGameImage(scene);

  // If we have a real AI-generated image, show it
  if (imageUrl) {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          background: '#1a1a2e',
        }}
      >
        <img
          src={imageUrl}
          alt={eventCategory}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          loading="lazy"
        />
      </div>
    );
  }

  // Fallback: inline SVG scenes
  return (
    <svg viewBox="0 0 320 180"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%', display: 'block' }}
      preserveAspectRatio="xMidYMid slice"
      role="img" aria-label={`Ilustración: ${eventCategory}`}>
      {(scene === 'pol_congress' || scene === 'arg_congreso_ley') && <ScenePolCongress presidentId={presidentId} />}
      {(scene === 'pol_scandal' || scene === 'arg_fmi_negocio')   && <ScenePolScandal presidentId={presidentId} />}
      {scene === 'pol_protest'   && <ScenePolProtest />}
      {scene === 'eco_inflation' && <SceneEcoInflation />}
      {scene === 'eco_reserves'  && <SceneEcoReserves />}
      {scene === 'eco_growth'    && <SceneEcoGrowth />}
      {scene === 'soc_strike'    && <SceneSocStrike />}
      {scene === 'soc_unrest'    && <SceneSocUnrest />}
      {scene === 'soc_health'    && <SceneSocHealth />}
      {scene === 'int_imf'       && <SceneIntImf presidentId={presidentId} />}
      {scene === 'int_war'       && <SceneIntWar />}
      {scene === 'int_trade'     && <SceneIntTrade />}
      {scene === 'arg_mundial'   && <SceneArgMundial />}
      {scene === 'arg_corralito' && <SceneArgCorralito />}
      {(scene === 'arg_campo' || scene === 'arg_dolar') && <SceneArgCampo />}
      {(scene === 'crisis' || scene === 'crisis_impeachment') && <SceneCrisis presidentId={presidentId} />}
    </svg>
  );
}
