import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { m } from 'framer-motion';
import { useLeaderboard } from '../hooks/useLeaderboard.js';
import { useAuth } from '../hooks/useAuth.js';

const DIFFICULTY_FILTERS = [
  { id: '', label: 'Todos' },
  { id: 'easy', label: 'Fácil' },
  { id: 'normal', label: 'Normal' },
  { id: 'hard', label: 'Difícil' },
  { id: 'crisis', label: 'Crisis' },
];

export default function LeaderboardScreen() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const { data: entries, isLoading, error } = useLeaderboard(difficultyFilter || undefined);

  return (
    <div className="mx-auto min-h-screen max-w-3xl p-6">
      <m.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold text-gold-400">Tabla de Líderes</h1>
            <p className="text-smoke-500 mt-1 font-mono text-sm">Los mejores presidentes de la historia</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="font-mono text-sm text-smoke-400 hover:text-smoke-200"
          >
            ← Volver
          </button>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-2">
          {DIFFICULTY_FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setDifficultyFilter(f.id)}
              className={`rounded-lg px-4 py-2 font-mono text-sm transition-colors ${
                difficultyFilter === f.id
                  ? 'bg-gold-500 font-bold text-navy-900'
                  : 'border border-navy-600 bg-navy-800 text-smoke-400 hover:border-gold-600'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Table */}
        {isLoading && (
          <div className="animate-pulse py-12 text-center font-mono text-smoke-400">Cargando tabla...</div>
        )}

        {error && (
          <div className="py-12 text-center font-mono text-sm text-crimson-400">
            Error al cargar. ¿Configuraste las credenciales de Supabase?
          </div>
        )}

        {entries && entries.length === 0 && (
          <div className="text-smoke-500 py-12 text-center font-mono">
            Aún no hay puntajes registrados. ¡Sé el primero!
          </div>
        )}

        {entries && entries.length > 0 && (
          <div className="space-y-2">
            {entries.map((entry, index) => {
              const isCurrentUser = user?.id === entry.user_id;
              return (
                <m.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className={`flex items-center gap-4 rounded-lg border p-4 transition-colors ${
                    isCurrentUser ? 'border-gold-500 bg-navy-700' : 'border-navy-700 bg-navy-800'
                  }`}
                >
                  {/* Rank */}
                  <div
                    className={`w-8 text-center font-mono text-lg font-bold ${
                      index === 0
                        ? 'text-gold-400'
                        : index === 1
                          ? 'text-smoke-400'
                          : index === 2
                            ? 'text-yellow-700'
                            : 'text-smoke-600'
                    }`}
                  >
                    {index + 1}
                  </div>

                  {/* Name */}
                  <div className="flex-1">
                    <span
                      className={`font-serif font-bold ${isCurrentUser ? 'text-gold-300' : 'text-smoke-100'}`}
                    >
                      {entry.username}
                    </span>
                    {isCurrentUser && (
                      <span className="ml-2 rounded bg-gold-600 px-2 py-0.5 font-mono text-xs text-navy-900">
                        Tú
                      </span>
                    )}
                  </div>

                  {/* Difficulty */}
                  <span className="text-smoke-500 w-16 font-mono text-xs">{entry.difficulty}</span>

                  {/* Win indicator */}
                  <span className={`text-lg ${entry.is_win ? 'opacity-100' : 'opacity-20'}`}>👑</span>

                  {/* Score */}
                  <div className="w-24 text-right font-mono font-bold text-gold-400">
                    {entry.score.toLocaleString()}
                  </div>
                </m.div>
              );
            })}
          </div>
        )}
      </m.div>
    </div>
  );
}
