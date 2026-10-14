import React from 'react';
import type { InflationBreakdown } from '@republica/game-engine';

interface Props {
  breakdown: InflationBreakdown;
}

const CAPUTO_QUOTES = [
  'Los mercados van a reaccionar positivamente.',
  'Es una situación controlada.',
  'El ajuste está dando frutos.',
  'Estamos en el camino correcto.',
  'La inflación es un fenómeno monetario.',
];

export function InflationBreakdownPanel({ breakdown }: Props) {
  const quote = CAPUTO_QUOTES[Math.floor(Math.abs(breakdown.newInflation)) % CAPUTO_QUOTES.length]!;
  const isDeflation = breakdown.newInflation < 0;

  const factors: { label: string; value: number; emoji: string; inverse?: boolean }[] = [
    { label: 'Déficit Público', value: breakdown.deficitPressure, emoji: '📊' },
    { label: 'Desconfianza Mercados', value: breakdown.marketDistrust, emoji: '📉' },
    { label: 'Moneda Débil', value: breakdown.currencyWeakness, emoji: '💵' },
    { label: 'Shocks Externos', value: breakdown.shockEffect, emoji: '⚡' },
    { label: 'Efecto Inercia', value: breakdown.accelerationEffect, emoji: '🔥' },
    { label: 'Estabilidad Económica', value: breakdown.naturalDecay ?? 0, emoji: '📈' },
  ].filter((f) => Math.abs(f.value) >= 0.1);

  return (
    <div className="rounded-lg border border-navy-600 bg-navy-900 p-4 font-mono text-xs">
      {isDeflation && (
        <p className="mb-2 animate-pulse text-[9px] font-bold uppercase tracking-widest text-crimson-400">
          ⚠️ DEFLACIÓN PELIGROSA
        </p>
      )}
      <p className="text-smoke-500 mb-3 text-[10px] uppercase tracking-widest">
        Desglose Inflacionario — Turno
      </p>

      <div className="mb-3 space-y-2">
        {factors.map((f) => (
          <div key={f.label} className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-smoke-400">
              <span>{f.emoji}</span>
              <span>{f.label}</span>
            </span>
            <span className={`font-bold ${f.value > 0 ? 'text-crimson-400' : 'text-emerald-400'}`}>
              {f.value > 0 ? '+' : ''}
              {f.value.toFixed(1)}%
            </span>
          </div>
        ))}
      </div>

      <div className="flex justify-between border-t border-navy-600 pt-2">
        <span className="text-smoke-300 font-bold">Total nueva inflación</span>
        <span
          className={`text-sm font-bold ${breakdown.delta > 2 ? 'text-crimson-400' : breakdown.delta > 0 ? 'text-gold-400' : 'text-emerald-400'}`}
        >
          {breakdown.newInflation.toFixed(1)}%
          <span className="ml-1 text-xs opacity-70">
            ({breakdown.delta > 0 ? '+' : ''}
            {breakdown.delta.toFixed(1)})
          </span>
        </span>
      </div>

      <div className="text-smoke-500 mt-3 rounded border border-navy-700 bg-navy-800 px-3 py-2 text-[10px] italic">
        💼 "{quote}" — <span className="not-italic">Luis Caputo, Min. Economía</span>
      </div>
    </div>
  );
}
