import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { GameState } from '@republica/game-engine';
import { useGameStore } from '../stores/gameStore.js';
import type { VarSnapshot } from '../stores/gameStore.js';
import { InflationBreakdownPanel } from './InflationBreakdownPanel.js';
import { PixelMate } from './illustrations/PixelMate.js';
import { PixelFuego } from './illustrations/PixelFuego.js';

interface Props {
  state: GameState;
}

interface MeterProps {
  label: string;
  value: number;
  prevValue?: number | undefined;
  max?: number | undefined;
  color: string;
  icon: string;
  inverse?: boolean | undefined;
  flashDir?: 'up' | 'down' | null | undefined;
}

function TrendArrow({ current, prev, inverse = false }: { current: number; prev?: number | undefined; inverse?: boolean | undefined }) {
  if (prev === undefined) return null;
  const delta = current - prev;
  if (Math.abs(delta) < 1) return <span className="text-smoke-600 text-xs">→</span>;
  const goingUp = delta > 0;
  // For higher-is-better vars: up = green. For lower-is-better (inverse): down = green.
  const isGood = inverse ? !goingUp : goingUp;
  const isVeryBig = Math.abs(delta) > 10;
  if (isVeryBig) {
    return <span className={isGood ? 'text-green-400 text-sm' : 'text-crimson-400 text-sm'}>{goingUp ? '↑↑' : '↓↓'}</span>;
  }
  return <span className={isGood ? 'text-green-400 text-xs' : 'text-crimson-400 text-xs'}>{goingUp ? '↑' : '↓'}</span>;
}

