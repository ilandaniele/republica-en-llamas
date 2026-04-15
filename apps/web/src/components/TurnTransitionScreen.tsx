import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { TransitionData } from '../stores/gameStore.js';
import { InflationBreakdownPanel } from './InflationBreakdownPanel.js';
import { useGameStore } from '../stores/gameStore.js';

// ── pixel palette (subset) ───────────────────────────────────────────────
// P=3 on 96×40 grid → viewBox 288×120. Each cell is 3 SVG units.
// Double the grid density vs the old 48×20 layout → 4× more detail cells.
const P = 3;
const COLS = 96;
const ROWS = 40;
const NAV = '#162032'; const SLT = '#2A3D52'; const CB  = '#74ACDF';
const WH  = '#ECE8E0'; const SK  = '#D4956A'; const BK  = '#080C12';
const GN  = '#3AA858'; const DG  = '#1E3A1E'; const BR  = '#7A5530';
const RD  = '#EF3030'; const OR  = '#FF7B2A'; const YL  = '#FFD84D';
const GR2 = '#8A9BAA'; const LB  = '#B3D4F0'; const GD  = '#F6B40E';
const PK  = '#E8B4B8'; // Casa Rosada pink
const CR  = '#CC2200'; // crisis crimson
const ST  = '#C8A882'; // stone / cornice
const PK2 = '#F0C8CC'; // lighter pink facade highlight
const GR3 = '#6A7D8A'; // dark grey roof

type CasaState = 'guard' | 'mate' | 'quiet' | 'protest' | 'riot' | 'chaos' | 'nuke';

function px(col: number, row: number, w: number, h: number, fill: string) {
  return <rect x={col * P} y={row * P} width={w * P} height={h * P} fill={fill} />;
}

// 2×5 pixel person at P=3 → 6×15 SVG units
function Person({ c, r, suit = SLT, hair = BK, skin = SK }: { c: number; r: number; suit?: string; hair?: string; skin?: string }) {
  return (
    <g>
      {px(c,   r,   2, 1, hair)}
      {px(c,   r+1, 2, 1, skin)}
      {px(c,   r+2, 2, 2, suit)}
      {px(c,   r+4, 1, 1, suit)}
      {px(c+1, r+4, 1, 1, suit)}
    </g>
  );
}

