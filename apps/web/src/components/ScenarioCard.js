import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScenarioIllustration } from './illustrations/ScenarioIllustration.js';
import { useGameStore } from '../stores/gameStore.js';
gsap.registerPlugin(useGSAP);
// Pixel-era "scan-line" colour per scenario era
const ERA_ACCENT = {
    hiperinflacion_1989: '#CC2200', // crisis red
    corralito_2001: '#CC2200',
    convertibilidad: '#74ACDF', // celeste — stable era
    rodrigazo_1975: '#F6B40E', // gold — social unrest
    malvinas_1982: '#74ACDF',
    kirchnerismo_boom: '#2e7d32', // green — boom
    libertad_avanza_2023: '#CC2200',
    guerra_ucrania_2022: '#ffd500', // Ukrainian yellow
    conflicto_iran_2024: '#ff9900', // orange — oil/conflict
};
export function ScenarioCard({ id, label, period, description, locked, index, onClick }) {
    const presidentId = useGameStore((s) => s.presidentId);
    const cardRef = useRef(null);
    const scanRef = useRef(null);
    const yearRef = useRef(null);
    const labelRef = useRef(null);
    const descRef = useRef(null);
    const [yearDisplay, setYearDisplay] = useState('----');
    const accent = ERA_ACCENT[id] ?? '#74ACDF';
    // Parse year from period string like "1989" or "2001" or "2003–2007"
    const targetYear = parseInt(period.slice(0, 4), 10);
    // ── Enter animation: stagger reveal + year counter ──────────────────────
    useGSAP(() => {
        if (!cardRef.current)
            return;
        const delay = index * 0.08;
        // Card slides up from below with clip-path reveal
        gsap.fromTo(cardRef.current, { autoAlpha: 0, y: 24, clipPath: 'inset(100% 0% 0% 0%)' }, {
            autoAlpha: 1,
            y: 0,
            clipPath: 'inset(0% 0% 0% 0%)',
            duration: 0.5,
            delay,
            ease: 'power3.out',
            immediateRender: false,
        });
        // Label and description stagger inside the card
        if (labelRef.current && descRef.current) {
            gsap.fromTo([labelRef.current, descRef.current], { autoAlpha: 0, x: -8 }, { autoAlpha: 1, x: 0, duration: 0.35, delay: delay + 0.3, stagger: 0.08, ease: 'power2.out' });
        }
        // Year counter animation
        if (!isNaN(targetYear) && yearRef.current) {
            const startYear = targetYear - 12;
            const counter = { val: startYear };
            gsap.to(counter, {
                val: targetYear,
                duration: 0.7,
                delay: delay + 0.15,
                ease: 'power2.inOut',
                snap: { val: 1 },
                onUpdate: () => setYearDisplay(String(Math.round(counter.val))),
                onComplete: () => setYearDisplay(period),
            });
        }
        else {
            setYearDisplay(period);
        }
    }, { scope: cardRef, dependencies: [index] });
    // ── Hover: scanline sweep across the card ───────────────────────────────
    const { contextSafe } = useGSAP({ scope: cardRef });
    const handleMouseEnter = contextSafe(() => {
        if (!scanRef.current || locked)
            return;
        gsap.fromTo(scanRef.current, { scaleY: 0, autoAlpha: 0.6, top: 0 }, { scaleY: 1, autoAlpha: 0, top: '100%', duration: 0.4, ease: 'power1.inOut', overwrite: true });
        gsap.to(cardRef.current, {
            boxShadow: `0 0 0 2px ${accent}, 0 0 12px ${accent}44`,
            duration: 0.2,
            ease: 'power2.out',
        });
        // Parallax lift on illustration
        gsap.to('.scenario-illus', { scale: 1.04, duration: 0.35, ease: 'power2.out', overwrite: true });
    });
    const handleMouseLeave = contextSafe(() => {
        gsap.to(cardRef.current, {
            boxShadow: '0 0 0 2px transparent',
            duration: 0.3,
            ease: 'power2.out',
        });
        gsap.to('.scenario-illus', { scale: 1, duration: 0.3, ease: 'power2.out', overwrite: true });
    });
    return (_jsxs("button", { ref: cardRef, onClick: onClick, onMouseEnter: handleMouseEnter, onMouseLeave: handleMouseLeave, className: "border-2 border-navy-600 bg-navy-800 text-left relative overflow-hidden", style: { willChange: 'transform, opacity', display: 'block', width: '100%' }, children: [_jsx("div", { ref: scanRef, className: "absolute inset-x-0 pointer-events-none", style: {
                    height: '100%',
                    background: `linear-gradient(to bottom, transparent, ${accent}33, transparent)`,
                    top: 0,
                    opacity: 0,
                    transformOrigin: 'top center',
                } }), locked && (_jsx("div", { className: "absolute inset-0 bg-navy-900/70 flex items-center justify-center z-10", children: _jsx("span", { className: "text-gold-400 font-serif text-[8px]", children: "\uD83D\uDD12 PRO" }) })), _jsx("div", { className: "scenario-illus w-full overflow-hidden", style: { height: '180px', borderBottom: `1px solid ${accent}44` }, children: _jsx(ScenarioIllustration, { id: id, presidentId: presidentId }) }), _jsxs("div", { className: "p-3", children: [_jsx("div", { className: "font-mono text-xs mb-1", style: { color: accent }, children: _jsx("span", { ref: yearRef, children: yearDisplay }) }), _jsx("div", { ref: labelRef, className: "font-serif text-smoke-100 font-bold mb-1", style: { fontSize: '8px' }, children: label }), _jsx("div", { ref: descRef, className: "text-smoke-400 font-mono text-xs leading-tight", children: description })] }), _jsx("div", { className: "absolute bottom-0 inset-x-0 h-[2px]", style: { background: locked ? '#334155' : accent, opacity: locked ? 0.3 : 0.6 } })] }));
}
//# sourceMappingURL=ScenarioCard.js.map