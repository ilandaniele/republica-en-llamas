import React from 'react';
import { isOfflineMode } from '../lib/api.js';
import { isPlaytestMode } from '../lib/playtest.js';

export function OfflineBanner() {
  if (!isOfflineMode && !isPlaytestMode) return null;

  return (
    <div className="w-full border-b border-navy-600 bg-navy-800/80 px-4 py-1.5 text-center">
      <span className="font-mono text-sm text-smoke-400">
        {isPlaytestMode
          ? 'VERSIÓN DE PRUEBA · Milei, Massa y Kicillof gratis · Sin compras ni ranking'
          : '📴 Modo sin conexión — tu progreso se guarda localmente'}
      </span>
    </div>
  );
}