function AnimatedNumber({ value, inverse = false }: { value: number; inverse?: boolean }) {
  const [displayed, setDisplayed] = useState(value);
  const [flash, setFlash] = useState<'good' | 'bad' | null>(null);
  const prev = useRef(value);

  useEffect(() => {
    if (prev.current !== value) {
      const delta = value - prev.current;
      const goingUp = delta > 0;
      // For inverse vars (inflation, deficit): going up = bad; for normal vars: going up = good
      const isGood = inverse ? !goingUp : goingUp;
      setFlash(isGood ? 'good' : 'bad');
      const timer = setTimeout(() => {
        setDisplayed(value);
        setFlash(null);
        prev.current = value;
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [value, inverse]);

  return (
    <motion.span
      animate={flash ? { scale: [1, 1.2, 1] } : {}}
      transition={{ duration: 0.3 }}
      className={flash === 'good' ? 'text-green-400' : flash === 'bad' ? 'text-crimson-400' : 'text-smoke-100'}
    >
      {Math.round(displayed)}
    </motion.span>
  );
}

function Meter({ label, value, prevValue, max = 100, color, icon, inverse = false, flashDir }: MeterProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const isWarning = inverse ? pct > 70 : pct < 30;
  const isCritical = inverse ? pct > 85 : pct < 15;
  const isDanger = inverse ? pct > 75 : pct < 25;

  // Pixel bar color class
  const barFillClass = isCritical ? 'bar-critical' : isWarning ? 'bar-warning' : 'bar-good';
  const flashClass = flashDir === 'up' ? 'animate-bar-flash-up' : flashDir === 'down' ? 'animate-bar-flash-down' : '';

  return (
    <div className="variable-meter">
      <div className="flex justify-between items-center mb-1">
        <span
          style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '7px' }}
          className={`flex items-center gap-1 ${isCritical ? 'text-crimson-400' : isDanger ? 'text-gold-400' : 'text-smoke-400'}`}
        >
          {icon} {label}
          {isDanger && <span className="text-crimson-400"> !</span>}
        </span>
        <span
          style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '7px' }}
          className="font-bold flex items-center gap-1"
        >
          <TrendArrow current={value} prev={prevValue} inverse={inverse} />
          <AnimatedNumber value={Math.round(value)} inverse={inverse} />
        </span>
      </div>
      <div className={`pixel-bar-container ${flashClass}`}>
        <div
          className={`pixel-bar-fill ${barFillClass}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function getTemperatura(state: GameState): { label: string; emoji: string; color: string; bg: string } {
  const vars = [
    state.political.popularity,
    state.political.socialStability,
    state.economic.marketConfidence,
    state.economic.currencyStrength,
    state.economic.foreignReserves,
  ];
  const minVar = Math.min(...vars);
  if (minVar < 10) return { label: 'COLAPSO INMINENTE', emoji: '💀', color: 'text-red-300', bg: 'bg-red-900/50 border-red-600 animate-pulse' };
  if (minVar < 25) return { label: 'EN LLAMAS', emoji: '🔴', color: 'text-crimson-300', bg: 'bg-crimson-900/40 border-crimson-700' };
  if (minVar < 50) return { label: 'CALIENTE', emoji: '🟡', color: 'text-gold-300', bg: 'bg-gold-900/30 border-gold-700' };
  return { label: 'ESTABLE', emoji: '🟢', color: 'text-emerald-300', bg: 'bg-emerald-900/30 border-emerald-700' };
}

export function VariablesPanel({ state }: Props) {
  const { political, economic, congress } = state;
  const prevSnapshot = useGameStore((s) => s.prevVarSnapshot);
  const [showInflationBreakdown, setShowInflationBreakdown] = useState(false);
  const [flashMap, setFlashMap] = useState<Record<string, 'up' | 'down' | null>>({});
  const breakdown = state.lastInflationBreakdown;

  useEffect(() => {
    if (!prevSnapshot) return;
    const newFlash: Record<string, 'up' | 'down' | null> = {};
    const checks: Array<{ key: string; curr: number; prev: number; inverse?: boolean }> = [
      { key: 'popularity', curr: political.popularity, prev: prevSnapshot.popularity },
      { key: 'socialStability', curr: political.socialStability, prev: prevSnapshot.socialStability },
      { key: 'marketConfidence', curr: economic.marketConfidence, prev: prevSnapshot.marketConfidence },
      { key: 'currencyStrength', curr: economic.currencyStrength, prev: prevSnapshot.currencyStrength },
      { key: 'foreignReserves', curr: economic.foreignReserves, prev: prevSnapshot.foreignReserves },
      { key: 'inflation', curr: economic.inflation, prev: prevSnapshot.inflation, inverse: true },
      { key: 'publicDeficit', curr: economic.publicDeficit, prev: prevSnapshot.publicDeficit ?? economic.publicDeficit, inverse: true },
    ];
    let hasFlash = false;
    for (const { key, curr, prev, inverse } of checks) {
      const delta = curr - prev;
      if (Math.abs(delta) >= 1) {
        const isGood = inverse ? delta < 0 : delta > 0;
        newFlash[key] = isGood ? 'up' : 'down';
        hasFlash = true;
      }
    }
    if (!hasFlash) return;
    setFlashMap(newFlash);
    const t = setTimeout(() => setFlashMap({}), 650);
    return () => clearTimeout(t);
  }, [prevSnapshot]);

  const temp = getTemperatura(state);
  const isDeflation = economic.inflation < 0;

  const hasAnyCrisis = [political.popularity, political.socialStability, economic.marketConfidence, economic.currencyStrength, economic.foreignReserves].some((v) => v < 30);
  const isStable = political.socialStability > 50 && political.popularity > 50;

  return (
    <div className="pixel-border bg-navy-800 p-4 space-y-4">
      <h3
        style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '7px', borderBottom: '2px solid var(--celeste-dark)', paddingBottom: '8px', color: 'var(--celeste)' }}
        className="uppercase"
      >
        TERMOMETRO NACIONAL
      </h3>

      {/* Pixel decoration: fuego or mate depending on state */}
      <div className="flex justify-center py-1">
        {hasAnyCrisis ? <PixelFuego size="sm" /> : <PixelMate steaming={isStable} />}
      </div>

      {/* Political */}
      <div className="space-y-3">
        <p style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '6px' }} className="text-smoke-600 uppercase">POLITICO</p>
        <Meter label="POP" value={political.popularity} prevValue={prevSnapshot?.popularity} color="bg-blue-500" icon="★" flashDir={flashMap['popularity']} />
        <Meter label="EST" value={political.socialStability} prevValue={prevSnapshot?.socialStability} color="bg-emerald-500" icon="⚖" flashDir={flashMap['socialStability']} />
        <Meter label="MED" value={political.mediaCredibility} color="bg-purple-500" icon="📺" />
        <div className="flex justify-between" style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '6px' }}>
          <span className="text-smoke-400">DECRETOS</span>
          <span className={political.emergencyDecreesUsed > 2 ? 'text-crimson-400' : 'text-smoke-200'}>
            {political.emergencyDecreesUsed}
          </span>
        </div>
      </div>

      {/* Economic */}
      <div className="space-y-3">
        <p style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '6px' }} className="text-smoke-600 uppercase">ECONOMICO</p>
        <button
          className="w-full text-left"
          onClick={() => setShowInflationBreakdown((v) => !v)}
          title="Ver desglose de inflación"
        >
          <Meter
            label={isDeflation ? `DEFL${breakdown ? ' 🔍' : ''}` : `INF${breakdown ? ' 🔍' : ''}`}
            value={isDeflation ? Math.abs(economic.inflation) : economic.inflation}
            prevValue={prevSnapshot?.inflation !== undefined ? (isDeflation ? Math.abs(prevSnapshot.inflation) : prevSnapshot.inflation) : undefined}
            max={isDeflation ? 20 : 200}
            color={isDeflation ? 'bg-crimson-500' : 'bg-orange-500'}
            icon={isDeflation ? '📉' : '💸'}
            inverse
            flashDir={isDeflation ? (flashMap['inflation'] === 'up' ? 'down' : flashMap['inflation'] === 'down' ? 'up' : null) : flashMap['inflation']}
          />
        </button>
        <AnimatePresence>
          {showInflationBreakdown && breakdown && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <InflationBreakdownPanel breakdown={breakdown} />
            </motion.div>
          )}
        </AnimatePresence>
        <Meter label="DEF" value={economic.publicDeficit} prevValue={prevSnapshot?.publicDeficit} color="bg-red-500" icon="📊" inverse flashDir={flashMap['publicDeficit']} />
        <Meter label="MKT" value={economic.marketConfidence} prevValue={prevSnapshot?.marketConfidence} color="bg-teal-500" icon="📈" flashDir={flashMap['marketConfidence']} />
        <Meter label="$$$" value={economic.currencyStrength} prevValue={prevSnapshot?.currencyStrength} color="bg-yellow-500" icon="💰" flashDir={flashMap['currencyStrength']} />
        <Meter label="RES" value={economic.foreignReserves} prevValue={prevSnapshot?.foreignReserves} color="bg-cyan-500" icon="🏦" flashDir={flashMap['foreignReserves']} />
        <div className="flex justify-between" style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '6px' }}>
          <span className="text-smoke-400">PIB</span>
          <span className={economic.gdpGrowth >= 0 ? 'text-green-400' : 'text-crimson-400'}>
            {economic.gdpGrowth >= 0 ? '+' : ''}{economic.gdpGrowth.toFixed(1)}%
          </span>
        </div>
      </div>

      {/* Congress */}
      <div className="space-y-2">
        <p style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '6px' }} className="text-smoke-600 uppercase">CONGRESO</p>
        <div className="flex gap-0.5 h-3 overflow-hidden" style={{ border: '2px solid #444' }}>
          <div className="transition-all duration-700" style={{ width: `${(congress.governmentSeats / 538) * 100}%`, background: 'var(--celeste)' }} title={`Gobierno: ${congress.governmentSeats}`} />
          <div className="bg-smoke-600 transition-all duration-700" style={{ width: `${(congress.independentSeats / 538) * 100}%` }} title={`Independientes: ${congress.independentSeats}`} />
          <div className="bg-crimson-500 transition-all duration-700" style={{ width: `${(congress.oppositionSeats / 538) * 100}%` }} title={`Oposición: ${congress.oppositionSeats}`} />
        </div>
        <div className="flex justify-between" style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '6px' }}>
          <span style={{ color: 'var(--celeste)' }}>GOB:{congress.governmentSeats}</span>
          <span className="text-smoke-400">IND:{congress.independentSeats}</span>
          <span className="text-crimson-400">OPO:{congress.oppositionSeats}</span>
        </div>
        <div className="flex justify-between" style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '6px' }}>
          <span className="text-smoke-400">LEYES</span>
          <span style={{ color: 'var(--gold)' }}>{congress.lawsPassedThisRun}</span>
        </div>
      </div>

      {/* Temperatura del País */}
      <div className={`p-3 ${temp.bg}`} style={{ border: '2px solid currentColor' }}>
        <p style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '6px' }} className="text-smoke-500 uppercase mb-1">TEMPERATURA</p>
        <div className={`flex items-center gap-2 font-bold ${temp.color}`} style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '7px' }}>
          <span>{temp.emoji}</span>
          <span>{temp.label}</span>
        </div>
      </div>

      {/* Turn / Score */}
      <div className="pt-3 flex justify-between" style={{ borderTop: '2px solid var(--celeste-dark)' }}>
        <div>
          <p style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '6px' }} className="text-smoke-600">TURNO</p>
          <p style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '8px', color: 'var(--gold)' }}>{state.turn}/50</p>
        </div>
        <div className="text-right">
          <p style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '6px' }} className="text-smoke-600">SCORE</p>
          <p style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '8px', color: 'var(--gold)' }}>{state.score.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}
