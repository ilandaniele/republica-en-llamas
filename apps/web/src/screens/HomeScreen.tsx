import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import type { Difficulty, ScenarioId } from '@republica/game-engine';
import { HISTORICAL_SCENARIOS } from '@republica/game-engine';
import { useGameStore } from '../stores/gameStore.js';
import { useAuth } from '../hooks/useAuth.js';
import { isOfflineMode } from '../lib/supabase.js';
import { UserMenu } from '../components/UserMenu.js';
import { useEntitlements, getDailyRunsRemaining, consumeDailyRun } from '../hooks/useEntitlements.js';
import { BuyButton } from '../components/BuyButton.js';
import { PaywallModal } from '../components/PaywallModal.js';
import { trackGameStarted } from '../lib/analytics.js';

type AuthMode = 'menu' | 'login' | 'register';

const DIFFICULTIES: { id: Difficulty; label: string; flavor: string; color: string }[] = [
  { id: 'easy', label: 'Fácil', flavor: 'El viento sopla a tu favor. Por ahora.', color: 'border-emerald-500 hover:bg-emerald-900/30' },
  { id: 'normal', label: 'Normal', flavor: 'La república tiembla. Tú decides si cae.', color: 'border-blue-500 hover:bg-blue-900/30' },
  { id: 'hard', label: 'Difícil', flavor: 'El abismo te mira. ¿Lo mirarás tú también?', color: 'border-orange-500 hover:bg-orange-900/30' },
  { id: 'crisis', label: 'Crisis', flavor: 'Todo está en llamas. Bienvenido.', color: 'border-crimson-500 hover:bg-crimson-900/30' },
];

