import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { m, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import type { Difficulty, ScenarioId } from '@republica/game-engine';
import { HISTORICAL_SCENARIOS } from '@republica/game-engine';
import { useGameStore } from '../../stores/gameStore.js';
import { useAuth } from '../../hooks/useAuth.js';
import { isOfflineMode } from '../../lib/api.js';
import { translateAuthError } from '../../lib/auth.js';
import { UserMenu } from '../../components/UserMenu.js';
import { OfflineBanner } from '../../components/OfflineBanner.js';
import { useEntitlements } from '../../hooks/useEntitlements.js';
import { PaywallModal } from '../../components/PaywallModal.js';
import { CasaRosadaEmblem } from '../../components/casa-rosada/CasaRosadaEmblem.js';
import { AccessibilitySettings } from '../../components/AccessibilitySettings.js';
import { prefersReducedMotion } from '../../lib/reducedMotion.js';
import { ScenarioCard } from './ScenarioCard.js';
import { DailyCapBanner } from './DailyCapBanner.js';
import { CareerSetup } from './CareerSetup.js';
import { trackGameStarted } from '../../lib/analytics.js';
import { usePrefetchLeaderboard } from '../../hooks/useLeaderboard.js';
import { isPlaytestMode } from '../../lib/playtest.js';

gsap.registerPlugin(useGSAP);

type AuthMode = 'menu' | 'login' | 'register';

const DIFFICULTIES: { id: Difficulty; label: string; flavor: string; color: string }[] = [
  {
    id: 'easy',
    label: 'Fácil',
    flavor: 'El viento sopla a tu favor. Por ahora.',
    color: 'border-emerald-500 hover:bg-emerald-900/30',
  },
  {
    id: 'normal',
    label: 'Normal',
    flavor: 'La república tiembla. Tú decides si cae.',
    color: 'border-blue-500 hover:bg-blue-900/30',
  },
  {
    id: 'hard',
    label: 'Difícil',
    flavor: 'El abismo te mira. ¿Lo mirarás tú también?',
    color: 'border-orange-500 hover:bg-orange-900/30',
  },
  {
    id: 'crisis',
    label: 'Crisis',
    flavor: 'Todo está en llamas. Bienvenido.',
    color: 'border-crimson-500 hover:bg-crimson-900/30',
  },
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
  const [accountCreated, setAccountCreated] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('normal');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (mode === 'login') {
        const { error: err } = await signIn(email, password);
        if (err) {
          setError(translateAuthError(err.message ?? ''));
          return;
        }
      } else if (!accountCreated) {
        if (!username.trim()) {
          setError('El nombre de usuario es requerido');
          setLoading(false);
          return;
        }
        const result = await signUp(email, password, username);
        if (result.error) {
          setError(translateAuthError(result.error.message ?? ''));
          return;
        }
        if (result.usernameError) {
          setAccountCreated(true);
          setError(translateAuthError(result.usernameError));
          return;
        }
      }
      await startNewGame(selectedDifficulty);
      navigate('/president');
    } catch {
      setError('Error inesperado. Intentá de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <m.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}>
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-1 font-mono text-xs text-smoke-500 hover:text-smoke-300"
      >
        ← Volver
      </button>
      <h2 className="mb-6 font-serif text-2xl font-bold text-smoke-100">
        {mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
      </h2>

      {/* Difficulty selector */}
      <div className="mb-6">
        <p className="mb-3 font-mono text-xs uppercase tracking-widest text-smoke-400">Dificultad</p>
        <div className="home-levels grid grid-cols-2 gap-2">
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
              <div className="difficulty-name text-smoke-100">{d.label}</div>
            </button>
          ))}
        </div>
      </div>

      <form
        onSubmit={(e) => {
          void handleSubmit(e);
        }}
        className="space-y-4"
      >
        {mode === 'register' && (
          <input
            type="text"
            placeholder="Nombre de usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full rounded-lg border border-navy-600 bg-navy-800 px-4 py-3 font-mono text-sm text-smoke-100 focus:border-gold-500 focus:outline-none"
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-navy-600 bg-navy-800 px-4 py-3 font-mono text-sm text-smoke-100 focus:border-gold-500 focus:outline-none"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-navy-600 bg-navy-800 px-4 py-3 font-mono text-sm text-smoke-100 focus:border-gold-500 focus:outline-none"
        />
        {error && <p className="font-mono text-xs text-crimson-400">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-gold-500 px-6 py-3 font-serif font-bold text-navy-900 transition-colors hover:bg-gold-400 disabled:opacity-50"
        >
          {loading
            ? 'Cargando...'
            : mode === 'login'
              ? 'Entrar'
              : accountCreated
                ? 'Continuar'
                : 'Registrarse'}
        </button>
      </form>
    </m.div>
  );
}

type HomeMode = 'clasico' | 'historico' | 'carrera';

function ModeTabs({ homeMode, onChange }: { homeMode: HomeMode; onChange: (mode: HomeMode) => void }) {
  return (
    <div className="home-tabs mb-4 flex" style={{ borderBottom: '2px solid var(--night-blue)' }}>
      <button
        onClick={() => onChange('clasico')}
        aria-pressed={homeMode === 'clasico'}
        className={`px-4 py-2 font-serif text-sm transition-colors ${homeMode === 'clasico' ? 'text-gold-400' : 'text-smoke-500'}`}
        style={{
          borderBottom: homeMode === 'clasico' ? '2px solid var(--gold)' : '2px solid transparent',
        }}
      >
        CLÁSICO
      </button>
      <button
        onClick={() => onChange('historico')}
        aria-pressed={homeMode === 'historico'}
        className={`px-4 py-2 font-serif text-sm transition-colors ${homeMode === 'historico' ? 'text-gold-400' : 'text-smoke-500'}`}
        style={{
          borderBottom: homeMode === 'historico' ? '2px solid var(--gold)' : '2px solid transparent',
        }}
      >
        HISTÓRICO
      </button>
      <button
        type="button"
        onClick={() => onChange('carrera')}
        aria-pressed={homeMode === 'carrera'}
        className={`px-4 py-2 text-sm ${homeMode === 'carrera' ? 'text-gold-400' : 'text-smoke-500'}`}
      >
        CARRERA
      </button>
    </div>
  );
}

interface GuestStartButtonsProps {
  onLogin: () => void;
  onRegister: () => void;
  onGuest: () => void;
}

function GuestStartButtons({ onLogin, onRegister, onGuest }: GuestStartButtonsProps) {
  return (
    <>
      {!isOfflineMode && (
        <>
          <m.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onLogin}
            className="w-full rounded-lg bg-crimson-600 px-8 py-4 font-serif text-sm font-bold uppercase leading-relaxed tracking-wide text-smoke-100 shadow-lg transition-colors hover:bg-crimson-500"
          >
            Iniciar sesión
          </m.button>
          <m.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onRegister}
            className="w-full rounded-lg border border-gold-600 bg-navy-700 px-8 py-3 font-serif text-sm font-bold leading-relaxed text-gold-400 transition-colors hover:bg-navy-600"
          >
            Crear cuenta
          </m.button>
        </>
      )}
      <m.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onGuest}
        className={`w-full ${isOfflineMode ? 'bg-gold-400 py-4 font-serif text-sm leading-relaxed text-navy-900 shadow-lg hover:bg-gold-300' : 'border border-navy-500 bg-navy-800 text-smoke-400 hover:bg-navy-700'} rounded-lg px-8 py-3 font-bold transition-colors`}
      >
        {isOfflineMode ? 'Nueva Partida' : 'Jugar como invitado'}
      </m.button>
    </>
  );
}

