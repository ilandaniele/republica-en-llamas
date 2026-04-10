import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth.js';
import { checkUsernameAvailable, isOfflineMode, missingEnvVars, signInWithGoogle, supabase, translateAuthError } from '../lib/supabase.js';
import { useGameStore } from '../stores/gameStore.js';
export default function RegisterScreen() {
    const navigate = useNavigate();
    const location = useLocation();
    const difficulty = location.state?.difficulty ?? 'normal';
    const { signUp } = useAuth();
    const startNewGame = useGameStore((s) => s.startNewGame);
    const setUserId = useGameStore((s) => s.setUserId);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [usernameAvailable, setUsernameAvailable] = useState(null);
    const [checkingUsername, setCheckingUsername] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [confirmationSent, setConfirmationSent] = useState(false);
    const debounceRef = useRef(null);
    useEffect(() => {
        if (username.length < 3) {
            setUsernameAvailable(null);
            return;
        }
        if (debounceRef.current)
            clearTimeout(debounceRef.current);
        setCheckingUsername(true);
        debounceRef.current = setTimeout(async () => {
            const available = await checkUsernameAvailable(username);
            setUsernameAvailable(available);
            setCheckingUsername(false);
        }, 400);
        return () => { if (debounceRef.current)
            clearTimeout(debounceRef.current); };
    }, [username]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!username.trim()) {
            setError('El nombre de usuario es requerido');
            return;
        }
        if (username.length < 3) {
            setError('El usuario debe tener al menos 3 caracteres');
            return;
        }
        if (usernameAvailable === false) {
            setError('Ese nombre de usuario ya está ocupado');
            return;
        }
        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }
        setLoading(true);
        try {
            const { data, error: err } = await signUp(email, password, username);
            if (err) {
                setError(translateAuthError(err.message));
                return;
            }
            // Insert profile record with username
            if (data.user) {
                setUserId(data.user.id);
                await supabase.from('profiles').upsert({
                    id: data.user.id,
                    username: username.trim(),
                    country: 'AR',
                });
            }
            // If session exists immediately: email confirmation is disabled → go to game
            if (data.session) {
                startNewGame(difficulty);
                navigate('/president');
            }
            else {
                // Email confirmation required
                setConfirmationSent(true);
            }
        }
        catch {
            setError('Error inesperado. Intentá de nuevo.');
        }
        finally {
            setLoading(false);
        }
    };
    if (isOfflineMode) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center p-6", children: _jsxs("div", { className: "max-w-md w-full bg-navy-800 border border-navy-600 rounded-xl p-8 text-center", children: [_jsx("p", { className: "text-crimson-400 font-serif text-xl font-bold mb-3", children: "\u26A0 Sin conexi\u00F3n a Supabase" }), _jsxs("p", { className: "text-smoke-400 font-mono text-xs mb-4", children: ["Faltan variables de entorno en ", _jsx("code", { className: "text-gold-400", children: ".env" }), ":"] }), missingEnvVars.url && _jsx("p", { className: "text-smoke-300 font-mono text-xs mb-1", children: "\u2022 VITE_SUPABASE_URL" }), missingEnvVars.key && _jsx("p", { className: "text-smoke-300 font-mono text-xs mb-1", children: "\u2022 VITE_SUPABASE_ANON_KEY" }), _jsx("button", { onClick: () => navigate('/'), className: "mt-6 text-gold-400 font-mono text-sm underline", children: "Jugar en modo offline \u2192" })] }) }));
    }
    if (confirmationSent) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center p-6", children: _jsxs("div", { className: "max-w-md w-full text-center", children: [_jsx("div", { className: "text-5xl mb-4", children: "\uD83D\uDCEC" }), _jsx("h2", { className: "font-serif text-2xl text-smoke-100 font-bold mb-3", children: "Revis\u00E1 tu email" }), _jsxs("p", { className: "text-smoke-400 font-mono text-sm mb-6", children: ["Te enviamos un link de confirmaci\u00F3n a ", _jsx("strong", { className: "text-gold-400", children: email }), ". Confirm\u00E1 tu cuenta y volv\u00E9 a iniciar sesi\u00F3n."] }), _jsx("button", { onClick: () => navigate('/login', { state: { difficulty } }), className: "bg-crimson-600 hover:bg-crimson-500 text-smoke-100 font-serif font-bold py-3 px-6 rounded-lg transition-colors", children: "Ir al login \u2192" })] }) }));
    }
    return (_jsx(motion.div, { initial: { opacity: 0, x: 40 }, animate: { opacity: 1, x: 0 }, className: "min-h-screen flex flex-col items-center justify-center p-6", children: _jsxs("div", { className: "max-w-md w-full", children: [_jsx("button", { onClick: () => navigate(-1), className: "text-smoke-500 font-mono text-xs mb-6 hover:text-smoke-300 flex items-center gap-1", children: "\u2190 Volver" }), _jsx("h1", { className: "font-serif text-3xl text-smoke-100 font-bold mb-2", children: "Crear cuenta" }), _jsx("p", { className: "text-smoke-400 font-mono text-xs mb-6", children: "Tu historial de partidas se guarda autom\u00E1ticamente." }), _jsxs("button", { type: "button", onClick: () => { void signInWithGoogle(); }, className: "w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-800 font-semibold py-3 px-4 rounded-lg border border-gray-300 transition-colors mb-4", children: [_jsxs("svg", { width: "18", height: "18", viewBox: "0 0 48 48", xmlns: "http://www.w3.org/2000/svg", children: [_jsx("path", { fill: "#EA4335", d: "M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" }), _jsx("path", { fill: "#4285F4", d: "M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" }), _jsx("path", { fill: "#FBBC05", d: "M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" }), _jsx("path", { fill: "#34A853", d: "M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.35-8.16 2.35-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" })] }), "Continuar con Google"] }), _jsxs("div", { className: "flex items-center gap-3 mb-4", children: [_jsx("div", { className: "flex-1 h-px bg-navy-600" }), _jsx("span", { className: "text-smoke-600 font-mono text-xs", children: "o registrate con email" }), _jsx("div", { className: "flex-1 h-px bg-navy-600" })] }), _jsxs("form", { onSubmit: (e) => { void handleSubmit(e); }, className: "space-y-4", children: [_jsxs("div", { className: "relative", children: [_jsx("input", { type: "text", placeholder: "Nombre de usuario (m\u00EDn. 3 caracteres)", value: username, onChange: (e) => setUsername(e.target.value), className: "w-full bg-navy-800 border border-navy-600 text-smoke-100 font-mono text-sm px-4 py-3 rounded-lg focus:outline-none focus:border-gold-500 pr-8" }), username.length >= 3 && (_jsx("span", { className: `absolute right-3 top-3.5 text-xs ${checkingUsername ? 'text-smoke-500' : usernameAvailable ? 'text-emerald-400' : 'text-crimson-400'}`, children: checkingUsername ? '...' : usernameAvailable ? '✓' : '✗' }))] }), _jsx("input", { type: "email", placeholder: "Email", value: email, onChange: (e) => setEmail(e.target.value), required: true, className: "w-full bg-navy-800 border border-navy-600 text-smoke-100 font-mono text-sm px-4 py-3 rounded-lg focus:outline-none focus:border-gold-500" }), _jsxs("div", { children: [_jsx("input", { type: "password", placeholder: "Contrase\u00F1a (m\u00EDnimo 6 caracteres)", value: password, onChange: (e) => setPassword(e.target.value), required: true, className: `w-full bg-navy-800 border text-smoke-100 font-mono text-sm px-4 py-3 rounded-lg focus:outline-none ${password.length > 0 && password.length < 6 ? 'border-crimson-600' : 'border-navy-600 focus:border-gold-500'}` }), password.length > 0 && password.length < 6 && (_jsxs("p", { className: "text-crimson-400 font-mono text-xs mt-1", children: ['▓'.repeat(password.length), '░'.repeat(6 - password.length), " ", password.length, "/6"] }))] }), error && (_jsx("div", { className: "bg-crimson-900/40 border border-crimson-700 rounded px-3 py-2", children: _jsx("p", { className: "text-crimson-300 font-mono text-xs", children: error }) })), _jsx("button", { type: "submit", disabled: loading || usernameAvailable === false || username.length < 3, className: "w-full bg-crimson-600 hover:bg-crimson-500 text-smoke-100 font-serif font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 uppercase tracking-wider", children: loading ? 'Creando cuenta...' : 'Registrarse y jugar' })] }), _jsxs("p", { className: "text-smoke-500 font-mono text-xs mt-6 text-center", children: ["\u00BFYa ten\u00E9s cuenta?", ' ', _jsx("button", { onClick: () => navigate('/login', { state: { difficulty } }), className: "text-gold-400 hover:text-gold-300 underline", children: "Inici\u00E1 sesi\u00F3n" })] })] }) }));
}
//# sourceMappingURL=RegisterScreen.js.map