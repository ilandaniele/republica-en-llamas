import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { getSafestChoiceIndex } from '@republica/game-engine';
import { CharacterPortrait } from './illustrations/characters/CharacterPortrait.js';
import { EventIllustration } from './illustrations/EventIllustration.js';
import { PixelPortrait } from './illustrations/PixelPortrait.js';
gsap.registerPlugin(useGSAP);
const PRESIDENT_IDS = new Set(['milei', 'massa', 'bullrich', 'ingeniero', 'populista', 'tecnocrata']);
// Category styles: left border color, badge color, icon
const CATEGORY_STYLES = {
    political: { border: 'border-l-[#1a237e]', badge: 'text-blue-400', icon: '🏛' },
    economic: { border: 'border-l-[#1b5e20]', badge: 'text-yellow-400', icon: '💰' },
    social: { border: 'border-l-[#e65100]', badge: 'text-emerald-400', icon: '✊' },
    international: { border: 'border-l-[#b71c1c]', badge: 'text-purple-400', icon: '🌐' },
    crisis: { border: 'border-l-crimson-500', badge: 'text-crimson-400', icon: '⚠' },
};
const CATEGORY_LABELS = {
    political: 'POLÍTICO',
    economic: 'ECONÓMICO',
    social: 'SOCIAL',
    international: 'INTERNACIONAL',
    crisis: '⚠ CRISIS',
};
export function EventCardComponent({ card, selectedIndex, onSelect, onConfirm, disabled, contextPrefix, presidentId = 'ingeniero', gameState }) {
    const { t } = useTranslation();
    const style = CATEGORY_STYLES[card.category] ?? CATEGORY_STYLES['crisis'];
    const isCrisis = card.category === 'crisis';
    const isEasy = gameState?.difficulty === 'easy';
    const safestIndex = isEasy ? getSafestChoiceIndex(card) : -1;
    const [ripplingChoice, setRipplingChoice] = useState(null);
    const touchStartX = useRef(null);
    const cardRef = useRef(null);
    // ── GSAP: category-specific ambient particle effects on the card ────────────
    useGSAP(() => {
        if (!cardRef.current)
            return;
        if (isCrisis) {
            // Crimson border glow pulses on the whole card
            gsap.fromTo('.card-glow-overlay', { autoAlpha: 0 }, { autoAlpha: 0.12, duration: 0.35, yoyo: true, repeat: -1, ease: 'sine.inOut' });
        }
        else if (card.category === 'economic') {
            // $ symbols rain down through the card body
            gsap.fromTo('.card-particle', { y: 0, autoAlpha: 0.55 }, { y: 90, autoAlpha: 0, duration: 2.2, ease: 'power1.in',
                stagger: { each: 0.55, repeat: -1, from: 'random' } });
        }
        else if (card.category === 'social') {
            // Smoke wisps drift upward
            gsap.fromTo('.card-particle', { y: 0, x: 0, scale: 1, autoAlpha: 0.35 }, { y: -50, x: 10, scale: 1.8, autoAlpha: 0, duration: 2.8, ease: 'power1.out',
                stagger: { each: 1.1, repeat: -1 } });
        }
        else if (card.category === 'international') {
            // Radar pulse ring expands and fades
            gsap.fromTo('.card-radar', { scale: 0.6, autoAlpha: 0.7 }, { scale: 2.2, autoAlpha: 0, duration: 1.8, ease: 'power1.out', repeat: -1, repeatDelay: 0.6 });
        }
    }, { scope: cardRef, dependencies: [card.category] });
    const handleTouchStart = useCallback((e) => {
        touchStartX.current = e.touches[0]?.clientX ?? null;
    }, []);
    const handleTouchEnd = useCallback((e) => {
        if (touchStartX.current === null || disabled)
            return;
        const dx = (e.changedTouches[0]?.clientX ?? 0) - touchStartX.current;
        touchStartX.current = null;
        if (Math.abs(dx) < 50)
            return;
        const n = card.choices.length;
        const current = selectedIndex ?? -1;
        if (dx < 0) {
            onSelect(card.id, (current + 1 + n) % n);
        }
        else {
            onSelect(card.id, ((current < 0 ? 0 : current) - 1 + n) % n);
        }
    }, [card.choices.length, card.id, disabled, onSelect, selectedIndex]);
    const handleChoiceClick = useCallback((idx) => {
        if (disabled)
            return;
        onSelect(card.id, idx);
        setRipplingChoice(idx);
        setTimeout(() => setRipplingChoice(null), 400);
    }, [disabled, onSelect, card.id]);
    return (_jsxs(motion.div, { ref: cardRef, initial: { y: 80, opacity: 0 }, animate: { y: 0, opacity: 1 }, exit: { y: -40, opacity: 0 }, transition: { type: 'spring', stiffness: 300, damping: 30 }, className: `event-card border-l-4 ${style.border} !p-0 overflow-hidden relative`, style: {
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 23px, rgba(255,255,255,0.015) 24px)',
        }, onTouchStart: handleTouchStart, onTouchEnd: handleTouchEnd, children: [isCrisis && (_jsx("div", { className: "card-glow-overlay", style: { position: 'absolute', inset: 0, background: 'var(--crisis-red)', pointerEvents: 'none', zIndex: 1, opacity: 0 } })), card.category === 'economic' && (_jsx("div", { style: { position: 'absolute', top: '30%', left: 0, width: '100%', height: '60%', pointerEvents: 'none', zIndex: 1, overflow: 'hidden' }, children: [12, 28, 46, 64, 80].map((x, i) => (_jsx("span", { className: "card-particle", style: { position: 'absolute', left: `${x}%`, top: 0, color: i % 2 === 0 ? '#2e7d32' : '#f9a825', fontFamily: "'Press Start 2P', monospace", fontSize: '9px', userSelect: 'none' }, children: "$" }, i))) })), card.category === 'social' && (_jsx("div", { style: { position: 'absolute', bottom: '20%', left: 0, width: '100%', height: '40%', pointerEvents: 'none', zIndex: 1, overflow: 'hidden' }, children: [18, 42, 70].map((x, i) => (_jsx("div", { className: "card-particle", style: { position: 'absolute', left: `${x}%`, bottom: 0, width: 14 + i * 4, height: 14 + i * 4, borderRadius: '50%', background: 'rgba(120,144,156,0.25)' } }, i))) })), card.category === 'international' && (_jsx("div", { style: { position: 'absolute', top: 12, right: 12, width: 18, height: 18, pointerEvents: 'none', zIndex: 1 }, children: _jsx("div", { className: "card-radar", style: { position: 'absolute', inset: 0, borderRadius: '50%', border: '2px solid #7c4dff', transformOrigin: '50% 50%' } }) })), _jsxs("div", { className: "px-6 pt-5 pb-3", children: [contextPrefix && (_jsx("p", { className: "text-smoke-500 font-mono text-xs italic mb-2", children: contextPrefix })), card.requiredFlags && card.requiredFlags.length > 0 && (_jsxs("div", { className: "flex items-center gap-1 mb-2 px-2 py-1 pixel-border text-celeste-400", style: { fontFamily: "'Press Start 2P'", fontSize: '6px', display: 'inline-flex' }, children: [_jsx("span", { children: "\u21A9" }), _jsx("span", { children: "CONSECUENCIA DE DECISI\u00D3N PREVIA" })] })), _jsxs("div", { className: `flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest mb-3 ${style.badge}`, children: [_jsx("span", { className: "text-base", children: style.icon }), _jsx("span", { children: CATEGORY_LABELS[card.category] ?? card.category.toUpperCase() })] }), _jsx("h2", { style: { fontFamily: "'Press Start 2P', monospace", fontSize: isCrisis ? '9px' : '10px', lineHeight: '1.6' }, className: `uppercase ${isCrisis ? 'text-crimson-400 text-shadow-crimson' : 'text-smoke-100'}`, children: t(card.titleKey) })] }), _jsxs("div", { className: "relative w-full h-[180px] md:h-[260px] xl:h-[360px] overflow-hidden", children: [card.characterId && PRESIDENT_IDS.has(card.characterId) ? (_jsx("div", { className: "absolute inset-0 flex items-center justify-center bg-navy-800/60 border-y border-navy-700", children: _jsx(PixelPortrait, { id: card.characterId, mood: "neutral", px: 180 }) })) : card.characterId ? (_jsxs("div", { className: "absolute inset-0 flex items-center gap-3 bg-navy-800/60 border-y border-navy-600 px-4", children: [_jsx(CharacterPortrait, { characterId: card.characterId, size: 72 }), _jsx("div", { className: "text-smoke-400 font-mono text-xs italic opacity-70", children: "Personaje recurrente" })] })) : (_jsx(EventIllustration, { eventCategory: card.category, presidentId: presidentId, eventId: card.id, gameState: gameState })), !card.characterId && (_jsx("div", { className: "absolute bottom-0 inset-x-0 h-10 pointer-events-none", style: { background: 'linear-gradient(to top, rgba(9,21,37,0.85) 0%, transparent 100%)' } }))] }), _jsxs("div", { className: "px-6 pt-4 pb-6", children: [_jsx("p", { className: "text-smoke-300 leading-relaxed mb-5", style: { fontFamily: "'VT323', monospace", fontSize: '18px' }, children: t(card.bodyKey) }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3", children: Array.from({ length: 4 }).map((_, index) => {
                            const choice = card.choices[index];
                            const isLocked = !choice;
                            const isSelected = selectedIndex === index;
                            const letter = String.fromCharCode(65 + index);
                            if (isLocked) {
                                return null;
                            }
                            return (_jsxs(motion.button, { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0, scale: isSelected ? 1.02 : 1 }, transition: { duration: 0.2, delay: index * 0.05 }, whileTap: !disabled ? { scale: 0.97 } : {}, onClick: () => handleChoiceClick(index), className: `pixel-choice-card w-full text-left ${isSelected ? 'selected' : ''}`, children: [ripplingChoice === index && _jsx("span", { className: "choice-ripple" }), _jsxs("div", { className: "flex items-start gap-2 mb-2", children: [_jsx("span", { style: {
                                                    background: isSelected ? 'var(--gold)' : 'var(--celeste-dark)',
                                                    color: isSelected ? '#0D1B2A' : 'white',
                                                    fontFamily: "'Press Start 2P', monospace",
                                                    fontSize: '8px',
                                                    padding: '3px 5px',
                                                    display: 'inline-block',
                                                    flexShrink: 0,
                                                }, children: letter }), _jsx("span", { style: { fontFamily: "'VT323', monospace", fontSize: '16px', lineHeight: '1.3' }, className: isSelected ? 'text-smoke-100' : 'text-smoke-300', children: t(choice.textKey) }), isEasy && index === safestIndex && (_jsx("span", { className: "ml-auto shrink-0 text-xs text-gold-400", title: "Opci\u00F3n m\u00E1s segura", children: "\u2B50" }))] }), choice.requiresVote && (_jsxs("div", { className: "pixel-border mt-2 px-2 py-1 flex items-center gap-1", style: { fontFamily: "'Press Start 2P', monospace", fontSize: '6px', color: 'var(--celeste)', borderColor: 'var(--celeste)', display: 'inline-flex' }, children: [_jsx("span", { children: "\uD83D\uDDF3" }), _jsx("span", { children: "REQUIERE CONGRESO" })] }))] }, choice.id));
                        }) }), selectedIndex !== null && (_jsxs(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, className: "mt-5", children: [_jsx("button", { onClick: onConfirm, disabled: disabled, className: "w-full pixel-border-gold bg-gold-500 hover:bg-gold-400 text-navy-900 font-bold py-3 px-6 transition-colors duration-200 disabled:opacity-50", style: { fontFamily: "'Press Start 2P', monospace", fontSize: '8px' }, children: "CONFIRMAR TURNO \u25B6" }), _jsx("p", { style: { fontFamily: "'VT323', monospace", fontSize: '14px' }, className: "text-smoke-600 text-center mt-1", children: "Pod\u00E9s cambiar tu opci\u00F3n antes de confirmar" })] }))] })] }));
}
//# sourceMappingURL=EventCardComponent.js.map