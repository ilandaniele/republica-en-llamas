import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLeaderboard } from '../hooks/useLeaderboard.js';
import { useAuth } from '../hooks/useAuth.js';
const DIFFICULTY_FILTERS = [
    { id: '', label: 'Todos' },
    { id: 'easy', label: 'Fácil' },
    { id: 'normal', label: 'Normal' },
    { id: 'hard', label: 'Difícil' },
    { id: 'crisis', label: 'Crisis' },
];
export default function LeaderboardScreen() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [difficultyFilter, setDifficultyFilter] = useState('');
    const { data: entries, isLoading, error } = useLeaderboard(difficultyFilter || undefined);
    return (_jsx("div", { className: "min-h-screen p-6 max-w-3xl mx-auto", children: _jsxs(motion.div, { initial: { opacity: 0, y: -20 }, animate: { opacity: 1, y: 0 }, children: [_jsxs("div", { className: "flex items-center justify-between mb-8", children: [_jsxs("div", { children: [_jsx("h1", { className: "font-serif text-3xl font-bold text-gold-400", children: "Tabla de L\u00EDderes" }), _jsx("p", { className: "text-smoke-500 font-mono text-sm mt-1", children: "Los mejores presidentes de la historia" })] }), _jsx("button", { onClick: () => navigate('/'), className: "text-smoke-400 hover:text-smoke-200 font-mono text-sm", children: "\u2190 Volver" })] }), _jsx("div", { className: "flex gap-2 mb-6 flex-wrap", children: DIFFICULTY_FILTERS.map((f) => (_jsx("button", { onClick: () => setDifficultyFilter(f.id), className: `px-4 py-2 rounded-lg font-mono text-sm transition-colors ${difficultyFilter === f.id
                            ? 'bg-gold-500 text-navy-900 font-bold'
                            : 'bg-navy-800 border border-navy-600 text-smoke-400 hover:border-gold-600'}`, children: f.label }, f.id))) }), isLoading && (_jsx("div", { className: "text-center text-smoke-400 font-mono animate-pulse py-12", children: "Cargando tabla..." })), error && (_jsx("div", { className: "text-crimson-400 font-mono text-sm text-center py-12", children: "Error al cargar. \u00BFConfiguraste las credenciales de Supabase?" })), entries && entries.length === 0 && (_jsx("div", { className: "text-smoke-500 font-mono text-center py-12", children: "A\u00FAn no hay puntajes registrados. \u00A1S\u00E9 el primero!" })), entries && entries.length > 0 && (_jsx("div", { className: "space-y-2", children: entries.map((entry, index) => {
                        const isCurrentUser = user?.id === entry.user_id;
                        return (_jsxs(motion.div, { initial: { opacity: 0, x: -20 }, animate: { opacity: 1, x: 0 }, transition: { delay: index * 0.03 }, className: `flex items-center gap-4 p-4 rounded-lg border transition-colors ${isCurrentUser
                                ? 'bg-navy-700 border-gold-500'
                                : 'bg-navy-800 border-navy-700'}`, children: [_jsx("div", { className: `font-mono font-bold text-lg w-8 text-center ${index === 0 ? 'text-gold-400' :
                                        index === 1 ? 'text-smoke-400' :
                                            index === 2 ? 'text-yellow-700' :
                                                'text-smoke-600'}`, children: index + 1 }), _jsxs("div", { className: "flex-1", children: [_jsx("span", { className: `font-serif font-bold ${isCurrentUser ? 'text-gold-300' : 'text-smoke-100'}`, children: entry.username }), isCurrentUser && (_jsx("span", { className: "ml-2 text-xs bg-gold-600 text-navy-900 px-2 py-0.5 rounded font-mono", children: "T\u00FA" }))] }), _jsx("span", { className: "font-mono text-xs text-smoke-500 w-16", children: entry.difficulty }), _jsx("span", { className: `text-lg ${entry.is_win ? 'opacity-100' : 'opacity-20'}`, children: "\uD83D\uDC51" }), _jsx("div", { className: "font-mono font-bold text-gold-400 w-24 text-right", children: entry.score.toLocaleString() })] }, entry.id));
                    }) }))] }) }));
}
//# sourceMappingURL=LeaderboardScreen.js.map