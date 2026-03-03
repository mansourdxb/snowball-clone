/**
 * Mock analytics data — risk metrics, return series, benchmark comparisons.
 * Replace with real computed data from Supabase + price feeds.
 */

import type { ReturnSeries } from "@/lib/calculations/risk-metrics";

export interface PortfolioMetrics {
  portfolioId: string;
  irr: number;
  sharpeRatio: number;
  sortinoRatio: number;
  beta: number;
  alpha: number;
  maxDrawdown: number;
  volatility: number;
  cagr: number;
  weightedPE: number;
  treynorRatio: number;
  informationRatio: number;
}

// Pre-computed mock metrics for each portfolio
export const mockPortfolioMetrics: Record<string, PortfolioMetrics> = {
  p1: {
    portfolioId: "p1",
    irr: 0.2485,
    sharpeRatio: 1.42,
    sortinoRatio: 2.01,
    beta: 0.96,
    alpha: 3.24,
    maxDrawdown: 0.082,
    volatility: 0.145,
    cagr: 0.2773,
    weightedPE: 24.5,
    treynorRatio: 0.185,
    informationRatio: 0.72,
  },
  p2: {
    portfolioId: "p2",
    irr: 0.1423,
    sharpeRatio: 0.89,
    sortinoRatio: 1.34,
    beta: 0.72,
    alpha: 1.85,
    maxDrawdown: 0.065,
    volatility: 0.11,
    cagr: 0.1594,
    weightedPE: 18.3,
    treynorRatio: 0.142,
    informationRatio: 0.45,
  },
  p3: {
    portfolioId: "p3",
    irr: 0.3215,
    sharpeRatio: 1.18,
    sortinoRatio: 1.56,
    beta: 1.32,
    alpha: 5.61,
    maxDrawdown: 0.154,
    volatility: 0.228,
    cagr: 0.2844,
    weightedPE: 38.7,
    treynorRatio: 0.168,
    informationRatio: 0.88,
  },
};

// Mock daily return series for p1 (last 30 trading days)
export const mockReturnSeries: ReturnSeries[] = Array.from({ length: 60 }, (_, i) => {
  const date = new Date(2025, 0, 2 + i);
  const dayStr = date.toISOString().split("T")[0];
  return {
    date: dayStr,
    portfolioReturn: (Math.random() - 0.48) * 0.02,
    benchmarkReturn: (Math.random() - 0.48) * 0.018,
    riskFreeReturn: 0.0525 / 252,
  };
});

// Mock benchmark comparison data
export interface BenchmarkComparison {
  name: string;
  symbol: string;
  ytdReturn: number;
  oneYearReturn: number;
  threeYearReturn: number;
  fiveYearReturn: number;
}

export const mockBenchmarks: BenchmarkComparison[] = [
  { name: "S&P 500", symbol: "SPY", ytdReturn: 24.5, oneYearReturn: 26.3, threeYearReturn: 10.2, fiveYearReturn: 15.7 },
  { name: "NASDAQ 100", symbol: "QQQ", ytdReturn: 31.2, oneYearReturn: 33.8, threeYearReturn: 12.8, fiveYearReturn: 22.4 },
  { name: "FTSE 100", symbol: "ISF.L", ytdReturn: 8.4, oneYearReturn: 9.1, threeYearReturn: 7.2, fiveYearReturn: 5.8 },
  { name: "MSCI World", symbol: "URTH", ytdReturn: 20.1, oneYearReturn: 22.5, threeYearReturn: 8.6, fiveYearReturn: 12.3 },
  { name: "Total US Bond", symbol: "AGG", ytdReturn: 1.2, oneYearReturn: 2.8, threeYearReturn: -2.1, fiveYearReturn: 0.5 },
];
