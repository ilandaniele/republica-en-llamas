import React, { useEffect, useRef, useState } from 'react';
import { useGameStore } from '../stores/gameStore.js';
import { getAnibalLine } from '@republica/game-engine';
import type { GameState } from '@republica/game-engine';

interface Props {
  /** Override the displayed text instead of pulling from store */
  text?: string;
  /** When true: background flashes between crisis-red and crisis-dark */
  isCrisis?: boolean;
}

/** Pick a context-aware headline based on current game state. Falls back to engine's getAnibalLine. */
function getDynamicLine(state: GameState): string {
  const { political, economic, turn, activeCrises } = state;
  const inf = economic.inflation;
  const pop = political.popularity;
  const stab = political.socialStability;
  const reserves = economic.foreignReserves;
  const conf = economic.marketConfidence;

  // Crisis-specific pool
  if (activeCrises.length >= 2) {
    const lines = [
      'El país arde por los cuatro costados. El presidente pide calma. Nadie le cree.',
      'Dos crisis simultáneas. La historia dice que esto no termina bien.',
      'Caos total. Los mercados cerraron. El FMI no atiende el teléfono.',
    ];
    return lines[turn % lines.length]!;
  }

  // Hyperinflation
  if (inf >= 80) {
    const lines = [
      `Inflación al ${Math.round(inf)}%. El precio del pan cambió tres veces hoy.`,
      'Los supermercados sacaron las etiquetas de precios. "¿Para qué?", dijeron.',
      `${Math.round(inf)}% de inflación. Comprar dólares dejó de ser opción, pasó a ser obligación.`,
      'El billete de diez mil no alcanza ni para el bondi.',
    ];
    return lines[turn % lines.length]!;
  }

  // High inflation
  if (inf >= 40) {
    const lines = [
      `Inflación al ${Math.round(inf)}%. El Plan Platita tiene fecha de vencimiento.`,
      'Los gremios piden reapertura de paritarias. Tercera vez este mes.',
      `Con inflación al ${Math.round(inf)}%, el poder adquisitivo del salario cayó otro piso.`,
    ];
    return lines[turn % lines.length]!;
  }

  // Popularity collapse
  if (pop <= 15) {
    const lines = [
      'Cacerolazos en Palermo, Flores y La Matanza. Dicen que hasta en Coronel Suárez.',
      `Solo el ${Math.round(pop)}% apoya al gobierno. El otro ${100 - Math.round(pop)}% tiene cacerola.',`,
      'La Plaza de Mayo está tomada. El presidente miraba desde el helicóptero.',
      'Tasa de aprobación en mínimos históricos. El portero del edificio presidencial renunció por solidaridad.',
    ];
    return lines[turn % lines.length]!;
  }

  // Low stability
  if (stab <= 20) {
    const lines = [
      'Corte de ruta en el acceso a la ciudad. El tránsito parado desde las 6 de la mañana.',
      'Paro general convocado para mañana. CGT, CTA y los trapitos de Callao.',
      'Saqueos en tres provincias. El gobernador declaró "zona de emergencia social".',
    ];
    return lines[turn % lines.length]!;
  }

  // Reserves crisis
  if (reserves <= 15) {
    const lines = [
      'Las reservas del Banco Central alcanzan para nueve días de importaciones.',
      'El BCRA vendió otros 200 palos verdes. Dicen que quedan como para un café.',
      'Reservas en cero técnico. El dólar blue despegó como el Falcon.',
    ];
    return lines[turn % lines.length]!;
  }

  // Market confidence crisis
  if (conf <= 20) {
    const lines = [
      'El riesgo país superó los 3000 puntos. Los bonistas se tomaron el primer avión.',
      'Los mercados cerraron en rojo profundo. Hasta el maíz perdió.',
      'Fuga de capitales récord. Los empresarios dicen que "esperan señales".',
    ];
    return lines[turn % lines.length]!;
  }

  // Late-game pre-election
  if (turn >= 38) {
    const lines = [
      'A días de las elecciones, el gobierno prometió "estabilidad". El dólar no escuchó.',
      'Las encuestas dicen empate técnico. Los líderes peinan candidatos de último momento.',
      'Campaña electoral en su apogeo. El asado de cierre costó 40 mil pesos por persona.',
    ];
    return lines[turn % lines.length]!;
  }

  // Good streak / stable
  if (pop >= 65 && stab >= 60 && inf <= 20) {
    const lines = [
      'Racha positiva del gobierno. Los analistas dicen "veremos cuánto dura".',
      `Aprobación al ${Math.round(pop)}%. Hasta el Gordo Aníbal reconoce que las cosas están bien.`,
      'Mercados en verde, inflación a la baja. El FMI sonrió. Primera vez en décadas.',
    ];
    return lines[turn % lines.length]!;
  }

  // Default: rotate engine lines
  return getAnibalLine(state);
}

export function AnibalTicker({ text, isCrisis = false }: Props) {
  const gameState = useGameStore((s) => s.gameState);
  const [currentLine, setCurrentLine] = useState<string>('');
  const lineTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Rotate headlines every 18s so the ticker feels live
  useEffect(() => {
    if (!gameState) return;
    setCurrentLine(getDynamicLine(gameState));
    lineTimerRef.current = setTimeout(() => {
      setCurrentLine(getDynamicLine(gameState));
    }, 18000);
    return () => { if (lineTimerRef.current) clearTimeout(lineTimerRef.current); };
  }, [gameState?.turn, gameState?.activeCrises.length, gameState?.economic.inflation, gameState?.political.popularity]); // eslint-disable-line react-hooks/exhaustive-deps

  const displayText = text ?? (gameState ? `📻 Aníbal (AM 1010): "${currentLine || getDynamicLine(gameState)}"` : '');

  if (!displayText) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-30 flex items-center"
      style={{
        height: '28px',
        background: 'var(--crisis-red)',
        animation: isCrisis ? 'crisis-ticker-flash 1s ease-in-out infinite' : undefined,
        borderTop: '2px solid var(--crisis-dark)',
      }}
    >
      {/* Station badge */}
      <div
        style={{
          background: 'var(--crisis-dark)',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          padding: '0 8px',
          flexShrink: 0,
          borderRight: '2px solid rgba(255,255,255,0.3)',
        }}
      >
        <span style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '6px', color: 'white' }}>
          📻 AM1010
        </span>
      </div>

      {/* Scrolling text */}
      <div style={{ overflow: 'hidden', flex: 1, height: '100%', display: 'flex', alignItems: 'center' }}>
        <span
          className="ticker-text"
          style={{ animationDuration: `${Math.max(12, displayText.length * 0.18)}s` }}
        >
          {displayText}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          {displayText}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </span>
      </div>
    </div>
  );
}
