"use client";

import Link from "next/link";
import type { PlanLimits } from "@/lib/config/pricing";
import { useSubscription } from "@/lib/hooks/use-subscription";

interface FeatureGateProps {
  feature: keyof PlanLimits;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function FeatureGate({ feature, children, fallback }: FeatureGateProps) {
  const { canAccess } = useSubscription();

  if (canAccess(feature)) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <div className="bg-white dark:bg-surface-800 rounded-xl p-8 shadow-sm border border-surface-200 dark:border-surface-700 text-center">
      <div className="w-12 h-12 rounded-full bg-warning-500/10 flex items-center justify-center mx-auto mb-4">
        <span className="text-2xl">🔒</span>
      </div>
      <h3 className="font-semibold text-lg mb-2">Upgrade Required</h3>
      <p className="text-sm text-foreground/60 mb-4 max-w-md mx-auto">
        This feature is not available on your current plan. Upgrade to unlock full access.
      </p>
      <Link
        href="/pricing"
        className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-medium py-2.5 px-6 rounded-lg text-sm transition-colors"
      >
        View Plans
      </Link>
    </div>
  );
}
