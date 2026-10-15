import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth.js';
import { useGameStore } from '../stores/gameStore.js';
import { prefetchOnIntent } from '../app/routes.js';

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
          {...prefetchOnIntent('login')}
          className="text-smoke-300 rounded border border-navy-500 bg-navy-700 px-3 py-1.5 font-mono text-sm transition-colors hover:bg-navy-600"
        >
          Iniciar sesión
        </button>
        <button
          onClick={() => navigate('/register')}
          {...prefetchOnIntent('register')}
          className="rounded bg-gold-600 px-3 py-1.5 font-mono text-sm font-bold text-navy-900 transition-colors hover:bg-gold-500"
        >
          Crear cuenta
        </button>
      </div>
    );
  }

  const displayName =
    (user.user_metadata?.['username'] as string | undefined) ?? user.email?.split('@')[0] ?? '?';

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="text-smoke-300 flex items-center gap-2 rounded-lg border border-navy-600 bg-navy-800 px-3 py-1.5 font-mono text-xs transition-colors hover:bg-navy-700"
      >
        {personalBest && <span className="text-gold-400">🏆 {personalBest.score.toLocaleString()}</span>}
        <span>👤 {displayName}</span>
        <span className="text-smoke-600">{open ? '▴' : '▾'}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 min-w-[160px] rounded-lg border border-navy-600 bg-navy-800 py-1 shadow-xl">
          <button
            onClick={() => {
              setOpen(false);
              navigate('/profile');
            }}
            {...prefetchOnIntent('profile')}
            className="text-smoke-300 w-full px-4 py-2 text-left font-mono text-xs transition-colors hover:bg-navy-700"
          >
            👤 Mi Perfil
          </button>
          <button
            onClick={() => {
              setOpen(false);
              navigate('/history');
            }}
            {...prefetchOnIntent('history')}
            className="text-smoke-300 w-full px-4 py-2 text-left font-mono text-xs transition-colors hover:bg-navy-700"
          >
            📋 Mis Partidas
          </button>
          <div className="my-1 border-t border-navy-600" />
          <button
            onClick={() => {
              setOpen(false);
              void signOut().then(() => setUserId(null));
            }}
            className="w-full px-4 py-2 text-left font-mono text-xs text-crimson-400 transition-colors hover:bg-navy-700"
          >
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}
