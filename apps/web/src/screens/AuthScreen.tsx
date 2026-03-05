import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { isOfflineMode, signInWithGoogle } from '../lib/supabase.js';
import { useGameStore } from '../stores/gameStore.js';
import type { Difficulty } from '@republica/game-engine';

const DIFFICULTIES: { id: Difficulty; label: string; flavor: string; color: string }[] = [
  { id: 'easy', label: 'Fácil', flavor: 'El viento sopla a tu favor.', color: 'border-emerald-500 hover:bg-emerald-900/30' },
  { id: 'normal', label: 'Normal', flavor: 'La república tiembla.', color: 'border-blue-500 hover:bg-blue-900/30' },
  { id: 'hard', label: 'Difícil', flavor: 'El abismo te mira.', color: 'border-orange-500 hover:bg-orange-900/30' },
  { id: 'crisis', label: 'Crisis', flavor: 'Todo está en llamas.', color: 'border-crimson-500 hover:bg-crimson-900/30' },
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
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen flex flex-col items-center justify-center p-6"
    >
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-10">
          <h1 className="font-serif text-5xl font-black text-smoke-100 leading-none mb-2">
            <span className="text-crimson-400">República</span><br />
            <span className="text-gold-400">en Llamas</span>
          </h1>
          <p className="text-smoke-400 font-mono text-sm tracking-wider uppercase mt-2">
            Simulador de Decisiones Políticas
          </p>
        </div>

        {/* Difficulty selector */}
        <div className="mb-6">
          <p className="text-smoke-400 font-mono text-xs uppercase tracking-widest mb-3 text-center">
            Dificultad
          </p>
          <div className="grid grid-cols-2 gap-2">
            {DIFFICULTIES.map((d) => (
              <button
                key={d.id}
                onClick={() => setSelectedDifficulty(d.id)}
                className={`p-3 border-2 rounded-lg text-left text-xs transition-colors ${d.color} ${
                  selectedDifficulty === d.id ? 'bg-navy-700 ring-2 ring-gold-400' : 'border-navy-600 bg-navy-800'
                }`}
              >
                <div className="font-serif font-bold text-smoke-100">{d.label}</div>
                <div className="text-smoke-500 italic text-[10px] mt-0.5">{d.flavor}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Auth buttons */}
        <div className="space-y-3">
          {!isOfflineMode ? (
            <>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { void signInWithGoogle(); }}
                className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-800 font-semibold py-3 px-4 rounded-lg border border-gray-300 transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.35-8.16 2.35-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
                Continuar con Google
              </motion.button>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-navy-600" />
                <span className="text-smoke-600 font-mono text-xs">o</span>
                <div className="flex-1 h-px bg-navy-600" />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/register', { state: { difficulty: selectedDifficulty } })}
                className="w-full bg-crimson-600 hover:bg-crimson-500 text-smoke-100 font-serif font-bold py-4 px-8 rounded-lg text-xl transition-colors uppercase tracking-wider shadow-lg"
              >
                Crear cuenta
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/login', { state: { difficulty: selectedDifficulty } })}
                className="w-full bg-navy-700 hover:bg-navy-600 border border-gold-600 text-gold-400 font-serif font-bold py-3 px-8 rounded-lg transition-colors"
              >
                Iniciar sesión
              </motion.button>
              <button
                onClick={handleGuest}
                className="w-full text-smoke-500 hover:text-smoke-300 font-mono text-sm py-2 transition-colors"
              >
                Jugar sin cuenta → <span className="text-smoke-600 text-xs">(el progreso no se guarda)</span>
              </button>
            </>
          ) : (
            <>
              <div className="bg-gold-900/30 border border-gold-700 rounded-lg p-3 mb-2 text-xs font-mono text-gold-300">
                ⚠ Modo sin conexión — el progreso se guarda localmente
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleGuest}
                className="w-full bg-crimson-600 hover:bg-crimson-500 text-smoke-100 font-serif font-bold py-4 px-8 rounded-lg text-xl transition-colors uppercase tracking-wider shadow-lg"
              >
                Nueva Partida
              </motion.button>
            </>
          )}
        </div>

        <p className="text-center text-smoke-600 font-mono text-xs mt-8">
          v0.4.0 — República en Llamas
        </p>
      </div>
    </motion.div>
  );
}
