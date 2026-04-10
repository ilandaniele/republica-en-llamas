import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth.js';
import { useRunHistory } from '../hooks/useRunHistory.js';
import { getCard } from '@republica/game-engine';
export default function HistoryScreen() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { data: runs, isLoading } = useRunHistory(user?.id);
    const [expandedRunId, setExpandedRunId] = useState(null);
    if (!user) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-smoke-400 font-mono mb-4", children: "Inicia sesi\u00F3n para ver tu historial" }), _jsx("button", { onClick: () => navigate('/'), className: "text-gold-400 font-mono hover:underline", children: "\u2190 Volver al inicio" })] }) }));
    }
    return (_jsx("div", { className: "min-h-screen p-6 max-w-3xl mx-auto", children: _jsxs(motion.div, { initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, children: [_jsxs("div", { className: "flex items-center justify-between mb-8", children: [_jsxs("div", { children: [_jsx("h1", { className: "font-serif text-3xl font-bold text-gold-400", children: "Historial de Partidas" }), _jsx("p", { className: "text-smoke-500 font-mono text-sm mt-1", children: "Tus \u00FAltimas 20 partidas" })] }), _jsx("button", { onClick: () => navigate('/'), className: "text-smoke-400 hover:text-smoke-200 font-mono text-sm", children: "\u2190 Volver" })] }), isLoading && (_jsx("div", { className: "text-smoke-400 font-mono text-center animate-pulse py-12", children: "Cargando historial..." })), runs && runs.length === 0 && (_jsx("div", { className: "text-smoke-500 font-mono text-center py-12", children: "No tienes partidas registradas a\u00FAn." })), _jsx("div", { className: "space-y-3", children: (runs ?? []).map((run) => {
                        const isExpanded = expandedRunId === run.id;
                        const isWin = run.is_win;
                        return (_jsxs("div", { className: "bg-navy-800 border border-navy-600 rounded-lg overflow-hidden", children: [_jsxs("button", { onClick: () => setExpandedRunId(isExpanded ? null : run.id), className: "w-full p-4 flex items-center justify-between hover:bg-navy-700 transition-colors", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("span", { className: `text-xl ${isWin ? '' : 'grayscale'}`, children: isWin ? '👑' : '💀' }), _jsxs("div", { className: "text-left", children: [_jsxs("p", { className: "font-serif font-bold text-smoke-100", children: [run.difficulty, " \u2014 Turno ", run.turns_survived, "/50"] }), _jsxs("p", { className: "text-smoke-500 font-mono text-xs", children: [new Date(run.created_at).toLocaleDateString('es'), ' · ', run.game_over_reason ?? 'En curso'] })] })] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("span", { className: "font-mono font-bold text-gold-400 text-lg", children: run.score.toLocaleString() }), _jsx("span", { className: "text-smoke-500 text-sm", children: isExpanded ? '▲' : '▼' })] })] }), _jsx(AnimatePresence, { children: isExpanded && (_jsx(motion.div, { initial: { height: 0, opacity: 0 }, animate: { height: 'auto', opacity: 1 }, exit: { height: 0, opacity: 0 }, className: "border-t border-navy-700 overflow-hidden", children: _jsxs("div", { className: "p-4 space-y-2", children: [_jsx("p", { className: "text-smoke-400 font-mono text-xs uppercase tracking-wider mb-3", children: "Decisiones clave" }), (run.run_events ?? []).slice(0, 10).map((ev) => {
                                                    const event = ev;
                                                    let card;
                                                    try {
                                                        card = getCard(event.card_id);
                                                    }
                                                    catch {
                                                        return null;
                                                    }
                                                    return (_jsxs("div", { className: "flex gap-3 text-sm", children: [_jsxs("span", { className: "font-mono text-smoke-600 w-12", children: ["T", event.turn_number] }), _jsxs("span", { className: "text-smoke-400 truncate", children: [event.card_id, " \u2192 Opci\u00F3n ", String.fromCharCode(65 + event.choice_index)] })] }, `${event.turn_number}`));
                                                })] }) })) })] }, run.id));
                    }) })] }) }));
}
//# sourceMappingURL=HistoryScreen.js.map