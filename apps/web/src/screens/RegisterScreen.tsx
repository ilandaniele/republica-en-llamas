import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth.js';
import { checkUsernameAvailable, isOfflineMode, missingEnvVars, signInWithGoogle, supabase, translateAuthError } from '../lib/supabase.js';
import { useGameStore } from '../stores/gameStore.js';
import type { Difficulty } from '@republica/game-engine';

export default function RegisterScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const difficulty: Difficulty = (location.state as { difficulty?: Difficulty })?.difficulty ?? 'normal';
  const { signUp } = useAuth();
  const startNewGame = useGameStore((s) => s.startNewGame);
  const setUserId = useGameStore((s) => s.setUserId);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (username.length < 3) { setUsernameAvailable(null); return; }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setCheckingUsername(true);
    debounceRef.current = setTimeout(async () => {
      const available = await checkUsernameAvailable(username);
      setUsernameAvailable(available);
      setCheckingUsername(false);
    }, 400);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [username]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!username.trim()) { setError('El nombre de usuario es requerido'); return; }
    if (username.length < 3) { setError('El usuario debe tener al menos 3 caracteres'); return; }
    if (usernameAvailable === false) { setError('Ese nombre de usuario ya está ocupado'); return; }
    if (password.length < 6) { setError('La contraseña debe tener al menos 6 caracteres'); return; }
    setLoading(true);
    try {
      const { data, error: err } = await signUp(email, password, username);
      if (err) {
        setError(translateAuthError(err.message));
        return;
      }

      // Insert profile record with username
      if (data.user) {
        setUserId(data.user.id);
        await supabase.from('profiles').upsert({
          id: data.user.id,
          username: username.trim(),
          country: 'AR',
        });
      }

      // If session exists immediately: email confirmation is disabled → go to game
      if (data.session) {
        startNewGame(difficulty);
        navigate('/president');
      } else {
        // Email confirmation required
        setConfirmationSent(true);
      }
    } catch {
      setError('Error inesperado. Intentá de nuevo.');
    } finally {
      setLoading(false);
    }
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

  if (confirmationSent) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <div className="text-5xl mb-4">📬</div>
          <h2 className="font-serif text-2xl text-smoke-100 font-bold mb-3">Revisá tu email</h2>
          <p className="text-smoke-400 font-mono text-sm mb-6">
            Te enviamos un link de confirmación a <strong className="text-gold-400">{email}</strong>.
            Confirmá tu cuenta y volvé a iniciar sesión.
          </p>
          <button
            onClick={() => navigate('/login', { state: { difficulty } })}
            className="bg-crimson-600 hover:bg-crimson-500 text-smoke-100 font-serif font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Ir al login →
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      className="min-h-screen flex flex-col items-center justify-center p-6"
    >
      <div className="max-w-md w-full">
        <button onClick={() => navigate(-1)} className="text-smoke-500 font-mono text-xs mb-6 hover:text-smoke-300 flex items-center gap-1">
          ← Volver
        </button>
        <h1 className="font-serif text-3xl text-smoke-100 font-bold mb-2">Crear cuenta</h1>
        <p className="text-smoke-400 font-mono text-xs mb-6">
          Tu historial de partidas se guarda automáticamente.
        </p>

        {/* Google OAuth */}
        <button
          type="button"
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
          <span className="text-smoke-600 font-mono text-xs">o registrate con email</span>
          <div className="flex-1 h-px bg-navy-600" />
        </div>

        <form onSubmit={(e) => { void handleSubmit(e); }} className="space-y-4">
          {/* Username */}
          <div className="relative">
            <input
              type="text"
              placeholder="Nombre de usuario (mín. 3 caracteres)"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-navy-800 border border-navy-600 text-smoke-100 font-mono text-sm px-4 py-3 rounded-lg focus:outline-none focus:border-gold-500 pr-8"
            />
            {username.length >= 3 && (
              <span className={`absolute right-3 top-3.5 text-xs ${
                checkingUsername ? 'text-smoke-500' : usernameAvailable ? 'text-emerald-400' : 'text-crimson-400'
              }`}>
                {checkingUsername ? '...' : usernameAvailable ? '✓' : '✗'}
              </span>
            )}
          </div>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-navy-800 border border-navy-600 text-smoke-100 font-mono text-sm px-4 py-3 rounded-lg focus:outline-none focus:border-gold-500"
          />
          <div>
            <input
              type="password"
              placeholder="Contraseña (mínimo 6 caracteres)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={`w-full bg-navy-800 border text-smoke-100 font-mono text-sm px-4 py-3 rounded-lg focus:outline-none ${
                password.length > 0 && password.length < 6 ? 'border-crimson-600' : 'border-navy-600 focus:border-gold-500'
              }`}
            />
            {password.length > 0 && password.length < 6 && (
              <p className="text-crimson-400 font-mono text-xs mt-1">
                {'▓'.repeat(password.length)}{'░'.repeat(6 - password.length)} {password.length}/6
              </p>
            )}
          </div>

          {error && (
            <div className="bg-crimson-900/40 border border-crimson-700 rounded px-3 py-2">
              <p className="text-crimson-300 font-mono text-xs">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || usernameAvailable === false || username.length < 3}
            className="w-full bg-crimson-600 hover:bg-crimson-500 text-smoke-100 font-serif font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 uppercase tracking-wider"
          >
            {loading ? 'Creando cuenta...' : 'Registrarse y jugar'}
          </button>
        </form>

        <p className="text-smoke-500 font-mono text-xs mt-6 text-center">
          ¿Ya tenés cuenta?{' '}
          <button
            onClick={() => navigate('/login', { state: { difficulty } })}
            className="text-gold-400 hover:text-gold-300 underline"
          >
            Iniciá sesión
          </button>
        </p>
      </div>
    </motion.div>
  );
}