export default function HomeScreen() {
  const navigate = useNavigate();
  const prefetchLeaderboard = usePrefetchLeaderboard();
  const { t } = useTranslation();
  const startNewGame = useGameStore((s) => s.startNewGame);
  const gameState = useGameStore((s) => s.gameState);
  const saveRecoveryMessage = useGameStore((s) => s.saveRecoveryMessage);
  const presidentId = useGameStore((s) => s.presidentId);
  const setScenario = useGameStore((s) => s.setScenario);
  const careerStart = useGameStore((s) => s.careerStart);
  const setCareerStart = useGameStore((s) => s.setCareerStart);
  const { user } = useAuth();
  const { hasEntitlement } = useEntitlements();
  const [authMode, setAuthMode] = useState<AuthMode>('menu');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('normal');
  const [homeMode, setHomeMode] = useState<HomeMode>(careerStart ? 'carrera' : 'clasico');
  const [paywallScenario, setPaywallScenario] = useState<ScenarioId | null>(null);
  const scenarioGridRef = useRef<HTMLDivElement>(null);
  const homeContainerRef = useRef<HTMLDivElement>(null);

  // ── GSAP: title entry + tab-switch card stagger ───────────────────────────
  useGSAP(
    () => {
      if (!homeContainerRef.current || prefersReducedMotion()) return;
      // Title + subtitle cascade in on first mount
      gsap.from('.home-title-line', {
        y: -24,
        autoAlpha: 0,
        duration: 0.5,
        stagger: 0.12,
        ease: 'power2.out',
      });
      gsap.from('.home-subtitle', {
        y: 10,
        autoAlpha: 0,
        duration: 0.4,
        delay: 0.3,
        ease: 'power1.out',
      });
    },
    { scope: homeContainerRef },
  );

  useGSAP(
    () => {
      if (!homeContainerRef.current || prefersReducedMotion()) return;
      // Tab content fades + cards stagger in whenever homeMode switches
      gsap.fromTo(
        '.home-tab-cards > *',
        { y: 18, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.3,
          stagger: 0.055,
          ease: 'back.out(1.4)',
          clearProps: 'transform,opacity',
        },
      );
    },
    { scope: homeContainerRef, dependencies: [homeMode] },
  );

  const isStartingRef = useRef(false);

  const launchRun = async (difficulty: Difficulty, mode: 'normal' | 'historical' | 'daily') => {
    if (isStartingRef.current) return;
    isStartingRef.current = true;
    try {
      await startNewGame(difficulty, { daily: mode === 'daily' });
      trackGameStarted({ difficulty, president: presidentId, mode });
      navigate('/president');
    } finally {
      isStartingRef.current = false;
    }
  };

  const startGame = (difficulty: Difficulty) => {
    setScenario(null);
    setCareerStart(homeMode === 'carrera' ? (careerStart ?? 'mayor') : null);
    return launchRun(difficulty, 'normal');
  };

  const startHistoricalScenario = async (scenarioId: ScenarioId) => {
    const config = HISTORICAL_SCENARIOS[scenarioId];
    if (!hasEntitlement(config.entitlementRequired)) {
      setPaywallScenario(scenarioId);
      return;
    }
    setScenario(scenarioId);
    setCareerStart(null);
    await launchRun('hard', 'historical');
  };

  const startDailyChallenge = () => {
    setScenario(null);
    setCareerStart(null);
    void launchRun('normal', 'daily');
  };

  const handleGuest = () => void startGame(selectedDifficulty);
  const handleLoggedInStart = () => void startGame(selectedDifficulty);
  const handleContinue = () => {
    navigate('/game');
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden p-6">
      <div className="relative z-20 mb-4 w-full max-w-2xl">
        <OfflineBanner />
      </div>
      {saveRecoveryMessage && (
        <p
          role="status"
          className="relative z-20 mb-4 max-w-xl rounded border border-gold-400 bg-navy-800 p-4 font-mono text-lg text-gold-400"
        >
          {saveRecoveryMessage}
        </p>
      )}
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-transparent via-navy-900 to-navy-900" />

      {/* Main content */}
      <m.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-20 w-full max-w-2xl"
      >
        {/* User menu (top right) */}
        <div className="mb-4 flex justify-end">
          <UserMenu />
        </div>

        {/* Logo */}
        <div ref={homeContainerRef} className="mb-10 text-center">
          <CasaRosadaEmblem className="mx-auto mb-4 w-full max-w-2xl" />
          <h1 className="font-pixel text-[22px] font-black leading-relaxed text-smoke-100 sm:text-[32px] lg:text-[40px]">
            <span className="home-title-line text-shadow-crimson block text-crimson-400">República</span>
            <span className="home-title-line text-shadow-gold block text-gold-400">en Llamas</span>
          </h1>
          <p className="home-subtitle mt-3 font-mono text-sm uppercase tracking-wider text-smoke-400">
            Simulador de Decisiones Políticas
          </p>
        </div>

        <AnimatePresence mode="wait">
          {authMode === 'menu' ? (
            <m.div key="menu" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ModeTabs
                homeMode={homeMode}
                onChange={(mode) => {
                  setHomeMode(mode);
                  setCareerStart(mode === 'carrera' ? (careerStart ?? 'mayor') : null);
                }}
              />
              <CareerSetup active={homeMode === 'carrera'} office={careerStart} onChange={setCareerStart} />

              {homeMode !== 'historico' ? (
                <div className="home-levels home-tab-cards mb-8 grid grid-cols-2 gap-3">
                  {DIFFICULTIES.map((d) => (
                    <m.button
                      key={d.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedDifficulty(d.id)}
                      aria-pressed={selectedDifficulty === d.id}
                      className={`border-2 p-4 text-left transition-colors duration-200 ${d.color} ${
                        selectedDifficulty === d.id
                          ? 'bg-navy-700 ring-2 ring-gold-400'
                          : 'border-navy-600 bg-navy-800'
                      }`}
                    >
                      <div className="difficulty-name text-smoke-100">{d.label}</div>
                      <div className="difficulty-description text-smoke-400">{d.flavor}</div>
                    </m.button>
                  ))}
                </div>
              ) : (
                <div ref={scenarioGridRef} className="home-tab-cards mb-8 grid grid-cols-2 gap-3">
                  {(
                    Object.entries(HISTORICAL_SCENARIOS) as [
                      ScenarioId,
                      (typeof HISTORICAL_SCENARIOS)[ScenarioId],
                    ][]
                  ).map(([id, cfg], i) => {
                    const locked = !hasEntitlement(cfg.entitlementRequired);
                    return (
                      <ScenarioCard
                        key={id}
                        id={id}
                        label={t(cfg.labelKey)}
                        period={t(cfg.periodKey)}
                        description={t(cfg.descriptionKey)}
                        locked={locked}
                        index={i}
                        onClick={() => void startHistoricalScenario(id)}
                      />
                    );
                  })}
                </div>
              )}

              {/* Auth / Start buttons */}
              <DailyCapBanner />

              <div className="home-actions space-y-3">
                {isPlaytestMode && (
                  <button
                    type="button"
                    className="w-full border-2 border-celeste-dark bg-navy-800 p-3 text-celeste-light"
                    onClick={() => navigate('/debate')}
                  >
                    Probar debate presidencial
                  </button>
                )}
                {user ? (
                  <m.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleLoggedInStart}
                    className="w-full rounded-lg bg-crimson-600 px-8 py-4 font-serif text-xl font-bold uppercase tracking-wider text-smoke-100 shadow-lg transition-colors hover:bg-crimson-500"
                  >
                    Nueva Partida
                  </m.button>
                ) : (
                  <GuestStartButtons
                    onLogin={() => setAuthMode('login')}
                    onRegister={() => setAuthMode('register')}
                    onGuest={handleGuest}
                  />
                )}

                <button
                  type="button"
                  onClick={startDailyChallenge}
                  className="w-full rounded-lg border-2 border-gold-500 bg-navy-800 px-8 py-3 font-serif font-bold text-gold-400 transition-colors hover:bg-navy-700"
                >
                  Desafío diario — misma partida para todos hoy
                </button>

                {gameState && !gameState.isGameOver && (
                  <m.button
                    whileHover={{ scale: 1.02 }}
                    onClick={handleContinue}
                    className="w-full rounded-lg border border-navy-500 bg-navy-700 px-8 py-3 font-serif font-bold text-smoke-200 transition-colors hover:bg-navy-600"
                  >
                    Continuar Partida — Turno {gameState.turn}
                  </m.button>
                )}

                <button
                  onClick={() => navigate('/leaderboard')}
                  onMouseEnter={prefetchLeaderboard}
                  onFocus={prefetchLeaderboard}
                  className="w-full rounded-lg border border-navy-600 bg-transparent px-8 py-3 font-mono text-sm text-smoke-400 transition-colors hover:bg-navy-800"
                >
                  Tabla de Líderes
                </button>
              </div>
            </m.div>
          ) : (
            <m.div key="auth" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <AuthForm mode={authMode as 'login' | 'register'} onBack={() => setAuthMode('menu')} />
            </m.div>
          )}
        </AnimatePresence>

        <AccessibilitySettings />

        <p className="mt-8 text-center font-mono text-xs text-smoke-600">v0.3.0 — República en Llamas</p>
      </m.div>

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
