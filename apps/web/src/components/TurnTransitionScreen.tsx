import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { TransitionData } from '../stores/gameStore.js';
import { InflationBreakdownPanel } from './InflationBreakdownPanel.js';
import { useGameStore } from '../stores/gameStore.js';

// ── pixel palette (subset) ───────────────────────────────────────────────
const P = 6;
const NAV = '#162032'; const SLT = '#2A3D52'; const CB  = '#74ACDF';
const WH  = '#ECE8E0'; const SK  = '#D4956A'; const BK  = '#080C12';
const GN  = '#3AA858'; const DG  = '#1E3A1E'; const BR  = '#7A5530';
const RD  = '#EF3030'; const OR  = '#FF7B2A'; const YL  = '#FFD84D';
const GR2 = '#8A9BAA'; const LB  = '#B3D4F0'; const GD  = '#F6B40E';
const PK  = '#E8B4B8'; // Casa Rosada pink

type CasaState = 'guard' | 'mate' | 'quiet' | 'protest' | 'riot' | 'chaos' | 'nuke';

function px(col: number, row: number, w: number, h: number, fill: string) {
  return <rect x={col * P} y={row * P} width={w * P} height={h * P} fill={fill} />;
}

function Person({ c, r, suit = SLT, hair = BK }: { c: number; r: number; suit?: string; hair?: string }) {
  return (
    <g>
      {px(c, r,   2, 1, hair)}
      {px(c, r+1, 2, 1, SK)}
      {px(c, r+2, 2, 2, suit)}
      {px(c, r+4, 1, 1, suit)}
      {px(c+1, r+4, 1, 1, suit)}
    </g>
  );
}

