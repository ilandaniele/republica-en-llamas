import { Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useSearchParams } from 'react-router';
import { useGameStore } from './stores/gameStore.js';
import { SoundProvider } from './components/SoundManager.js';
import { initAnalytics } from './lib/analytics.js';
import { useEntitlements } from './hooks/useEntitlements.js';
import { useTransientValue } from './hooks/useTransientValue.js';
import { PixelMate } from './components/illustrations/PixelMate.js';
import { prefetchRoutesWhenIdle, screens } from './app/routes.js';

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
          fontFamily: "'Press Start 2P', monospace",
          fontSize: '8px',
          color: 'var(--gold)',
          lineHeight: 2,
        }}
      >
        Cargando...
      </div>
    </div>
  );
}

function PurchaseSuccessToast() {
  const [params] = useSearchParams();
  const { refetch } = useEntitlements();
  const [show, flash] = useTransientValue(false);
  useEffect(() => {
    if (params.get('purchase_success') === '1') {
      flash(true, 4000);
      void refetch();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  if (!show) return null;
  return (
    <div className="fixed left-1/2 top-4 z-50 -translate-x-1/2 rounded-xl border border-emerald-500 bg-emerald-800 px-6 py-3 font-mono text-sm text-emerald-100 shadow-xl">
      ✅ Compra exitosa — contenido desbloqueado
    </div>
  );
}

export default function App() {
  useEffect(() => {
    initAnalytics();
    prefetchRoutesWhenIdle(['presidentSelect', 'game']);
  }, []);
  return (
    <SoundProvider>
      <BrowserRouter>
        <Suspense fallback={<LoadingSpinner />}>
          <PurchaseSuccessToast />
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/president" element={<PresidentSelectRoute />} />
            <Route path="/game" element={<GameRoute />} />
            <Route path="/gameover" element={<GameOverRoute />} />
            <Route path="/leaderboard" element={<LeaderboardScreen />} />
            <Route path="/history" element={<HistoryScreen />} />
            <Route path="/auth" element={<AuthScreen />} />
            <Route path="/register" element={<RegisterScreen />} />
            <Route path="/login" element={<LoginScreen />} />
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

  if (!gameState) return <Navigate to="/" replace />;
  if (gameState.isGameOver) return <Navigate to="/gameover" replace />;
  if (showCrisisScreen) return <CrisisScreen />;
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
