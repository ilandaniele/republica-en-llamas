import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { m, AnimatePresence } from 'framer-motion';
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
    setNewUsername((user.user_metadata?.['username'] as string) ?? '');

    void (async () => {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('username')
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
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="text-center">
          <p className="mb-4 font-mono text-smoke-400">No hay sesión activa.</p>
          <button onClick={() => navigate('/')} className="font-mono text-sm text-gold-400 underline">
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  const displayName =
    profile?.username ?? (user.user_metadata?.['username'] as string | undefined) ?? user.email ?? '?';
  const avatarInitials = displayName.slice(0, 2).toUpperCase();
  const avatarColor = generateAvatarColor(displayName);

  const totalRuns_display = totalRuns || recentRuns.length;
  const bestScore = recentRuns.reduce((max, r) => Math.max(max, r.score), 0);
  // Note: we don't store president_id in game_runs currently, so skip for now

  return (
    <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen p-6">
      <div className="mx-auto max-w-2xl">
        <button
          onClick={() => navigate(-1)}
          className="text-smoke-500 hover:text-smoke-300 mb-6 flex items-center gap-1 font-mono text-xs"
        >
          ← Volver
        </button>

        {/* Profile header */}
        <div className="pixel-border mb-6 flex items-center gap-6 bg-navy-800 p-6">
          <div
            className="pixel-border flex h-14 w-14 shrink-0 items-center justify-center text-xl font-bold text-white"
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
                  className="rounded border border-navy-500 bg-navy-900 px-3 py-1 font-mono text-sm text-smoke-100 focus:border-gold-500 focus:outline-none"
                  // eslint-disable-next-line jsx-a11y/no-autofocus -- inline edit opened by explicit user click
                  autoFocus
                />
                <button
                  onClick={() => {
                    void handleUpdateUsername();
                  }}
                  className="font-mono text-xs text-gold-400 hover:text-gold-300"
                >
                  Guardar
                </button>
                <button
                  onClick={() => setEditingUsername(false)}
                  className="text-smoke-500 hover:text-smoke-300 font-mono text-xs"
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-xl font-bold text-smoke-100">{displayName}</h2>
                <button
                  onClick={() => setEditingUsername(true)}
                  className="font-mono text-xs text-smoke-600 hover:text-smoke-400"
                >
                  ✎
                </button>
              </div>
            )}
            {usernameError && <p className="mt-1 font-mono text-xs text-crimson-400">{usernameError}</p>}
            <p className="text-smoke-500 mt-1 font-mono text-xs">{user.email}</p>
          </div>
          <button
            onClick={() => setShowLogoutModal(true)}
            className="shrink-0 rounded border border-navy-500 bg-navy-700 px-4 py-2 font-mono text-xs text-smoke-400 transition-colors hover:bg-navy-600"
          >
            Cerrar sesión
          </button>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-3 gap-4">
          {[
            { label: 'Partidas', value: totalRuns_display.toString() },
            { label: 'Mejor Score', value: (personalBest?.score ?? bestScore).toLocaleString() },
            { label: 'Mejor Turno', value: personalBest ? `T${personalBest.turns}` : '—' },
          ].map((stat) => (
            <div key={stat.label} className="pixel-border bg-navy-800 p-4 text-center">
              <p
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: '6px',
                  color: 'var(--peso-grey)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                {stat.label}
              </p>
              <p
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: '14px',
                  color: 'var(--gold)',
                  marginTop: '6px',
                }}
              >
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Recent runs */}
        <div className="pixel-border bg-navy-800 p-4">
          <h3
            style={{
              fontFamily: "'Press Start 2P', monospace",
              fontSize: '7px',
              color: 'var(--gold)',
              letterSpacing: '0.1em',
              marginBottom: '16px',
              textTransform: 'uppercase',
            }}
          >
            Últimas Partidas
          </h3>
          {loadingRuns ? (
            <p className="text-smoke-500 animate-pulse font-mono text-xs">Cargando historial...</p>
          ) : recentRuns.length === 0 ? (
            <p className="text-smoke-500 font-mono text-xs">Sin partidas registradas aún.</p>
          ) : (
            <div className="space-y-2">
              {recentRuns.map((run) => (
                <div
                  key={run.id}
                  className="pixel-border flex items-center justify-between bg-navy-900/60 px-3 py-2"
                >
                  <div>
                    <span
                      className={`font-mono text-xs font-bold ${run.is_win ? 'text-emerald-400' : 'text-crimson-400'}`}
                    >
                      {run.is_win ? '✓' : '✗'}
                    </span>
                    <span className="ml-2 font-mono text-xs capitalize text-smoke-400">{run.difficulty}</span>
                    <span className="ml-2 font-mono text-xs text-smoke-600">T{run.turns_survived}</span>
                  </div>
                  <span className="font-mono text-xs font-bold text-gold-400">
                    {run.score.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Logout confirmation modal */}
      <AnimatePresence>
        {showLogoutModal && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/90 p-6"
          >
            <m.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="pixel-border w-full max-w-sm bg-navy-800 p-6"
            >
              <h3
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: '8px',
                  color: 'var(--smoke-100)',
                  marginBottom: '12px',
                }}
              >
                ¿Cerrar sesión?
              </h3>
              <p className="mb-6 font-mono text-xs text-smoke-400">
                Tu progreso guardado se mantendrá en el servidor. Podés volver cuando quieras.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    void handleLogout();
                  }}
                  className="pixel-border-crisis flex-1 px-4 py-2 text-smoke-100 transition-colors"
                  style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '6px' }}
                >
                  Cerrar sesión
                </button>
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="pixel-border text-smoke-300 flex-1 bg-navy-700 px-4 py-2 transition-colors hover:bg-navy-600"
                  style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '6px' }}
                >
                  Cancelar
                </button>
              </div>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </m.div>
  );
}
