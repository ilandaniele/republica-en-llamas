import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { TransitionData } from '../stores/gameStore.js';
import { InflationBreakdownPanel } from './InflationBreakdownPanel.js';
import { useGameStore } from '../stores/gameStore.js';

// ── pixel palette (subset) ───────────────────────────────────────────────
// P=2 on 144×60 grid → viewBox 288×120. Each cell is 2 SVG units.
// 2.25× more detail cells vs the old P=3 layout.
const P = 2;
const COLS = 144;
const ROWS = 60;
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

// 2×5 person sprite at P=2 → 4×10 SVG units
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
  const W = COLS * P;  // 144 × 2 = 288
  const H = ROWS * P;  // 60  × 2 = 120
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

      {/* City skyline silhouette — 14 buildings */}
      {([0,12,22,32,42,52,62,72,84,96,106,116,126,136] as number[]).map((x, i) => {
        const hs = [28,24,34,26,18,38,30,22,36,26,20,32,28,24];
        const ws = [12,10,12,10,8,12,10,10,10,8,10,10,10,8];
        return <rect key={i} x={x*P} y={(58-hs[i]!)*P} width={ws[i]!*P} height={hs[i]!*P} fill="rgba(20,30,50,0.38)" />;
      })}

      {/* Ground strip */}
      {px(0, 56, 144, 4, DG)}
      {px(0, 57, 144, 3, GN)}
      {/* Plaza cobblestones */}
      {px(8, 45, 128, 14, BR)}
      {([10,22,34,46,58,70,82,94,106,118] as number[]).map((c,i) => (
        <rect key={i} x={c*P} y={45*P} width={10*P} height={3*P} fill="rgba(0,0,0,0.16)" />
      ))}
      {([10,22,34,46,58,70,82,94,106,118] as number[]).map((c,i) => (
        <rect key={`v${i}`} x={c*P} y={48*P} width={10*P} height={1*P} fill="rgba(0,0,0,0.10)" />
      ))}

      {/* ── Casa Rosada — 144×60 grid, P=2 ── */}

      {/* Corner pavilions — slightly taller */}
      {px(18, 17, 10, 42, PK)}
      {px(116, 17, 10, 42, PK)}
      {/* Pavilion highlights */}
      {px(19, 17, 8, 5, PK2)}
      {px(117, 17, 8, 5, PK2)}
      {/* Pavilion cornice */}
      {px(17, 14, 12, 3, WH)}
      {px(115, 14, 12, 3, WH)}
      {/* Pavilion dentils */}
      {([18,21,24] as number[]).map((c,i) => <rect key={i} x={c*P} y={14*P} width={2*P} height={2*P} fill={GR2} />)}
      {([116,119,122] as number[]).map((c,i) => <rect key={i} x={c*P} y={14*P} width={2*P} height={2*P} fill={GR2} />)}

      {/* Main facade — between pavilions, 2 floors */}
      {px(28, 20, 88, 39, PK)}
      {/* Facade highlight upper floor */}
      {px(30, 20, 84, 6, PK2)}
      {/* Horizontal stonework courses */}
      {px(28, 28, 88, 1, ST)}
      {px(28, 34, 88, 1, ST)}

      {/* Cornice across full width */}
      {px(17, 12, 110, 5, WH)}
      {/* Dentil row */}
      {([18,22,26,30,34,38,42,46,50,54,58,62,66,70,74,78,82,86,90,94,98,102,106,110,114,118,122] as number[]).map((c,i) => (
        <rect key={i} x={c*P} y={12*P} width={2*P} height={3*P} fill={GR2} />
      ))}

      {/* Parapet balustrade */}
      {px(17, 17, 110, 3, ST)}
      {([18,21,24,27,30,33,36,39,42,45,48,51,54,57,60,63,66,69,72,75,78,81,84,87,90,93,96,99,102,105,108,111,114,117,120,123] as number[]).map((c,i) => (
        <rect key={i} x={c*P} y={17*P} width={2*P} height={3*P} fill={WH} />
      ))}

      {/* 7 arcade arches on ground floor */}
      {([28,42,56,70,84,98,112] as number[]).map((c,i) => (
        <g key={i}>
          {px(c, 34, 10, 24, BK)}
          {px(c-1, 32, 12, 2, PK)}
          {px(c,   30, 10, 2, PK)}
          {px(c+1, 28, 8, 2, PK)}
          {px(c+2, 26, 6, 2, PK)}
          {px(c+3, 24, 4, 2, PK)}
          {px(c+4, 25, 2, 2, ST)}
          {px(c-2, 34, 3, 24, ST)}
          {px(c+10, 34, 3, 24, ST)}
        </g>
      ))}

      {/* Upper floor windows — 8 celeste windows with cross-dividers */}
      {([30,42,54,66,78,90,102,114] as number[]).map((c,i) => (
        <g key={i}>
          {px(c, 21, 8, 8, CB)}
          {px(c-1, 29, 10, 1, ST)}
          <rect x={(c+4)*P} y={21*P} width={P} height={8*P} fill="rgba(0,0,0,0.28)" />
          <rect x={c*P} y={25*P} width={8*P} height={P} fill="rgba(0,0,0,0.28)" />
          {px(c, 20, 8, 1, ST)}
        </g>
      ))}

      {/* Balcony rail between floors */}
      {px(28, 34, 88, 3, ST)}
      {([29,32,35,38,41,44,47,50,53,56,59,62,65,68,71,74,77,80,83,86,89,92,95,98,101,104,107,110,113] as number[]).map((c,i) => (
        <rect key={i} x={c*P} y={34*P} width={2*P} height={3*P} fill={WH} />
      ))}

      {/* Side pavilion pilasters */}
      {([18,20,22,24,116,118,120,122] as number[]).map((c,i) => (
        <rect key={i} x={c*P} y={20*P} width={P} height={22*P} fill={ST} />
      ))}

      {/* Roof trim */}
      {px(17, 12, 110, 2, GR3)}

      {/* Central flag tower */}
      {px(64,  4, 16, 14, PK)}
      {px(62,  2, 20,  2, ST)}
      {px(64,  0, 16,  2, WH)}
      {px(63,  9, 18,  3, ST)}
      {px(65,  4, 14,  8, WH)}
      {px(66,  4, 12,  8, '#F5F0E8')}
      {px(70,  4, 2, 1, GR2)}
      {px(70, 11, 2, 1, GR2)}
      {px(65,  7, 2, 1, GR2)}
      {px(77,  7, 2, 1, GR2)}
      <rect x={71*P} y={4*P+1} width={1} height={4*P} fill={BK} />
      <rect x={71*P} y={6*P} width={5*P} height={1} fill={BK} />

      {/* Argentine flag on tower */}
      <rect x={73*P+1} y={0} width={3} height={7*P} fill={BR} />
      {px(74, 0, 14, 2, CB)}
      {px(74, 2, 14, 2, WH)}
      {px(74, 4, 14, 2, CB)}
      {px(80, 2, 3, 2, GD)}

      {/* ── State layers ── */}

      {/* GUARD */}
      {state === 'guard' && <>
        <Person c={4}   r={28} suit={NAV} hair={BK} />
        <Person c={10}  r={28} suit={NAV} hair={BK} />
        <Person c={16}  r={28} suit={NAV} hair={BK} />
        <Person c={122} r={28} suit={NAV} hair={BK} />
        <Person c={128} r={28} suit={NAV} hair={BK} />
        <Person c={134} r={28} suit={NAV} hair={BK} />
        {([4,10,16,122,128,134] as number[]).map((c,i) => <rect key={i} x={c*P} y={24*P} width={2*P} height={4*P} fill={BK} />)}
        <rect x={54*P} y={37*P} width={3} height={8*P} fill={GR2} />
        <rect x={90*P} y={37*P} width={3} height={8*P} fill={GR2} />
        {px(55,37,8,2,CB)}{px(55,39,8,2,WH)}{px(55,41,8,2,CB)}
        {px(91,37,8,2,CB)}{px(91,39,8,2,WH)}{px(91,41,8,2,CB)}
      </>}

      {/* MATE */}
      {state === 'mate' && <>
        <Person c={8}   r={36} suit={SLT} />
        <Person c={16}  r={36} suit={CB} />
        <Person c={24}  r={36} hair="#8B4513" suit={GN} />
        <Person c={32}  r={36} suit={OR} />
        <Person c={108} r={36} suit={SLT} />
        <Person c={116} r={36} suit={CB} />
        <Person c={124} r={36} suit={GN} />
        <Person c={132} r={36} suit={OR} />
        {px(10,42,18,3,BR)}{px(10,45,18,3,'#5a3a1e')}
        {px(116,42,18,3,BR)}{px(116,45,18,3,'#5a3a1e')}
        {([12,22,118,128] as number[]).map((c,i) => (
          <g key={i}>
            {px(c, 40, 5, 5, '#8B4513')}
            <rect x={(c+3)*P} y={38*P} width={4} height={5*P} fill="#A8A8A8" />
          </g>
        ))}
      </>}

      {/* QUIET */}
      {state === 'quiet' && <>
        {([28,50,72,94,116] as number[]).map((c,i) => (
          <g key={i}>
            <rect x={c*P} y={42*P} width={6*P} height={4*P} fill={GR2} />
            <rect x={c*P+1} y={40*P} width={3*P} height={3*P} fill={GR2} />
            <rect x={(c+6)*P} y={43*P} width={3*P} height={3*P} fill="#9AAABB" />
          </g>
        ))}
        <Person c={68} r={32} suit={NAV} hair={BK} />
      </>}

      {/* PROTEST */}
      {state === 'protest' && <>
        {([4,10,16,22,28,34,40,104,110,116,122,128,134,140] as number[]).map((c,i) => (
          <Person key={i} c={c} r={28} suit={([RD,SLT,OR,CB,RD,SLT,RD,OR,CB,RD,SLT,OR,CB,RD] as string[])[i]!} />
        ))}
        {([4,16,28,110,128] as number[]).map((c,i) => (
          <g key={i}>
            {px(c, 22, 6, 6, RD)}
            <rect x={(c+3)*P} y={20*P} width={3} height={6*P} fill={GR2} />
          </g>
        ))}
        {px(44, 36, 56, 5, RD)}
        {px(46, 38, 52, 3, WH)}
      </>}

      {/* RIOT */}
      {state === 'riot' && <>
        <rect x={0} y={0} width={W} height={H} fill="rgba(80,30,0,0.28)" />
        {([4,8,14,18,24,28,34,38,44,100,106,112,118,124,130,136,140,142] as number[]).map((c,i) => (
          <Person key={i} c={c} r={28} suit={([RD,SLT,OR,RD,OR,SLT,RD,OR,RD,SLT,OR,RD,SLT,OR,RD,SLT,OR,RD] as string[])[i]!} />
        ))}
        {([4,14,24,34,104,120,132] as number[]).map((c,i) => (
          <rect key={i} x={(c+1)*P} y={22*P} width={4} height={6*P} fill={BR} />
        ))}
        {px(4,38,6,6,OR)}{px(4,34,6,4,YL)}
        {px(134,38,6,6,OR)}{px(134,34,6,4,YL)}
        {([20,30,40,60,72] as number[]).map(c => (
          <rect key={c} x={c*P} y={20*P} width={6*P} height={6*P} fill={BK} />
        ))}
      </>}

      {/* CHAOS */}
      {state === 'chaos' && <>
        <rect x={0} y={0} width={W} height={H} fill="rgba(130,45,0,0.38)" />
        {([2,6,12,16,20,24,30,36,40,46,98,108,116,124,130,136,140] as number[]).map((c,i) => (
          <Person key={i} c={c} r={28} suit={([RD,OR,RD,SLT,OR,CR,RD,SLT,OR,RD,SLT,OR,CR,RD,SLT,OR,RD] as string[])[i]!} />
        ))}
        {px(2,30,10,14,OR)}{px(4,22,8,8,YL)}{px(6,18,6,4,WH)}
        {px(14,26,10,18,OR)}{px(16,20,8,6,YL)}
        {px(122,30,10,14,OR)}{px(122,22,8,8,YL)}{px(122,18,6,4,WH)}
        {px(112,26,10,18,OR)}{px(112,20,8,6,YL)}
        {([28,42,56,70,84,98,112] as number[]).map(c => (
          <rect key={c} x={c*P} y={18*P} width={10*P} height={12*P} fill={BK} />
        ))}
        <rect x={0} y={0} width={W} height={H*0.32} fill="rgba(20,5,0,0.42)" />
      </>}

      {/* NUKE */}
      {state === 'nuke' && <>
        <rect x={0} y={0} width={W} height={H} fill="rgba(255,90,0,0.48)" />
        {px(56, 12,32, 6,OR)}{px(58,  8,28, 4,YL)}
        {px(48,  6,48, 6,OR)}{px(50,  3,44, 4,YL)}{px(52,  0,40, 4,WH)}
        {px(38,  0,68, 8,OR)}{px(42,  0,60, 4,YL)}
        {px(18,20, 108, 22,OR)}
        <rect x={18*P} y={20*P} width={108*P} height={22*P} fill="rgba(0,0,0,0.62)" />
        {([20,32,44,56,68,80,92,104,116] as number[]).map((c,i) => (
          <rect key={i} x={c*P} y={42*P} width={(4+i%4)*P} height={3*P} fill={([GR2,BR,PK,GR3] as string[])[i%4]!} />
        ))}
        {px(60, 12,24,10,GD)}
        <rect x={60*P} y={12*P} width={24*P} height={10*P} fill="rgba(0,0,0,0.48)" />
        {px(64, 12,16,10,GD)}
        {px(68,  9, 8, 3,GD)}{px(68,22, 8, 2,GD)}
        {px(60, 15, 4, 4,GD)}{px(80,15, 4, 4,GD)}
        {px(68, 15, 8, 4,BK)}
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
    if (clicked) return;
    setClicked(true);
    onDismiss();
  };

  // Keyboard: Enter or Space to continue
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleContinue(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [clicked]); // eslint-disable-line react-hooks/exhaustive-deps

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
              <div key={d.label} className="flex items-center justify-between bg-navy-900/60 px-3 py-2">
                <span className="font-mono text-xs text-smoke-400">{d.emoji} {d.label}</span>
                <span className={`font-mono font-bold text-sm ${d.delta > 0 ? 'text-green-400' : 'text-crimson-400'}`}>
                  {d.delta > 0 ? '▲ +' : '▼ '}{Math.round(d.delta)}
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
