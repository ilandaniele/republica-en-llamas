import React from 'react';
import { useNavigate } from 'react-router-dom';
import { m } from 'framer-motion';
import { isOfflineMode, signInWithGoogle } from '../lib/supabase.js';
import { useGameStore } from '../stores/gameStore.js';
import type { Difficulty } from '@republica/game-engine';

const DIFFICULTIES: { id: Difficulty; label: string; flavor: string; color: string }[] = [
  {
    id: 'easy',
    label: 'Fácil',
    flavor: 'El viento sopla a tu favor.',
    color: 'border-emerald-500 hover:bg-emerald-900/30',
  },
  {
    id: 'normal',
    label: 'Normal',
    flavor: 'La república tiembla.',
    color: 'border-blue-500 hover:bg-blue-900/30',
  },
  {
    id: 'hard',
    label: 'Difícil',
    flavor: 'El abismo te mira.',
    color: 'border-orange-500 hover:bg-orange-900/30',
  },
  {
    id: 'crisis',
    label: 'Crisis',
    flavor: 'Todo está en llamas.',
    color: 'border-crimson-500 hover:bg-crimson-900/30',
  },
];

export default function AuthScreen() {
  const navigate = useNavigate();
  const startNewGame = useGameStore((s) => s.startNewGame);
  const [selectedDifficulty, setSelectedDifficulty] = React.useState<Difficulty>('normal');

  const handleGuest = () => {
    startNewGame(selectedDifficulty);
    navigate('/president');
  };

  return (
    <m.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex min-h-screen flex-col items-center justify-center p-6"
    >
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-10 text-center">
          <h1 className="mb-2 font-serif text-5xl font-black leading-none text-smoke-100">
            <span className="text-crimson-400">República</span>
            <br />
            <span className="text-gold-400">en Llamas</span>
          </h1>
          <p className="mt-2 font-mono text-sm uppercase tracking-wider text-smoke-400">
            Simulador de Decisiones Políticas
          </p>
        </div>

        {/* Difficulty selector */}
        <div className="mb-6">
          <p className="mb-3 text-center font-mono text-xs uppercase tracking-widest text-smoke-400">
            Dificultad
          </p>
          <div className="grid grid-cols-2 gap-2">
            {DIFFICULTIES.map((d) => (
              <button
                key={d.id}
                onClick={() => setSelectedDifficulty(d.id)}
                className={`rounded-lg border-2 p-3 text-left text-xs transition-colors ${d.color} ${
                  selectedDifficulty === d.id
                    ? 'bg-navy-700 ring-2 ring-gold-400'
                    : 'border-navy-600 bg-navy-800'
                }`}
              >
                <div className="font-serif font-bold text-smoke-100">{d.label}</div>
                <div className="text-smoke-500 mt-0.5 text-[10px] italic">{d.flavor}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Auth buttons */}
        <div className="space-y-3">
          {!isOfflineMode ? (
            <>
              <m.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  void signInWithGoogle();
                }}
                className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 bg-white px-4 py-3 font-semibold text-gray-800 transition-colors hover:bg-gray-50"
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
              </m.button>

              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-navy-600" />
                <span className="font-mono text-xs text-smoke-600">o</span>
                <div className="h-px flex-1 bg-navy-600" />
              </div>

              <m.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/register', { state: { difficulty: selectedDifficulty } })}
                className="w-full rounded-lg bg-crimson-600 px-8 py-4 font-serif text-xl font-bold uppercase tracking-wider text-smoke-100 shadow-lg transition-colors hover:bg-crimson-500"
              >
                Crear cuenta
              </m.button>
              <m.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/login', { state: { difficulty: selectedDifficulty } })}
                className="w-full rounded-lg border border-gold-600 bg-navy-700 px-8 py-3 font-serif font-bold text-gold-400 transition-colors hover:bg-navy-600"
              >
                Iniciar sesión
              </m.button>
              <button
                onClick={handleGuest}
                className="text-smoke-500 hover:text-smoke-300 w-full py-2 font-mono text-sm transition-colors"
              >
                Jugar sin cuenta → <span className="text-xs text-smoke-600">(el progreso no se guarda)</span>
              </button>
            </>
          ) : (
            <>
              <div className="bg-gold-900/30 border-gold-700 mb-2 rounded-lg border p-3 font-mono text-xs text-gold-300">
                ⚠ Modo sin conexión — el progreso se guarda localmente
              </div>
              <m.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGuest}
                className="w-full rounded-lg bg-crimson-600 px-8 py-4 font-serif text-xl font-bold uppercase tracking-wider text-smoke-100 shadow-lg transition-colors hover:bg-crimson-500"
              >
                Nueva Partida
              </m.button>
            </>
          )}
        </div>

        <p className="mt-8 text-center font-mono text-xs text-smoke-600">v0.4.0 — República en Llamas</p>
      </div>
    </m.div>
  );
}
