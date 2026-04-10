import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { useGameStore } from '../stores/gameStore.js';
export function UserMenu() {
    const navigate = useNavigate();
    const { user, signOut } = useAuth();
    const setUserId = useGameStore((s) => s.setUserId);
    const personalBest = useGameStore((s) => s.personalBest);
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    if (!user) {
        return (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("button", { onClick: () => navigate('/login'), className: "bg-navy-700 hover:bg-navy-600 border border-navy-500 text-smoke-300 font-mono text-sm px-3 py-1.5 rounded transition-colors", children: "Iniciar sesi\u00F3n" }), _jsx("button", { onClick: () => navigate('/register'), className: "bg-gold-600 hover:bg-gold-500 text-navy-900 font-mono text-sm px-3 py-1.5 rounded font-bold transition-colors", children: "Crear cuenta" })] }));
    }
    const displayName = user.user_metadata?.['username'] ?? user.email?.split('@')[0] ?? '?';
    return (_jsxs("div", { className: "relative", ref: ref, children: [_jsxs("button", { onClick: () => setOpen((v) => !v), className: "flex items-center gap-2 bg-navy-800 hover:bg-navy-700 border border-navy-600 text-smoke-300 font-mono text-xs px-3 py-1.5 rounded-lg transition-colors", children: [personalBest && (_jsxs("span", { className: "text-gold-400", children: ["\uD83C\uDFC6 ", personalBest.score.toLocaleString()] })), _jsxs("span", { children: ["\uD83D\uDC64 ", displayName] }), _jsx("span", { className: "text-smoke-600", children: open ? '▴' : '▾' })] }), open && (_jsxs("div", { className: "absolute right-0 top-full mt-1 bg-navy-800 border border-navy-600 rounded-lg shadow-xl z-50 min-w-[160px] py-1", children: [_jsx("button", { onClick: () => { setOpen(false); navigate('/profile'); }, className: "w-full text-left px-4 py-2 text-smoke-300 font-mono text-xs hover:bg-navy-700 transition-colors", children: "\uD83D\uDC64 Mi Perfil" }), _jsx("button", { onClick: () => { setOpen(false); navigate('/history'); }, className: "w-full text-left px-4 py-2 text-smoke-300 font-mono text-xs hover:bg-navy-700 transition-colors", children: "\uD83D\uDCCB Mis Partidas" }), _jsx("div", { className: "border-t border-navy-600 my-1" }), _jsx("button", { onClick: () => {
                            setOpen(false);
                            void signOut().then(() => setUserId(null));
                        }, className: "w-full text-left px-4 py-2 text-crimson-400 font-mono text-xs hover:bg-navy-700 transition-colors", children: "Cerrar sesi\u00F3n" })] }))] }));
}
//# sourceMappingURL=UserMenu.js.map