function AuthForm({ mode, onBack }: { mode: 'login' | 'register'; onBack: () => void }) {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const startNewGame = useGameStore((s) => s.startNewGame);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('normal');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        const { error: err } = await signIn(email, password);
        if (err) { setError(err.message); return; }
      } else {
        if (!username.trim()) { setError('El nombre de usuario es requerido'); setLoading(false); return; }
        const { error: err } = await signUp(email, password, username);
        if (err) { setError(err.message); return; }
      }
      startNewGame(selectedDifficulty);
      navigate('/president');
    } catch {
      setError('Error inesperado. Intentá de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
    >
      <button onClick={onBack} className="text-smoke-500 font-mono text-xs mb-6 hover:text-smoke-300 flex items-center gap-1">
        ← Volver
      </button>
      <h2 className="font-serif text-2xl text-smoke-100 font-bold mb-6">
        {mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
      </h2>

      {/* Difficulty selector */}
      <div className="mb-6">
        <p className="text-smoke-400 font-mono text-xs uppercase tracking-widest mb-3">Dificultad</p>
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
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={(e) => { void handleSubmit(e); }} className="space-y-4">
        {mode === 'register' && (
          <input
            type="text"
            placeholder="Nombre de usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-navy-800 border border-navy-600 text-smoke-100 font-mono text-sm px-4 py-3 rounded-lg focus:outline-none focus:border-gold-500"
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-navy-800 border border-navy-600 text-smoke-100 font-mono text-sm px-4 py-3 rounded-lg focus:outline-none focus:border-gold-500"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-navy-800 border border-navy-600 text-smoke-100 font-mono text-sm px-4 py-3 rounded-lg focus:outline-none focus:border-gold-500"
        />
        {error && <p className="text-crimson-400 font-mono text-xs">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gold-500 hover:bg-gold-400 text-navy-900 font-serif font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? 'Cargando...' : mode === 'login' ? 'Entrar' : 'Registrarse'}
        </button>
      </form>
    </motion.div>
  );
}

export default function HomeScreen() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const startNewGame = useGameStore((s) => s.startNewGame);
  const gameState = useGameStore((s) => s.gameState);
  const presidentId = useGameStore((s) => s.presidentId);
  const setScenario = useGameStore((s) => s.setScenario);
  const { user, loading: authLoading, signOut } = useAuth();
  const { hasEntitlement, hasPremium } = useEntitlements();
  const [authMode, setAuthMode] = useState<AuthMode>('menu');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('normal');
  const [homeMode, setHomeMode] = useState<'clasico' | 'historico'>('clasico');
  const [paywallScenario, setPaywallScenario] = useState<ScenarioId | null>(null);

  const dailyRemaining = getDailyRunsRemaining();
  const dailyLimitReached = !hasPremium && dailyRemaining <= 0;

  const startGame = (difficulty: Difficulty) => {
    consumeDailyRun();
    startNewGame(difficulty);
    trackGameStarted({ difficulty, president: presidentId, mode: 'normal' });
    navigate('/president');
  };

  const startHistoricalScenario = (scenarioId: ScenarioId) => {
    const config = HISTORICAL_SCENARIOS[scenarioId];
    if (!hasEntitlement(config.entitlementRequired)) {
      setPaywallScenario(scenarioId);
      return;
    }
    setScenario(scenarioId);
    consumeDailyRun();
    startNewGame('hard');
    trackGameStarted({ difficulty: 'hard', president: presidentId, mode: 'historical' });
    navigate('/president');
  };

  const handleGuest = () => startGame(selectedDifficulty);
  const handleLoggedInStart = () => startGame(selectedDifficulty);
  const handleContinue = () => { navigate('/game'); };
  const handleLogout = () => { void signOut(); };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-navy-900 to-navy-900 pointer-events-none z-10" />

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-20 max-w-2xl w-full"
      >
        {/* User menu (top right) */}
        <div className="flex justify-end mb-4">
          <UserMenu />
        </div>

        {/* Logo */}
        <div className="text-center mb-10">
          <div className="fire-container mx-auto w-48 h-16 mb-4">
            <div className="fire-particle" />
            <div className="fire-particle" />
            <div className="fire-particle" />
            <div className="fire-particle" />
            <div className="fire-particle" />
            <div className="fire-particle" />
            <div className="smoke-particle" />
            <div className="smoke-particle" />
            <div className="smoke-particle" />
          </div>
          <h1 className="font-serif text-5xl font-black text-smoke-100 leading-none">
            <span className="text-crimson-400 text-shadow-crimson">República</span>
            <br />
            <span className="text-gold-400 text-shadow-gold">en Llamas</span>
          </h1>
          <p className="text-smoke-400 mt-3 font-mono text-sm tracking-wider uppercase">
            Simulador de Decisiones Políticas
          </p>
        </div>

        <AnimatePresence mode="wait">
          {authMode === 'menu' ? (
            <motion.div
              key="menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Logged-in user header */}
              {!authLoading && user && (
                <div className="flex items-center justify-between mb-6 bg-navy-800 border border-navy-600 rounded-lg px-4 py-3">
                  <div>
                    <p className="text-smoke-400 font-mono text-xs">Sesión activa</p>
                    <p className="text-gold-400 font-mono text-sm font-bold">{user.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-smoke-500 hover:text-smoke-300 font-mono text-xs border border-navy-500 px-3 py-1 rounded"
                  >
                    Cerrar sesión
                  </button>
                </div>
              )}

              {/* Mode tab switcher */}
              <div className="flex mb-4" style={{ borderBottom: '2px solid var(--night-blue)' }}>
                <button
                  onClick={() => setHomeMode('clasico')}
                  className={`font-serif text-[8px] px-4 py-2 transition-colors ${homeMode === 'clasico' ? 'text-gold-400' : 'text-smoke-500'}`}
                  style={{ borderBottom: homeMode === 'clasico' ? '2px solid var(--gold)' : '2px solid transparent' }}
                >
                  CLÁSICO
                </button>
                <button
                  onClick={() => setHomeMode('historico')}
                  className={`font-serif text-[8px] px-4 py-2 transition-colors ${homeMode === 'historico' ? 'text-gold-400' : 'text-smoke-500'}`}
                  style={{ borderBottom: homeMode === 'historico' ? '2px solid var(--gold)' : '2px solid transparent' }}
                >
                  HISTÓRICO
                </button>
              </div>

              {homeMode === 'clasico' ? (
                <div className="grid grid-cols-2 gap-3 mb-8">
                  {DIFFICULTIES.map((d) => (
                    <motion.button
                      key={d.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedDifficulty(d.id)}
                      className={`p-4 border-2 text-left transition-colors duration-200 ${d.color} ${
                        selectedDifficulty === d.id
                          ? 'bg-navy-700 ring-2 ring-gold-400'
                          : 'border-navy-600 bg-navy-800'
                      }`}
                    >
                      <div className="font-serif font-bold text-smoke-100 mb-1">{d.label}</div>
                      <div className="text-xs text-smoke-400 italic">{d.flavor}</div>
                    </motion.button>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 mb-8">
                  {(Object.entries(HISTORICAL_SCENARIOS) as [ScenarioId, typeof HISTORICAL_SCENARIOS[ScenarioId]][]).map(([id, cfg]) => {
                    const locked = !hasEntitlement(cfg.entitlementRequired);
                    return (
                      <motion.button
                        key={id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => startHistoricalScenario(id)}
                        className="p-4 border-2 border-navy-600 bg-navy-800 hover:bg-navy-700 text-left relative overflow-hidden transition-colors"
                      >
                        {locked && (
                          <div className="absolute inset-0 bg-navy-900/70 flex items-center justify-center z-10">
                            <span className="text-gold-400 font-serif text-[8px]">🔒 PRO</span>
                          </div>
                        )}
                        <div className="text-gold-400 font-mono text-xs mb-1">{t(cfg.periodKey)}</div>
                        <div className="font-serif text-smoke-100 text-[8px] font-bold mb-1">{t(cfg.labelKey)}</div>
                        <div className="text-smoke-400 font-mono text-xs leading-tight">{t(cfg.descriptionKey)}</div>
                      </motion.button>
                    );
                  })}
                </div>
              )}

              {/* Auth / Start buttons */}
              {/* Daily run limit banner */}
              {dailyLimitReached && (
                <div className="mb-4 bg-crimson-900/40 border border-crimson-700 rounded-xl p-4 text-center">
                  <p className="text-crimson-300 font-mono text-sm font-bold mb-1">⏰ Límite diario alcanzado (3/3)</p>
                  <p className="text-smoke-400 font-mono text-xs mb-3">Volvé mañana o desbloqueá acceso ilimitado</p>
                  <BuyButton entitlement="full_access" label="Acceso Total — $5.99" className="mx-auto" />
                </div>
              )}

              <div className="space-y-3">
                {!dailyLimitReached && (user ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleLoggedInStart}
                    className="w-full bg-crimson-600 hover:bg-crimson-500 text-smoke-100 font-serif font-bold py-4 px-8 rounded-lg text-xl transition-colors uppercase tracking-wider shadow-lg"
                  >
                    Nueva Partida
                  </motion.button>
                ) : (
                  <>
                    {!isOfflineMode && (
                      <>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setAuthMode('login')}
                          className="w-full bg-crimson-600 hover:bg-crimson-500 text-smoke-100 font-serif font-bold py-4 px-8 rounded-lg text-xl transition-colors uppercase tracking-wider shadow-lg"
                        >
                          Iniciar sesión
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setAuthMode('register')}
                          className="w-full bg-navy-700 hover:bg-navy-600 border border-gold-600 text-gold-400 font-serif font-bold py-3 px-8 rounded-lg transition-colors"
                        >
                          Crear cuenta
                        </motion.button>
                      </>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleGuest}
                      className={`w-full ${isOfflineMode ? 'bg-crimson-600 hover:bg-crimson-500 text-smoke-100 font-serif font-bold py-4 text-xl shadow-lg' : 'bg-navy-800 hover:bg-navy-700 border border-navy-500 text-smoke-400'} font-bold py-3 px-8 rounded-lg transition-colors`}
                    >
                      {isOfflineMode ? 'Nueva Partida' : 'Jugar como invitado'}
                    </motion.button>
                  </>
                ))}

                {gameState && !gameState.isGameOver && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={handleContinue}
                    className="w-full bg-navy-700 hover:bg-navy-600 border border-navy-500 text-smoke-200 font-serif font-bold py-3 px-8 rounded-lg transition-colors"
                  >
                    Continuar Partida — Turno {gameState.turn}
                  </motion.button>
                )}

                <button
                  onClick={() => navigate('/leaderboard')}
                  className="w-full bg-transparent hover:bg-navy-800 border border-navy-600 text-smoke-400 font-mono py-3 px-8 rounded-lg transition-colors text-sm"
                >
                  Tabla de Líderes
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div key="auth" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <AuthForm mode={authMode as 'login' | 'register'} onBack={() => setAuthMode('menu')} />
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-center text-smoke-600 font-mono text-xs mt-8">
          v0.3.0 — República en Llamas
        </p>
      </motion.div>

      {paywallScenario && (
        <PaywallModal
          entitlement="mode_historical"
          triggerPoint="scenario_select"
          onClose={() => setPaywallScenario(null)}
        />
      )}
    </div>
  );
}
