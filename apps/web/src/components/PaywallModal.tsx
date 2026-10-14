import React, { useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { ENTITLEMENT_PRODUCTS } from '@republica/game-engine';
import type { EntitlementId } from '@republica/game-engine';
import { BuyButton } from './BuyButton.js';
import { getFeatureFlag, trackExperimentStarted, trackPaywallShown } from '../lib/analytics.js';

interface Props {
  entitlement: EntitlementId;
  triggerPoint: string;
  onClose: () => void;
}

export function PaywallModal({ entitlement, triggerPoint, onClose }: Props) {
  const product = ENTITLEMENT_PRODUCTS[entitlement];

  const ctaCopyVariant = getFeatureFlag('paywall_cta_copy') ?? 'comprar';
  const pricingVariant = getFeatureFlag('paywall_pricing_order') ?? 'anchor_first';

  const ctaLabel =
    ctaCopyVariant === 'seguir_gobernando'
      ? `SEGUIR GOBERNANDO — ${product.priceLabel}`
      : `Comprar — ${product.priceLabel}`;

  const fullAccessProduct = ENTITLEMENT_PRODUCTS['full_access'];
  const showUpsell = entitlement !== 'full_access' && pricingVariant === 'anchor_first';

  useEffect(() => {
    trackExperimentStarted({ experiment: 'paywall_cta_copy', variant: ctaCopyVariant });
    trackExperimentStarted({ experiment: 'paywall_pricing_order', variant: pricingVariant });
    trackPaywallShown({
      entitlement,
      trigger_point: triggerPoint,
      ab_variant: `${ctaCopyVariant}__${pricingVariant}`,
    });
  }, [entitlement, triggerPoint, ctaCopyVariant, pricingVariant]);

  return (
    <AnimatePresence>
      <m.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: 'rgba(0,0,0,0.75)' }}
        onClick={onClose}
      >
        <m.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="w-full max-w-sm rounded-2xl border border-gold-600 bg-navy-800 p-8 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-6 text-center">
            <div className="mb-3 text-4xl">🔒</div>
            <h2 className="mb-1 font-serif text-xl font-bold text-smoke-100">{product.label}</h2>
            <p className="font-mono text-sm text-smoke-400">{product.description}</p>
          </div>

          <div className="mb-6 rounded-lg border border-navy-600 bg-navy-900 p-4">
            <ul className="space-y-1">
              {product.unlocks.map((u) => (
                <li key={u} className="text-smoke-300 flex items-center gap-2 font-mono text-xs">
                  <span className="text-gold-400">✓</span>
                  <span>{u}</span>
                </li>
              ))}
            </ul>
          </div>

          <BuyButton entitlement={entitlement} className="w-full text-center" label={ctaLabel} />

          {showUpsell && (
            <div className="border-gold-700 mt-3 border bg-navy-900 p-3 text-center">
              <p className="mb-1 font-mono text-[10px] text-smoke-400">O desbloqueá TODO por</p>
              <BuyButton
                entitlement="full_access"
                className="w-full text-center"
                label={`ACCESO TOTAL — ${fullAccessProduct.priceLabel}`}
              />
            </div>
          )}

          <button
            onClick={onClose}
            className="text-smoke-500 hover:text-smoke-300 mt-3 w-full py-2 font-mono text-xs"
          >
            Tal vez despues
          </button>
        </m.div>
      </m.div>
    </AnimatePresence>
  );
}
