import React from 'react';
import { isOfflineMode } from '../lib/supabase.js';

export function OfflineBanner() {
  if (!isOfflineMode) return null;

  return (
    <div className="w-full bg-navy-800/80 border-b border-navy-600 px-4 py-1.5 text-center">
      <span className="font-mono text-xs text-smoke-400">
        📴 Modo sin conexión — tu progreso se guarda localmente
      </span>
    </div>
  );
}
