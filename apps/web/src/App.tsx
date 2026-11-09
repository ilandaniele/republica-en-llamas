import { Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useSearchParams } from 'react-router';
import { useGameStore } from './stores/gameStore.js';
import { SoundProvider } from './components/SoundManager.js';
import { initAnalytics } from './lib/analytics.js';
import { useEntitlements } from './hooks/useEntitlements.js';
import { useTransientValue } from './hooks/useTransientValue.js';
import { PixelMate } from './components/illustrations/PixelMate.js';
import { DebatePracticeScreen, prefetchRoutesWhenIdle, screens } from './app/routes.js';

const {
  HomeScreen,
  GameScreen,
  CrisisScreen,
  GameOverScreen,
  LeaderboardScreen,
  HistoryScreen,
  PresidentSelectScreen,
  AuthScreen,
  RegisterScreen,
  LoginScreen,
  PasswordResetScreen,
  ProfileScreen,
} = screens;

function LoadingSpinner() {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center gap-6"
      style={{ background: 'var(--night-blue)' }}
    >
      <PixelMate steaming width={80} height={100} />
      <div
        style={{
          fontFamily: 'var(--font-readable)',
          fontSize: '16px',
          color: 'var(--gold)',
          lineHeight: 2,
        }}
      >
        Cargando...
      </div>
    </div>
  );
}

export function PurchaseSuccessToast() {
  const [params] = useSearchParams();
  const { refetch } = useEntitlements();
  const [message, flash] = useTransientValue<string | null>(null);
  useEffect(() => {
    let active = true;
    if (params.get('purchase_success') === '1') {
      flash('Verificando compra...', 4000);
      const entitlement = params.get('entitlement');
      void refetch()
        .then(({ data, error }) => {
          if (!active) return;
          const confirmed = !error && data?.some((id) => id === entitlement || id === 'full_access');
          flash(
            confirmed
              ? 'Compra confirmada — contenido desbloqueado'
              : 'Compra pendiente de confirmación. Revisá tu cuenta en unos momentos.',
            6000,
          );
        })
        .catch(() => {
          if (active) flash('No se pudo verificar la compra. Revisá tu conexión.', 6000);
        });
    }
    return () => {
      active = false;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  if (!message) return null;
  return (
    <div
      role="status"
      className="fixed left-1/2 top-4 z-50 -translate-x-1/2 rounded-xl border border-emerald-500 bg-emerald-800 px-6 py-3 font-mono text-sm text-emerald-100 shadow-xl"
    >
      {message}
    </div>
  );
}

export default function App() {
  useEffect(() => {
    initAnalytics();
    return prefetchRoutesWhenIdle(['presidentSelect', 'game']);
  }, []);
  return (
    <SoundProvider>
      <BrowserRouter>
        <Suspense fallback={<LoadingSpinner />}>
          <PurchaseSuccessToast />
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            {DebatePracticeScreen && <Route path="/debate" element={<DebatePracticeScreen />} />}
            <Route path="/president" element={<PresidentSelectRoute />} />
            <Route path="/game" element={<GameRoute />} />
            <Route path="/gameover" element={<GameOverRoute />} />
            <Route path="/leaderboard" element={<LeaderboardScreen />} />
            <Route path="/history" element={<HistoryScreen />} />
            <Route path="/auth" element={<AuthScreen />} />
            <Route path="/register" element={<RegisterScreen />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/reset-password" element={<PasswordResetScreen />} />
            <Route path="/profile" element={<ProfileScreen />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </SoundProvider>
  );
}

function GameRoute() {
  const gameState = useGameStore((s) => s.gameState);
  const showCrisisScreen = useGameStore((s) => s.showCrisisScreen);
  const showTransition = useGameStore((s) => s.showTransition);

  if (!gameState) return <Navigate to="/" replace />;
  if (gameState.isGameOver) return <Navigate to="/gameover" replace />;
  if (showCrisisScreen && !showTransition) return <CrisisScreen />;
  return <GameScreen />;
}

function GameOverRoute() {
  const gameState = useGameStore((s) => s.gameState);
  if (!gameState?.isGameOver) return <Navigate to="/" replace />;
  return <GameOverScreen />;
}

function PresidentSelectRoute() {
  const gameState = useGameStore((s) => s.gameState);
  if (!gameState) return <Navigate to="/" replace />;
  return <PresidentSelectScreen />;
}
