import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
// ── Constants ────────────────────────────────────────────────────────────────
const VISUAL_SEATS = 257;
const VISUAL_REQUIRED = 129; // Math.floor(257/2)+1
const ROW_COUNTS = [14, 20, 26, 32, 38, 44, 50, 33];
const ROW_RADII = [80, 110, 140, 170, 200, 230, 260, 285];
const CX = 300, CY = 320;
const BLOC_COLORS = {
    government: '#9C27B0',
    hardOpposition: '#1565C0',
    proOpposition: '#FFD600',
    independent: '#78909C',
};
const VOTE_COLORS = {
    pending: null,
    yes: '#43A047',
    no: '#E53935',
    abstain: '#FFA726',
};
// ── Swing senators pool ──────────────────────────────────────────────────────
const SWING_POOL = [
    { id: 'urquiza', name: 'Sen. Roberto Urquiza', province: 'Chaco', bloc: 'Interbloque Federal', demand: '"Presidente, necesito que me garantice la obra del puente sobre el río Bermejo."', costLabel: '+2% déficit', effects: { deficitDelta: 2 } },
    { id: 'ferreyra', name: 'Dip. Graciela Ferreyra', province: 'Salta', bloc: 'Movimiento Popular', demand: '"El sector minero salteño necesita ese subsidio. Sin él, no puedo acompañar."', costLabel: '+2% déficit, −3 popularidad', effects: { deficitDelta: 2, popularityDelta: -3 } },
    { id: 'dominguez', name: 'Sen. Carlos Domínguez', province: 'Entre Ríos', bloc: 'Federal Productivo', demand: '"El campo entrerriano no aguanta más retenciones. Necesito una garantía escrita."', costLabel: '+3% déficit', effects: { deficitDelta: 3 } },
    { id: 'paz', name: 'Dip. Valeria Paz', province: 'Neuquén', bloc: 'MPN', demand: '"Las regalías petroleras de Neuquén tienen que actualizarse urgente."', costLabel: '−4 reservas', effects: { foreignReservesDelta: -4 } },
    { id: 'villegas', name: 'Sen. Matías Villegas', province: 'Tucumán', bloc: 'PJ Federal', demand: '"El fondo universitario de Tucumán tiene que estar garantizado en el texto."', costLabel: '+2% déficit, +5 popularidad', effects: { deficitDelta: 2, popularityDelta: 5 } },
    { id: 'rios', name: 'Dip. Adriana Ríos', province: 'Corrientes', bloc: 'Encuentro Liberal', demand: '"La obra hídrica del Iberá no puede esperar. Es lo único que le pido."', costLabel: '+2% déficit', effects: { deficitDelta: 2 } },
    { id: 'medina', name: 'Sen. Jorge Medina', province: 'San Juan', bloc: 'Productivos del Centro', demand: '"Los beneficios al litio son innegociables para San Juan. Sin eso, no."', costLabel: '+5 mercados, +1% déficit', effects: { marketConfidenceDelta: 5, deficitDelta: 1 } },
    { id: 'torres', name: 'Dip. Claudia Torres', province: 'Tierra del Fuego', bloc: 'Fuerza Fueguina', demand: '"La zona franca fueguina es lo único que sostenemos. Extiéndala."', costLabel: '+3% déficit', effects: { deficitDelta: 3 } },
    { id: 'blanco', name: 'Sen. Ricardo Blanco', province: 'La Rioja', bloc: 'PJ Riojano', demand: '"La ruta 40 cruza mi provincia. Sin plata para obras, no tengo cómo justificar mi voto."', costLabel: '+2% déficit', effects: { deficitDelta: 2 } },
    { id: 'caceres', name: 'Dip. Marta Cáceres', province: 'Misiones', bloc: 'Renovación Misionera', demand: '"El turismo de Misiones necesita fondos ahora. Las Cataratas no pueden esperar."', costLabel: '+1% déficit, +3 popularidad', effects: { deficitDelta: 1, popularityDelta: 3 } },
];
// ── Negotiation actions ──────────────────────────────────────────────────────
const NEG_ACTIONS = [
    {
        id: 'radical',
        icon: '📞',
        label: 'Llamar al bloque radical',
        voteRange: [8, 12],
        preview: 'Convocás a los radicales disidentes. Suman votos pero hay costos políticos.',
        costLabel: '−5 popularidad',
        effects: { popularityDelta: -5 },
    },
    {
        id: 'presupuesto',
        icon: '💰',
        label: 'Ofrecer partida presupuestaria',
        voteRange: [10, 15],
        preview: 'Comprás votos con fondos públicos. Efectivo pero costoso.',
        costLabel: '+3% déficit',
        effects: { deficitDelta: 3 },
    },
    {
        id: 'cadena',
        icon: '📺',
        label: 'Cadena nacional',
        voteRange: [3, 7],
        preview: 'Presión mediática sobre legisladores indecisos. Rinde menos de lo esperado.',
        costLabel: '−8 credibilidad mediática',
        effects: { mediaCredibilityDelta: -8 },
    },
    {
        id: 'gobernadores',
        icon: '🤝',
        label: 'Negociar con gobernadores',
        voteRange: [6, 10],
        preview: 'Alianza territorial a cambio de obra pública. Moderado pero real.',
        costLabel: '−2 reservas, −3 popularidad',
        effects: { foreignReservesDelta: -2, popularityDelta: -3 },
    },
    {
        id: 'decreto',
        icon: '⚡',
        label: 'Amenazar con decreto',
        voteRange: [0, 0],
        preview: 'Saltás el Congreso. La ley pasa pero la oposición y la prensa te destruyen.',
        costLabel: '+15 inestabilidad, −12 credibilidad',
        effects: { stabilityDelta: -15, mediaCredibilityDelta: -12, emergencyDecreeDelta: 1 },
        isDecree: true,
    },
];
// ── Helpers ──────────────────────────────────────────────────────────────────
function mergeEffects(a, b) {
    const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
    const result = {};
    for (const k of keys) {
        result[k] = (a[k] ?? 0) + (b[k] ?? 0);
    }
    return result;
}
function playTick(freq = 220) {
    try {
        const AudioCtx = window.AudioContext ?? window.webkitAudioContext;
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.05);
    }
    catch { /* ignore */ }
}
// ── Seat layout computation ──────────────────────────────────────────────────
function computeSeats(congress) {
    const TOTAL = congress.governmentSeats + congress.oppositionSeats + congress.independentSeats;
    // Visual proportions (257 dots total)
    const visGov = Math.round(VISUAL_SEATS * congress.governmentSeats / TOTAL);
    const visOpp = congress.oppositionSeats > 0 ? Math.round(VISUAL_SEATS * congress.oppositionSeats / TOTAL) : 0;
    const visInd = VISUAL_SEATS - visGov - visOpp;
    const visHardOpp = Math.round(visOpp * 0.6);
    const visProOpp = visOpp - visHardOpp;
    // Compute raw positions
    const positions = [];
    for (let row = 0; row < ROW_COUNTS.length; row++) {
        const count = ROW_COUNTS[row];
        const r = ROW_RADII[row];
        for (let i = 0; i < count; i++) {
            const angle = Math.PI * (1 - i / (count - 1));
            positions.push({ x: CX + r * Math.cos(angle), y: CY - r * Math.sin(angle) });
        }
    }
    // Sort by x to assign blocs left (opposition) → right (government)
    const sorted = positions
        .map((pos, idx) => ({ ...pos, idx }))
        .sort((a, b) => a.x - b.x);
    // Bloc assignment
    const blocs = [];
    for (let i = 0; i < visHardOpp; i++)
        blocs.push('hardOpposition');
    for (let i = 0; i < visProOpp; i++)
        blocs.push('proOpposition');
    for (let i = 0; i < visInd; i++)
        blocs.push('independent');
    for (let i = 0; i < visGov; i++)
        blocs.push('government');
    // fill any rounding leftover
    while (blocs.length < VISUAL_SEATS)
        blocs.push('government');
    const seats = new Array(VISUAL_SEATS);
    sorted.forEach((pos, sortedIdx) => {
        seats[pos.idx] = { x: pos.x, y: pos.y, bloc: blocs[sortedIdx] ?? 'independent', index: pos.idx };
    });
    return seats;
}
// ── MAIN COMPONENT ───────────────────────────────────────────────────────────
export function CongressSession({ card, gameState, onComplete }) {
    const { t } = useTranslation();
    const congress = gameState.congress;
    const TOTAL_REAL = congress.governmentSeats + congress.oppositionSeats + congress.independentSeats;
    const REQUIRED_REAL = Math.floor(TOTAL_REAL / 2) + 1;
    // ── Phase state ────────────────────────────────────────────────────────────
    const [phase, setPhase] = useState('negotiation');
    const [actionsUsed, setActionsUsed] = useState([]);
    const [actionPoints, setActionPoints] = useState(3);
    const [negBonusVotes, setNegBonusVotes] = useState(0); // extra YES votes (real count)
    const [negEffects, setNegEffects] = useState({});
    const [usedDecree, setUsedDecree] = useState(false);
    const [hoveredAction, setHoveredAction] = useState(null);
    // Vote animation
    const [seatVotes, setSeatVotes] = useState(() => new Array(VISUAL_SEATS).fill('pending'));
    const timeoutsRef = useRef([]);
    // Swing senators (phase 4)
    const [swingSens, setSwingSens] = useState([]);
    const [swingIdx, setSwingIdx] = useState(0);
    const [swingExtraYes, setSwingExtraYes] = useState(0);
    const [swingExtraNo, setSwingExtraNo] = useState(0);
    // Result
    const [finalYesReal, setFinalYesReal] = useState(0);
    // Seat layout (memoized)
    const seats = useMemo(() => computeSeats(congress), [congress.governmentSeats, congress.oppositionSeats, congress.independentSeats]);
    // ── Derived vote counts ────────────────────────────────────────────────────
    const indYesPercent = Math.min(100, (congress.independentSupportBonus ?? 0) + Math.round(negBonusVotes / Math.max(1, congress.independentSeats) * 100));
    const baseYesReal = congress.governmentSeats + Math.floor(congress.independentSeats * indYesPercent / 100);
    const projectedYes = baseYesReal;
    const projectedNo = TOTAL_REAL - projectedYes;
    // Current live vote count (from animated visual dots)
    const liveVisYes = seatVotes.filter(v => v === 'yes').length;
    const liveVisNo = seatVotes.filter(v => v === 'no').length;
    const liveRealYes = Math.round(liveVisYes * TOTAL_REAL / VISUAL_SEATS);
    const liveRealNo = Math.round(liveVisNo * TOTAL_REAL / VISUAL_SEATS);
    // ── Cleanup on unmount ─────────────────────────────────────────────────────
    useEffect(() => () => { timeoutsRef.current.forEach(clearTimeout); }, []);
    // ── Negotiation handler ────────────────────────────────────────────────────
    const handleAction = useCallback((action) => {
        if (actionsUsed.includes(action.id) || actionPoints <= 0)
            return;
        if (action.isDecree) {
            setUsedDecree(true);
            setNegEffects(prev => mergeEffects(prev, action.effects));
            setActionsUsed(prev => [...prev, action.id]);
            // Skip to result immediately
            setPhase('result');
            setFinalYesReal(TOTAL_REAL); // decree passes regardless
            return;
        }
        const bonus = action.voteRange[0] + Math.floor(Math.random() * (action.voteRange[1] - action.voteRange[0] + 1));
        setNegBonusVotes(prev => prev + bonus);
        setNegEffects(prev => mergeEffects(prev, action.effects));
        setActionsUsed(prev => [...prev, action.id]);
        setActionPoints(prev => prev - 1);
    }, [actionsUsed, actionPoints, TOTAL_REAL]);
    // ── Start voting animation ─────────────────────────────────────────────────
    const startVoting = useCallback(() => {
        setPhase('voting');
        const oppSeats = seats.filter(s => s.bloc === 'hardOpposition' || s.bloc === 'proOpposition');
        const indSeats = seats.filter(s => s.bloc === 'independent');
        const govSeats = seats.filter(s => s.bloc === 'government');
        // Compute how many visual independents vote yes
        const visIndYes = Math.round(indSeats.length * Math.min(100, indYesPercent) / 100);
        const voteMap = new Map();
        indSeats.forEach((seat, i) => {
            if (i < visIndYes)
                voteMap.set(seat.index, 'yes');
            else if (i < Math.round(indSeats.length * 0.60))
                voteMap.set(seat.index, 'no');
            else
                voteMap.set(seat.index, 'abstain');
        });
        let delay = 0;
        const ts = [];
        // Wave 1 – opposition votes NO
        oppSeats.forEach(seat => {
            ts.push(setTimeout(() => {
                setSeatVotes(prev => { const n = [...prev]; n[seat.index] = 'no'; return n; });
                playTick(180);
            }, delay));
            delay += 12;
        });
        // 800ms gap
        delay += 800;
        // Wave 2 – independents (suspense)
        indSeats.forEach(seat => {
            const status = voteMap.get(seat.index) ?? 'abstain';
            ts.push(setTimeout(() => {
                setSeatVotes(prev => { const n = [...prev]; n[seat.index] = status; return n; });
                playTick(status === 'yes' ? 440 : 200);
            }, delay));
            delay += 55;
        });
        // 800ms gap
        delay += 800;
        // Wave 3 – government votes YES (rapid)
        govSeats.forEach(seat => {
            ts.push(setTimeout(() => {
                setSeatVotes(prev => { const n = [...prev]; n[seat.index] = 'yes'; return n; });
                playTick(440);
            }, delay));
            delay += 8;
        });
        // Compute final result
        ts.push(setTimeout(() => {
            const finalYes = baseYesReal + (negBonusVotes - congress.independentSeats * (congress.independentSupportBonus ?? 0) / 100);
            const realYes = Math.max(0, Math.round(baseYesReal));
            setFinalYesReal(realYes);
            const margin = Math.abs(realYes - REQUIRED_REAL);
            if (margin <= 5 && SWING_POOL.length > 0) {
                // Select 3 random swing senators
                const shuffled = [...SWING_POOL].sort(() => Math.random() - 0.5).slice(0, 3);
                setSwingSens(shuffled);
                setSwingIdx(0);
                setPhase('swing');
            }
            else {
                setPhase('result');
            }
        }, delay + 600));
        timeoutsRef.current = ts;
    }, [seats, indYesPercent, baseYesReal, negBonusVotes, congress, REQUIRED_REAL]);
    // ── Swing senator decisions ────────────────────────────────────────────────
    const handleSwingChoice = useCallback((choice) => {
        const sen = swingSens[swingIdx];
        if (!sen)
            return;
        if (choice === 'accept') {
            setNegEffects(prev => mergeEffects(prev, sen.effects));
            setSwingExtraYes(prev => prev + 1);
        }
        else if (choice === 'refuse') {
            setSwingExtraNo(prev => prev + 1);
        }
        else {
            // Random 50/50
            if (Math.random() < 0.5)
                setSwingExtraYes(prev => prev + 1);
            else
                setSwingExtraNo(prev => prev + 1);
        }
        const next = swingIdx + 1;
        if (next >= swingSens.length) {
            setPhase('result');
        }
        else {
            setSwingIdx(next);
        }
    }, [swingSens, swingIdx]);
    // ── Result computation ─────────────────────────────────────────────────────
    const finalYes = finalYesReal + swingExtraYes - swingExtraNo;
    const lawPassed = usedDecree || finalYes >= REQUIRED_REAL;
    const resultChoiceIdx = usedDecree ? 2 : lawPassed ? 0 : 1;
    const margin = Math.abs(finalYes - REQUIRED_REAL);
    // ── Render helpers ─────────────────────────────────────────────────────────
    function seatColor(seat, vote) {
        const vc = VOTE_COLORS[vote];
        if (vc)
            return vc;
        return BLOC_COLORS[seat.bloc];
    }
    const barWidth = 360;
    const markerPct = REQUIRED_REAL / TOTAL_REAL;
    const noBarPct = Math.min(1, liveRealNo / TOTAL_REAL);
    const yesBarPct = Math.min(1, liveRealYes / TOTAL_REAL);
    // ── Render: Negotiation ────────────────────────────────────────────────────
    const renderNegotiation = () => (_jsxs(motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 }, className: "space-y-4", children: [_jsxs("div", { className: "text-center", children: [_jsx("p", { className: "font-mono text-xs text-smoke-500 uppercase tracking-widest mb-1", children: "Sesi\u00F3n ordinaria del Congreso" }), _jsx("h2", { className: "font-serif text-xl font-bold text-smoke-100", children: t(card.titleKey) }), _jsx("p", { className: "text-smoke-400 text-sm mt-1 leading-relaxed max-w-lg mx-auto", children: t(card.bodyKey) })] }), _jsxs("div", { className: "grid grid-cols-3 gap-2 text-center", children: [_jsxs("div", { className: "bg-purple-900/40 border border-purple-700 rounded-lg px-3 py-2", children: [_jsx("p", { className: "font-mono text-xs text-purple-400 uppercase", children: "Oficialismo" }), _jsx("p", { className: "font-mono font-bold text-purple-200 text-lg", children: congress.governmentSeats })] }), _jsxs("div", { className: "bg-navy-800 border border-navy-600 rounded-lg px-3 py-2", children: [_jsx("p", { className: "font-mono text-xs text-smoke-500 uppercase", children: "Independientes" }), _jsx("p", { className: "font-mono font-bold text-smoke-200 text-lg", children: congress.independentSeats })] }), _jsxs("div", { className: "bg-blue-900/40 border border-blue-700 rounded-lg px-3 py-2", children: [_jsx("p", { className: "font-mono text-xs text-blue-400 uppercase", children: "Oposici\u00F3n" }), _jsx("p", { className: "font-mono font-bold text-blue-200 text-lg", children: congress.oppositionSeats })] })] }), _jsxs("div", { className: "bg-navy-800 border border-navy-600 rounded-lg px-4 py-3", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("span", { className: "font-mono text-xs text-smoke-500", children: "Proyecci\u00F3n actual" }), _jsxs("p", { className: "font-mono font-bold text-smoke-100", children: [_jsxs("span", { className: "text-emerald-400", children: [projectedYes, " S\u00CD"] }), _jsx("span", { className: "text-smoke-600 mx-2", children: "|" }), _jsxs("span", { className: "text-crimson-400", children: [projectedNo, " NO"] })] })] }), _jsxs("div", { className: "text-right", children: [_jsx("span", { className: "font-mono text-xs text-smoke-500", children: "Se necesitan" }), _jsx("p", { className: "font-mono font-bold text-gold-400 text-lg", children: REQUIRED_REAL })] })] }), projectedYes >= REQUIRED_REAL ? (_jsx("p", { className: "text-emerald-400 font-mono text-xs mt-1", children: "\u2713 Con votos suficientes para pasar" })) : (_jsxs("p", { className: "text-crimson-400 font-mono text-xs mt-1", children: ["\u26A0 Faltan ", REQUIRED_REAL - projectedYes, " votos para la mayor\u00EDa"] }))] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "font-mono text-xs text-smoke-500", children: "Acciones disponibles:" }), Array.from({ length: 3 }).map((_, i) => (_jsx("div", { className: `w-3 h-3 rounded-full border ${i < actionPoints ? 'bg-gold-400 border-gold-300' : 'bg-navy-700 border-navy-600'}` }, i))), _jsxs("span", { className: "font-mono text-xs text-smoke-500 ml-1", children: ["(", actionPoints, " restantes)"] })] }), _jsx("div", { className: "space-y-2", children: NEG_ACTIONS.map(action => {
                    const used = actionsUsed.includes(action.id);
                    const canUse = !used && (action.isDecree || actionPoints > 0);
                    const isHovered = hoveredAction === action.id;
                    return (_jsx(motion.button, { onClick: () => handleAction(action), onMouseEnter: () => setHoveredAction(action.id), onMouseLeave: () => setHoveredAction(null), disabled: !canUse, className: `w-full text-left px-4 py-3 rounded-lg border transition-all duration-150 ${used
                            ? 'border-navy-700 bg-navy-800/40 opacity-40 cursor-not-allowed'
                            : action.isDecree
                                ? 'border-crimson-700 bg-crimson-900/30 hover:bg-crimson-900/50 cursor-pointer'
                                : 'border-navy-600 bg-navy-800 hover:border-gold-500 hover:bg-navy-700 cursor-pointer'} ${!canUse && !used ? 'opacity-50 cursor-not-allowed' : ''}`, whileHover: canUse ? { x: 2 } : {}, children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("span", { className: "text-lg shrink-0 mt-0.5", children: action.icon }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center justify-between gap-2", children: [_jsx("span", { className: `font-mono font-bold text-sm ${used ? 'line-through text-smoke-600' : action.isDecree ? 'text-crimson-300' : 'text-smoke-200'}`, children: action.label }), !action.isDecree && !used && (_jsxs("span", { className: "font-mono text-xs text-emerald-400 shrink-0", children: ["+", action.voteRange[0], "\u2013", action.voteRange[1], " votos"] })), used && _jsx("span", { className: "font-mono text-xs text-smoke-600", children: "Utilizada" })] }), _jsx(AnimatePresence, { children: isHovered && !used && (_jsxs(motion.div, { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: 'auto' }, exit: { opacity: 0, height: 0 }, className: "overflow-hidden", children: [_jsx("p", { className: "text-smoke-400 text-xs mt-1", children: action.preview }), _jsxs("p", { className: "text-crimson-400 font-mono text-xs mt-0.5", children: ["Costo: ", action.costLabel] })] })) })] })] }) }, action.id));
                }) }), _jsx("button", { onClick: startVoting, className: "w-full bg-gold-500 hover:bg-gold-400 text-navy-900 font-serif font-bold py-3 px-6 rounded-md transition-colors uppercase tracking-wider", children: "\uD83C\uDFDB Llamar a votar \u2192" })] }, "negotiation"));
    // ── Render: Hemiciclo + voting ─────────────────────────────────────────────
    const renderVoting = () => (_jsxs(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, className: "space-y-3", children: [_jsxs("div", { className: "text-center", children: [_jsx("p", { className: "font-mono text-xs text-smoke-500 uppercase tracking-widest", children: t(card.titleKey) }), _jsx("p", { className: "font-mono text-sm text-smoke-400 mt-1", children: "Hemiciclo en vivo" })] }), _jsx("div", { className: "w-full overflow-hidden rounded-lg bg-navy-900 border border-navy-700", children: _jsxs("svg", { viewBox: "0 0 600 345", className: "w-full h-auto", style: { display: 'block', maxHeight: '340px' }, children: [ROW_RADII.map(r => (_jsx("path", { d: `M ${CX - r} ${CY} A ${r} ${r} 0 0 1 ${CX + r} ${CY}`, fill: "none", stroke: "#1e293b", strokeWidth: "0.5" }, r))), seats.map(seat => {
                            const vote = seatVotes[seat.index] ?? 'pending';
                            const color = seatColor(seat, vote);
                            const isPending = vote === 'pending';
                            return (_jsx("circle", { cx: seat.x, cy: seat.y, r: 5, fill: color, opacity: isPending ? 0.5 : 1, style: { transition: 'fill 0.15s ease, opacity 0.15s ease' } }, seat.index));
                        }), _jsxs("text", { x: CX, y: CY + 16, textAnchor: "middle", fill: "#64748b", fontSize: "10", fontFamily: "monospace", children: [REQUIRED_REAL, " votos para mayor\u00EDa"] }), _jsxs("g", { transform: "translate(510,285)", children: [_jsx("rect", { x: "2", y: "8", width: "12", height: "14", fill: "#8B4513" }), _jsx("rect", { x: "4", y: "2", width: "8", height: "8", fill: "#F5C8A0" }), _jsx("rect", { x: "2", y: "0", width: "12", height: "4", fill: "#4A3728" }), _jsx("rect", { x: "-4", y: "16", width: "20", height: "6", fill: "#888" }), _jsx("rect", { x: "6", y: "22", width: "4", height: "4", fill: "#555" }), _jsx("rect", { x: "0", y: "14", width: "6", height: "3", fill: "#CC6633" }), _jsx("rect", { x: "7", y: "14", width: "6", height: "3", fill: "#CC5522" })] })] }) }), _jsxs("div", { className: "px-2", children: [_jsxs("div", { className: "flex justify-between font-mono text-xs text-smoke-400 mb-1", children: [_jsxs("span", { className: "text-crimson-400", children: ["NO: ", liveRealNo] }), _jsxs("span", { className: "text-smoke-500", children: ["\u2014 ", REQUIRED_REAL, " necesarios \u2014"] }), _jsxs("span", { className: "text-emerald-400", children: ["S\u00CD: ", liveRealYes] })] }), _jsxs("div", { className: "relative h-4 bg-navy-800 border border-navy-600 rounded-full overflow-hidden", style: { width: '100%' }, children: [_jsx("div", { className: "absolute left-0 top-0 h-full bg-crimson-600 transition-all duration-100", style: { width: `${noBarPct * 100}%` } }), _jsx("div", { className: "absolute right-0 top-0 h-full bg-emerald-600 transition-all duration-100", style: { width: `${yesBarPct * 100}%` } }), _jsx("div", { className: "absolute top-0 bottom-0 w-0.5 bg-gold-400 z-10", style: { left: `${markerPct * 100}%` } })] }), _jsxs("div", { className: "flex justify-between font-mono text-xs text-smoke-600 mt-1", children: [_jsx("span", { children: "Oposici\u00F3n" }), _jsx("span", { className: "text-gold-500", children: "\u2190 mayor\u00EDa \u2192" }), _jsx("span", { children: "Oficialismo" })] })] }), _jsx("div", { className: "flex flex-wrap gap-3 justify-center font-mono text-xs text-smoke-500", children: [['#9C27B0', 'Oficialismo'], ['#1565C0', 'UxP'], ['#FFD600', 'PRO'], ['#78909C', 'Independientes'], ['#43A047', 'SÍ'], ['#E53935', 'NO'], ['#FFA726', 'Abstención']].map(([color, label]) => (_jsxs("span", { className: "flex items-center gap-1", children: [_jsx("span", { className: "inline-block w-3 h-3 rounded-full", style: { background: color } }), label] }, label))) })] }, "voting"));
    // ── Render: Swing senator ──────────────────────────────────────────────────
    const renderSwing = () => {
        const sen = swingSens[swingIdx];
        if (!sen)
            return null;
        return (_jsxs(motion.div, { initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.9 }, className: "space-y-4", children: [_jsx("div", { className: "w-full overflow-hidden rounded-lg bg-navy-900 border border-navy-700", children: _jsx("svg", { viewBox: "0 0 600 345", className: "w-full h-auto", style: { display: 'block', maxHeight: '200px' }, children: seats.map(seat => {
                            const vote = seatVotes[seat.index] ?? 'pending';
                            const color = seatColor(seat, vote);
                            const isPending = vote === 'pending';
                            return (_jsx("circle", { cx: seat.x, cy: seat.y, r: 5, fill: color, opacity: isPending ? 0.4 : 1 }, seat.index));
                        }) }) }), _jsxs("div", { className: "text-center font-mono text-sm", children: [_jsxs("span", { className: "text-emerald-400", children: [finalYesReal + swingExtraYes, " S\u00CD"] }), _jsx("span", { className: "text-smoke-600 mx-2", children: "\u2014" }), _jsxs("span", { className: "text-crimson-400", children: [TOTAL_REAL - finalYesReal - swingExtraYes + swingExtraNo, " NO"] }), _jsxs("span", { className: "text-smoke-500 ml-3 text-xs", children: ["(", REQUIRED_REAL, " para mayor\u00EDa)"] })] }), _jsxs("div", { className: "bg-navy-800 border-2 border-gold-600 rounded-xl p-4 space-y-3", children: [_jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "w-12 h-12 rounded-full bg-navy-700 border border-navy-500 flex items-center justify-center text-xl shrink-0", children: "\uD83C\uDFDB" }), _jsxs("div", { children: [_jsx("p", { className: "font-serif font-bold text-smoke-100", children: sen.name }), _jsxs("p", { className: "font-mono text-xs text-smoke-500", children: [sen.bloc, " \u00B7 ", sen.province] })] }), _jsxs("div", { className: "ml-auto bg-gold-900/40 border border-gold-700 rounded px-2 py-1", children: [_jsx("p", { className: "font-mono text-xs text-gold-400", children: "\u26A1 VOTO SORPRESA" }), _jsxs("p", { className: "font-mono text-xs text-smoke-500", children: [swingIdx + 1, "/", swingSens.length] })] })] }), _jsx("p", { className: "text-smoke-300 text-sm italic border-l-2 border-gold-700 pl-3", children: sen.demand }), _jsxs("div", { className: "space-y-2", children: [_jsxs("button", { onClick: () => handleSwingChoice('accept'), className: "w-full bg-emerald-800/60 hover:bg-emerald-700/60 border border-emerald-600 text-emerald-200 font-mono text-sm py-2 px-4 rounded-lg text-left flex items-center justify-between transition-colors", children: [_jsx("span", { children: "\u2705 Acepto la demanda" }), _jsxs("span", { className: "text-xs text-emerald-400", children: [sen.costLabel, " \u00B7 +1 voto"] })] }), _jsxs("button", { onClick: () => handleSwingChoice('refuse'), className: "w-full bg-crimson-900/40 hover:bg-crimson-800/40 border border-crimson-700 text-crimson-200 font-mono text-sm py-2 px-4 rounded-lg text-left flex items-center justify-between transition-colors", children: [_jsx("span", { children: "\u274C Me niego" }), _jsx("span", { className: "text-xs text-crimson-400", children: "\u22121 voto" })] }), _jsxs("button", { onClick: () => handleSwingChoice('decide'), className: "w-full bg-navy-700 hover:bg-navy-600 border border-navy-500 text-smoke-300 font-mono text-sm py-2 px-4 rounded-lg text-left flex items-center justify-between transition-colors", children: [_jsx("span", { children: "\uD83C\uDFB2 Dejarlo decidir solo" }), _jsx("span", { className: "text-xs text-smoke-500", children: "50/50" })] })] })] })] }, `swing-${swingIdx}`));
    };
    // ── Render: Result ────────────────────────────────────────────────────────
    const renderResult = () => {
        const anibalQuotes = {
            pass: `Zafaron por ${margin} votos. La próxima no van a tener tanta suerte.`,
            fail: `El gobierno perdió en el Congreso. ¿Alguien avisó al Presidente?`,
            decree: `Gobernar por decreto. Clásico argentino. Alguien dígale que esto tiene consecuencias.`,
        };
        const mode = usedDecree ? 'decree' : lawPassed ? 'pass' : 'fail';
        return (_jsxs(motion.div, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, className: "space-y-4", children: [_jsxs("div", { className: `rounded-xl border-2 p-6 text-center ${usedDecree
                        ? 'border-orange-600 bg-orange-900/30'
                        : lawPassed
                            ? 'border-emerald-600 bg-emerald-900/20'
                            : 'border-crimson-600 bg-crimson-900/20'}`, children: [_jsx("p", { className: "text-4xl mb-3", children: usedDecree ? '📋' : lawPassed ? '✅' : '❌' }), _jsx("h2", { className: `font-serif text-2xl font-black mb-2 ${usedDecree ? 'text-orange-300' : lawPassed ? 'text-emerald-300' : 'text-crimson-300'}`, children: usedDecree
                                ? 'DECRETO DE NECESIDAD Y URGENCIA'
                                : lawPassed
                                    ? 'LEY APROBADA'
                                    : 'LEY RECHAZADA' }), _jsx("p", { className: "font-serif text-lg text-smoke-100 mb-1", children: t(card.titleKey) }), !usedDecree && (_jsxs("p", { className: "font-mono text-sm text-smoke-400", children: [finalYes, " votos a favor \u2014 ", TOTAL_REAL - finalYes, " en contra", lawPassed
                                    ? ` — aprobada por ${margin} votos`
                                    : ` — faltaron ${margin} para la mayoría`] })), usedDecree && (_jsx("p", { className: "font-mono text-sm text-orange-400", children: "Promulgada sin votaci\u00F3n parlamentaria" }))] }), _jsxs("div", { className: "bg-navy-800 border border-navy-600 rounded-lg px-4 py-3", children: [_jsx("p", { className: "font-mono text-sm text-smoke-500 uppercase tracking-widest mb-2", children: "Consecuencias inmediatas" }), _jsx("div", { className: "font-mono text-sm text-smoke-300", children: (() => {
                                const choice = card.choices[resultChoiceIdx];
                                if (!choice)
                                    return null;
                                const e = choice.effects;
                                return (_jsxs("div", { className: "space-y-1", children: [e.popularityDelta !== undefined && _jsxs("p", { children: [e.popularityDelta >= 0 ? '▲' : '▼', " Popularidad ", e.popularityDelta > 0 ? '+' : '', e.popularityDelta] }), e.stabilityDelta !== undefined && _jsxs("p", { children: [e.stabilityDelta >= 0 ? '▲' : '▼', " Estabilidad ", e.stabilityDelta > 0 ? '+' : '', e.stabilityDelta] }), e.marketConfidenceDelta !== undefined && _jsxs("p", { children: [e.marketConfidenceDelta >= 0 ? '▲' : '▼', " Mercados ", e.marketConfidenceDelta > 0 ? '+' : '', e.marketConfidenceDelta] }), e.deficitDelta !== undefined && _jsxs("p", { children: [e.deficitDelta <= 0 ? '▲' : '▼', " D\u00E9ficit ", e.deficitDelta > 0 ? '+' : '', e.deficitDelta, "%"] }), e.lawsPassedDelta !== undefined && e.lawsPassedDelta > 0 && _jsx("p", { children: "\u2713 Ley promulgada" })] }));
                            })() })] }), _jsxs("div", { className: "bg-navy-800/60 border border-navy-700 rounded px-4 py-3 flex items-start gap-2", children: [_jsx("span", { className: "text-gold-500 font-mono text-xs shrink-0 mt-0.5", children: "\uD83D\uDCFB" }), _jsxs("p", { className: "text-smoke-400 font-mono text-xs italic", children: ["\"", anibalQuotes[mode], "\" \u2014 ", _jsx("span", { className: "text-smoke-500", children: "El Gordo An\u00EDbal, Radio AM 1010" })] })] }), _jsx("button", { onClick: () => onComplete(resultChoiceIdx, negEffects), className: `w-full font-serif font-bold py-3 px-6 rounded-md uppercase tracking-wider transition-colors ${lawPassed || usedDecree
                        ? 'bg-gold-500 hover:bg-gold-400 text-navy-900'
                        : 'bg-navy-700 hover:bg-navy-600 border border-navy-500 text-smoke-200'}`, children: "Continuar con el gobierno \u2192" })] }, "result"));
    };
    // ── Main render ────────────────────────────────────────────────────────────
    return (_jsxs("div", { className: "event-card border-l-4 border-l-[#1a237e]", children: [_jsxs("div", { className: `flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest mb-3 text-blue-400`, children: [_jsx("span", { className: "text-base", children: "\uD83C\uDFDB" }), _jsx("span", { children: "SESI\u00D3N PARLAMENTARIA" })] }), _jsxs(AnimatePresence, { mode: "wait", children: [phase === 'negotiation' && renderNegotiation(), phase === 'voting' && renderVoting(), phase === 'swing' && renderSwing(), phase === 'result' && renderResult()] })] }));
}
//# sourceMappingURL=CongressSession.js.map