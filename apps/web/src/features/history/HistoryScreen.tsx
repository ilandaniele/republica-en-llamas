import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { m, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth.js';
import { useRunHistory } from './useRunHistory.js';
import { getCard } from '@republica/game-engine';

export default function HistoryScreen() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: runs, isLoading } = useRunHistory(user?.id);
  const [expandedRunId, setExpandedRunId] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="mb-4 font-mono text-smoke-400">Inicia sesión para ver tu historial</p>
          <button onClick={() => navigate('/')} className="font-mono text-gold-400 hover:underline">
            ← Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen max-w-3xl p-6">
      <m.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold text-gold-400">Historial de Partidas</h1>
            <p className="text-smoke-500 mt-1 font-mono text-sm">Tus últimas 20 partidas</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="font-mono text-sm text-smoke-400 hover:text-smoke-200"
          >
            ← Volver
          </button>
        </div>

        {isLoading && (
          <div className="animate-pulse py-12 text-center font-mono text-smoke-400">
            Cargando historial...
          </div>
        )}

        {runs && runs.length === 0 && (
          <div className="text-smoke-500 py-12 text-center font-mono">
            No tienes partidas registradas aún.
          </div>
        )}

        <div className="space-y-3">
          {(runs ?? []).map((run) => {
            const isExpanded = expandedRunId === run.id;
            const isWin = run.is_win as boolean;
            return (
              <div
                key={run.id as string}
                className="overflow-hidden rounded-lg border border-navy-600 bg-navy-800"
              >
                <button
                  onClick={() => setExpandedRunId(isExpanded ? null : (run.id as string))}
                  className="flex w-full items-center justify-between p-4 transition-colors hover:bg-navy-700"
                >
                  <div className="flex items-center gap-4">
                    <span className={`text-xl ${isWin ? '' : 'grayscale'}`}>{isWin ? '👑' : '💀'}</span>
                    <div className="text-left">
                      <p className="font-serif font-bold text-smoke-100">
                        {run.difficulty as string} — Turno {run.turns_survived as number}/50
                      </p>
                      <p className="text-smoke-500 font-mono text-xs">
                        {new Date(run.created_at as string).toLocaleDateString('es')}
                        {' · '}
                        {(run.game_over_reason as string) ?? 'En curso'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-lg font-bold text-gold-400">
                      {(run.score as number).toLocaleString()}
                    </span>
                    <span className="text-smoke-500 text-sm">{isExpanded ? '▲' : '▼'}</span>
                  </div>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <m.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden border-t border-navy-700"
                    >
                      <div className="space-y-2 p-4">
                        <p className="mb-3 font-mono text-xs uppercase tracking-wider text-smoke-400">
                          Decisiones clave
                        </p>
                        {((run.run_events as unknown[]) ?? []).slice(0, 10).map((ev) => {
                          const event = ev as { turn_number: number; card_id: string; choice_index: number };
                          try {
                            getCard(event.card_id);
                          } catch {
                            return null;
                          }
                          return (
                            <div key={`${event.turn_number}`} className="flex gap-3 text-sm">
                              <span className="w-12 font-mono text-smoke-600">T{event.turn_number}</span>
                              <span className="truncate text-smoke-400">
                                {event.card_id} → Opción {String.fromCharCode(65 + event.choice_index)}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </m.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </m.div>
    </div>
  );
}
