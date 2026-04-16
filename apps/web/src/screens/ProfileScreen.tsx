import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth.js';
import { supabase, isOfflineMode } from '../lib/supabase.js';
import { useGameStore } from '../stores/gameStore.js';
import type { Tables } from '../lib/supabase.js';

type GameRun = Tables['game_runs'];

function generateAvatarColor(username: string): string {
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 60%, 40%)`;
}

export default function ProfileScreen() {
  const navigate = useNavigate();
  const { user, signOut, updateUsername } = useAuth();
  const personalBest = useGameStore((s) => s.personalBest);
  const setUserId = useGameStore((s) => s.setUserId);

  const [recentRuns, setRecentRuns] = useState<GameRun[]>([]);
  const [loadingRuns, setLoadingRuns] = useState(false);
  const [totalRuns, setTotalRuns] = useState(0);
  const [editingUsername, setEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [profile, setProfile] = useState<Tables['profiles'] | null>(null);

  useEffect(() => {
    if (!user || isOfflineMode) return;
    setNewUsername(user.user_metadata?.['username'] as string ?? '');

    void (async () => {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      if (profileData) setProfile(profileData as Tables['profiles']);

      setLoadingRuns(true);
      const { data: runsData, count } = await supabase
        .from('game_runs')
        .select('id, score, turns_survived, is_win, difficulty, created_at', { count: 'exact' })
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);
      if (runsData) setRecentRuns(runsData as GameRun[]);
      if (count !== null) setTotalRuns(count);
      setLoadingRuns(false);
    })();
  }, [user]);

  const handleUpdateUsername = async () => {
    if (!newUsername.trim() || newUsername.length < 3) {
      setUsernameError('Al menos 3 caracteres');
      return;
    }
    const result = await updateUsername(newUsername);
    if (result && 'error' in result && result.error) {
      setUsernameError((result.error as Error).message);
    } else {
      setEditingUsername(false);
      setUsernameError('');
    }
  };

  const handleLogout = async () => {
    await signOut();
    setUserId(null);
    navigate('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-smoke-400 font-mono mb-4">No hay sesión activa.</p>
          <button onClick={() => navigate('/')} className="text-gold-400 font-mono text-sm underline">
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  const displayName = profile?.username ?? (user.user_metadata?.['username'] as string | undefined) ?? user.email ?? '?';
  const avatarInitials = displayName.slice(0, 2).toUpperCase();
  const avatarColor = generateAvatarColor(displayName);

  const totalRuns_display = totalRuns || recentRuns.length;
  const bestScore = recentRuns.reduce((max, r) => Math.max(max, r.score), 0);
  const presidentCounts: Record<string, number> = {};
  // Note: we don't store president_id in game_runs currently, so skip for now

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen p-6"
    >
      <div className="max-w-2xl mx-auto">
        <button onClick={() => navigate(-1)} className="text-smoke-500 font-mono text-xs mb-6 hover:text-smoke-300 flex items-center gap-1">
          ← Volver
        </button>

        {/* Profile header */}
        <div className="bg-navy-800 pixel-border p-6 mb-6 flex items-center gap-6">
          <div
            className="w-14 h-14 pixel-border flex items-center justify-center text-xl font-bold text-white shrink-0"
            style={{ backgroundColor: avatarColor }}
          >
            {avatarInitials}
          </div>
          <div className="flex-1">
            {editingUsername ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="bg-navy-900 border border-navy-500 text-smoke-100 font-mono text-sm px-3 py-1 rounded focus:outline-none focus:border-gold-500"
                  autoFocus
                />
                <button onClick={() => { void handleUpdateUsername(); }} className="text-gold-400 font-mono text-xs hover:text-gold-300">
                  Guardar
                </button>
                <button onClick={() => setEditingUsername(false)} className="text-smoke-500 font-mono text-xs hover:text-smoke-300">
                  Cancelar
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-xl text-smoke-100 font-bold">{displayName}</h2>
                <button onClick={() => setEditingUsername(true)} className="text-smoke-600 hover:text-smoke-400 font-mono text-xs">
                  ✎
                </button>
              </div>
            )}
            {usernameError && <p className="text-crimson-400 font-mono text-xs mt-1">{usernameError}</p>}
            <p className="text-smoke-500 font-mono text-xs mt-1">{user.email}</p>
          </div>
          <button
            onClick={() => setShowLogoutModal(true)}
            className="bg-navy-700 hover:bg-navy-600 border border-navy-500 text-smoke-400 font-mono text-xs px-4 py-2 rounded transition-colors shrink-0"
          >
            Cerrar sesión
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
        { label: 'Partidas', value: totalRuns_display_display.toString() },
            { label: 'Mejor Score', value: (personalBest?.score ?? bestScore).toLocaleString() },
            { label: 'Mejor Turno', value: personalBest ? `T${personalBest.turns}` : '—' },
          ].map((stat) => (
            <div key={stat.label} className="pixel-border bg-navy-800 p-4 text-center">
              <p style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '6px', color: 'var(--peso-grey)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{stat.label}</p>
              <p style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '14px', color: 'var(--gold)', marginTop: '6px' }}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Recent runs */}
        <div className="pixel-border bg-navy-800 p-4">
          <h3 style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '7px', color: 'var(--gold)', letterSpacing: '0.1em', marginBottom: '16px', textTransform: 'uppercase' }}>
            Últimas Partidas
          </h3>
          {loadingRuns ? (
            <p className="text-smoke-500 font-mono text-xs animate-pulse">Cargando historial...</p>
          ) : recentRuns.length === 0 ? (
            <p className="text-smoke-500 font-mono text-xs">Sin partidas registradas aún.</p>
          ) : (
            <div className="space-y-2">
              {recentRuns.map((run) => (
                <div key={run.id} className="flex items-center justify-between pixel-border px-3 py-2 bg-navy-900/60">
                  <div>
                    <span className={`font-mono text-xs font-bold ${run.is_win ? 'text-emerald-400' : 'text-crimson-400'}`}>
                      {run.is_win ? '✓' : '✗'}
                    </span>
                    <span className="text-smoke-400 font-mono text-xs ml-2 capitalize">{run.difficulty}</span>
                    <span className="text-smoke-600 font-mono text-xs ml-2">T{run.turns_survived}</span>
                  </div>
                  <span className="text-gold-400 font-mono text-xs font-bold">{run.score.toLocaleString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Logout confirmation modal */}
      <AnimatePresence>
        {showLogoutModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-navy-900/90 z-50 flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="pixel-border bg-navy-800 p-6 max-w-sm w-full"
            >
              <h3 style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '8px', color: 'var(--smoke-100)', marginBottom: '12px' }}>¿Cerrar sesión?</h3>
              <p className="text-smoke-400 font-mono text-xs mb-6">
                Tu progreso guardado se mantendrá en el servidor. Podés volver cuando quieras.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => { void handleLogout(); }}
                  className="flex-1 pixel-border-crisis text-smoke-100 py-2 px-4 transition-colors"
                  style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '6px' }}
                >
                  Cerrar sesión
                </button>
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 pixel-border bg-navy-700 hover:bg-navy-600 text-smoke-300 py-2 px-4 transition-colors"
                  style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '6px' }}
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
