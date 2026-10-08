import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import { ENTITLEMENT_PRODUCTS } from '@republica/game-engine';
import type { EntitlementId } from '@republica/game-engine';
import { trackPurchaseStarted } from '../lib/analytics.js';
import { supabase } from '../lib/supabase.js';

interface Props {
  entitlement: EntitlementId;
  className?: string;
  label?: string;
}

export function BuyButton({ entitlement, className = '', label }: Props) {
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
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;
      if (!accessToken) {
        window.location.href = '/login';
        return;
      }
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ entitlement }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        setError(data.error ?? 'Error al iniciar el pago');
        return;
      }
      window.location.href = data.url;
    } catch {
      setError('Error de conexion. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={() => void handleBuy()}
        disabled={loading}
        className={`rounded-lg bg-gold-500 px-5 py-2 font-mono font-bold text-navy-900 transition-colors hover:bg-gold-400 disabled:opacity-50 ${className}`}
      >
        {loading ? 'Redirigiendo...' : (label ?? `${product.priceLabel} — ${product.label}`)}
      </button>
      {error && <p className="mt-1 font-mono text-xs text-crimson-400">{error}</p>}
    </div>
  );
}
