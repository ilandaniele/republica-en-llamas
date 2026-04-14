import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { TransitionData } from '../stores/gameStore.js';
import { InflationBreakdownPanel } from './InflationBreakdownPanel.js';
import { useGameStore } from '../stores/gameStore.js';

// ── pixel palette (subset) ───────────────────────────────────────────────
// P=6 on 48×20 grid → viewBox 288×120 (same dims as before) but each pixel
// is visually 2× larger because the grid is half-density (48 cols vs 96).
const P = 6;
const COLS = 48;
const ROWS = 20;
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

// 2×5 pixel person at P=6 → 12×30 SVG units
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
  const W = COLS * P;  // 48 × 6 = 288
  const H = ROWS * P;  // 20 × 6 = 120
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

      {/* City skyline silhouette — 10 buildings, coords halved from original 96×40 grid */}
      {[0,5,9,13,17,20,25,29,33,37].map((x, i) => {
        const hs = [11,9,13,10,7,15,12,8,14,10];
        const ws = [5,4,5,4,3,5,4,4,4,3];
        return <rect key={i} x={x*P} y={(19-hs[i]!)*P} width={ws[i]!*P} height={hs[i]!*P} fill="rgba(20,30,50,0.4)" />;
      })}

      {/* Floating island */}
      {px(1, 12, 46, 1, DG)}
      {px(1, 13, 46, 1, GN)}
      {/* Plaza with cobblestone pattern */}
      {px(3, 14, 42, 2, BR)}
      {[4,8,12,16,20,24,28,32,36,40].map((c,i) => (
        <rect key={i} x={c*P} y={14*P} width={3*P} height={P} fill="rgba(0,0,0,0.2)" />
      ))}
      {/* Island narrows toward bottom */}
      {px(5, 16, 38, 1, BR)}
      {px(7, 17, 34, 1, BR)}
      {px(10, 18, 28, 1, BR)}
      {px(14, 19, 20, 1, BK)}

      {/* ── Casa Rosada — 48×20 grid, P=6 → pixels visually 2× larger ── */}

      {/* Main facade — two floors */}
      {px(7, 6, 34, 7, PK)}
      {px(8, 6, 32, 2, PK2)}

      {/* Wing extensions */}
      {px(6, 8, 2, 5, PK)}
      {px(40, 8, 2, 5, PK)}

      {/* Cornice + dentil row */}
      {px(6, 4, 36, 2, WH)}
      {[6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36,38,40].map((c,i) => (
        <rect key={i} x={c*P} y={4*P} width={P} height={P} fill={GR2} />
      ))}

      {/* Parapet balustrade */}
      {px(6, 5, 36, 1, ST)}
      {[6,9,12,15,18,21,24,27,30,33,36,39].map((c,i) => (
        <rect key={i} x={c*P} y={5*P} width={2*P} height={P} fill={ST} />
      ))}

      {/* 5 arcade arches on ground floor */}
      {[9,15,21,27,33].map((c,i) => (
        <g key={i}>
          {px(c, 9, 4, 5, BK)}
          {px(c-1, 8, 6, 1, PK)}
          {px(c,   7, 4, 1, PK)}
        </g>
      ))}

      {/* Upper floor windows — 8 celeste windows */}
      {[8,12,17,21,26,30,35,38].map((c,i) => (
        <g key={i}>
          {px(c, 6, 3, 3, CB)}
          {px(c-1, 9, 5, 1, ST)}
          <rect x={(c+1)*P} y={6*P} width={1} height={3*P} fill="rgba(0,0,0,0.3)" />
        </g>
      ))}

      {/* Balcony rail between floors */}
      {px(7, 9, 34, 1, ST)}
      {[7,9,11,13,15,17,19,21,23,25,27,29,31,33,35,37,39].map((c,i) => (
        <rect key={i} x={c*P} y={9*P} width={2*P} height={P} fill={WH} />
      ))}

      {/* Side pavilion pillars */}
      {[7,8,39,40].map((c,i) => (
        <rect key={i} x={c*P} y={6*P} width={P} height={7*P} fill={ST} />
      ))}

      {/* Center clock tower */}
      {px(21, 2, 6, 5, PK)}
      {px(20, 1, 8, 1, ST)}
      {px(21, 0, 6, 1, WH)}
      {/* Clock face */}
      {px(22, 2, 4, 3, WH)}
      {px(23, 2, 2, 1, GR2)}{/* 12 mark */}
      {px(23, 4, 2, 1, GR2)}{/* 6 mark */}
      {px(22, 3, 1, 1, GR2)}{/* 9 mark */}
      {px(25, 3, 1, 1, GR2)}{/* 3 mark */}
      <rect x={23*P+2} y={2*P+2} width={1} height={P*2} fill={BK} />
      <rect x={23*P+2} y={3*P+1} width={P*2} height={1} fill={BK} />

      {/* Argentine flag on clock tower */}
      <rect x={24*P+2} y={0} width={2} height={3*P} fill={BR} />
      {px(25, 0, 5, 1, CB)}
      {px(25, 1, 5, 1, WH)}
      {px(25, 2, 5, 1, CB)}

      {/* Roof trim */}
      {px(7, 6, 34, 1, GR3)}

      {/* ── State layers ── */}

      {/* GUARD — 4 guards at plaza edges */}
      {state === 'guard' && <>
        <Person c={2}  r={9} suit={NAV} hair={BK} />
        <Person c={5}  r={9} suit={NAV} hair={BK} />
        <Person c={41} r={9} suit={NAV} hair={BK} />
        <Person c={44} r={9} suit={NAV} hair={BK} />
        {px(2,8,2,1,BK)}{px(5,8,2,1,BK)}{px(41,8,2,1,BK)}{px(44,8,2,1,BK)}
        <rect x={18*P} y={11*P} width={2} height={3*P} fill={GR2} />
        <rect x={31*P} y={11*P} width={2} height={3*P} fill={GR2} />
        {px(18,11,3,1,CB)}{px(18,12,3,1,WH)}{px(18,13,3,1,CB)}
        {px(31,11,3,1,CB)}{px(31,12,3,1,WH)}{px(31,13,3,1,CB)}
      </>}

      {/* MATE — 6 civilians, mate cups, benches */}
      {state === 'mate' && <>
        <Person c={3}  r={10} suit={SLT} />
        <Person c={6}  r={10} suit={CB} />
        <Person c={9}  r={10} hair="#8B4513" suit={GN} />
        <Person c={39} r={10} suit={SLT} />
        <Person c={42} r={10} suit={CB} />
        <Person c={36} r={10} suit={OR} />
        {[5,8,37].map((c,i) => (
          <g key={i}>
            {px(c, 13, 2, 2, '#8B4513')}
            <rect x={(c+1)*P} y={12*P} width={2} height={2*P} fill="#A8A8A8" />
          </g>
        ))}
        {px(4,13,6,1,BR)}{px(4,14,6,1,'#5a3a1e')}
        {px(35,13,6,1,BR)}{px(35,14,6,1,'#5a3a1e')}
      </>}

      {/* QUIET — pigeons, lone guard */}
      {state === 'quiet' && <>
        {[10,18,25,33].map((c,i) => (
          <g key={i}>
            <rect x={c*P} y={13*P} width={3} height={3} fill={GR2} />
            <rect x={c*P+4} y={13*P} width={2} height={2} fill={GR2} />
          </g>
        ))}
        <Person c={23} r={10} suit={NAV} hair={BK} />
      </>}

      {/* PROTEST — 10 people, signs, banner */}
      {state === 'protest' && <>
        {[2,5,7,10,12,30,32,35,38,40].map((c,i) => (
          <Person key={i} c={c} r={9} suit={[RD,SLT,OR,CB,RD,SLT,RD,OR,CB,RD][i]!} />
        ))}
        {[2,7,12,32,38].map((c,i) => (
          <g key={i}>
            {px(c, 7, 2, 2, RD)}
            <rect x={(c+1)*P} y={6*P} width={1} height={2*P} fill={GR2} />
          </g>
        ))}
        {px(14, 11, 18, 2, RD)}
        {px(15, 12, 16, 1, WH)}
      </>}

      {/* RIOT — 14 people, sticks, fires */}
      {state === 'riot' && <>
        <rect x={0} y={0} width={W} height={H} fill="rgba(80,30,0,0.30)" />
        {[2,4,6,8,10,12,14,28,30,33,35,38,40,43].map((c,i) => (
          <Person key={i} c={c} r={9} suit={[RD,SLT,OR,RD,OR,SLT,RD,OR,RD,SLT,OR,RD,SLT,OR][i]!} />
        ))}
        {[2,6,10,14,30,35,40].map((c,i) => (
          <rect key={i} x={(c+1)*P} y={7*P} width={2} height={2*P} fill={BR} />
        ))}
        {px(2,11,2,2,OR)}{px(2,10,2,1,YL)}
        {px(43,11,2,2,OR)}{px(43,10,2,1,YL)}
        {[7,10,14,20,23].map(c => (
          <rect key={c} x={c*P} y={7*P} width={2*P} height={2*P} fill={BK} />
        ))}
      </>}

      {/* CHAOS — 16+ people, heavy fires, broken windows */}
      {state === 'chaos' && <>
        <rect x={0} y={0} width={W} height={H} fill="rgba(130,45,0,0.40)" />
        {[1,3,5,7,9,11,13,15,27,30,33,36,39,42,44,46].map((c,i) => (
          <Person key={i} c={c} r={9} suit={[RD,OR,RD,SLT,OR,CR,RD,SLT,OR,RD,SLT,OR,CR,RD,SLT,OR][i]!} />
        ))}
        {px(1,9,3,3,OR)}{px(2,7,2,2,YL)}{px(2,6,2,1,WH)}
        {px(5,8,3,4,OR)}{px(6,6,2,2,YL)}
        {px(40,9,3,3,OR)}{px(41,7,2,2,YL)}{px(41,6,2,1,WH)}
        {px(37,8,3,3,OR)}{px(38,6,2,2,YL)}
        {[9,15,21,27,33].map(c => (
          <rect key={c} x={c*P} y={6*P} width={4*P} height={4*P} fill={BK} />
        ))}
        <rect x={0} y={0} width={W} height={H*0.4} fill="rgba(20,5,0,0.35)" />
      </>}

      {/* NUKE — mushroom cloud, crumbled building */}
      {state === 'nuke' && <>
        <rect x={0} y={0} width={W} height={H} fill="rgba(255,90,0,0.50)" />
        {px(19,4,10,2,OR)}{px(19,3,10,1,YL)}
        {px(17,2,14,2,OR)}{px(17,1,14,1,YL)}{px(18,0,12,1,WH)}
        {px(14,0,20,2,OR)}{px(15,0,18,1,YL)}
        {px(7,6,34,7,OR)}
        <rect x={7*P} y={6*P} width={34*P} height={7*P} fill="rgba(0,0,0,0.65)" />
        {[8,11,15,19,23,27,31,35].map((c,i) => (
          <rect key={i} x={c*P} y={13*P} width={(1+i%2)*P} height={P} fill={[GR2,BR,PK,GR3][i%4]!} />
        ))}
        {px(20,4,8,3,GD)}
        <rect x={20*P} y={4*P} width={8*P} height={3*P} fill="rgba(0,0,0,0.5)" />
        {px(22,4,4,3,GD)}
        {px(23,3,2,1,GD)}{px(23,7,2,1,GD)}
        {px(21,5,1,1,GD)}{px(26,5,1,1,GD)}
        {px(23,5,2,1,BK)}
      </>}
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
