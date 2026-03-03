"use client";

import { useState } from "react";
import type { PlanTier, PlanLimits } from "@/lib/config/pricing";
import { getPlan, canAccess, isWithinLimit } from "@/lib/config/pricing";

// Mock subscription state — replace with Supabase query when auth is wired
interface SubscriptionState {
  tier: PlanTier;
  status: "active" | "trialing" | "past_due" | "canceled" | "none";
  trialEndsAt: string | null;
  currentPeriodEnd: string | null;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
}

const MOCK_SUBSCRIPTION: SubscriptionState = {
  tier: "investor",
  status: "trialing",
  trialEndsAt: "2025-02-15T00:00:00Z",
  currentPeriodEnd: "2025-03-01T00:00:00Z",
  stripeCustomerId: null,
  stripeSubscriptionId: null,
};

export function useSubscription() {
  const [subscription] = useState<SubscriptionState>(MOCK_SUBSCRIPTION);

  const plan = getPlan(subscription.tier);

  return {
    ...subscription,
    plan,
    isPro: subscription.tier !== "free",
    isTrialing: subscription.status === "trialing",
    canAccess: (feature: keyof PlanLimits) => canAccess(subscription.tier, feature),
    isWithinLimit: (feature: "portfolios" | "holdings" | "watchlistSize", count: number) =>
      isWithinLimit(subscription.tier, feature, count),
  };
}
