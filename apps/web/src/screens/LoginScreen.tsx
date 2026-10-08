import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { m } from 'framer-motion';
import { useAuth } from '../hooks/useAuth.js';
import {
  supabase,
  isOfflineMode,
  missingEnvVars,
  signInWithGoogle,
  translateAuthError,
} from '../lib/supabase.js';
import { useGameStore } from '../stores/gameStore.js';
import type { Difficulty } from '@republica/game-engine';

export default function LoginScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const difficulty: Difficulty = (location.state as { difficulty?: Difficulty })?.difficulty ?? 'normal';
  const { signIn } = useAuth();
  const startNewGame = useGameStore((s) => s.startNewGame);
  const setUserId = useGameStore((s) => s.setUserId);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data, error: err } = await signIn(email, password);
      if (err) {
        setError(translateAuthError(err.message));
        return;
      }
      if (data.user) setUserId(data.user.id);
      startNewGame(difficulty);
      navigate('/president');
    } catch {
      setError('Error inesperado. Intentá de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Ingresá tu email primero');
      return;
    }
    setLoading(true);
    await supabase.auth.resetPasswordForEmail(email);
    setResetSent(true);
    setLoading(false);
  };

  if (isOfflineMode) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-md rounded-xl border border-navy-600 bg-navy-800 p-8 text-center">
          <p className="mb-3 font-serif text-xl font-bold text-crimson-400">⚠ Sin conexión a Supabase</p>
          <p className="mb-4 font-mono text-xs text-smoke-400">
            Faltan variables de entorno en <code className="text-gold-400">.env</code>:
          </p>
          {missingEnvVars.url && <p className="text-smoke-300 mb-1 font-mono text-xs">• VITE_SUPABASE_URL</p>}
          {missingEnvVars.key && (
            <p className="text-smoke-300 mb-1 font-mono text-xs">• VITE_SUPABASE_ANON_KEY</p>
          )}
          <button onClick={() => navigate('/')} className="mt-6 font-mono text-sm text-gold-400 underline">
            Jugar en modo offline →
          </button>
        </div>
      </div>
    );
  }

  return (
    <m.div
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex min-h-screen flex-col items-center justify-center p-6"
    >
      <div className="w-full max-w-md">
        <button
          onClick={() => navigate(-1)}
          className="text-smoke-500 hover:text-smoke-300 mb-6 flex items-center gap-1 font-mono text-xs"
        >
          ← Volver
        </button>
        <h1 className="mb-2 font-serif text-3xl font-bold text-smoke-100">Iniciar sesión</h1>
        <p className="mb-8 font-mono text-xs text-smoke-400">Tu historial y puntajes te esperan.</p>

        {/* Google OAuth button */}
        <button
          onClick={() => {
            void signInWithGoogle();
          }}
          className="mb-4 flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-3 font-semibold text-gray-800 transition-colors hover:bg-gray-50"
        >
          <svg width="18" height="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path
              fill="#EA4335"
              d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
            />
            <path
              fill="#4285F4"
              d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
            />
            <path
              fill="#FBBC05"
              d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
            />
            <path
              fill="#34A853"
              d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.35-8.16 2.35-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
            />
          </svg>
          Continuar con Google
        </button>

        <div className="mb-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-navy-600" />
          <span className="font-mono text-xs text-smoke-600">o</span>
          <div className="h-px flex-1 bg-navy-600" />
        </div>

        {resetSent ? (
          <div className="rounded-lg border border-emerald-700 bg-emerald-900/40 p-4 font-mono text-sm text-emerald-300">
            ✓ Te enviamos un email para restablecer tu contraseña.
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              void handleSubmit(e);
            }}
            className="space-y-4"
          >
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-navy-600 bg-navy-800 px-4 py-3 font-mono text-sm text-smoke-100 focus:border-gold-500 focus:outline-none"
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-lg border border-navy-600 bg-navy-800 px-4 py-3 font-mono text-sm text-smoke-100 focus:border-gold-500 focus:outline-none"
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
              <div className="bg-crimson-900/40 rounded border border-crimson-700 px-3 py-2">
                <p className="text-crimson-300 font-mono text-xs">{error}</p>
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
        )}

        <div className="mt-4 flex justify-between">
          <button
            onClick={() => {
              void handleForgotPassword();
            }}
            className="text-smoke-500 hover:text-smoke-300 font-mono text-xs underline"
          >
            Olvidé mi contraseña
          </button>
          <button
            onClick={() => navigate('/register', { state: { difficulty } })}
            className="font-mono text-xs text-gold-400 underline hover:text-gold-300"
          >
            Crear cuenta →
          </button>
        </div>
      </div>
    </m.div>
  );
}