function CasaRosadaScene({ state }: { state: CasaState }) {
  const W = COLS * P;  // 96 × 3 = 288
  const H = ROWS * P;  // 40 × 3 = 120
  const skyColor = state === 'nuke'  ? '#3A1000'
    : state === 'chaos' ? '#221508'
    : state === 'riot'  ? '#160E1E'
    : LB;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', width: '100%', imageRendering: 'pixelated' }}
      preserveAspectRatio="xMidYMid meet">

      {/* Sky */}
      <rect x={0} y={0} width={W} height={H} fill={skyColor} />

      {/* City skyline silhouette — 10 buildings on 96×40 grid */}
      {[0,10,18,26,34,40,50,58,66,74].map((x, i) => {
        const hs = [22,18,26,20,14,30,24,16,28,20];
        const ws = [10,8,10,8,6,10,8,8,8,6];
        return <rect key={i} x={x*P} y={(38-hs[i]!)*P} width={ws[i]!*P} height={hs[i]!*P} fill="rgba(20,30,50,0.4)" />;
      })}

      {/* Floating island */}
      {px(2, 24, 92, 2, DG)}
      {px(2, 26, 92, 2, GN)}
      {/* Plaza with cobblestone pattern */}
      {px(6, 28, 84, 4, BR)}
      {[8,16,24,32,40,48,56,64,72,80].map((c,i) => (
        <rect key={i} x={c*P} y={28*P} width={6*P} height={2*P} fill="rgba(0,0,0,0.18)" />
      ))}
      {/* Cobble cross-lines */}
      {[8,16,24,32,40,48,56,64,72,80].map((c,i) => (
        <rect key={`v${i}`} x={c*P} y={30*P} width={6*P} height={1*P} fill="rgba(0,0,0,0.12)" />
      ))}
      {/* Island narrows toward bottom */}
      {px(10, 32, 76, 2, BR)}
      {px(14, 34, 68, 2, BR)}
      {px(20, 36, 56, 2, BR)}
      {px(28, 38, 40, 2, BK)}

      {/* ── Casa Rosada — 96×40 grid, P=3, viewBox 288×120 ── */}

      {/* Main facade — two floors */}
      {px(14, 12, 68, 14, PK)}
      {/* Facade highlight on upper floor */}
      {px(16, 12, 64, 4, PK2)}
      {/* Horizontal stonework courses */}
      {px(14, 18, 68, 1, ST)}
      {px(14, 22, 68, 1, ST)}

      {/* Wing extensions */}
      {px(12, 16, 4, 10, PK)}
      {px(80, 16, 4, 10, PK)}
      {/* Wing stonework */}
      {px(12, 20, 4, 1, ST)}
      {px(80, 20, 4, 1, ST)}

      {/* Cornice — top band */}
      {px(12,  8, 72, 4, WH)}
      {/* Dentil row — alternating GR2 blocks */}
      {[12,16,20,24,28,32,36,40,44,48,52,56,60,64,68,72,76,80].map((c,i) => (
        <rect key={i} x={c*P} y={8*P} width={2*P} height={2*P} fill={GR2} />
      ))}

      {/* Parapet balustrade */}
      {px(12, 10, 72, 2, ST)}
      {/* Balustrade spindles */}
      {[12,15,18,21,24,27,30,33,36,39,42,45,48,51,54,57,60,63,66,69,72,75,78].map((c,i) => (
        <rect key={i} x={c*P} y={10*P} width={2*P} height={2*P} fill={WH} />
      ))}

      {/* 5 arcade arches on ground floor — each arch 8 cols wide */}
      {[18,30,42,54,66].map((c,i) => (
        <g key={i}>
          {/* Arch opening */}
          {px(c, 18, 8, 10, BK)}
          {/* Arch lintel */}
          {px(c-2, 16, 12, 2, PK)}
          {/* Arch soffit (curved pixel art — 2-cell steps) */}
          {px(c,   14, 8, 2, PK)}
          {px(c+1, 13, 6, 1, PK)}
          {px(c+2, 12, 4, 1, PK)}
          {/* Keystone accent */}
          {px(c+3, 13, 2, 1, ST)}
          {/* Arch pilasters */}
          {px(c-2, 18, 2, 10, ST)}
          {px(c+8, 18, 2, 10, ST)}
        </g>
      ))}

      {/* Upper floor windows — 10 celeste windows with cross-dividers */}
      {[16,24,32,42,50,58,67,75,78,82].slice(0,8).map((c,i) => {
        const cols = [16,24,32,42,50,58,67,75];
        const col = cols[i]!;
        return (
          <g key={i}>
            {px(col, 12, 6, 6, CB)}
            {/* Window sill */}
            {px(col-1, 18, 8, 1, ST)}
            {/* Cross divider vertical */}
            <rect x={(col+3)*P} y={12*P} width={P} height={6*P} fill="rgba(0,0,0,0.3)" />
            {/* Cross divider horizontal */}
            <rect x={col*P} y={15*P} width={6*P} height={P} fill="rgba(0,0,0,0.3)" />
            {/* Window header arch */}
            {px(col, 11, 6, 1, ST)}
          </g>
        );
      })}

      {/* Balcony rail between floors */}
      {px(14, 18, 68, 2, ST)}
      {/* Balcony balusters */}
      {[14,17,20,23,26,29,32,35,38,41,44,47,50,53,56,59,62,65,68,71,74,77,80].map((c,i) => (
        <rect key={i} x={c*P} y={18*P} width={2*P} height={2*P} fill={WH} />
      ))}

      {/* Side pavilion pillars */}
      {[14,15,16,80,81,82].map((c,i) => (
        <rect key={i} x={c*P} y={12*P} width={P} height={14*P} fill={ST} />
      ))}
      {/* Pavilion capitals */}
      {px(13, 11, 5, 1, WH)}
      {px(79, 11, 5, 1, WH)}

      {/* Roof trim line */}
      {px(14, 12, 68, 2, GR3)}

      {/* Center clock tower */}
      {px(42,  4, 12, 10, PK)}
      {px(40,  2, 16,  2, ST)}
      {px(42,  0, 12,  2, WH)}
      {/* Tower cornice */}
      {px(41,  8, 14,  2, ST)}
      {/* Clock face surround */}
      {px(43,  4,  10, 6, WH)}
      {/* Clock face detail */}
      {px(44,  4,  8, 6, '#F5F0E8')}
      {/* 12 o'clock mark */}
      {px(47,  4, 2, 1, GR2)}
      {/* 6 o'clock mark */}
      {px(47,  9, 2, 1, GR2)}
      {/* 9 o'clock mark */}
      {px(43,  6, 2, 1, GR2)}
      {/* 3 o'clock mark */}
      {px(51,  6, 2, 1, GR2)}
      {/* Hour hand */}
      <rect x={48*P} y={4*P+1} width={1} height={4*P} fill={BK} />
      {/* Minute hand */}
      <rect x={48*P} y={5*P} width={4*P} height={1} fill={BK} />

      {/* Argentine flag on clock tower */}
      <rect x={49*P+1} y={0} width={3} height={6*P} fill={BR} />
      {px(50, 0, 10, 2, CB)}
      {px(50, 2, 10, 2, WH)}
      {px(50, 4, 10, 2, CB)}
      {/* Sol de Mayo — 2×2 gold dot in white stripe */}
      {px(54, 2, 2, 2, GD)}

      {/* ── State layers ── */}

      {/* GUARD — 4 guards at plaza edges */}
      {state === 'guard' && <>
        <Person c={4}   r={18} suit={NAV} hair={BK} />
        <Person c={10}  r={18} suit={NAV} hair={BK} />
        <Person c={82}  r={18} suit={NAV} hair={BK} />
        <Person c={88}  r={18} suit={NAV} hair={BK} />
        {/* Guard rifles */}
        {px(4,16,2,2,BK)}{px(10,16,2,2,BK)}{px(82,16,2,2,BK)}{px(88,16,2,2,BK)}
        {/* Flag poles in plaza */}
        <rect x={36*P} y={22*P} width={3} height={6*P} fill={GR2} />
        <rect x={62*P} y={22*P} width={3} height={6*P} fill={GR2} />
        {px(37,22,6,2,CB)}{px(37,24,6,2,WH)}{px(37,26,6,2,CB)}
        {px(63,22,6,2,CB)}{px(63,24,6,2,WH)}{px(63,26,6,2,CB)}
      </>}

      {/* MATE — 6 civilians, mate cups, benches */}
      {state === 'mate' && <>
        <Person c={6}   r={20} suit={SLT} />
        <Person c={12}  r={20} suit={CB} />
        <Person c={18}  r={20} hair="#8B4513" suit={GN} />
        <Person c={78}  r={20} suit={SLT} />
        <Person c={84}  r={20} suit={CB} />
        <Person c={72}  r={20} suit={OR} />
        {/* Benches */}
        {px(8, 26, 12, 2, BR)}{px(8,28,12,2,'#5a3a1e')}
        {px(70,26,12,2, BR)}{px(70,28,12,2,'#5a3a1e')}
        {/* Mate cups */}
        {[10,16,74].map((c,i) => (
          <g key={i}>
            {px(c, 26, 4, 4, '#8B4513')}
            <rect x={(c+2)*P} y={24*P} width={4} height={4*P} fill="#A8A8A8" />
          </g>
        ))}
      </>}

      {/* QUIET — pigeons, lone guard */}
      {state === 'quiet' && <>
        {[20,36,50,66].map((c,i) => (
          <g key={i}>
            {/* Pigeon body */}
            <rect x={c*P} y={26*P} width={4*P} height={3*P} fill={GR2} />
            {/* Pigeon head */}
            <rect x={c*P+1} y={25*P} width={2*P} height={2*P} fill={GR2} />
            {/* Tail feathers */}
            <rect x={(c+4)*P} y={27*P} width={2*P} height={2*P} fill="#9AAABB" />
          </g>
        ))}
        <Person c={46} r={20} suit={NAV} hair={BK} />
      </>}

      {/* PROTEST — 10 people, signs, banner */}
      {state === 'protest' && <>
        {[4,10,14,20,24,60,64,70,76,80].map((c,i) => (
          <Person key={i} c={c} r={18} suit={[RD,SLT,OR,CB,RD,SLT,RD,OR,CB,RD][i]!} />
        ))}
        {/* Protest signs */}
        {[4,14,24,64,76].map((c,i) => (
          <g key={i}>
            {px(c, 14, 4, 4, RD)}
            <rect x={(c+2)*P} y={12*P} width={2} height={4*P} fill={GR2} />
          </g>
        ))}
        {/* Banner across plaza */}
        {px(28, 22, 36, 4, RD)}
        {px(30, 24, 32, 2, WH)}
      </>}

      {/* RIOT — 14 people, sticks, fires */}
      {state === 'riot' && <>
        <rect x={0} y={0} width={W} height={H} fill="rgba(80,30,0,0.30)" />
        {[4,8,12,16,20,24,28,56,60,66,70,76,80,86].map((c,i) => (
          <Person key={i} c={c} r={18} suit={[RD,SLT,OR,RD,OR,SLT,RD,OR,RD,SLT,OR,RD,SLT,OR][i]!} />
        ))}
        {/* Riot torches */}
        {[4,12,20,28,60,70,80].map((c,i) => (
          <rect key={i} x={(c+1)*P} y={14*P} width={4} height={4*P} fill={BR} />
        ))}
        {/* Fire at edges */}
        {px(4,22,4,4,OR)}{px(4,20,4,2,YL)}
        {px(86,22,4,4,OR)}{px(86,20,4,2,YL)}
        {/* Broken pavement */}
        {[14,20,28,40,46].map(c => (
          <rect key={c} x={c*P} y={14*P} width={4*P} height={4*P} fill={BK} />
        ))}
      </>}

      {/* CHAOS — 16+ people, heavy fires, broken windows */}
      {state === 'chaos' && <>
        <rect x={0} y={0} width={W} height={H} fill="rgba(130,45,0,0.40)" />
        {[2,6,10,14,18,22,26,30,54,60,66,72,78,84,88,92].map((c,i) => (
          <Person key={i} c={c} r={18} suit={[RD,OR,RD,SLT,OR,CR,RD,SLT,OR,RD,SLT,OR,CR,RD,SLT,OR][i]!} />
        ))}
        {/* Large fires on both wings */}
        {px(2,18,6,6,OR)}{px(4,14,4,4,YL)}{px(4,12,4,2,WH)}
        {px(10,16,6,8,OR)}{px(12,12,4,4,YL)}
        {px(80,18,6,6,OR)}{px(82,14,4,4,YL)}{px(82,12,4,2,WH)}
        {px(74,16,6,8,OR)}{px(76,12,4,4,YL)}
        {/* Broken arch windows (black fill replaces pink) */}
        {[18,30,42,54,66].map(c => (
          <rect key={c} x={c*P} y={12*P} width={8*P} height={8*P} fill={BK} />
        ))}
        {/* Heavy smoke top */}
        <rect x={0} y={0} width={W} height={H*0.35} fill="rgba(20,5,0,0.45)" />
      </>}

      {/* NUKE — mushroom cloud, crumbled building */}
      {state === 'nuke' && <>
        <rect x={0} y={0} width={W} height={H} fill="rgba(255,90,0,0.50)" />
        {/* Mushroom stem */}
        {px(38, 8,20, 4,OR)}{px(38, 6,20, 2,YL)}
        {/* Cloud layers */}
        {px(34, 4,28, 4,OR)}{px(34, 2,28, 2,YL)}{px(36, 0,24, 2,WH)}
        {px(28, 0,40, 4,OR)}{px(30, 0,36, 2,YL)}
        {/* Building ruins */}
        {px(14,12,68,14,OR)}
        <rect x={14*P} y={12*P} width={68*P} height={14*P} fill="rgba(0,0,0,0.65)" />
        {/* Rubble chunks */}
        {[16,22,30,38,46,54,62,70].map((c,i) => (
          <rect key={i} x={c*P} y={26*P} width={(2+i%3)*P} height={2*P} fill={[GR2,BR,PK,GR3][i%4]!} />
        ))}
        {/* Gold presidential seal in dust cloud */}
        {px(40, 8,16,6,GD)}
        <rect x={40*P} y={8*P} width={16*P} height={6*P} fill="rgba(0,0,0,0.5)" />
        {px(44, 8, 8,6,GD)}
        {px(46, 6, 4,2,GD)}{px(46,14, 4,2,GD)}
        {px(42,10, 2,2,GD)}{px(52,10, 2,2,GD)}
        {px(46,10, 4,2,BK)}
      </>}
    </svg>
  );
}

