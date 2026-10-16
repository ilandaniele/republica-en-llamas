import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { m } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth.js';
import {
  supabase,
  isOfflineMode,
  missingEnvVars,
  signInWithGoogle,
  translateAuthError,
} from '../../lib/supabase.js';
import { useGameStore } from '../../stores/gameStore.js';
import { GoogleIcon } from './GoogleIcon.js';
import { useAuthDestination } from './useAuthDestination.js';

export default function LoginScreen() {
  const navigate = useNavigate();
  const { routeState, captureGuestToken, continueAfterAuth } = useAuthDestination();
  const { signIn } = useAuth();
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
      const guestToken = await captureGuestToken();
      const { data, error: err } = await signIn(email, password);
      if (err) {
        setError(translateAuthError(err.message));
        return;
      }
      if (data.user) setUserId(data.user.id);
      await continueAfterAuth(guestToken);
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
          <GoogleIcon />
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
