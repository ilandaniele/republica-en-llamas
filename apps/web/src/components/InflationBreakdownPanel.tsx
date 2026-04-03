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
  const quote = CAPUTO_QUOTES[Math.floor(breakdown.newInflation) % CAPUTO_QUOTES.length]!;

  const factors: { label: string; value: number; emoji: string; inverse?: boolean }[] = [
    { label: 'Déficit Público', value: breakdown.deficitPressure, emoji: '📊' },
    { label: 'Desconfianza Mercados', value: breakdown.marketDistrust, emoji: '📉' },
    { label: 'Moneda Débil', value: breakdown.currencyWeakness, emoji: '💵' },
    { label: 'Shocks Externos', value: breakdown.shockEffect, emoji: '⚡' },
    { label: 'Efecto Inercia', value: breakdown.accelerationEffect, emoji: '🔥' },
    { label: 'Estabilidad Económica', value: breakdown.naturalDecay ?? 0, emoji: '📈' },
  ].filter((f) => Math.abs(f.value) >= 0.1);

  return (
    <div className="bg-navy-900 border border-navy-600 rounded-lg p-4 text-xs font-mono">
      <p className="text-smoke-500 uppercase tracking-widest mb-3 text-[10px]">
        Desglose Inflacionario — Turno
      </p>

      <div className="space-y-2 mb-3">
        {factors.map((f) => (
          <div key={f.label} className="flex items-center justify-between">
            <span className="text-smoke-400 flex items-center gap-1">
              <span>{f.emoji}</span>
              <span>{f.label}</span>
            </span>
            <span className={`font-bold ${f.value > 0 ? 'text-crimson-400' : 'text-emerald-400'}`}>
              {f.value > 0 ? '+' : ''}{f.value.toFixed(1)}%
            </span>
          </div>
        ))}
      </div>

      <div className="border-t border-navy-600 pt-2 flex justify-between">
        <span className="text-smoke-300 font-bold">Total nueva inflación</span>
        <span className={`font-bold text-sm ${breakdown.delta > 2 ? 'text-crimson-400' : breakdown.delta > 0 ? 'text-gold-400' : 'text-emerald-400'}`}>
          {breakdown.newInflation.toFixed(1)}%
          <span className="text-xs ml-1 opacity-70">
            ({breakdown.delta > 0 ? '+' : ''}{breakdown.delta.toFixed(1)})
          </span>
        </span>
      </div>

      <div className="mt-3 bg-navy-800 border border-navy-700 rounded px-3 py-2 italic text-smoke-500 text-[10px]">
        💼 "{quote}" — <span className="not-italic">Luis Caputo, Min. Economía</span>
      </div>
    </div>
  );
}
