import type { GameState } from '@republica/game-engine';

export function getTemperatura(state: GameState): {
  label: string;
  emoji: string;
  color: string;
  bg: string;
} {
  const vars = [
    state.political.popularity,
    state.political.socialStability,
    state.economic.marketConfidence,
    state.economic.currencyStrength,
    state.economic.foreignReserves,
  ];
  const minVar = Math.min(...vars);
  if (minVar < 10)
    return {
      label: 'COLAPSO INMINENTE',
      emoji: '💀',
      color: 'text-red-300',
      bg: 'bg-red-900/50 border-red-600 animate-pulse',
    };
  if (minVar < 25)
    return {
      label: 'EN LLAMAS',
      emoji: '🔴',
      color: 'text-crimson-300',
      bg: 'bg-crimson-900/40 border-crimson-700',
    };
  if (minVar < 50)
    return { label: 'CALIENTE', emoji: '🟡', color: 'text-gold-300', bg: 'bg-gold-900/30 border-gold-700' };
  return {
    label: 'ESTABLE',
    emoji: '🟢',
    color: 'text-emerald-300',
    bg: 'bg-emerald-900/30 border-emerald-700',
  };
}
