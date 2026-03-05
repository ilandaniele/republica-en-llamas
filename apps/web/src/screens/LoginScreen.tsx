import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth.js';
import { supabase, isOfflineMode, missingEnvVars, signInWithGoogle, translateAuthError } from '../lib/supabase.js';
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
      if (err) { setError(translateAuthError(err.message)); return; }
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
    if (!email) { setError('Ingresá tu email primero'); return; }
    setLoading(true);
    await supabase.auth.resetPasswordForEmail(email);
    setResetSent(true);
    setLoading(false);
  };

  if (isOfflineMode) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-navy-800 border border-navy-600 rounded-xl p-8 text-center">
          <p className="text-crimson-400 font-serif text-xl font-bold mb-3">⚠ Sin conexión a Supabase</p>
          <p className="text-smoke-400 font-mono text-xs mb-4">
            Faltan variables de entorno en <code className="text-gold-400">.env</code>:
          </p>
          {missingEnvVars.url && <p className="text-smoke-300 font-mono text-xs mb-1">• VITE_SUPABASE_URL</p>}
          {missingEnvVars.key && <p className="text-smoke-300 font-mono text-xs mb-1">• VITE_SUPABASE_ANON_KEY</p>}
          <button onClick={() => navigate('/')} className="mt-6 text-gold-400 font-mono text-sm underline">
            Jugar en modo offline →
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      className="min-h-screen flex flex-col items-center justify-center p-6"
    >
      <div className="max-w-md w-full">
        <button onClick={() => navigate(-1)} className="text-smoke-500 font-mono text-xs mb-6 hover:text-smoke-300 flex items-center gap-1">
          ← Volver
        </button>
        <h1 className="font-serif text-3xl text-smoke-100 font-bold mb-2">Iniciar sesión</h1>
        <p className="text-smoke-400 font-mono text-xs mb-8">
          Tu historial y puntajes te esperan.
        </p>

        {/* Google OAuth button */}
        <button
          onClick={() => { void signInWithGoogle(); }}
          className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-800 font-semibold py-3 px-4 rounded-lg border border-gray-300 transition-colors mb-4"
        >
          <svg width="18" height="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.35-8.16 2.35-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          Continuar con Google
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-navy-600" />
          <span className="text-smoke-600 font-mono text-xs">o</span>
          <div className="flex-1 h-px bg-navy-600" />
        </div>

        {resetSent ? (
          <div className="bg-emerald-900/40 border border-emerald-700 rounded-lg p-4 text-emerald-300 font-mono text-sm">
            ✓ Te enviamos un email para restablecer tu contraseña.
          </div>
        ) : (
          <form onSubmit={(e) => { void handleSubmit(e); }} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-navy-800 border border-navy-600 text-smoke-100 font-mono text-sm px-4 py-3 rounded-lg focus:outline-none focus:border-gold-500"
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-navy-800 border border-navy-600 text-smoke-100 font-mono text-sm px-4 py-3 rounded-lg focus:outline-none focus:border-gold-500"
            />

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="accent-gold-500"
              />
              <label htmlFor="rememberMe" className="text-smoke-400 font-mono text-xs cursor-pointer">
                Recordarme
              </label>
            </div>

            {error && (
              <div className="bg-crimson-900/40 border border-crimson-700 rounded px-3 py-2">
                <p className="text-crimson-300 font-mono text-xs">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-crimson-600 hover:bg-crimson-500 text-smoke-100 font-serif font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 uppercase tracking-wider"
            >
              {loading ? 'Ingresando...' : 'Entrar y jugar'}
            </button>
          </form>
        )}

        <div className="flex justify-between mt-4">
          <button
            onClick={() => { void handleForgotPassword(); }}
            className="text-smoke-500 hover:text-smoke-300 font-mono text-xs underline"
          >
            Olvidé mi contraseña
          </button>
          <button
            onClick={() => navigate('/register', { state: { difficulty } })}
            className="text-gold-400 hover:text-gold-300 font-mono text-xs underline"
          >
            Crear cuenta →
          </button>
        </div>
      </div>
    </motion.div>
  );
}
