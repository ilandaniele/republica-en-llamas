import { useState, useEffect, useCallback, useRef } from 'react';
import { Platform } from 'react-native';
import {
  RewardedAd,
  RewardedAdEventType,
  TestIds,
  AdEventType,
} from 'react-native-google-mobile-ads';
import { useEntitlements } from './useEntitlements.js';
import { trackAdShown, trackAdRewarded } from '../lib/analytics.js';

const REWARDED_AD_UNIT_IOS =
  process.env.EXPO_PUBLIC_ADMOB_REWARDED_IOS ?? TestIds.REWARDED;
const REWARDED_AD_UNIT_ANDROID =
  process.env.EXPO_PUBLIC_ADMOB_REWARDED_ANDROID ?? TestIds.REWARDED;

const AD_UNIT_ID = Platform.OS === 'ios' ? REWARDED_AD_UNIT_IOS : REWARDED_AD_UNIT_ANDROID;

interface UseRewardedAdOptions {
  placement: string;
  onRewarded?: () => void;
}

interface UseRewardedAdResult {
  isLoaded: boolean;
  isLoading: boolean;
  showAd: () => void;
  adsDisabled: boolean;
}

export function useRewardedAd({ placement, onRewarded }: UseRewardedAdOptions): UseRewardedAdResult {
  const { hasEntitlement } = useEntitlements();
  const adsDisabled = hasEntitlement('remove_ads') || hasEntitlement('full_access');

  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const adRef = useRef<RewardedAd | null>(null);

  const loadAd = useCallback(() => {
    if (adsDisabled) return;
    setIsLoading(true);
    setIsLoaded(false);

    const ad = RewardedAd.createForAdRequest(AD_UNIT_ID, {
      requestNonPersonalizedAdsOnly: false,
    });

    const unsubLoaded = ad.addAdEventListener(RewardedAdEventType.LOADED, () => {
      setIsLoaded(true);
      setIsLoading(false);
    });

    const unsubEarned = ad.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      () => {
        trackAdRewarded({ placement });
        onRewarded?.();
      },
    );

    const unsubClosed = ad.addAdEventListener(AdEventType.CLOSED, () => {
      setIsLoaded(false);
      unsubLoaded();
      unsubEarned();
      unsubClosed();
      loadAd();          // pre-load next ad
    });

    const unsubError = ad.addAdEventListener(AdEventType.ERROR, () => {
      setIsLoading(false);
      unsubLoaded();
      unsubEarned();
      unsubClosed();
      unsubError();
    });

    adRef.current = ad;
    ad.load();
  }, [adsDisabled, placement, onRewarded]);

  useEffect(() => {
    if (!adsDisabled) loadAd();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adsDisabled]);

  const showAd = useCallback(() => {
    if (!isLoaded || !adRef.current) return;
    trackAdShown({ placement });
    adRef.current.show();
  }, [isLoaded, placement]);

  return { isLoaded, isLoading, showAd, adsDisabled };
}
