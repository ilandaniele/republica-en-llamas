import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth.js';
import { useRunHistory } from '../hooks/useRunHistory.js';
import { getCard } from '@republica/game-engine';

export default function HistoryScreen() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: runs, isLoading } = useRunHistory(user?.id);
  const [expandedRunId, setExpandedRunId] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-smoke-400 font-mono mb-4">Inicia sesión para ver tu historial</p>
          <button onClick={() => navigate('/')} className="text-gold-400 font-mono hover:underline">
            ← Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl font-bold text-gold-400">Historial de Partidas</h1>
            <p className="text-smoke-500 font-mono text-sm mt-1">Tus últimas 20 partidas</p>
          </div>
          <button onClick={() => navigate('/')} className="text-smoke-400 hover:text-smoke-200 font-mono text-sm">
            ← Volver
          </button>
        </div>

        {isLoading && (
          <div className="text-smoke-400 font-mono text-center animate-pulse py-12">
            Cargando historial...
          </div>
        )}

        {runs && runs.length === 0 && (
          <div className="text-smoke-500 font-mono text-center py-12">
            No tienes partidas registradas aún.
          </div>
        )}

        <div className="space-y-3">
          {(runs ?? []).map((run) => {
            const isExpanded = expandedRunId === run.id;
            const isWin = run.is_win as boolean;
            return (
              <div key={run.id as string} className="bg-navy-800 border border-navy-600 rounded-lg overflow-hidden">
                <button
                  onClick={() => setExpandedRunId(isExpanded ? null : run.id as string)}
                  className="w-full p-4 flex items-center justify-between hover:bg-navy-700 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span className={`text-xl ${isWin ? '' : 'grayscale'}`}>
                      {isWin ? '👑' : '💀'}
                    </span>
                    <div className="text-left">
                      <p className="font-serif font-bold text-smoke-100">
                        {run.difficulty as string} — Turno {run.turns_survived as number}/50
                      </p>
                      <p className="text-smoke-500 font-mono text-xs">
                        {new Date(run.created_at as string).toLocaleDateString('es')}
                        {' · '}
                        {run.game_over_reason as string ?? 'En curso'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-mono font-bold text-gold-400 text-lg">
                      {(run.score as number).toLocaleString()}
                    </span>
                    <span className="text-smoke-500 text-sm">{isExpanded ? '▲' : '▼'}</span>
                  </div>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-navy-700 overflow-hidden"
                    >
                      <div className="p-4 space-y-2">
                        <p className="text-smoke-400 font-mono text-xs uppercase tracking-wider mb-3">
                          Decisiones clave
                        </p>
                        {((run.run_events as unknown[]) ?? []).slice(0, 10).map((ev) => {
                          const event = ev as { turn_number: number; card_id: string; choice_index: number };
                          let card;
                          try { card = getCard(event.card_id); } catch { return null; }
                          return (
                            <div key={`${event.turn_number}`} className="flex gap-3 text-sm">
                              <span className="font-mono text-smoke-600 w-12">T{event.turn_number}</span>
                              <span className="text-smoke-400 truncate">
                                {event.card_id} → Opción {String.fromCharCode(65 + event.choice_index)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
