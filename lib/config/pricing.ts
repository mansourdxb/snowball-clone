export type PlanTier = "free" | "starter" | "investor" | "expert";

export interface PlanFeature {
  name: string;
  free: boolean | string;
  starter: boolean | string;
  investor: boolean | string;
  expert: boolean | string;
}

export interface Plan {
  id: PlanTier;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  description: string;
  stripePriceIdMonthly: string;
  stripePriceIdYearly: string;
  limits: PlanLimits;
  highlighted?: boolean;
}

export interface PlanLimits {
  portfolios: number;
  holdings: number;
  historicalYears: number;
  csvImport: boolean;
  brokerSync: boolean;
  dividendRating: boolean;
  backtesting: boolean;
  rebalancing: boolean;
  companyFinancials: boolean;
  financialYears: number;
  publicSharing: boolean;
  customBenchmarks: boolean;
  watchlistSize: number;
  prioritySupport: boolean;
}

export const PLANS: Plan[] = [
  {
    id: "free",
    name: "Free",
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: "Get started with basic portfolio tracking",
    stripePriceIdMonthly: "",
    stripePriceIdYearly: "",
    limits: {
      portfolios: 1,
      holdings: 15,
      historicalYears: 1,
      csvImport: false,
      brokerSync: false,
      dividendRating: false,
      backtesting: false,
      rebalancing: false,
      companyFinancials: false,
      financialYears: 0,
      publicSharing: false,
      customBenchmarks: false,
      watchlistSize: 5,
      prioritySupport: false,
    },
  },
  {
    id: "starter",
    name: "Starter",
    monthlyPrice: 6.7,
    yearlyPrice: 80.4,
    description: "For individual investors building their first portfolio",
    stripePriceIdMonthly: process.env.STRIPE_STARTER_MONTHLY_PRICE_ID || "",
    stripePriceIdYearly: process.env.STRIPE_STARTER_YEARLY_PRICE_ID || "",
    limits: {
      portfolios: 3,
      holdings: 50,
      historicalYears: 5,
      csvImport: true,
      brokerSync: false,
      dividendRating: false,
      backtesting: false,
      rebalancing: true,
      companyFinancials: false,
      financialYears: 0,
      publicSharing: true,
      customBenchmarks: false,
      watchlistSize: 15,
      prioritySupport: false,
    },
  },
  {
    id: "investor",
    name: "Investor",
    monthlyPrice: 12.5,
    yearlyPrice: 150,
    description: "Advanced analytics for serious investors",
    stripePriceIdMonthly: process.env.STRIPE_INVESTOR_MONTHLY_PRICE_ID || "",
    stripePriceIdYearly: process.env.STRIPE_INVESTOR_YEARLY_PRICE_ID || "",
    highlighted: true,
    limits: {
      portfolios: 10,
      holdings: 200,
      historicalYears: 10,
      csvImport: true,
      brokerSync: true,
      dividendRating: true,
      backtesting: true,
      rebalancing: true,
      companyFinancials: true,
      financialYears: 10,
      publicSharing: true,
      customBenchmarks: true,
      watchlistSize: 50,
      prioritySupport: false,
    },
  },
  {
    id: "expert",
    name: "Expert",
    monthlyPrice: 20.8,
    yearlyPrice: 249.6,
    description: "Full power for professional portfolio management",
    stripePriceIdMonthly: process.env.STRIPE_EXPERT_MONTHLY_PRICE_ID || "",
    stripePriceIdYearly: process.env.STRIPE_EXPERT_YEARLY_PRICE_ID || "",
    limits: {
      portfolios: -1, // unlimited
      holdings: -1,
      historicalYears: 30,
      csvImport: true,
      brokerSync: true,
      dividendRating: true,
      backtesting: true,
      rebalancing: true,
      companyFinancials: true,
      financialYears: 30,
      publicSharing: true,
      customBenchmarks: true,
      watchlistSize: -1,
      prioritySupport: true,
    },
  },
];

export const PLAN_FEATURES: PlanFeature[] = [
  { name: "Portfolios", free: "1", starter: "3", investor: "10", expert: "Unlimited" },
  { name: "Holdings per Portfolio", free: "15", starter: "50", investor: "200", expert: "Unlimited" },
  { name: "Historical Data", free: "1 year", starter: "5 years", investor: "10 years", expert: "30+ years" },
  { name: "CSV Import", free: false, starter: true, investor: true, expert: true },
  { name: "Broker Auto-Sync", free: false, starter: false, investor: true, expert: true },
  { name: "Dividend Rating", free: false, starter: false, investor: true, expert: true },
  { name: "Backtesting (Portfolio Lab)", free: false, starter: false, investor: true, expert: true },
  { name: "Rebalancing Tool", free: false, starter: true, investor: true, expert: true },
  { name: "Company Financials", free: false, starter: false, investor: "10 years", expert: "30 years" },
  { name: "Public Portfolio Sharing", free: false, starter: true, investor: true, expert: true },
  { name: "Custom Benchmarks", free: false, starter: false, investor: true, expert: true },
  { name: "Watchlist", free: "5 items", starter: "15 items", investor: "50 items", expert: "Unlimited" },
  { name: "Priority Support", free: false, starter: false, investor: false, expert: true },
];

export function getPlan(tier: PlanTier): Plan {
  return PLANS.find((p) => p.id === tier)!;
}

export function canAccess(userTier: PlanTier, feature: keyof PlanLimits): boolean {
  const plan = getPlan(userTier);
  const value = plan.limits[feature];
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;
  return false;
}

export function isWithinLimit(userTier: PlanTier, feature: "portfolios" | "holdings" | "watchlistSize", currentCount: number): boolean {
  const plan = getPlan(userTier);
  const limit = plan.limits[feature];
  if (limit === -1) return true; // unlimited
  return currentCount < limit;
}
