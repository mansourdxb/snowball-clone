/**
 * Backtesting engine (Portfolio Lab).
 * Simulates portfolio performance over historical periods.
 */

export interface BacktestConfig {
  startDate: string;
  endDate: string;
  initialInvestment: number;
  monthlyContribution: number;
  allocations: { symbol: string; weight: number }[];
  rebalanceFrequency: "monthly" | "quarterly" | "annually" | "never";
  reinvestDividends: boolean;
}

export interface BacktestResult {
  config: BacktestConfig;
  finalValue: number;
  totalContributed: number;
  totalReturn: number;
  totalReturnPercent: number;
  cagr: number;
  maxDrawdown: number;
  sharpeRatio: number;
  bestYear: { year: number; return: number };
  worstYear: { year: number; return: number };
  totalDividends: number;
  monthlyData: { date: string; value: number; contributed: number }[];
}

// Mock backtesting with synthetic data
export function runBacktest(config: BacktestConfig): BacktestResult {
  const startYear = parseInt(config.startDate.split("-")[0]);
  const endYear = parseInt(config.endDate.split("-")[0]);
  const months = (endYear - startYear) * 12;

  // Simulated annual returns per allocation (based on historical averages)
  const avgReturns: Record<string, number> = {
    SPY: 0.105, QQQ: 0.138, VOO: 0.105, SCHD: 0.092, VTI: 0.102,
    AAPL: 0.28, MSFT: 0.25, AMZN: 0.22, NVDA: 0.45, META: 0.20,
    GOOG: 0.18, KO: 0.08, JNJ: 0.07, PEP: 0.09, O: 0.06,
    BRK_B: 0.12, TSLA: 0.35, default: 0.10,
  };

  const avgDivYields: Record<string, number> = {
    SPY: 0.013, VOO: 0.013, SCHD: 0.035, KO: 0.031, JNJ: 0.032,
    PEP: 0.028, O: 0.055, AAPL: 0.005, MSFT: 0.007, default: 0.015,
  };

  // Weighted portfolio return
  const weightedReturn = config.allocations.reduce((s, a) => {
    const r = avgReturns[a.symbol] ?? avgReturns["default"];
    return s + r * a.weight;
  }, 0);

  const weightedDivYield = config.allocations.reduce((s, a) => {
    const d = avgDivYields[a.symbol] ?? avgDivYields["default"];
    return s + d * a.weight;
  }, 0);

  const monthlyReturn = Math.pow(1 + weightedReturn, 1 / 12) - 1;
  const monthlyDiv = weightedDivYield / 12;

  let value = config.initialInvestment;
  let totalContributed = config.initialInvestment;
  let totalDividends = 0;
  let peak = value;
  let maxDrawdown = 0;
  const monthlyData: BacktestResult["monthlyData"] = [];
  const yearlyReturns: Record<number, { start: number; end: number }> = {};

  for (let m = 0; m < months; m++) {
    const year = startYear + Math.floor(m / 12);
    const month = (m % 12) + 1;
    const dateStr = `${year}-${String(month).padStart(2, "0")}-01`;

    if (!yearlyReturns[year]) yearlyReturns[year] = { start: value, end: value };

    // Add monthly contribution
    value += config.monthlyContribution;
    totalContributed += config.monthlyContribution;

    // Apply return with some random noise
    const noise = (Math.random() - 0.5) * 0.04;
    value *= 1 + monthlyReturn + noise;

    // Dividends
    const divIncome = value * monthlyDiv;
    totalDividends += divIncome;
    if (config.reinvestDividends) {
      value += divIncome;
    }

    // Track drawdown
    if (value > peak) peak = value;
    const drawdown = (peak - value) / peak;
    if (drawdown > maxDrawdown) maxDrawdown = drawdown;

    yearlyReturns[year].end = value;

    monthlyData.push({ date: dateStr, value: Math.round(value), contributed: Math.round(totalContributed) });
  }

  // Compute yearly returns
  const yearlyReturnsList = Object.entries(yearlyReturns).map(([year, data]) => ({
    year: parseInt(year),
    return: data.start > 0 ? ((data.end - data.start) / data.start) * 100 : 0,
  }));

  const bestYear = yearlyReturnsList.reduce((best, y) => (y.return > best.return ? y : best), yearlyReturnsList[0]);
  const worstYear = yearlyReturnsList.reduce((worst, y) => (y.return < worst.return ? y : worst), yearlyReturnsList[0]);

  const totalReturn = value - totalContributed;
  const years = months / 12;
  const cagr = totalContributed > 0 ? Math.pow(value / config.initialInvestment, 1 / years) - 1 : 0;

  return {
    config,
    finalValue: Math.round(value),
    totalContributed: Math.round(totalContributed),
    totalReturn: Math.round(totalReturn),
    totalReturnPercent: totalContributed > 0 ? (totalReturn / totalContributed) * 100 : 0,
    cagr: cagr * 100,
    maxDrawdown: maxDrawdown * 100,
    sharpeRatio: 1.1 + Math.random() * 0.5, // mock
    bestYear,
    worstYear,
    totalDividends: Math.round(totalDividends),
    monthlyData,
  };
}
