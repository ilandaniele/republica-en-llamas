import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth.js';
import { supabase, isOfflineMode } from '../lib/supabase.js';
import { useGameStore } from '../stores/gameStore.js';
function generateAvatarColor(username) {
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
        hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 60%, 40%)`;
}
export default function ProfileScreen() {
    const navigate = useNavigate();
    const { user, signOut, updateUsername } = useAuth();
    const personalBest = useGameStore((s) => s.personalBest);
    const setUserId = useGameStore((s) => s.setUserId);
    const [recentRuns, setRecentRuns] = useState([]);
    const [loadingRuns, setLoadingRuns] = useState(false);
    const [editingUsername, setEditingUsername] = useState(false);
    const [newUsername, setNewUsername] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [profile, setProfile] = useState(null);
    useEffect(() => {
        if (!user || isOfflineMode)
            return;
        setNewUsername(user.user_metadata?.['username'] ?? '');
        void (async () => {
            const { data: profileData } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .maybeSingle();
            if (profileData)
                setProfile(profileData);
            setLoadingRuns(true);
            const { data: runsData } = await supabase
                .from('game_runs')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(10);
            if (runsData)
                setRecentRuns(runsData);
            setLoadingRuns(false);
        })();
    }, [user]);
    const handleUpdateUsername = async () => {
        if (!newUsername.trim() || newUsername.length < 3) {
            setUsernameError('Al menos 3 caracteres');
            return;
        }
        const result = await updateUsername(newUsername);
        if (result && 'error' in result && result.error) {
            setUsernameError(result.error.message);
        }
        else {
            setEditingUsername(false);
            setUsernameError('');
        }
    };
    const handleLogout = async () => {
        await signOut();
        setUserId(null);
        navigate('/');
    };
    if (!user) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center p-6", children: _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-smoke-400 font-mono mb-4", children: "No hay sesi\u00F3n activa." }), _jsx("button", { onClick: () => navigate('/'), className: "text-gold-400 font-mono text-sm underline", children: "Volver al inicio" })] }) }));
    }
    const displayName = profile?.username ?? user.user_metadata?.['username'] ?? user.email ?? '?';
    const avatarInitials = displayName.slice(0, 2).toUpperCase();
    const avatarColor = generateAvatarColor(displayName);
    const totalRuns = recentRuns.length;
    const bestScore = recentRuns.reduce((max, r) => Math.max(max, r.score), 0);
    const presidentCounts = {};
    // Note: we don't store president_id in game_runs currently, so skip for now
    return (_jsxs(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, className: "min-h-screen p-6", children: [_jsxs("div", { className: "max-w-2xl mx-auto", children: [_jsx("button", { onClick: () => navigate(-1), className: "text-smoke-500 font-mono text-xs mb-6 hover:text-smoke-300 flex items-center gap-1", children: "\u2190 Volver" }), _jsxs("div", { className: "bg-navy-800 border border-navy-600 rounded-xl p-6 mb-6 flex items-center gap-6", children: [_jsx("div", { className: "w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white shrink-0", style: { backgroundColor: avatarColor }, children: avatarInitials }), _jsxs("div", { className: "flex-1", children: [editingUsername ? (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("input", { type: "text", value: newUsername, onChange: (e) => setNewUsername(e.target.value), className: "bg-navy-900 border border-navy-500 text-smoke-100 font-mono text-sm px-3 py-1 rounded focus:outline-none focus:border-gold-500", autoFocus: true }), _jsx("button", { onClick: () => { void handleUpdateUsername(); }, className: "text-gold-400 font-mono text-xs hover:text-gold-300", children: "Guardar" }), _jsx("button", { onClick: () => setEditingUsername(false), className: "text-smoke-500 font-mono text-xs hover:text-smoke-300", children: "Cancelar" })] })) : (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("h2", { className: "font-serif text-xl text-smoke-100 font-bold", children: displayName }), _jsx("button", { onClick: () => setEditingUsername(true), className: "text-smoke-600 hover:text-smoke-400 font-mono text-xs", children: "\u270E" })] })), usernameError && _jsx("p", { className: "text-crimson-400 font-mono text-xs mt-1", children: usernameError }), _jsx("p", { className: "text-smoke-500 font-mono text-xs mt-1", children: user.email })] }), _jsx("button", { onClick: () => setShowLogoutModal(true), className: "bg-navy-700 hover:bg-navy-600 border border-navy-500 text-smoke-400 font-mono text-xs px-4 py-2 rounded transition-colors shrink-0", children: "Cerrar sesi\u00F3n" })] }), _jsx("div", { className: "grid grid-cols-3 gap-4 mb-6", children: [
                            { label: 'Partidas', value: totalRuns.toString() },
                            { label: 'Mejor Score', value: (personalBest?.score ?? bestScore).toLocaleString() },
                            { label: 'Mejor Turno', value: personalBest ? `T${personalBest.turns}` : '—' },
                        ].map((stat) => (_jsxs("div", { className: "bg-navy-800 border border-navy-600 rounded-lg p-4 text-center", children: [_jsx("p", { className: "text-smoke-500 font-mono text-xs uppercase tracking-widest", children: stat.label }), _jsx("p", { className: "font-serif text-2xl text-gold-400 font-bold mt-1", children: stat.value })] }, stat.label))) }), _jsxs("div", { className: "bg-navy-800 border border-navy-600 rounded-xl p-4", children: [_jsx("h3", { className: "font-serif text-gold-400 text-sm uppercase tracking-widest mb-4", children: "\u00DAltimas Partidas" }), loadingRuns ? (_jsx("p", { className: "text-smoke-500 font-mono text-xs animate-pulse", children: "Cargando historial..." })) : recentRuns.length === 0 ? (_jsx("p", { className: "text-smoke-500 font-mono text-xs", children: "Sin partidas registradas a\u00FAn." })) : (_jsx("div", { className: "space-y-2", children: recentRuns.map((run) => (_jsxs("div", { className: "flex items-center justify-between bg-navy-900/60 rounded px-3 py-2", children: [_jsxs("div", { children: [_jsx("span", { className: `font-mono text-xs font-bold ${run.is_win ? 'text-emerald-400' : 'text-crimson-400'}`, children: run.is_win ? '✓' : '✗' }), _jsx("span", { className: "text-smoke-400 font-mono text-xs ml-2 capitalize", children: run.difficulty }), _jsxs("span", { className: "text-smoke-600 font-mono text-xs ml-2", children: ["T", run.turns_survived] })] }), _jsx("span", { className: "text-gold-400 font-mono text-xs font-bold", children: run.score.toLocaleString() })] }, run.id))) }))] })] }), _jsx(AnimatePresence, { children: showLogoutModal && (_jsx(motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, className: "fixed inset-0 bg-navy-900/90 z-50 flex items-center justify-center p-6", children: _jsxs(motion.div, { initial: { scale: 0.9, opacity: 0 }, animate: { scale: 1, opacity: 1 }, exit: { scale: 0.9, opacity: 0 }, className: "bg-navy-800 border border-navy-600 rounded-xl p-6 max-w-sm w-full", children: [_jsx("h3", { className: "font-serif text-xl text-smoke-100 font-bold mb-3", children: "\u00BFCerrar sesi\u00F3n?" }), _jsx("p", { className: "text-smoke-400 font-mono text-xs mb-6", children: "Tu progreso guardado se mantendr\u00E1 en el servidor. Pod\u00E9s volver cuando quieras." }), _jsxs("div", { className: "flex gap-3", children: [_jsx("button", { onClick: () => { void handleLogout(); }, className: "flex-1 bg-crimson-600 hover:bg-crimson-500 text-smoke-100 font-serif font-bold py-2 px-4 rounded-lg transition-colors", children: "Cerrar sesi\u00F3n" }), _jsx("button", { onClick: () => setShowLogoutModal(false), className: "flex-1 bg-navy-700 hover:bg-navy-600 border border-navy-500 text-smoke-300 font-mono py-2 px-4 rounded-lg transition-colors", children: "Cancelar" })] })] }) })) })] }));
}
//# sourceMappingURL=ProfileScreen.js.map