import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGameStore } from '../stores/gameStore.js';
import { PixelPortrait } from '../components/illustrations/PixelPortrait.js';
import { useEntitlements } from '../hooks/useEntitlements.js';
import { PaywallModal } from '../components/PaywallModal.js';
import { HISTORICAL_SCENARIOS } from '@republica/game-engine';
import { useTranslation } from 'react-i18next';
const ARCHETYPES = [
    {
        id: 'ingeniero',
        name: 'Javier',
        lastName: 'Milei',
        title: 'La Motosierra',
        description: '¡VIVA LA LIBERTAD, CARAJO! Economista austríaco, anarcocapitalista, enemigo del Banco Central. La motosierra en mano, promete destruir el Estado.',
        bonus: '+15 Confianza de Mercados inicial',
        weakness: '-10 Popularidad inicial',
        bonusStat: 'marketConfidence',
        weaknessStat: 'popularity',
        color: 'border-blue-500',
        emoji: '⚡',
    },
    {
        id: 'populista',
        name: 'Sergio',
        lastName: 'Massa',
        title: 'El Candidato',
        description: '"Estamos trabajando." Peronista pragmático, camaleón político, eterno candidato. Las plazas lo bancan, los mercados lo dudan.',
        bonus: '+15 Popularidad inicial',
        weakness: '-10 Confianza de Mercados inicial',
        bonusStat: 'popularity',
        weaknessStat: 'marketConfidence',
        color: 'border-crimson-500',
        emoji: '🎙',
    },
    {
        id: 'tecnocrata',
        name: 'Patricia',
        lastName: 'Bullrich',
        title: 'La Mano Dura',
        description: '"Orden y trabajo, sin excusas." PRO de hierro, ministra de seguridad, candidata eterna. Fría, determinada, con cero tolerancia al caos.',
        bonus: '+10 Estabilidad Social, +5 Credibilidad Mediática',
        weakness: '-10 Popularidad inicial',
        bonusStat: 'socialStability',
        weaknessStat: 'popularity',
        color: 'border-yellow-500',
        emoji: '🦅',
    },
    {
        id: 'izquierda',
        name: 'Myriam',
        lastName: 'Bregman',
        title: 'La Tribuna',
        description: '"Que paguen los que más tienen." FIT-Unidad, abogada, trotskista convencida. Las plazas la aclaman, los mercados la odian.',
        bonus: '+15 Estabilidad Social inicial',
        weakness: '-15 Confianza de Mercados inicial',
        bonusStat: 'socialStability',
        weaknessStat: 'marketConfidence',
        color: 'border-red-600',
        emoji: '✊',
    },
    {
        id: 'federal',
        name: 'Juan',
        lastName: 'Schiaretti',
        title: 'El Federal',
        description: '"Córdoba primero." Tres veces gobernador, peronista disfrazado de independiente. Pragmático, cordobés hasta los huesos, distante de Buenos Aires.',
        bonus: '+10 Credibilidad Mediática, +5 Estabilidad',
        weakness: '-10 Popularidad nacional inicial',
        bonusStat: 'mediaCredibility',
        weaknessStat: 'popularity',
        color: 'border-blue-400',
        emoji: '🌾',
    },
    {
        id: 'corporativo',
        name: 'Horacio',
        lastName: 'Larreta',
        title: 'El Gestor',
        description: '"Trabajar, trabajar y trabajar." Ex jefe de Gobierno porteño, tecnócrata del PRO, amante del PowerPoint. Gestión sin carisma, resultados sin pasión.',
        bonus: '+10 Confianza de Mercados, +5 Credibilidad Mediática',
        weakness: '-15 Popularidad inicial',
        bonusStat: 'marketConfidence',
        weaknessStat: 'popularity',
        color: 'border-sky-400',
        emoji: '📊',
    },
];
function ArchetypeCard({ archetype, selected, onSelect }) {
    return (_jsxs(motion.button, { whileHover: { scale: 1.02, y: -4 }, whileTap: { scale: 0.98 }, onClick: onSelect, className: `relative w-full text-left p-6 border-2 rounded-xl transition-all duration-200 ${archetype.color} ${selected
            ? 'bg-navy-700 ring-2 ring-gold-400 shadow-lg shadow-gold-500/20'
            : 'bg-navy-800 hover:bg-navy-750'}`, children: [_jsx("div", { className: "flex justify-center mb-3", children: _jsx(PixelPortrait, { id: archetype.id, mood: selected ? 'victory' : 'neutral', px: 120 }) }), _jsxs("div", { className: "text-center mb-4", children: [_jsxs("p", { className: "font-serif font-bold text-smoke-100 text-xl", children: [archetype.name, " ", archetype.lastName] }), _jsx("p", { className: "font-mono text-xs text-smoke-500 uppercase tracking-widest mt-1", children: archetype.title })] }), _jsxs("p", { className: "text-smoke-300 text-xs leading-relaxed mb-4 text-center italic", children: ["\"", archetype.description, "\""] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center gap-2 bg-emerald-900/30 border border-emerald-800 rounded px-3 py-2", children: [_jsx("span", { className: "text-emerald-400 font-mono text-xs font-bold", children: "+" }), _jsx("span", { className: "text-emerald-300 font-mono text-xs", children: archetype.bonus })] }), _jsxs("div", { className: "flex items-center gap-2 bg-crimson-900/30 border border-crimson-800 rounded px-3 py-2", children: [_jsx("span", { className: "text-crimson-400 font-mono text-xs font-bold", children: "\u2212" }), _jsx("span", { className: "text-crimson-300 font-mono text-xs", children: archetype.weakness })] })] }), selected && (_jsx(motion.div, { initial: { opacity: 0, scale: 0 }, animate: { opacity: 1, scale: 1 }, className: "absolute top-3 right-3 bg-gold-400 text-navy-900 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold", children: "\u2713" }))] }));
}
export default function PresidentSelectScreen() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const setPresidentId = useGameStore((s) => s.setPresidentId);
    const isCrisisExpress = useGameStore((s) => s.isCrisisExpress);
    const setCrisisExpress = useGameStore((s) => s.setCrisisExpress);
    const scenarioId = useGameStore((s) => s.scenarioId);
    const setScenario = useGameStore((s) => s.setScenario);
    const [selected, setSelected] = useState('populista');
    const [paywall, setPaywall] = useState(null);
    const { hasEntitlement } = useEntitlements();
    const canPlay = (archetypeId) => {
        if (archetypeId === 'ingeniero')
            return true;
        if (archetypeId === 'populista')
            return true;
        return hasEntitlement('presidents_pack') || hasEntitlement('full_access');
    };
    const canUseCrisisExpress = hasEntitlement('mode_crisis_express') || hasEntitlement('full_access');
    const handleSelect = (id) => {
        if (!canPlay(id)) {
            setPaywall({ entitlement: 'presidents_pack', trigger: 'president_select' });
            return;
        }
        setSelected(id);
    };
    const handleToggleCrisisExpress = () => {
        if (!canUseCrisisExpress && !isCrisisExpress) {
            setPaywall({ entitlement: 'mode_crisis_express', trigger: 'president_select' });
            return;
        }
        setCrisisExpress(!isCrisisExpress);
    };
    const handleConfirm = () => {
        setPresidentId(selected);
        navigate('/game');
    };
    const selectedArchetype = ARCHETYPES.find((a) => a.id === selected) ?? ARCHETYPES[1];
    return (_jsxs(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, className: "min-h-screen flex flex-col items-center justify-center p-6", children: [_jsxs("div", { className: "max-w-4xl w-full", children: [scenarioId && (_jsxs("div", { className: "pixel-border-gold font-serif text-[8px] text-gold-400 bg-navy-800 px-3 py-2 mb-6 text-center tracking-wide", children: ["MODO HIST\u00D3RICO: ", t(HISTORICAL_SCENARIOS[scenarioId].labelKey)] })), _jsxs("div", { className: "text-center mb-10", children: [_jsx("p", { className: "font-mono text-xs text-smoke-500 uppercase tracking-widest mb-2", children: "Elecciones presidenciales" }), _jsxs("h1", { className: "font-serif text-4xl font-black text-smoke-100 mb-3", children: ["\u00BFQui\u00E9n va a ", _jsx("span", { className: "text-crimson-400", children: "gobernar" }), "?"] }), _jsx("p", { className: "text-smoke-400 text-sm max-w-lg mx-auto", children: "Cada presidente arranca con fortalezas y debilidades distintas. El pa\u00EDs se acuerda de qui\u00E9n lo llev\u00F3 a la gloria o al desastre." })] }), _jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-4 mb-8", children: ARCHETYPES.map((a) => {
                            const locked = !canPlay(a.id);
                            return (_jsxs("div", { className: "relative", children: [_jsx(ArchetypeCard, { archetype: a, selected: selected === a.id, onSelect: () => handleSelect(a.id) }), locked && (_jsxs("div", { className: "absolute inset-0 rounded-xl flex flex-col items-center justify-center bg-navy-900/70 pointer-events-none", children: [_jsx("span", { className: "text-3xl", children: "\uD83D\uDD12" }), _jsx("span", { className: "text-gold-400 font-mono text-xs mt-1", children: "$2.99" })] }))] }, a.id));
                        }) }), _jsx(motion.div, { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.3 }, className: "mb-4", children: _jsxs("button", { onClick: handleToggleCrisisExpress, className: `w-full flex items-center justify-between px-5 py-4 rounded-xl border-2 transition-all duration-200 ${isCrisisExpress
                                ? 'bg-crimson-900/50 border-crimson-500 shadow-lg shadow-crimson-500/20'
                                : 'bg-navy-800 border-navy-600 hover:border-navy-400'}`, children: [_jsxs("div", { className: "text-left", children: [_jsxs("p", { className: `font-mono font-bold text-sm uppercase tracking-widest ${isCrisisExpress ? 'text-crimson-300' : 'text-smoke-400'}`, children: ["\u26A1 Crisis Express ", !canUseCrisisExpress && _jsx("span", { className: "ml-2 text-gold-400", children: "\uD83D\uDD12 $1.99" })] }), _jsx("p", { className: "font-mono text-xs text-smoke-500 mt-0.5", children: "45s por turno \u00B7 15 turnos \u00B7 \u00D71.5 da\u00F1o \u00B7 \u00D72 puntaje" })] }), _jsx("div", { className: `w-10 h-6 rounded-full border-2 flex items-center transition-all duration-200 ${isCrisisExpress ? 'bg-crimson-500 border-crimson-400 justify-end' : 'bg-navy-700 border-navy-500 justify-start'}`, children: _jsx("div", { className: "w-4 h-4 rounded-full bg-smoke-100 mx-0.5" }) })] }) }), _jsx(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.4 }, children: _jsx("button", { onClick: handleConfirm, className: "w-full bg-crimson-600 hover:bg-crimson-500 text-smoke-100 font-serif font-bold py-4 px-8 rounded-xl text-xl transition-colors uppercase tracking-wider shadow-lg", children: selectedArchetype
                                ? `Asumir como ${selectedArchetype.name} ${selectedArchetype.lastName} →`
                                : 'Seleccioná un presidente' }) }), _jsx("button", { onClick: () => { setScenario(null); navigate('/'); }, className: "w-full mt-3 text-smoke-500 font-mono text-xs hover:text-smoke-300 py-2", children: "\u2190 Volver al inicio" })] }), paywall && (_jsx(PaywallModal, { entitlement: paywall.entitlement, triggerPoint: paywall.trigger, onClose: () => setPaywall(null) }))] }));
}
//# sourceMappingURL=PresidentSelectScreen.js.map