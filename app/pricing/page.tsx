"use client";

import { useState } from "react";
import Link from "next/link";
import { PLANS, PLAN_FEATURES } from "@/lib/config/pricing";

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(true);

  return (
    <div className="min-h-screen bg-surface-50 dark:bg-surface-900">
      {/* Header */}
      <div className="border-b border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="text-xl font-bold">
            Snowball
          </Link>
          <div className="flex gap-3">
            <Link href="/login" className="text-sm font-medium text-foreground/70 hover:text-foreground px-4 py-2">
              Sign In
            </Link>
            <Link
              href="/register"
              className="text-sm font-medium bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-lg text-foreground/60 max-w-2xl mx-auto">
            Start with a 14-day free trial. No credit card required.
            Cancel anytime.
          </p>
        </div>

        {/* Billing toggle */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <span className={`text-sm font-medium ${!isYearly ? "text-foreground" : "text-foreground/50"}`}>
            Monthly
          </span>
          <button
            onClick={() => setIsYearly(!isYearly)}
            className={`relative w-14 h-7 rounded-full transition-colors ${
              isYearly ? "bg-primary-600" : "bg-surface-200 dark:bg-surface-700"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                isYearly ? "translate-x-7" : ""
              }`}
            />
          </button>
          <span className={`text-sm font-medium ${isYearly ? "text-foreground" : "text-foreground/50"}`}>
            Yearly
            <span className="ml-1.5 text-xs font-semibold text-success-500 bg-success-500/10 px-2 py-0.5 rounded-full">
              Save 20%
            </span>
          </span>
        </div>

        {/* Plan cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {PLANS.map((plan) => {
            const price = isYearly ? plan.yearlyPrice / 12 : plan.monthlyPrice;
            const isHighlighted = plan.highlighted;
            return (
              <div
                key={plan.id}
                className={`rounded-2xl p-6 flex flex-col ${
                  isHighlighted
                    ? "bg-primary-600 text-white ring-2 ring-primary-600 shadow-lg scale-[1.02]"
                    : "bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 shadow-sm"
                }`}
              >
                {isHighlighted && (
                  <span className="text-xs font-bold uppercase tracking-wider bg-white/20 self-start px-3 py-1 rounded-full mb-4">
                    Most Popular
                  </span>
                )}
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <p className={`text-sm mt-1 mb-6 ${isHighlighted ? "text-white/80" : "text-foreground/60"}`}>
                  {plan.description}
                </p>
                <div className="mb-6">
                  {plan.monthlyPrice === 0 ? (
                    <span className="text-4xl font-bold">Free</span>
                  ) : (
                    <>
                      <span className="text-4xl font-bold">${price.toFixed(1)}</span>
                      <span className={`text-sm ml-1 ${isHighlighted ? "text-white/70" : "text-foreground/50"}`}>
                        /month
                      </span>
                      {isYearly && (
                        <p className={`text-xs mt-1 ${isHighlighted ? "text-white/60" : "text-foreground/40"}`}>
                          ${plan.yearlyPrice}/year billed annually
                        </p>
                      )}
                    </>
                  )}
                </div>
                <button
                  className={`w-full py-2.5 rounded-lg text-sm font-medium transition-colors mb-6 ${
                    isHighlighted
                      ? "bg-white text-primary-600 hover:bg-white/90"
                      : plan.monthlyPrice === 0
                        ? "bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600"
                        : "bg-primary-600 text-white hover:bg-primary-700"
                  }`}
                >
                  {plan.monthlyPrice === 0 ? "Get Started" : "Start Free Trial"}
                </button>
                <ul className="space-y-3 flex-1">
                  <li className={`text-xs font-semibold uppercase tracking-wider ${isHighlighted ? "text-white/60" : "text-foreground/40"}`}>
                    Includes:
                  </li>
                  {PLAN_FEATURES.map((feature) => {
                    const val = feature[plan.id];
                    if (val === false) return null;
                    return (
                      <li key={feature.name} className="flex items-start gap-2 text-sm">
                        <span className="mt-0.5">✓</span>
                        <span>
                          {feature.name}
                          {typeof val === "string" && (
                            <span className={`ml-1 font-medium ${isHighlighted ? "text-white/90" : ""}`}>
                              ({val})
                            </span>
                          )}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Feature comparison table */}
        <div className="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-surface-200 dark:border-surface-700">
            <h2 className="text-xl font-bold">Compare all features</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-200 dark:border-surface-700">
                  <th className="text-left py-4 px-6 font-semibold">Feature</th>
                  {PLANS.map((p) => (
                    <th key={p.id} className="text-center py-4 px-4 font-semibold">
                      {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PLAN_FEATURES.map((feature, i) => (
                  <tr
                    key={feature.name}
                    className={i % 2 === 0 ? "bg-surface-50 dark:bg-surface-800/50" : ""}
                  >
                    <td className="py-3 px-6 font-medium">{feature.name}</td>
                    {(["free", "starter", "investor", "expert"] as const).map((tier) => {
                      const val = feature[tier];
                      return (
                        <td key={tier} className="py-3 px-4 text-center">
                          {val === true ? (
                            <span className="text-success-500 font-bold">✓</span>
                          ) : val === false ? (
                            <span className="text-foreground/20">—</span>
                          ) : (
                            <span className="font-medium">{val}</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
