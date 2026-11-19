import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { m } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth.js';
import { isOfflineMode } from '../../lib/api.js';
import { translateAuthError } from '../../lib/auth.js';
import { useGameStore } from '../../stores/gameStore.js';
import { GoogleSignIn } from './GoogleSignIn.js';
import { useAuthDestination } from './useAuthDestination.js';
import { OfflineNotice } from './OfflineNotice.js';

export default function LoginScreen() {
  const navigate = useNavigate();
  const { routeState, continueAfterAuth } = useAuthDestination();
  const { signIn } = useAuth();
  const setUserId = useGameStore((s) => s.setUserId);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('Completá email y contraseña');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const { data, error: err } = await signIn(email, password, rememberMe);
      if (err) {
        setError(translateAuthError(err.message ?? ''));
        return;
      }
      setUserId(data.user.id);
      await continueAfterAuth();
    } catch {
      setError('Error inesperado. Intentá de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (isOfflineMode) return <OfflineNotice onPlayOffline={() => navigate('/')} />;

  return (
    <m.div
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex min-h-screen flex-col items-center justify-center p-6"
    >
      <div className="w-full max-w-md">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex min-h-[44px] min-w-[44px] items-center gap-1 font-mono text-xs text-smoke-500 hover:text-smoke-300"
        >
          ← Volver
        </button>
        <h1 className="mb-2 font-serif text-3xl font-bold text-smoke-100">Iniciar sesión</h1>
        <p className="mb-8 font-mono text-xs text-smoke-400">Tu historial y puntajes te esperan.</p>

        <GoogleSignIn dividerLabel="o" className="mb-4 space-y-4" />

        <form
          onSubmit={(e) => {
            void handleSubmit(e);
          }}
          className="space-y-4"
        >
          <input
            type="email"
            aria-label="Email"
            autoComplete="username"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-lg border border-navy-600 bg-navy-800 px-4 py-3 font-mono text-sm text-smoke-100 focus:border-gold-500"
          />
          <input
            type="password"
            aria-label="Contraseña"
            autoComplete="current-password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-lg border border-navy-600 bg-navy-800 px-4 py-3 font-mono text-sm text-smoke-100 focus:border-gold-500"
          />

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="accent-gold-500"
            />
            <label htmlFor="rememberMe" className="cursor-pointer font-mono text-xs text-smoke-400">
              Recordarme
            </label>
          </div>

          {error && (
            <div role="alert" className="rounded border border-crimson-700 bg-crimson-900/40 px-3 py-2">
              <p className="font-mono text-xs text-crimson-300">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-crimson-600 px-6 py-3 font-serif font-bold uppercase tracking-wider text-smoke-100 transition-colors hover:bg-crimson-500 disabled:opacity-50"
          >
            {loading ? 'Ingresando...' : 'Entrar y jugar'}
          </button>
        </form>

        <div className="mt-4 flex justify-end">
          <button
            onClick={() => navigate('/register', { state: routeState })}
            className="font-mono text-xs text-gold-400 underline hover:text-gold-300"
          >
            Crear cuenta →
          </button>
        </div>
      </div>
    </m.div>
  );
}
