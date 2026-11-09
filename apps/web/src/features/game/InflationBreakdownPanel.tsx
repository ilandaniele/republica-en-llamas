import React from 'react';
import type { InflationBreakdown } from '@republica/game-engine';

interface Props {
  breakdown: InflationBreakdown;
}

export function InflationBreakdownPanel({ breakdown }: Props) {
  const isDeflation = breakdown.newInflation < 0;

  const factors: { label: string; value: number; emoji: string }[] = [
    { label: 'Efecto directo de la decisión', value: breakdown.directEffect ?? 0, emoji: '🗳️' },
    { label: 'Déficit Público', value: breakdown.deficitPressure, emoji: '📊' },
    { label: 'Desconfianza Mercados', value: breakdown.marketDistrust, emoji: '📉' },
    { label: 'Moneda Débil', value: breakdown.currencyWeakness, emoji: '💵' },
    { label: 'Shocks Externos', value: breakdown.shockEffect, emoji: '⚡' },
    { label: 'Expectativas', value: breakdown.accelerationEffect, emoji: '🔥' },
    { label: 'Desaceleración natural', value: breakdown.naturalDecay, emoji: '📈' },
    { label: 'Contexto del escenario', value: breakdown.scenarioEffect ?? 0, emoji: '🌐' },
    { label: 'Límites del indicador', value: breakdown.limitEffect ?? 0, emoji: '↔️' },
  ].filter((f) => Math.abs(f.value) >= 0.1);

  return (
    <div className="rounded-lg border border-navy-600 bg-navy-900 p-3 text-sm">
      {isDeflation && (
        <p className="text-crimson-300 mb-2 animate-pulse text-sm font-bold uppercase">
          ⚠️ DEFLACIÓN PELIGROSA
        </p>
      )}
      <p className="mb-3 text-sm font-semibold text-smoke-300">Desglose Inflacionario — Turno</p>
      <p className="mb-3 text-smoke-400">
        La economía sigue evolucionando aunque la tarjeta no cambie precios directamente. Efecto directo:{' '}
        {(breakdown.directEffect ?? 0).toFixed(1)} puntos porcentuales.
      </p>

      <div className="mb-3 space-y-2">
        {factors.map((f) => (
          <div key={f.label} className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-1 text-smoke-400">
              <span>{f.emoji}</span>
              <span>{f.label}</span>
            </span>
            <span className={`shrink-0 font-bold ${f.value > 0 ? 'text-crimson-400' : 'text-emerald-400'}`}>
              {f.value > 0 ? '+' : ''}
              {f.value.toFixed(1)} pp
            </span>
          </div>
        ))}
      </div>

      <div className="flex justify-between border-t border-navy-600 pt-2">
        <span className="font-bold text-smoke-300">Total nueva inflación</span>
        <span
          className={`text-sm font-bold ${breakdown.delta > 2 ? 'text-crimson-400' : breakdown.delta > 0 ? 'text-gold-400' : 'text-emerald-400'}`}
        >
          {breakdown.newInflation.toFixed(1)}%
          <span className="ml-1 text-xs opacity-70">
            ({breakdown.delta > 0 ? '+' : ''}
            {breakdown.delta.toFixed(1)} pp)
          </span>
        </span>
      </div>
    </div>
  );
}
