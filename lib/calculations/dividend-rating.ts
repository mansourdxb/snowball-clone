/**
 * Dividend Rating Algorithm — scores stocks on 13 fundamental parameters.
 * Each parameter scored 0-10, weighted, then averaged to produce an overall rating.
 */

export interface DividendRatingInput {
  symbol: string;
  currentYield: number;         // Current dividend yield %
  fiveYearAvgYield: number;     // 5-year average yield %
  payoutRatio: number;          // Payout ratio % (0-100+)
  dividendGrowth1Y: number;     // 1-year dividend growth %
  dividendGrowth5Y: number;     // 5-year CAGR dividend growth %
  dividendGrowth10Y: number;    // 10-year CAGR dividend growth %
  consecutiveYears: number;     // Years of consecutive dividend payments
  increaseStreak: number;       // Years of consecutive dividend increases
  earningsGrowth5Y: number;     // 5-year earnings CAGR %
  revenueGrowth5Y: number;      // 5-year revenue CAGR %
  debtToEquity: number;         // Debt-to-equity ratio
  freeCashFlowYield: number;    // FCF yield %
  returnOnEquity: number;       // ROE %
}

export interface DividendRating {
  symbol: string;
  overallScore: number;         // 0-100
  grade: "A+" | "A" | "B+" | "B" | "C+" | "C" | "D" | "F";
  parameters: { name: string; score: number; weight: number; description: string }[];
}

const WEIGHTS = {
  currentYield: 8,
  yieldStability: 6,
  payoutSafety: 10,
  growth1Y: 5,
  growth5Y: 8,
  growth10Y: 7,
  consistency: 9,
  increaseStreak: 9,
  earningsGrowth: 7,
  revenueGrowth: 6,
  leverage: 8,
  fcfCoverage: 9,
  profitability: 8,
};

function scoreCurrentYield(y: number): number {
  if (y >= 4) return 10;
  if (y >= 3) return 8;
  if (y >= 2) return 6;
  if (y >= 1) return 4;
  return 2;
}

function scorePayoutRatio(r: number): number {
  if (r <= 0) return 0;
  if (r <= 40) return 10;
  if (r <= 60) return 8;
  if (r <= 75) return 6;
  if (r <= 90) return 3;
  return 1; // >90% is dangerous
}

function scoreGrowth(g: number): number {
  if (g >= 15) return 10;
  if (g >= 10) return 8;
  if (g >= 7) return 7;
  if (g >= 5) return 6;
  if (g >= 3) return 4;
  if (g >= 0) return 2;
  return 0;
}

function scoreStreak(years: number): number {
  if (years >= 25) return 10; // Dividend Aristocrat
  if (years >= 10) return 8;
  if (years >= 5) return 6;
  if (years >= 3) return 4;
  return 2;
}

function scoreDebtToEquity(d: number): number {
  if (d <= 0.3) return 10;
  if (d <= 0.5) return 8;
  if (d <= 1.0) return 6;
  if (d <= 1.5) return 4;
  if (d <= 2.0) return 2;
  return 1;
}

function scoreROE(r: number): number {
  if (r >= 25) return 10;
  if (r >= 20) return 8;
  if (r >= 15) return 7;
  if (r >= 10) return 5;
  if (r >= 5) return 3;
  return 1;
}

function scoreFCFYield(f: number): number {
  if (f >= 8) return 10;
  if (f >= 6) return 8;
  if (f >= 4) return 6;
  if (f >= 2) return 4;
  return 2;
}

function getGrade(score: number): DividendRating["grade"] {
  if (score >= 90) return "A+";
  if (score >= 80) return "A";
  if (score >= 70) return "B+";
  if (score >= 60) return "B";
  if (score >= 50) return "C+";
  if (score >= 40) return "C";
  if (score >= 30) return "D";
  return "F";
}

