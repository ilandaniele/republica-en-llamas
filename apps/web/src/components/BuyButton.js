import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import { ENTITLEMENT_PRODUCTS } from '@republica/game-engine';
import { trackPurchaseStarted } from '../lib/analytics.js';
export function BuyButton({ entitlement, className = '', label }) {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const product = ENTITLEMENT_PRODUCTS[entitlement];
    const handleBuy = async () => {
        if (!user) {
            window.location.href = '/login';
            return;
        }
        setLoading(true);
        setError('');
        trackPurchaseStarted({ entitlement, price: product.price });
        try {
            const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
                },
                body: JSON.stringify({
                    priceId: product.stripePriceId,
                    userId: user.id,
                    entitlement,
                }),
            });
            const data = await res.json();
            if (!res.ok || !data.url) {
                setError(data.error ?? 'Error al iniciar el pago');
                return;
            }
            window.location.href = data.url;
        }
        catch (e) {
            setError('Error de conexion. Intenta de nuevo.');
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs("div", { children: [_jsx("button", { onClick: () => void handleBuy(), disabled: loading, className: `bg-gold-500 hover:bg-gold-400 text-navy-900 font-mono font-bold py-2 px-5 rounded-lg transition-colors disabled:opacity-50 ${className}`, children: loading ? 'Redirigiendo...' : (label ?? `${product.priceLabel} — ${product.label}`) }), error && _jsx("p", { className: "text-crimson-400 font-mono text-xs mt-1", children: error })] }));
}
//# sourceMappingURL=BuyButton.js.map