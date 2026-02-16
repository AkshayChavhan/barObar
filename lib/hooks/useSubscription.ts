'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { hasFeature } from '@/lib/constants/features';
import type { PlanFeature } from '@/lib/constants/features';

interface SubscriptionData {
  id: string;
  hotelId: string;
  plan: 'BASIC' | 'PREMIUM';
  status: 'ACTIVE' | 'PAST_DUE' | 'CANCELLED' | 'EXPIRED';
  currentPeriodEnd: string | null;
  trialEndsAt: string | null;
}

// Module-level cache shared across hook instances
let cachedData: SubscriptionData | null = null;
let cacheHotelId: string | null = null;

export function useSubscription() {
  const { data: session, status: sessionStatus } = useSession();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(
    cachedData
  );
  const [isLoading, setIsLoading] = useState(!cachedData);
  const [error, setError] = useState<string | null>(null);
  const fetchedRef = useRef(false);

  const hotelId = session?.user?.hotelId ?? null;

  const fetchSubscription = useCallback(async () => {
    if (!hotelId) return;

    // Return cached if same hotel
    if (cachedData && cacheHotelId === hotelId) {
      setSubscription(cachedData);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`/api/hotels/${hotelId}/subscription`);
      if (!res.ok) {
        throw new Error('Failed to fetch subscription');
      }
      const data = await res.json();
      cachedData = data;
      cacheHotelId = hotelId;
      setSubscription(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, [hotelId]);

  useEffect(() => {
    if (sessionStatus === 'authenticated' && hotelId && !fetchedRef.current) {
      fetchedRef.current = true;
      fetchSubscription();
    }
  }, [sessionStatus, hotelId, fetchSubscription]);

  const plan = subscription?.plan ?? 'BASIC';
  const subscriptionStatus = subscription?.status ?? 'ACTIVE';

  return {
    subscription,
    plan,
    status: subscriptionStatus,
    isLoading: isLoading || sessionStatus === 'loading',
    error,
    isPremium: plan === 'PREMIUM',
    isActive: subscriptionStatus === 'ACTIVE',
    hasFeature: (feature: PlanFeature) => hasFeature(plan, feature),
    refetch: () => {
      cachedData = null;
      cacheHotelId = null;
      fetchedRef.current = false;
      fetchSubscription();
    },
  };
}
