import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import type { EntitlementId } from '@republica/game-engine';
import { ENTITLEMENT_PRODUCTS } from '@republica/game-engine';
import { useEntitlements } from '../hooks/useEntitlements.js';
import { trackPaywallShown } from '../lib/analytics.js';

interface PurchaseModalProps {
  entitlement: EntitlementId;
  triggerPoint: string;
  onClose: () => void;
}

export function PurchaseModal({ entitlement, triggerPoint, onClose }: PurchaseModalProps) {
  const product = ENTITLEMENT_PRODUCTS[entitlement];
  const { purchaseEntitlement, restorePurchases, isLoading } = useEntitlements();
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    trackPaywallShown({ entitlement, trigger_point: triggerPoint });
  }, [entitlement, triggerPoint]);

  const handleBuy = async () => {
    setError(null);
    const ok = await purchaseEntitlement(entitlement);
    if (ok) { onClose(); } else { setError('Compra no completada. Intenta de nuevo.'); }
  };

  const handleRestore = async () => {
    setError(null);
    await restorePurchases();
    onClose();
  };

  if (!product) return null;

  return (
    <Modal transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* Header */}
          <Text style={styles.label}>{product.label}</Text>
          <Text style={styles.description}>{product.description}</Text>

          {/* Unlocks */}
          <View style={styles.unlocksBox}>
            {product.unlocks.map((u) => (
              <Text key={u} style={styles.unlockItem}>✓ {u}</Text>
            ))}
          </View>

          {/* Price */}
          <Text style={styles.price}>${product.price.toFixed(2)} USD</Text>

          {/* Error */}
          {error && <Text style={styles.error}>{error}</Text>}

          {/* Buy button */}
          <TouchableOpacity
            style={styles.buyButton}
            onPress={handleBuy}
            disabled={isLoading}
            activeOpacity={0.85}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buyText}>Comprar — ${product.price.toFixed(2)}</Text>
            )}
          </TouchableOpacity>

          {/* Restore */}
          <TouchableOpacity onPress={handleRestore} disabled={isLoading} style={styles.restoreButton}>
            <Text style={styles.restoreText}>Restaurar compras</Text>
          </TouchableOpacity>

          {/* Dismiss */}
          <TouchableOpacity onPress={onClose} style={styles.dismissButton}>
            <Text style={styles.dismissText}>Tal vez después</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#0d1f2d',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 40,
  },
  label: { fontSize: 20, fontWeight: '900', color: '#f0c060', marginBottom: 6, fontFamily: 'monospace' },
  description: { fontSize: 14, color: '#c0c0c0', marginBottom: 14, lineHeight: 20 },
  unlocksBox: { marginBottom: 16 },
  unlockItem: { fontSize: 13, color: '#a0e0a0', marginBottom: 4 },
  price: { fontSize: 28, fontWeight: '900', color: '#ffffff', textAlign: 'center', marginBottom: 16 },
  error: { fontSize: 13, color: '#ff6666', marginBottom: 10, textAlign: 'center' },
  buyButton: {
    backgroundColor: '#c0392b',
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  buyText: { color: '#fff', fontSize: 16, fontWeight: '900', fontFamily: 'monospace' },
  restoreButton: { alignItems: 'center', paddingVertical: 8, marginBottom: 4 },
  restoreText: { color: '#8080a0', fontSize: 13 },
  dismissButton: { alignItems: 'center', paddingVertical: 8 },
  dismissText: { color: '#606080', fontSize: 12 },
});