export function calculateDividendRating(input: DividendRatingInput): DividendRating {
  const parameters = [
    { name: "Current Yield", score: scoreCurrentYield(input.currentYield), weight: WEIGHTS.currentYield, description: `${input.currentYield.toFixed(2)}% yield` },
    { name: "Yield Stability", score: Math.abs(input.currentYield - input.fiveYearAvgYield) < 0.5 ? 8 : 5, weight: WEIGHTS.yieldStability, description: `5Y avg: ${input.fiveYearAvgYield.toFixed(2)}%` },
    { name: "Payout Safety", score: scorePayoutRatio(input.payoutRatio), weight: WEIGHTS.payoutSafety, description: `${input.payoutRatio.toFixed(0)}% payout ratio` },
    { name: "1Y Dividend Growth", score: scoreGrowth(input.dividendGrowth1Y), weight: WEIGHTS.growth1Y, description: `${input.dividendGrowth1Y.toFixed(1)}%` },
    { name: "5Y Dividend Growth", score: scoreGrowth(input.dividendGrowth5Y), weight: WEIGHTS.growth5Y, description: `${input.dividendGrowth5Y.toFixed(1)}% CAGR` },
    { name: "10Y Dividend Growth", score: scoreGrowth(input.dividendGrowth10Y), weight: WEIGHTS.growth10Y, description: `${input.dividendGrowth10Y.toFixed(1)}% CAGR` },
    { name: "Payment Consistency", score: scoreStreak(input.consecutiveYears), weight: WEIGHTS.consistency, description: `${input.consecutiveYears} consecutive years` },
    { name: "Increase Streak", score: scoreStreak(input.increaseStreak), weight: WEIGHTS.increaseStreak, description: `${input.increaseStreak} years of increases` },
    { name: "Earnings Growth", score: scoreGrowth(input.earningsGrowth5Y), weight: WEIGHTS.earningsGrowth, description: `${input.earningsGrowth5Y.toFixed(1)}% 5Y CAGR` },
    { name: "Revenue Growth", score: scoreGrowth(input.revenueGrowth5Y), weight: WEIGHTS.revenueGrowth, description: `${input.revenueGrowth5Y.toFixed(1)}% 5Y CAGR` },
    { name: "Leverage", score: scoreDebtToEquity(input.debtToEquity), weight: WEIGHTS.leverage, description: `${input.debtToEquity.toFixed(2)} D/E ratio` },
    { name: "FCF Coverage", score: scoreFCFYield(input.freeCashFlowYield), weight: WEIGHTS.fcfCoverage, description: `${input.freeCashFlowYield.toFixed(1)}% FCF yield` },
    { name: "Profitability", score: scoreROE(input.returnOnEquity), weight: WEIGHTS.profitability, description: `${input.returnOnEquity.toFixed(1)}% ROE` },
  ];

  const totalWeight = parameters.reduce((s, p) => s + p.weight, 0);
  const weightedScore = parameters.reduce((s, p) => s + p.score * p.weight, 0);
  const overallScore = (weightedScore / totalWeight) * 10; // Scale to 0-100

  return {
    symbol: input.symbol,
    overallScore: Math.round(overallScore),
    grade: getGrade(overallScore),
    parameters,
  };
}

// Mock dividend ratings for existing holdings
export const mockDividendRatings: Record<string, DividendRatingInput> = {
  KO: {
    symbol: "KO", currentYield: 3.1, fiveYearAvgYield: 3.0, payoutRatio: 72,
    dividendGrowth1Y: 5.2, dividendGrowth5Y: 3.8, dividendGrowth10Y: 4.1,
    consecutiveYears: 62, increaseStreak: 62, earningsGrowth5Y: 6.2,
    revenueGrowth5Y: 7.1, debtToEquity: 1.8, freeCashFlowYield: 4.5, returnOnEquity: 38,
  },
  O: {
    symbol: "O", currentYield: 5.5, fiveYearAvgYield: 4.8, payoutRatio: 78,
    dividendGrowth1Y: 3.0, dividendGrowth5Y: 3.5, dividendGrowth10Y: 4.2,
    consecutiveYears: 28, increaseStreak: 28, earningsGrowth5Y: 4.1,
    revenueGrowth5Y: 12.5, debtToEquity: 0.7, freeCashFlowYield: 5.2, returnOnEquity: 3.5,
  },
  PEP: {
    symbol: "PEP", currentYield: 2.8, fiveYearAvgYield: 2.7, payoutRatio: 65,
    dividendGrowth1Y: 7.1, dividendGrowth5Y: 6.8, dividendGrowth10Y: 7.5,
    consecutiveYears: 52, increaseStreak: 52, earningsGrowth5Y: 8.2,
    revenueGrowth5Y: 6.8, debtToEquity: 2.1, freeCashFlowYield: 4.0, returnOnEquity: 52,
  },
  AAPL: {
    symbol: "AAPL", currentYield: 0.5, fiveYearAvgYield: 0.7, payoutRatio: 15,
    dividendGrowth1Y: 4.3, dividendGrowth5Y: 5.6, dividendGrowth10Y: 8.9,
    consecutiveYears: 12, increaseStreak: 12, earningsGrowth5Y: 12.1,
    revenueGrowth5Y: 8.5, debtToEquity: 1.5, freeCashFlowYield: 3.8, returnOnEquity: 160,
  },
  JNJ: {
    symbol: "JNJ", currentYield: 3.2, fiveYearAvgYield: 2.6, payoutRatio: 45,
    dividendGrowth1Y: 5.3, dividendGrowth5Y: 5.8, dividendGrowth10Y: 6.1,
    consecutiveYears: 62, increaseStreak: 62, earningsGrowth5Y: 4.5,
    revenueGrowth5Y: 3.2, debtToEquity: 0.4, freeCashFlowYield: 5.8, returnOnEquity: 22,
  },
  MSFT: {
    symbol: "MSFT", currentYield: 0.7, fiveYearAvgYield: 0.9, payoutRatio: 25,
    dividendGrowth1Y: 10.3, dividendGrowth5Y: 10.1, dividendGrowth10Y: 10.8,
    consecutiveYears: 22, increaseStreak: 22, earningsGrowth5Y: 18.5,
    revenueGrowth5Y: 14.2, debtToEquity: 0.3, freeCashFlowYield: 2.8, returnOnEquity: 38,
  },
};
