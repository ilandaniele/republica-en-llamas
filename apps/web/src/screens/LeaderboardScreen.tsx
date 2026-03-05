import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
    <div className="min-h-screen p-6 max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl font-bold text-gold-400">Tabla de Líderes</h1>
            <p className="text-smoke-500 font-mono text-sm mt-1">Los mejores presidentes de la historia</p>
          </div>
          <button
            onClick={() => navigate('/')}
            className="text-smoke-400 hover:text-smoke-200 font-mono text-sm"
          >
            ← Volver
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {DIFFICULTY_FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setDifficultyFilter(f.id)}
              className={`px-4 py-2 rounded-lg font-mono text-sm transition-colors ${
                difficultyFilter === f.id
                  ? 'bg-gold-500 text-navy-900 font-bold'
                  : 'bg-navy-800 border border-navy-600 text-smoke-400 hover:border-gold-600'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Table */}
        {isLoading && (
          <div className="text-center text-smoke-400 font-mono animate-pulse py-12">
            Cargando tabla...
          </div>
        )}

        {error && (
          <div className="text-crimson-400 font-mono text-sm text-center py-12">
            Error al cargar. ¿Configuraste las credenciales de Supabase?
          </div>
        )}

        {entries && entries.length === 0 && (
          <div className="text-smoke-500 font-mono text-center py-12">
            Aún no hay puntajes registrados. ¡Sé el primero!
          </div>
        )}

        {entries && entries.length > 0 && (
          <div className="space-y-2">
            {entries.map((entry, index) => {
              const isCurrentUser = user?.id === entry.user_id;
              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className={`flex items-center gap-4 p-4 rounded-lg border transition-colors ${
                    isCurrentUser
                      ? 'bg-navy-700 border-gold-500'
                      : 'bg-navy-800 border-navy-700'
                  }`}
                >
                  {/* Rank */}
                  <div className={`font-mono font-bold text-lg w-8 text-center ${
                    index === 0 ? 'text-gold-400' :
                    index === 1 ? 'text-smoke-400' :
                    index === 2 ? 'text-yellow-700' :
                    'text-smoke-600'
                  }`}>
                    {index + 1}
                  </div>

                  {/* Name */}
                  <div className="flex-1">
                    <span className={`font-serif font-bold ${isCurrentUser ? 'text-gold-300' : 'text-smoke-100'}`}>
                      {entry.username}
                    </span>
                    {isCurrentUser && (
                      <span className="ml-2 text-xs bg-gold-600 text-navy-900 px-2 py-0.5 rounded font-mono">
                        Tú
                      </span>
                    )}
                  </div>

                  {/* Difficulty */}
                  <span className="font-mono text-xs text-smoke-500 w-16">
                    {entry.difficulty}
                  </span>

                  {/* Win indicator */}
                  <span className={`text-lg ${entry.is_win ? 'opacity-100' : 'opacity-20'}`}>
                    👑
                  </span>

                  {/* Score */}
                  <div className="font-mono font-bold text-gold-400 w-24 text-right">
                    {entry.score.toLocaleString()}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}
