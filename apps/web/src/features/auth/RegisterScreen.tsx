import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { m } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth.js';
import { MIN_USERNAME_LENGTH, useUsernameAvailability } from './useUsernameAvailability.js';
import { isOfflineMode, signInWithGoogle, supabase, translateAuthError } from '../../lib/supabase.js';
import { useGameStore } from '../../stores/gameStore.js';
import type { Difficulty } from '@republica/game-engine';
import { GoogleIcon } from './GoogleIcon.js';
import { OfflineNotice } from './register/OfflineNotice.js';
import { ConfirmationSent } from './register/ConfirmationSent.js';
import { UsernameField } from './register/UsernameField.js';
import { PasswordField } from './register/PasswordField.js';
import { validateRegistration } from './register/validateRegistration.js';

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
  const { available: usernameAvailable, checking: checkingUsername } = useUsernameAvailability(username);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmationSent, setConfirmationSent] = useState(false);

  const goToLogin = () => navigate('/login', { state: { difficulty } });

  const register = async () => {
    const { data, error: err } = await signUp(email, password, username);
    if (err) {
      setError(translateAuthError(err.message));
      return;
    }

    if (data.user) {
      setUserId(data.user.id);
      await supabase.from('profiles').upsert({
        id: data.user.id,
        username: username.trim(),
      });
    }

    // A session exists immediately only when email confirmation is disabled
    if (data.session) {
      startNewGame(difficulty);
      navigate('/president');
    } else {
      setConfirmationSent(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateRegistration({ username, password, usernameAvailable });
    setError(validationError ?? '');
    if (validationError) return;
    setLoading(true);
    try {
      await register();
    } catch {
      setError('Error inesperado. Intentá de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (isOfflineMode) return <OfflineNotice onPlayOffline={() => navigate('/')} />;
  if (confirmationSent) return <ConfirmationSent email={email} onGoToLogin={goToLogin} />;

  return (
    <m.div
      initial={{ opacity: 0, x: 40 }}
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
        <h1 className="mb-2 font-serif text-3xl font-bold text-smoke-100">Crear cuenta</h1>
        <p className="mb-6 font-mono text-xs text-smoke-400">
          Tu historial de partidas se guarda automáticamente.
        </p>

        <button
          type="button"
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
          <span className="font-mono text-xs text-smoke-600">o registrate con email</span>
          <div className="h-px flex-1 bg-navy-600" />
        </div>

        <form
          onSubmit={(e) => {
            void handleSubmit(e);
          }}
          className="space-y-4"
        >
          <UsernameField
            value={username}
            onChange={setUsername}
            available={usernameAvailable}
            checking={checkingUsername}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-lg border border-navy-600 bg-navy-800 px-4 py-3 font-mono text-sm text-smoke-100 focus:border-gold-500 focus:outline-none"
          />
          <PasswordField value={password} onChange={setPassword} />

          {error && (
            <div className="bg-crimson-900/40 rounded border border-crimson-700 px-3 py-2">
              <p className="text-crimson-300 font-mono text-xs">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || usernameAvailable === false || username.length < MIN_USERNAME_LENGTH}
            className="w-full rounded-lg bg-crimson-600 px-6 py-3 font-serif font-bold uppercase tracking-wider text-smoke-100 transition-colors hover:bg-crimson-500 disabled:opacity-50"
          >
            {loading ? 'Creando cuenta...' : 'Registrarse y jugar'}
          </button>
        </form>

        <p className="text-smoke-500 mt-6 text-center font-mono text-xs">
          ¿Ya tenés cuenta?{' '}
          <button onClick={goToLogin} className="text-gold-400 underline hover:text-gold-300">
            Iniciá sesión
          </button>
        </p>
      </div>
    </m.div>
  );
}
