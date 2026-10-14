import React from 'react';
import { useNavigate } from 'react-router-dom';
import { m } from 'framer-motion';
import { isOfflineMode, signInWithGoogle } from '../../lib/supabase.js';
import { useGameStore } from '../../stores/gameStore.js';
import type { Difficulty } from '@republica/game-engine';
import { GoogleIcon } from './GoogleIcon.js';

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
                <GoogleIcon />
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
