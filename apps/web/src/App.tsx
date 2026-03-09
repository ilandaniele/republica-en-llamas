import React, { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useSearchParams } from 'react-router-dom';
import { useGameStore } from './stores/gameStore.js';
import { SoundProvider } from './components/SoundManager.js';
import { initAnalytics } from './lib/analytics.js';
import { useEntitlements } from './hooks/useEntitlements.js';

const HomeScreen = lazy(() => import('./screens/HomeScreen.js'));
const GameScreen = lazy(() => import('./screens/GameScreen.js'));
const CrisisScreen = lazy(() => import('./screens/CrisisScreen.js'));
const GameOverScreen = lazy(() => import('./screens/GameOverScreen.js'));
const LeaderboardScreen = lazy(() => import('./screens/LeaderboardScreen.js'));
const HistoryScreen = lazy(() => import('./screens/HistoryScreen.js'));
const PresidentSelectScreen = lazy(() => import('./screens/PresidentSelectScreen.js'));
const AuthScreen = lazy(() => import('./screens/AuthScreen.js'));
const RegisterScreen = lazy(() => import('./screens/RegisterScreen.js'));
const LoginScreen = lazy(() => import('./screens/LoginScreen.js'));
const ProfileScreen = lazy(() => import('./screens/ProfileScreen.js'));

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-navy-900">
      <div className="text-gold-400 font-serif text-2xl animate-pulse">
        Cargando República...
      </div>
    </div>
  );
}

function PurchaseSuccessToast() {
  const [params] = useSearchParams();
  const { refetch } = useEntitlements();
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (params.get('purchase_success') === '1') {
      setShow(true);
      void refetch();
      setTimeout(() => setShow(false), 4000);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  if (!show) return null;
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-emerald-800 border border-emerald-500 text-emerald-100 font-mono text-sm px-6 py-3 rounded-xl shadow-xl">
      ✅ Compra exitosa — contenido desbloqueado
    </div>
  );
}

export default function App() {
  useEffect(() => { initAnalytics(); }, []);
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
