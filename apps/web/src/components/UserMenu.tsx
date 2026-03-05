import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { useGameStore } from '../stores/gameStore.js';

export function UserMenu() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const setUserId = useGameStore((s) => s.setUserId);
  const personalBest = useGameStore((s) => s.personalBest);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate('/login')}
          className="bg-navy-700 hover:bg-navy-600 border border-navy-500 text-smoke-300 font-mono text-xs px-3 py-1.5 rounded transition-colors"
        >
          Iniciar sesión
        </button>
        <button
          onClick={() => navigate('/register')}
          className="bg-gold-600 hover:bg-gold-500 text-navy-900 font-mono text-xs px-3 py-1.5 rounded font-bold transition-colors"
        >
          Crear cuenta
        </button>
      </div>
    );
  }

  const displayName = (user.user_metadata?.['username'] as string | undefined) ?? user.email?.split('@')[0] ?? '?';

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 bg-navy-800 hover:bg-navy-700 border border-navy-600 text-smoke-300 font-mono text-xs px-3 py-1.5 rounded-lg transition-colors"
      >
        {personalBest && (
          <span className="text-gold-400">🏆 {personalBest.score.toLocaleString()}</span>
        )}
        <span>👤 {displayName}</span>
        <span className="text-smoke-600">{open ? '▴' : '▾'}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 bg-navy-800 border border-navy-600 rounded-lg shadow-xl z-50 min-w-[160px] py-1">
          <button
            onClick={() => { setOpen(false); navigate('/profile'); }}
            className="w-full text-left px-4 py-2 text-smoke-300 font-mono text-xs hover:bg-navy-700 transition-colors"
          >
            👤 Mi Perfil
          </button>
          <button
            onClick={() => { setOpen(false); navigate('/history'); }}
            className="w-full text-left px-4 py-2 text-smoke-300 font-mono text-xs hover:bg-navy-700 transition-colors"
          >
            📋 Mis Partidas
          </button>
          <div className="border-t border-navy-600 my-1" />
          <button
            onClick={() => {
              setOpen(false);
              void signOut().then(() => setUserId(null));
            }}
            className="w-full text-left px-4 py-2 text-crimson-400 font-mono text-xs hover:bg-navy-700 transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}