interface Props {
  data: TransitionData;
  onDismiss: () => void;
}

export function TurnTransitionScreen({ data, onDismiss }: Props) {
  const [clicked, setClicked] = useState(false);
  const gameState = useGameStore((s) => s.gameState);
  const breakdown = gameState?.lastInflationBreakdown;

  const handleContinue = () => {
    setClicked(true);
    onDismiss();
  };

  const pop   = gameState?.political.popularity ?? 70;
  const stab  = gameState?.political.socialStability ?? 70;
  const hasNuke = !!(gameState?.characters?.[0]?.memoryFlags?.includes('ignored_nuke_threat'));
  const casaState: CasaState = hasNuke          ? 'nuke'
    : (pop < 20 || stab < 20)                   ? 'chaos'
    : (pop < 35 || stab < 30)                   ? 'riot'
    : (pop < 50 || stab < 45)                   ? 'protest'
    : (pop >= 80 && stab >= 75)                  ? 'guard'
    : (pop >= 65 && stab >= 65)                  ? 'mate'
    : 'quiet';

  return (
    <motion.div
      initial={{ y: '-100%', opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: '-100%', opacity: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed inset-0 z-50 overflow-y-auto bg-navy-900/95"
    >
      <div className="max-w-xl w-full mx-auto px-4 py-4">
        {/* Casa Rosada floating island — FIRST for quick visual context */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="w-full mb-4 pixel-border overflow-hidden"
        >
          <CasaRosadaScene state={casaState} />
        </motion.div>

        {/* Turn counter */}
        <div className="text-center mb-4">
          <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '7px' }} className="text-smoke-500 uppercase">TURNO {data.fromTurn} ▶ {data.toTurn}</span>
        </div>

        {/* Stat deltas */}
        {data.statDeltas.length > 0 && (
          <div className="pixel-border bg-navy-800 p-4 mb-4 grid grid-cols-2 gap-2">
            {data.statDeltas.map((d) => (
              <div key={d.label} className="flex items-center justify-between bg-navy-900/60 rounded px-3 py-2">
                <span className="font-mono text-xs text-smoke-400">{d.emoji} {d.label}</span>
                <span className={`font-mono font-bold text-sm ${d.delta > 0 ? 'text-green-400' : 'text-crimson-400'}`}>
                  {d.delta > 0 ? '+' : ''}{Math.round(d.delta)}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Newspaper headline */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-[#f4f4f0] text-smoke-900 p-4 mb-4 pixel-border" style={{ borderColor: '#888' }}>
          <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '6px' }} className="text-smoke-500 mb-2 uppercase">LA GACETA DE LA REPUBLICA</div>
          <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '8px', lineHeight: '1.8' }} className="font-black text-smoke-900 leading-tight">{data.headline}</div>
        </motion.div>

        {/* Inflation breakdown (shown when delta > 0.5) */}
        {breakdown && Math.abs(breakdown.delta) > 0.5 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="mb-4"
          >
            <InflationBreakdownPanel breakdown={breakdown} />
          </motion.div>
        )}

        {/* Hook text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-center text-smoke-400 italic mb-6"
          style={{ fontFamily: "'VT323', monospace", fontSize: '16px' }}
        >
          {data.hookText}
        </motion.p>

        {/* Continue button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="w-full"
        >
          <button
            onClick={handleContinue}
            className="w-full min-h-[56px] pixel-border-gold bg-gold-500 hover:bg-gold-400 active:bg-gold-600 text-navy-900 font-bold py-4 px-8 transition-colors shadow-lg"
            style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '8px' }}
          >
            CONTINUAR ▶
          </button>
          {!clicked && (
            <p className="text-smoke-500 font-mono text-xs mt-2 text-center animate-pulse">
              tocá para continuar →
            </p>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
