import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useGameStore } from './stores/gameStore.js';

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

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingSpinner />}>
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
