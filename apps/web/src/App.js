import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useSearchParams } from 'react-router-dom';
import { useGameStore } from './stores/gameStore.js';
import { SoundProvider } from './components/SoundManager.js';
import { initAnalytics } from './lib/analytics.js';
import { useEntitlements } from './hooks/useEntitlements.js';
import { PixelMate } from './components/illustrations/PixelMate.js';
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
    return (_jsxs("div", { className: "flex flex-col items-center justify-center gap-6 min-h-screen", style: { background: 'var(--night-blue)' }, children: [_jsx(PixelMate, { steaming: true, width: 80, height: 100 }), _jsx("div", { style: { fontFamily: "'Press Start 2P', monospace", fontSize: '8px', color: 'var(--gold)', lineHeight: 2 }, children: "Cargando..." })] }));
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
    if (!show)
        return null;
    return (_jsx("div", { className: "fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-emerald-800 border border-emerald-500 text-emerald-100 font-mono text-sm px-6 py-3 rounded-xl shadow-xl", children: "\u2705 Compra exitosa \u2014 contenido desbloqueado" }));
}
export default function App() {
    useEffect(() => { initAnalytics(); }, []);
    return (_jsx(SoundProvider, { children: _jsx(BrowserRouter, { children: _jsxs(Suspense, { fallback: _jsx(LoadingSpinner, {}), children: [_jsx(PurchaseSuccessToast, {}), _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(HomeScreen, {}) }), _jsx(Route, { path: "/president", element: _jsx(PresidentSelectRoute, {}) }), _jsx(Route, { path: "/game", element: _jsx(GameRoute, {}) }), _jsx(Route, { path: "/gameover", element: _jsx(GameOverRoute, {}) }), _jsx(Route, { path: "/leaderboard", element: _jsx(LeaderboardScreen, {}) }), _jsx(Route, { path: "/history", element: _jsx(HistoryScreen, {}) }), _jsx(Route, { path: "/auth", element: _jsx(AuthScreen, {}) }), _jsx(Route, { path: "/register", element: _jsx(RegisterScreen, {}) }), _jsx(Route, { path: "/login", element: _jsx(LoginScreen, {}) }), _jsx(Route, { path: "/profile", element: _jsx(ProfileScreen, {}) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/", replace: true }) })] })] }) }) }));
}
function GameRoute() {
    const gameState = useGameStore((s) => s.gameState);
    const showCrisisScreen = useGameStore((s) => s.showCrisisScreen);
    if (!gameState)
        return _jsx(Navigate, { to: "/", replace: true });
    if (gameState.isGameOver)
        return _jsx(Navigate, { to: "/gameover", replace: true });
    if (showCrisisScreen)
        return _jsx(CrisisScreen, {});
    return _jsx(GameScreen, {});
}
function GameOverRoute() {
    const gameState = useGameStore((s) => s.gameState);
    if (!gameState?.isGameOver)
        return _jsx(Navigate, { to: "/", replace: true });
    return _jsx(GameOverScreen, {});
}
function PresidentSelectRoute() {
    const gameState = useGameStore((s) => s.gameState);
    if (!gameState)
        return _jsx(Navigate, { to: "/", replace: true });
    return _jsx(PresidentSelectScreen, {});
}
//# sourceMappingURL=App.js.map