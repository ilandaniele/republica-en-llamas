import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import posthog from 'posthog-js';
import { useTranslation } from 'react-i18next';
import { useGameStore } from '../stores/gameStore.js';
import { VariablesPanel } from '../components/VariablesPanel.js';
import { EventCardComponent } from '../components/EventCardComponent.js';
import { CrisisAlert } from '../components/CrisisAlert.js';
import { TensionMeter } from '../components/TensionMeter.js';
import { TutorialOverlay } from '../components/TutorialOverlay.js';
import { OfflineBanner } from '../components/OfflineBanner.js';
import { TurnTransitionScreen } from '../components/TurnTransitionScreen.js';
import { DecisionDiary } from '../components/DecisionDiary.js';
import { PixelPortrait } from '../components/illustrations/PixelPortrait.js';
import { CongressSession } from '../components/CongressSession.js';
import { UserMenu } from '../components/UserMenu.js';
import { trackCongressSession, trackTurnCompleted } from '../lib/analytics.js';
import { BuenosAiresBackground } from '../components/illustrations/BuenosAiresBackground.js';
import { AnibalTicker } from '../components/AnibalTicker.js';
import { PixelDolar } from '../components/illustrations/PixelDolar.js';
import { PaywallModal } from '../components/PaywallModal.js';
import { useEntitlements } from '../hooks/useEntitlements.js';
const DIFFICULTY_LABELS = {
    easy: 'Fácil',
    normal: 'Normal',
    hard: 'Difícil',
    crisis: 'Crisis',
};
function getRedZoneVars(state) {
    const vars = [];
    if (state.political.popularity < 25)
        vars.push('popularity');
    if (state.political.socialStability < 25)
        vars.push('socialStability');
    if (state.economic.marketConfidence < 25)
        vars.push('marketConfidence');
    if (state.economic.currencyStrength < 25)
        vars.push('currencyStrength');
    if (state.economic.foreignReserves < 25)
        vars.push('foreignReserves');
    return vars;
}
export default function GameScreen() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const gameState = useGameStore((s) => s.gameState);
    const currentCard = useGameStore((s) => s.currentCard);
    const pendingChoiceIndex = useGameStore((s) => s.pendingChoiceIndex);
    const isAnimating = useGameStore((s) => s.isAnimating);
    const showTransition = useGameStore((s) => s.showTransition);
    const transitionData = useGameStore((s) => s.transitionData);
    const selectChoice = useGameStore((s) => s.selectChoice);
    const confirmChoice = useGameStore((s) => s.confirmChoice);
    const resolveCongressSession = useGameStore((s) => s.resolveCongressSession);
    const dismissTransition = useGameStore((s) => s.dismissTransition);
    const presidentId = useGameStore((s) => s.presidentId);
    const isCrisisExpress = useGameStore((s) => s.isCrisisExpress);
    const timeoutSelection = useGameStore((s) => s.timeoutSelection);
    const [showDiary, setShowDiary] = useState(false);
    const [crisisTimeLeft, setCrisisTimeLeft] = useState(45);
    const [cardShaking, setCardShaking] = useState(false);
    const timerRef = useRef(null);
    // Easter egg states
    const [idlePresidentMood, setIdlePresidentMood] = useState(null);
    const [showMidGamePaywall, setShowMidGamePaywall] = useState(false);
    const { hasEntitlement } = useEntitlements();
    const paywallTimingVariant = (posthog.getFeatureFlag('paywall_timing') ?? 'after_game_over');
    const [showDolarFloat, setShowDolarFloat] = useState(false);
    const [showCrowd, setShowCrowd] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const idleTimerRef = useRef(null);
    const prevInflationRef = useRef(null);
    const prevLawsPassedRef = useRef(0);
    // Reset countdown when a new card appears
    useEffect(() => {
        if (!isCrisisExpress)
            return;
        setCrisisTimeLeft(45);
    }, [currentCard?.id, isCrisisExpress]);
    // Countdown tick
    useEffect(() => {
        if (!isCrisisExpress || !currentCard || isAnimating) {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
            return;
        }
        timerRef.current = setInterval(() => {
            setCrisisTimeLeft((t) => {
                if (t <= 1) {
                    clearInterval(timerRef.current);
                    timerRef.current = null;
                    timeoutSelection();
                    return 0;
                }
                return t - 1;
            });
        }, 1000);
        return () => { if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        } };
    }, [currentCard?.id, isCrisisExpress, isAnimating, timeoutSelection]);
    React.useEffect(() => {
        if (!gameState) {
            navigate('/');
            return;
        }
    }, [gameState, navigate]);
    useEffect(() => {
        posthog.capture('$experiment_started', { experiment: 'paywall_timing', variant: paywallTimingVariant });
    }, [paywallTimingVariant]);
    useEffect(() => {
        if (paywallTimingVariant === 'at_turn_5' && gameState?.turn === 5 && !hasEntitlement('full_access')) {
            setShowMidGamePaywall(true);
        }
    }, [gameState?.turn, paywallTimingVariant, hasEntitlement]);
    React.useEffect(() => {
        if (currentCard?.category === 'crisis') {
            setCardShaking(true);
            const t = setTimeout(() => setCardShaking(false), 500);
            return () => clearTimeout(t);
        }
    }, [currentCard?.id]);
    // Easter egg: idle 10s → president panics
    useEffect(() => {
        const resetIdle = () => {
            if (idleTimerRef.current)
                clearTimeout(idleTimerRef.current);
            setIdlePresidentMood(null);
            idleTimerRef.current = setTimeout(() => {
                setIdlePresidentMood('panic');
                setTimeout(() => setIdlePresidentMood(null), 2000);
            }, 10000);
        };
        resetIdle();
        window.addEventListener('mousemove', resetIdle);
        window.addEventListener('keydown', resetIdle);
        return () => {
            if (idleTimerRef.current)
                clearTimeout(idleTimerRef.current);
            window.removeEventListener('mousemove', resetIdle);
            window.removeEventListener('keydown', resetIdle);
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
    // Easter egg: inflation ≥50 → floating dollar
    useEffect(() => {
        if (!gameState)
            return;
        const curr = gameState.economic.inflation;
        if (prevInflationRef.current !== null && prevInflationRef.current < 50 && curr >= 50) {
            setShowDolarFloat(true);
            setTimeout(() => setShowDolarFloat(false), 2000);
        }
        prevInflationRef.current = curr;
    }, [gameState?.economic.inflation]); // eslint-disable-line react-hooks/exhaustive-deps
    // Easter egg: popularity = 0 → crowd torches
    useEffect(() => {
        if (!gameState)
            return;
        if (gameState.political.popularity <= 0) {
            setShowCrowd(true);
            setTimeout(() => setShowCrowd(false), 2000);
        }
    }, [gameState?.political.popularity]); // eslint-disable-line react-hooks/exhaustive-deps
    // Easter egg: law passed → confetti
    useEffect(() => {
        if (!gameState)
            return;
        const curr = gameState.congress.lawsPassedThisRun ?? 0;
        if (curr > prevLawsPassedRef.current) {
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 1500);
        }
        prevLawsPassedRef.current = curr;
    }, [gameState?.congress.lawsPassedThisRun]); // eslint-disable-line react-hooks/exhaustive-deps
    if (!gameState || !currentCard)
        return null;
    const hasCrisis = gameState.activeCrises.length > 0;
    const redZoneVars = getRedZoneVars(gameState);
    const inRedZone = redZoneVars.length > 0;
    const anyBelowTen = [
        gameState.political.popularity,
        gameState.political.socialStability,
        gameState.economic.marketConfidence,
        gameState.economic.currencyStrength,
        gameState.economic.foreignReserves,
    ].some((v) => v < 10);
    const presidentMood = hasCrisis || anyBelowTen
        ? 'panic'
        : gameState.political.popularity > 65
            ? 'victory'
            : 'neutral';
    return (_jsxs("div", { className: `min-h-screen relative transition-colors duration-500 bg-[var(--night-blue)] ${anyBelowTen ? 'animate-pulse' : ''}`, children: [_jsx(BuenosAiresBackground, {}), _jsx(OfflineBanner, {}), _jsx(DecisionDiary, { isOpen: showDiary, onClose: () => setShowDiary(false) }), _jsxs("div", { className: `p-4 ${hasCrisis || cardShaking ? 'animate-screen-shake' : ''}`, children: [hasCrisis && _jsx("div", { className: "crisis-vignette" }), _jsx(TutorialOverlay, {}), _jsx(AnimatePresence, { children: showTransition && transitionData && (_jsx(TurnTransitionScreen, { data: transitionData, onDismiss: dismissTransition })) }), _jsxs(motion.header, { initial: { y: -20, opacity: 0 }, animate: { y: 0, opacity: 1 }, className: `flex items-center justify-between mb-4 pb-4 border-b ${hasCrisis ? 'border-crimson-800' : 'border-navy-700'}`, children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-12 h-12 overflow-hidden pixel-border", children: _jsx(PixelPortrait, { id: presidentId, mood: idlePresidentMood ?? presidentMood, px: 48 }) }), _jsxs("div", { children: [_jsx("h1", { className: "font-serif text-base text-gold-400 font-bold leading-tight uppercase", children: "Rep\u00FAblica en Llamas" }), _jsx("span", { className: "font-mono text-sm text-smoke-400 bg-navy-800 px-2 py-0.5", children: DIFFICULTY_LABELS[gameState.difficulty] ?? gameState.difficulty })] })] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsx(UserMenu, {}), _jsx("button", { onClick: () => setShowDiary(true), className: "bg-navy-800 hover:bg-navy-700 border border-navy-600 text-smoke-400 font-mono text-sm px-3 py-2 rounded flex items-center gap-1", title: "Diario de Gesti\u00F3n", children: "\uD83D\uDCCB Diario" }), isCrisisExpress && (_jsxs("div", { className: `pixel-border flex flex-col items-center px-3 py-1 font-mono ${crisisTimeLeft <= 10
                                            ? 'bg-crimson-900/70 text-crimson-300 animate-pulse'
                                            : 'bg-navy-800 text-smoke-300'}`, children: [_jsx("p", { className: "text-sm", children: "\u26A1 EXPRESS" }), _jsxs("p", { className: "font-bold text-lg leading-none", children: [crisisTimeLeft, "s"] })] })), _jsxs("div", { className: "text-right", children: [_jsx("p", { className: "text-sm text-smoke-500 font-mono", children: "Turno" }), _jsxs("p", { className: "font-mono font-bold text-gold-400", children: [gameState.turn, "/", isCrisisExpress ? 15 : 50] })] }), (gameState.currentMonth != null && gameState.currentYear != null) && (_jsxs("div", { className: "text-right", children: [_jsx("p", { className: "text-sm text-smoke-500 font-mono", children: t(`month.${gameState.currentMonth}`) }), _jsx("p", { className: "font-mono font-bold text-celeste", children: gameState.currentYear })] })), _jsxs("div", { className: "text-right", children: [_jsx("p", { className: "text-sm text-smoke-500 font-mono", children: "Puntaje" }), _jsx("p", { className: "font-mono font-bold text-gold-400", children: gameState.score.toLocaleString() })] }), _jsx("button", { onClick: () => navigate('/'), className: "text-smoke-600 hover:text-smoke-400 font-mono text-xs", children: "\u2190 Salir" })] })] }), _jsx("div", { className: "mb-4", children: _jsx(TensionMeter, { state: gameState }) }), _jsxs("div", { className: "flex flex-col-reverse lg:grid lg:grid-cols-[320px_1fr] gap-6", children: [_jsx("aside", { children: _jsx(VariablesPanel, { state: gameState }) }), _jsxs("main", { children: [_jsx(AnimatePresence, { mode: "wait", children: !isAnimating && currentCard?.isLaw ? (_jsx(CongressSession, { card: currentCard, gameState: gameState, presidentId: presidentId, onComplete: (choiceIdx, negEffects) => {
                                                trackCongressSession({ law: currentCard.id, turn: gameState.turn });
                                                resolveCongressSession(choiceIdx, currentCard.id, negEffects);
                                            } }, currentCard.id)) : !isAnimating ? (_jsx(EventCardComponent, { card: currentCard, selectedIndex: pendingChoiceIndex, onSelect: selectChoice, onConfirm: () => {
                                                if (pendingChoiceIndex !== null && currentCard) {
                                                    trackTurnCompleted({ turn_number: gameState.turn, event_category: currentCard.category, choice_index: pendingChoiceIndex });
                                                }
                                                confirmChoice();
                                            }, disabled: isAnimating, presidentId: presidentId, gameState: gameState }, currentCard.id)) : null }), isAnimating && !showTransition && (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, className: "flex items-center justify-center h-64", children: _jsx("p", { className: "font-mono text-gold-400 text-2xl animate-pulse", children: "Aplicando decisi\u00F3n..." }) }))] })] }), hasCrisis && (_jsx("div", { className: "mt-6", children: _jsx(CrisisAlert, { crises: gameState.activeCrises }) })), gameState.activeShocks.length > 0 && (_jsx("div", { className: "mt-4 flex gap-2 flex-wrap", children: gameState.activeShocks.map((shock) => (_jsxs("span", { className: "pixel-border bg-orange-900/50 text-orange-300 font-mono text-xs px-3 py-1", children: ["\u26A1 ", shock.name, " (", shock.turnsRemaining, " turnos)"] }, shock.id))) }))] }), _jsx(AnibalTicker, { isCrisis: hasCrisis }), showDolarFloat && (_jsx("div", { className: "fixed inset-0 pointer-events-none z-40 flex items-center justify-center", children: _jsx(PixelDolar, { floating: true }) })), showCrowd && (_jsx("div", { className: "fixed bottom-0 left-0 right-0 z-40 pointer-events-none flex justify-around items-end pb-1", children: Array.from({ length: 5 }).map((_, i) => (_jsx("div", { className: "pixel-crowd-torches w-2 h-8 bg-orange-500", style: { animationDelay: `${i * 0.12}s` } }, i))) })), showConfetti && (_jsx("div", { className: "fixed inset-0 pointer-events-none z-40", children: Array.from({ length: 10 }).map((_, i) => (_jsx("div", { className: "pixel-confetti-piece absolute", style: {
                        left: `${5 + i * 9}%`,
                        top: `${15 + (i % 4) * 8}%`,
                        background: i % 2 === 0 ? 'var(--celeste)' : 'white',
                        animationDelay: `${i * 0.08}s`,
                    } }, i))) })), showMidGamePaywall && (_jsx(PaywallModal, { entitlement: "full_access", triggerPoint: "mid_game_turn_5", onClose: () => setShowMidGamePaywall(false) }))] }));
}
//# sourceMappingURL=GameScreen.js.map