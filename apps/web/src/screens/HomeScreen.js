import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { HISTORICAL_SCENARIOS } from '@republica/game-engine';
import { useGameStore } from '../stores/gameStore.js';
import { useAuth } from '../hooks/useAuth.js';
import { isOfflineMode } from '../lib/supabase.js';
import { UserMenu } from '../components/UserMenu.js';
import { useEntitlements, getDailyRunsRemaining, consumeDailyRun } from '../hooks/useEntitlements.js';
import { BuyButton } from '../components/BuyButton.js';
import { PaywallModal } from '../components/PaywallModal.js';
import { ScenarioCard } from '../components/ScenarioCard.js';
import { trackGameStarted } from '../lib/analytics.js';
gsap.registerPlugin(useGSAP);
const DIFFICULTIES = [
    { id: 'easy', label: 'Fácil', flavor: 'El viento sopla a tu favor. Por ahora.', color: 'border-emerald-500 hover:bg-emerald-900/30' },
    { id: 'normal', label: 'Normal', flavor: 'La república tiembla. Tú decides si cae.', color: 'border-blue-500 hover:bg-blue-900/30' },
    { id: 'hard', label: 'Difícil', flavor: 'El abismo te mira. ¿Lo mirarás tú también?', color: 'border-orange-500 hover:bg-orange-900/30' },
    { id: 'crisis', label: 'Crisis', flavor: 'Todo está en llamas. Bienvenido.', color: 'border-crimson-500 hover:bg-crimson-900/30' },
];
function AuthForm({ mode, onBack }) {
    const { signIn, signUp } = useAuth();
    const navigate = useNavigate();
    const startNewGame = useGameStore((s) => s.startNewGame);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [selectedDifficulty, setSelectedDifficulty] = useState('normal');
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (mode === 'login') {
                const { error: err } = await signIn(email, password);
                if (err) {
                    setError(err.message);
                    return;
                }
            }
            else {
                if (!username.trim()) {
                    setError('El nombre de usuario es requerido');
                    setLoading(false);
                    return;
                }
                const { error: err } = await signUp(email, password, username);
                if (err) {
                    setError(err.message);
                    return;
                }
            }
            startNewGame(selectedDifficulty);
            navigate('/president');
        }
        catch {
            setError('Error inesperado. Intentá de nuevo.');
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs(motion.div, { initial: { opacity: 0, x: 40 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -40 }, children: [_jsx("button", { onClick: onBack, className: "text-smoke-500 font-mono text-xs mb-6 hover:text-smoke-300 flex items-center gap-1", children: "\u2190 Volver" }), _jsx("h2", { className: "font-serif text-2xl text-smoke-100 font-bold mb-6", children: mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta' }), _jsxs("div", { className: "mb-6", children: [_jsx("p", { className: "text-smoke-400 font-mono text-xs uppercase tracking-widest mb-3", children: "Dificultad" }), _jsx("div", { className: "grid grid-cols-2 gap-2", children: DIFFICULTIES.map((d) => (_jsx("button", { onClick: () => setSelectedDifficulty(d.id), className: `p-3 border-2 rounded-lg text-left text-xs transition-colors ${d.color} ${selectedDifficulty === d.id ? 'bg-navy-700 ring-2 ring-gold-400' : 'border-navy-600 bg-navy-800'}`, children: _jsx("div", { className: "font-serif font-bold text-smoke-100", children: d.label }) }, d.id))) })] }), _jsxs("form", { onSubmit: (e) => { void handleSubmit(e); }, className: "space-y-4", children: [mode === 'register' && (_jsx("input", { type: "text", placeholder: "Nombre de usuario", value: username, onChange: (e) => setUsername(e.target.value), className: "w-full bg-navy-800 border border-navy-600 text-smoke-100 font-mono text-sm px-4 py-3 rounded-lg focus:outline-none focus:border-gold-500" })), _jsx("input", { type: "email", placeholder: "Email", value: email, onChange: (e) => setEmail(e.target.value), className: "w-full bg-navy-800 border border-navy-600 text-smoke-100 font-mono text-sm px-4 py-3 rounded-lg focus:outline-none focus:border-gold-500" }), _jsx("input", { type: "password", placeholder: "Contrase\u00F1a", value: password, onChange: (e) => setPassword(e.target.value), className: "w-full bg-navy-800 border border-navy-600 text-smoke-100 font-mono text-sm px-4 py-3 rounded-lg focus:outline-none focus:border-gold-500" }), error && _jsx("p", { className: "text-crimson-400 font-mono text-xs", children: error }), _jsx("button", { type: "submit", disabled: loading, className: "w-full bg-gold-500 hover:bg-gold-400 text-navy-900 font-serif font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50", children: loading ? 'Cargando...' : mode === 'login' ? 'Entrar' : 'Registrarse' })] })] }));
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
    const [authMode, setAuthMode] = useState('menu');
    const [selectedDifficulty, setSelectedDifficulty] = useState('normal');
    const [homeMode, setHomeMode] = useState('clasico');
    const [paywallScenario, setPaywallScenario] = useState(null);
    const scenarioGridRef = useRef(null);
    const homeContainerRef = useRef(null);
    // ── GSAP: title entry + tab-switch card stagger ───────────────────────────
    useGSAP(() => {
        if (!homeContainerRef.current)
            return;
        // Title + subtitle cascade in on first mount
        gsap.from('.home-title-line', {
            y: -24, autoAlpha: 0, duration: 0.5, stagger: 0.12, ease: 'power2.out',
        });
        gsap.from('.home-subtitle', {
            y: 10, autoAlpha: 0, duration: 0.4, delay: 0.3, ease: 'power1.out',
        });
    }, { scope: homeContainerRef });
    useGSAP(() => {
        if (!homeContainerRef.current)
            return;
        // Tab content fades + cards stagger in whenever homeMode switches
        gsap.fromTo('.home-tab-cards > *', { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.3, stagger: 0.055, ease: 'back.out(1.4)', clearProps: 'transform,opacity' });
    }, { scope: homeContainerRef, dependencies: [homeMode] });
    const dailyRemaining = getDailyRunsRemaining();
    const dailyLimitReached = !hasPremium && dailyRemaining <= 0;
    const startGame = (difficulty) => {
        consumeDailyRun();
        startNewGame(difficulty);
        trackGameStarted({ difficulty, president: presidentId, mode: 'normal' });
        navigate('/president');
    };
    const startHistoricalScenario = (scenarioId) => {
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
    return (_jsxs("div", { className: "min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden", children: [_jsx("div", { className: "absolute inset-0 bg-gradient-to-b from-transparent via-navy-900 to-navy-900 pointer-events-none z-10" }), _jsxs(motion.div, { initial: { opacity: 0, y: -30 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8 }, className: "relative z-20 max-w-2xl w-full", children: [_jsx("div", { className: "flex justify-end mb-4", children: _jsx(UserMenu, {}) }), _jsxs("div", { ref: homeContainerRef, className: "text-center mb-10", children: [_jsxs("div", { className: "fire-container mx-auto w-48 h-16 mb-4", children: [_jsx("div", { className: "fire-particle" }), _jsx("div", { className: "fire-particle" }), _jsx("div", { className: "fire-particle" }), _jsx("div", { className: "fire-particle" }), _jsx("div", { className: "fire-particle" }), _jsx("div", { className: "fire-particle" }), _jsx("div", { className: "smoke-particle" }), _jsx("div", { className: "smoke-particle" }), _jsx("div", { className: "smoke-particle" })] }), _jsxs("h1", { className: "font-serif text-5xl font-black text-smoke-100 leading-none", children: [_jsx("span", { className: "home-title-line block text-crimson-400 text-shadow-crimson", children: "Rep\u00FAblica" }), _jsx("span", { className: "home-title-line block text-gold-400 text-shadow-gold", children: "en Llamas" })] }), _jsx("p", { className: "home-subtitle text-smoke-400 mt-3 font-mono text-sm tracking-wider uppercase", children: "Simulador de Decisiones Pol\u00EDticas" })] }), _jsx(AnimatePresence, { mode: "wait", children: authMode === 'menu' ? (_jsxs(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, children: [!authLoading && user && (_jsxs("div", { className: "flex items-center justify-between mb-6 bg-navy-800 border border-navy-600 rounded-lg px-4 py-3", children: [_jsxs("div", { children: [_jsx("p", { className: "text-smoke-400 font-mono text-xs", children: "Sesi\u00F3n activa" }), _jsx("p", { className: "text-gold-400 font-mono text-sm font-bold", children: user.email })] }), _jsx("button", { onClick: handleLogout, className: "text-smoke-500 hover:text-smoke-300 font-mono text-xs border border-navy-500 px-3 py-1 rounded", children: "Cerrar sesi\u00F3n" })] })), _jsxs("div", { className: "flex mb-4", style: { borderBottom: '2px solid var(--night-blue)' }, children: [_jsx("button", { onClick: () => setHomeMode('clasico'), className: `font-serif text-[8px] px-4 py-2 transition-colors ${homeMode === 'clasico' ? 'text-gold-400' : 'text-smoke-500'}`, style: { borderBottom: homeMode === 'clasico' ? '2px solid var(--gold)' : '2px solid transparent' }, children: "CL\u00C1SICO" }), _jsx("button", { onClick: () => setHomeMode('historico'), className: `font-serif text-[8px] px-4 py-2 transition-colors ${homeMode === 'historico' ? 'text-gold-400' : 'text-smoke-500'}`, style: { borderBottom: homeMode === 'historico' ? '2px solid var(--gold)' : '2px solid transparent' }, children: "HIST\u00D3RICO" })] }), homeMode === 'clasico' ? (_jsx("div", { className: "home-tab-cards grid grid-cols-2 gap-3 mb-8", children: DIFFICULTIES.map((d) => (_jsxs(motion.button, { whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 }, onClick: () => setSelectedDifficulty(d.id), className: `p-4 border-2 text-left transition-colors duration-200 ${d.color} ${selectedDifficulty === d.id
                                            ? 'bg-navy-700 ring-2 ring-gold-400'
                                            : 'border-navy-600 bg-navy-800'}`, children: [_jsx("div", { className: "font-serif font-bold text-smoke-100 mb-1", children: d.label }), _jsx("div", { className: "text-xs text-smoke-400 italic", children: d.flavor })] }, d.id))) })) : (_jsx("div", { ref: scenarioGridRef, className: "home-tab-cards grid grid-cols-2 gap-3 mb-8", children: Object.entries(HISTORICAL_SCENARIOS).map(([id, cfg], i) => {
                                        const locked = !hasEntitlement(cfg.entitlementRequired);
                                        return (_jsx(ScenarioCard, { id: id, label: t(cfg.labelKey), period: t(cfg.periodKey), description: t(cfg.descriptionKey), locked: locked, index: i, onClick: () => startHistoricalScenario(id) }, id));
                                    }) })), dailyLimitReached && (_jsxs("div", { className: "mb-4 bg-crimson-900/40 border border-crimson-700 rounded-xl p-4 text-center", children: [_jsx("p", { className: "text-crimson-300 font-mono text-sm font-bold mb-1", children: "\u23F0 L\u00EDmite diario alcanzado (3/3)" }), _jsx("p", { className: "text-smoke-400 font-mono text-xs mb-3", children: "Volv\u00E9 ma\u00F1ana o desbloque\u00E1 acceso ilimitado" }), _jsx(BuyButton, { entitlement: "full_access", label: "Acceso Total \u2014 $5.99", className: "mx-auto" })] })), _jsxs("div", { className: "space-y-3", children: [!dailyLimitReached && (user ? (_jsx(motion.button, { whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 }, onClick: handleLoggedInStart, className: "w-full bg-crimson-600 hover:bg-crimson-500 text-smoke-100 font-serif font-bold py-4 px-8 rounded-lg text-xl transition-colors uppercase tracking-wider shadow-lg", children: "Nueva Partida" })) : (_jsxs(_Fragment, { children: [!isOfflineMode && (_jsxs(_Fragment, { children: [_jsx(motion.button, { whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 }, onClick: () => setAuthMode('login'), className: "w-full bg-crimson-600 hover:bg-crimson-500 text-smoke-100 font-serif font-bold py-4 px-8 rounded-lg text-xl transition-colors uppercase tracking-wider shadow-lg", children: "Iniciar sesi\u00F3n" }), _jsx(motion.button, { whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 }, onClick: () => setAuthMode('register'), className: "w-full bg-navy-700 hover:bg-navy-600 border border-gold-600 text-gold-400 font-serif font-bold py-3 px-8 rounded-lg transition-colors", children: "Crear cuenta" })] })), _jsx(motion.button, { whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 }, onClick: handleGuest, className: `w-full ${isOfflineMode ? 'bg-crimson-600 hover:bg-crimson-500 text-smoke-100 font-serif font-bold py-4 text-xl shadow-lg' : 'bg-navy-800 hover:bg-navy-700 border border-navy-500 text-smoke-400'} font-bold py-3 px-8 rounded-lg transition-colors`, children: isOfflineMode ? 'Nueva Partida' : 'Jugar como invitado' })] }))), gameState && !gameState.isGameOver && (_jsxs(motion.button, { whileHover: { scale: 1.02 }, onClick: handleContinue, className: "w-full bg-navy-700 hover:bg-navy-600 border border-navy-500 text-smoke-200 font-serif font-bold py-3 px-8 rounded-lg transition-colors", children: ["Continuar Partida \u2014 Turno ", gameState.turn] })), _jsx("button", { onClick: () => navigate('/leaderboard'), className: "w-full bg-transparent hover:bg-navy-800 border border-navy-600 text-smoke-400 font-mono py-3 px-8 rounded-lg transition-colors text-sm", children: "Tabla de L\u00EDderes" })] })] }, "menu")) : (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, children: _jsx(AuthForm, { mode: authMode, onBack: () => setAuthMode('menu') }) }, "auth")) }), _jsx("p", { className: "text-center text-smoke-600 font-mono text-xs mt-8", children: "v0.3.0 \u2014 Rep\u00FAblica en Llamas" })] }), paywallScenario && (_jsx(PaywallModal, { entitlement: "mode_historical", triggerPoint: "scenario_select", onClose: () => setPaywallScenario(null) }))] }));
}
//# sourceMappingURL=HomeScreen.js.map