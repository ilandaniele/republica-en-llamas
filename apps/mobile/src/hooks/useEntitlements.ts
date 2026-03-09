import { useState, useCallback } from 'react';
import Purchases, { type CustomerInfo, type PurchasesPackage } from 'react-native-purchases';
import type { EntitlementId } from '@republica/game-engine';
import { ENTITLEMENT_PRODUCTS } from '@republica/game-engine';
import { trackPurchaseCompleted } from '../lib/analytics.js';

export interface EntitlementsState {
  hasEntitlement: (id: EntitlementId) => boolean;
  hasPremium: boolean;
  isLoading: boolean;
  purchaseEntitlement: (id: EntitlementId) => Promise<boolean>;
  restorePurchases: () => Promise<void>;
  refresh: () => Promise<void>;
}

export function useEntitlements(): EntitlementsState {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const refresh = useCallback(async () => {
    try {
      setIsLoading(true);
      const info = await Purchases.getCustomerInfo();
      setCustomerInfo(info);
    } catch (e) {
      console.warn('[RevenueCat] getCustomerInfo failed', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const hasEntitlement = useCallback(
    (id: EntitlementId): boolean => {
      if (!customerInfo) return false;
      if (customerInfo.entitlements.active['full_access']) return true;
      return !!customerInfo.entitlements.active[id];
    },
    [customerInfo],
  );

  const hasPremium = hasEntitlement('full_access');

  const purchaseEntitlement = useCallback(
    async (id: EntitlementId): Promise<boolean> => {
      const product = ENTITLEMENT_PRODUCTS[id];
      if (!product) return false;
      try {
        setIsLoading(true);
        const offerings = await Purchases.getOfferings();
        const pkg: PurchasesPackage | undefined = offerings.current?.availablePackages.find(
          (p) => p.identifier === product.rcIdentifier,
        );
        if (!pkg) {
          console.warn('[RevenueCat] package not found', product.rcIdentifier);
          return false;
        }
        const { customerInfo: updated } = await Purchases.purchasePackage(pkg);
        setCustomerInfo(updated);
        trackPurchaseCompleted({ entitlement: id, price: product.price, platform: 'mobile' });
        return true;
      } catch (e: unknown) {
        const err = e as { userCancelled?: boolean };
        if (!err.userCancelled) console.warn('[RevenueCat] purchase failed', e);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const restorePurchases = useCallback(async () => {
    try {
      setIsLoading(true);
      const info = await Purchases.restorePurchases();
      setCustomerInfo(info);
    } catch (e) {
      console.warn('[RevenueCat] restorePurchases failed', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { hasEntitlement, hasPremium, isLoading, purchaseEntitlement, restorePurchases, refresh };
}
