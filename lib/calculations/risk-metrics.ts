/**
 * Advanced risk & performance metrics for portfolio analytics.
 * All calculations follow standard financial formulas.
 */

export interface ReturnSeries {
  date: string;
  portfolioReturn: number; // daily/periodic % return
  benchmarkReturn: number;
  riskFreeReturn: number;  // e.g., T-bill rate / 252
}

/**
 * Internal Rate of Return (IRR) using Newton-Raphson method.
 * cashFlows: array of { date: Date, amount: number } where negative = investment, positive = withdrawal/value
 */
export function calculateXIRR(
  cashFlows: { date: Date; amount: number }[],
  guess = 0.1,
  maxIterations = 100,
  tolerance = 1e-7
): number {
  if (cashFlows.length < 2) return 0;

  let rate = guess;
  const d0 = cashFlows[0].date.getTime();

  for (let i = 0; i < maxIterations; i++) {
    let npv = 0;
    let dnpv = 0;

    for (const cf of cashFlows) {
      const years = (cf.date.getTime() - d0) / (365.25 * 24 * 60 * 60 * 1000);
      const factor = Math.pow(1 + rate, years);
      npv += cf.amount / factor;
      dnpv -= (years * cf.amount) / (factor * (1 + rate));
    }

    if (Math.abs(npv) < tolerance) return rate;
    if (dnpv === 0) return rate;

    rate -= npv / dnpv;

    // Clamp to prevent divergence
    if (rate < -0.99) rate = -0.99;
    if (rate > 10) rate = 10;
  }

  return rate;
}

/**
 * Sharpe Ratio = (mean portfolio return - risk-free rate) / std deviation of portfolio returns
 */
export function calculateSharpeRatio(returns: ReturnSeries[]): number {
  if (returns.length < 2) return 0;

  const portfolioReturns = returns.map((r) => r.portfolioReturn);
  const riskFreeReturns = returns.map((r) => r.riskFreeReturn);

  const excessReturns = portfolioReturns.map((r, i) => r - riskFreeReturns[i]);
  const meanExcess = mean(excessReturns);
  const stdDev = standardDeviation(excessReturns);

  if (stdDev === 0) return 0;

  // Annualize: assuming daily returns, multiply by sqrt(252)
  return (meanExcess / stdDev) * Math.sqrt(252);
}

/**
 * Sortino Ratio = (mean portfolio return - risk-free rate) / downside deviation
 * Only penalizes negative volatility (downside risk)
 */
export function calculateSortinoRatio(returns: ReturnSeries[]): number {
  if (returns.length < 2) return 0;

  const portfolioReturns = returns.map((r) => r.portfolioReturn);
  const riskFreeReturns = returns.map((r) => r.riskFreeReturn);

  const excessReturns = portfolioReturns.map((r, i) => r - riskFreeReturns[i]);
  const meanExcess = mean(excessReturns);

  // Downside deviation: only count negative returns
  const downsideReturns = excessReturns.filter((r) => r < 0);
  if (downsideReturns.length === 0) return meanExcess > 0 ? Infinity : 0;

  const downsideDeviation = Math.sqrt(
    downsideReturns.reduce((sum, r) => sum + r * r, 0) / returns.length
  );

  if (downsideDeviation === 0) return 0;

  return (meanExcess / downsideDeviation) * Math.sqrt(252);
}

/**
 * Beta = Covariance(portfolio, benchmark) / Variance(benchmark)
 * Measures portfolio's sensitivity to market movements
 */
export function calculateBeta(returns: ReturnSeries[]): number {
  if (returns.length < 2) return 1;

  const portfolioReturns = returns.map((r) => r.portfolioReturn);
  const benchmarkReturns = returns.map((r) => r.benchmarkReturn);

  const cov = covariance(portfolioReturns, benchmarkReturns);
  const benchVar = variance(benchmarkReturns);

  if (benchVar === 0) return 1;
  return cov / benchVar;
}

/**
 * Alpha = Portfolio Return - [Risk-Free Rate + Beta × (Benchmark Return - Risk-Free Rate)]
 * Jensen's Alpha - excess return above expected CAPM return
 */
export function calculateAlpha(returns: ReturnSeries[]): number {
  if (returns.length < 2) return 0;

  const beta = calculateBeta(returns);
  const portfolioMean = mean(returns.map((r) => r.portfolioReturn)) * 252;
  const benchmarkMean = mean(returns.map((r) => r.benchmarkReturn)) * 252;
  const riskFreeMean = mean(returns.map((r) => r.riskFreeReturn)) * 252;

  return portfolioMean - (riskFreeMean + beta * (benchmarkMean - riskFreeMean));
}

/**
 * Maximum Drawdown - largest peak-to-trough decline
 */
export function calculateMaxDrawdown(values: number[]): number {
  if (values.length < 2) return 0;

  let maxDrawdown = 0;
  let peak = values[0];

  for (const value of values) {
    if (value > peak) peak = value;
    const drawdown = (peak - value) / peak;
    if (drawdown > maxDrawdown) maxDrawdown = drawdown;
  }

  return maxDrawdown;
}

/**
 * Compound Annual Growth Rate
 */
export function calculateCAGR(startValue: number, endValue: number, years: number): number {
  if (startValue <= 0 || years <= 0) return 0;
  return Math.pow(endValue / startValue, 1 / years) - 1;
}

/**
 * Volatility (annualized standard deviation of returns)
 */
export function calculateVolatility(returns: number[]): number {
  if (returns.length < 2) return 0;
  return standardDeviation(returns) * Math.sqrt(252);
}

/**
 * P/E Ratio (weighted by portfolio allocation)
 */
export function calculateWeightedPE(
  holdings: { marketValue: number; peRatio: number }[]
): number {
  const totalValue = holdings.reduce((s, h) => s + h.marketValue, 0);
  if (totalValue === 0) return 0;

  const weightedPE = holdings.reduce((s, h) => {
    if (h.peRatio <= 0) return s; // skip negative or zero PE
    const weight = h.marketValue / totalValue;
    return s + weight * h.peRatio;
  }, 0);

  return weightedPE;
}

// --- Utility functions ---

function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((s, v) => s + v, 0) / values.length;
}

function variance(values: number[]): number {
  if (values.length < 2) return 0;
  const m = mean(values);
  return values.reduce((s, v) => s + (v - m) ** 2, 0) / (values.length - 1);
}

function standardDeviation(values: number[]): number {
  return Math.sqrt(variance(values));
}

function covariance(a: number[], b: number[]): number {
  if (a.length !== b.length || a.length < 2) return 0;
  const meanA = mean(a);
  const meanB = mean(b);
  return a.reduce((s, v, i) => s + (v - meanA) * (b[i] - meanB), 0) / (a.length - 1);
}
