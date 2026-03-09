import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ENTITLEMENT_PRODUCTS } from '@republica/game-engine';
import type { EntitlementId } from '@republica/game-engine';
import { BuyButton } from './BuyButton.js';
import { trackPaywallShown } from '../lib/analytics.js';

interface Props {
  entitlement: EntitlementId;
  triggerPoint: string;
  onClose: () => void;
}

export function PaywallModal({ entitlement, triggerPoint, onClose }: Props) {
  const product = ENTITLEMENT_PRODUCTS[entitlement];

  useEffect(() => {
    trackPaywallShown({ entitlement, trigger_point: triggerPoint });
  }, [entitlement, triggerPoint]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: 'rgba(0,0,0,0.75)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-navy-800 border border-gold-600 rounded-2xl p-8 max-w-sm w-full shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-center mb-6">
            <div className="text-4xl mb-3">🔒</div>
            <h2 className="font-serif text-xl font-bold text-smoke-100 mb-1">{product.label}</h2>
            <p className="text-smoke-400 font-mono text-sm">{product.description}</p>
          </div>

          <div className="bg-navy-900 border border-navy-600 rounded-lg p-4 mb-6">
            <ul className="space-y-1">
              {product.unlocks.map((u) => (
                <li key={u} className="flex items-center gap-2 text-smoke-300 font-mono text-xs">
                  <span className="text-gold-400">✓</span>
                  <span>{u}</span>
                </li>
              ))}
            </ul>
          </div>

          <BuyButton entitlement={entitlement} className="w-full text-center" label={`Comprar — ${product.priceLabel}`} />

          <button
            onClick={onClose}
            className="w-full mt-3 text-smoke-500 hover:text-smoke-300 font-mono text-xs py-2"
          >
            Tal vez despues
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