function CasaRosadaScene({ state }: { state: CasaState }) {
  const W = 320; const H = 140;
  // Sky color
  const skyColor = state === 'nuke' ? '#4A1800'
    : state === 'chaos' ? '#2A1A08'
    : state === 'riot'  ? '#1A1228'
    : LB;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', width: '100%', imageRendering: 'pixelated' }}
      preserveAspectRatio="xMidYMid meet">

      {/* Sky */}
      <rect x={0} y={0} width={W} height={H} fill={skyColor} />

      {/* Floating island — green grass top, brown dirt body narrowing to point */}
      {px(4, 15, 46, 2, GN)}
      {px(4, 15, 46, 1, DG)}
      {px(5, 17, 44, 2, BR)}
      {px(7, 19, 40, 2, BR)}
      {px(10, 21, 34, 1, BK)}

      {/* Casa Rosada — pink neoclassical building */}
      {px(10, 7, 33, 9, PK)}
      {/* Arcade arches — 3 dark openings */}
      {px(13, 11, 4, 5, BK)}
      {px(20, 11, 4, 5, BK)}
      {px(27, 11, 4, 5, BK)}
      {/* Windows upper floor */}
      {[13, 18, 23, 28].map(c => px(c, 8, 3, 2, CB))}
      {/* Cornice top */}
      {px(9, 6, 35, 2, WH)}
      {px(8, 5, 37, 1, GR2)}

      {/* Argentine flag — mast + stripes */}
      <rect x={25 * P} y={1 * P} width={2} height={5 * P} fill={BR} />
      {px(26, 1, 6, 1, CB)}
      {px(26, 2, 6, 1, WH)}
      {px(26, 3, 6, 1, CB)}

      {/* ── State layers ── */}

      {/* GUARD — 2 guards at island edges, full plaza */}
      {(state === 'guard') && <>
        <Person c={5}  r={10} suit={NAV} hair={BK} />
        <Person c={46} r={10} suit={NAV} hair={BK} />
        {/* Guard hats */}
        {px(5,9,2,1,BK)}{px(46,9,2,1,BK)}
      </>}

      {/* MATE — civilians relaxing, mate cups */}
      {(state === 'mate') && <>
        <Person c={6}  r={11} suit={SLT} />
        <Person c={10} r={11} suit={CB} />
        <Person c={44} r={11} suit={SLT} />
        {/* Mate cup pixels */}
        {px(8,14,2,2,BR)}{px(12,14,2,2,BR)}{px(46,14,2,2,BR)}
      </>}

      {/* QUIET — empty plaza, a few pigeon dots */}
      {(state === 'quiet') && <>
        <rect x={15*P} y={15*P} width={3} height={3} fill={GR2} />
        <rect x={22*P} y={16*P} width={3} height={3} fill={GR2} />
        <rect x={30*P} y={15*P} width={3} height={3} fill={GR2} />
      </>}

      {/* PROTEST — 6 people with red signs */}
      {(state === 'protest') && <>
        {[5,10,16,22,36,43].map((c, i) => <Person key={i} c={c} r={11} suit={[RD,SLT,RD,CB,SLT,RD][i]!} />)}
        {/* Signs above heads */}
        {[5,16,36].map((c,i) => <rect key={i} x={c*P} y={8*P} width={3*P} height={2*P} fill={RD} />)}
      </>}

      {/* RIOT — 8 people with sticks + orange sky tint */}
      {(state === 'riot') && <>
        <rect x={0} y={0} width={W} height={H} fill="rgba(80,30,0,0.25)" />
        {[4,8,13,18,25,32,38,44].map((c, i) => <Person key={i} c={c} r={10} suit={[RD,SLT,OR,RD,SLT,OR,RD,SLT][i]!} />)}
        {/* Sticks / bats above heads */}
        {[4,13,25,38].map((c,i) => <rect key={i} x={(c+1)*P} y={7*P} width={2} height={3*P} fill={BR} />)}
      </>}

      {/* CHAOS — 10+ people, corner fires, broken windows */}
      {(state === 'chaos') && <>
        <rect x={0} y={0} width={W} height={H} fill="rgba(120,40,0,0.35)" />
        {[2,6,10,15,20,25,30,35,40,45].map((c, i) => <Person key={i} c={c} r={10} suit={[RD,OR,RD,SLT,OR,RD,SLT,OR,RD,OR][i]!} />)}
        {/* Fire columns at island corners */}
        {px(4,12,3,3,OR)}{px(4,10,3,2,YL)}
        {px(45,12,3,3,OR)}{px(45,10,3,2,YL)}
        {/* Broken windows on building */}
        {[13,20,27].map(c => <rect key={c} x={c*P} y={8*P} width={3*P} height={2*P} fill={BK} />)}
      </>}

      {/* NUKE — glowing orange sky, radiation symbol, cracked building */}
      {(state === 'nuke') && <>
        <rect x={0} y={0} width={W} height={H} fill="rgba(255,80,0,0.45)" />
        {/* Cracked / broken building overlay */}
        {px(10,7,33,9,OR)}
        <rect x={10*P} y={7*P} width={33*P} height={9*P} fill="rgba(0,0,0,0.6)" />
        {/* Rubble */}
        {[10,15,22,28,35].map((c,i) => <rect key={i} x={c*P} y={15*P} width={(2+i%2)*P} height={P} fill={GR2} />)}
        {/* Radiation symbol — simplified pixel */}
        <circle cx={26*P} cy={9*P} r={12} fill="rgba(255,200,0,0.8)" />
        <circle cx={26*P} cy={9*P} r={5} fill={BK} />
        {/* ☢ blades */}
        {[-30, 90, 210].map((deg, i) => {
          const rad = (deg * Math.PI) / 180;
          const x1 = 26*P + Math.cos(rad) * 5;
          const y1 = 9*P + Math.sin(rad) * 5;
          const x2 = 26*P + Math.cos(rad) * 12;
          const y2 = 9*P + Math.sin(rad) * 12;
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={GD} strokeWidth={4} />;
        })}
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
      className="fixed inset-0 z-50 flex items-start justify-center pt-12 bg-navy-900/95"
    >
      <div className="max-w-xl w-full mx-4">
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

        {/* Casa Rosada floating island */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="w-full mb-4 pixel-border overflow-hidden"
        >
          <CasaRosadaScene state={casaState} />
        </motion.div>

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
