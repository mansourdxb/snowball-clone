// Mock data for Snowball Analytics Clone
// Replace with real Supabase queries when ready

export interface Portfolio {
  id: string;
  name: string;
  description: string;
  currency: string;
  benchmark: string;
  totalValue: number;
  totalCost: number;
  totalGain: number;
  totalGainPercent: number;
  dayChange: number;
  dayChangePercent: number;
}

export interface Holding {
  id: string;
  portfolioId: string;
  symbol: string;
  name: string;
  assetType: "stock" | "etf" | "crypto" | "bond" | "cash";
  shares: number;
  averageCost: number;
  currentPrice: number;
  marketValue: number;
  totalGain: number;
  totalGainPercent: number;
  dayChange: number;
  dayChangePercent: number;
  allocation: number;
  sector: string;
}

export interface Transaction {
  id: string;
  portfolioId: string;
  symbol: string;
  type: "buy" | "sell" | "dividend" | "split" | "transfer";
  shares: number;
  pricePerShare: number;
  totalAmount: number;
  fees: number;
  executedAt: string;
}

export interface Dividend {
  id: string;
  portfolioId: string;
  symbol: string;
  amountPerShare: number;
  totalAmount: number;
  sharesHeld: number;
  exDate: string;
  payDate: string;
  isReinvested: boolean;
}

export interface PortfolioSnapshot {
  date: string;
  value: number;
  benchmarkValue: number;
}

// --- PORTFOLIOS ---
export const mockPortfolios: Portfolio[] = [
  {
    id: "p1",
    name: "Long-Term Growth",
    description: "Buy and hold US large-cap stocks",
    currency: "USD",
    benchmark: "SPY",
    totalValue: 125_430.5,
    totalCost: 98_200.0,
    totalGain: 27_230.5,
    totalGainPercent: 27.73,
    dayChange: 1_245.3,
    dayChangePercent: 1.0,
  },
  {
    id: "p2",
    name: "Dividend Income",
    description: "High-yield dividend stocks",
    currency: "USD",
    benchmark: "SCHD",
    totalValue: 52_870.25,
    totalCost: 45_600.0,
    totalGain: 7_270.25,
    totalGainPercent: 15.94,
    dayChange: -320.15,
    dayChangePercent: -0.6,
  },
  {
    id: "p3",
    name: "Tech & Innovation",
    description: "Growth-oriented tech picks",
    currency: "USD",
    benchmark: "QQQ",
    totalValue: 78_990.0,
    totalCost: 61_500.0,
    totalGain: 17_490.0,
    totalGainPercent: 28.44,
    dayChange: 2_105.6,
    dayChangePercent: 2.74,
  },
];

// --- HOLDINGS ---
export const mockHoldings: Record<string, Holding[]> = {
  p1: [
    {
      id: "h1",
      portfolioId: "p1",
      symbol: "AAPL",
      name: "Apple Inc.",
      assetType: "stock",
      shares: 50,
      averageCost: 142.5,
      currentPrice: 189.84,
      marketValue: 9_492.0,
      totalGain: 2_367.0,
      totalGainPercent: 33.21,
      dayChange: 125.0,
      dayChangePercent: 1.33,
      allocation: 7.57,
      sector: "Technology",
    },
    {
      id: "h2",
      portfolioId: "p1",
      symbol: "MSFT",
      name: "Microsoft Corp.",
      assetType: "stock",
      shares: 30,
      averageCost: 285.0,
      currentPrice: 415.6,
      marketValue: 12_468.0,
      totalGain: 3_918.0,
      totalGainPercent: 45.82,
      dayChange: 210.0,
      dayChangePercent: 1.71,
      allocation: 9.94,
      sector: "Technology",
    },
    {
      id: "h3",
      portfolioId: "p1",
      symbol: "AMZN",
      name: "Amazon.com Inc.",
      assetType: "stock",
      shares: 40,
      averageCost: 128.75,
      currentPrice: 185.6,
      marketValue: 7_424.0,
      totalGain: 2_274.0,
      totalGainPercent: 44.14,
      dayChange: 96.0,
      dayChangePercent: 1.31,
      allocation: 5.92,
      sector: "Consumer Cyclical",
    },
    {
      id: "h4",
      portfolioId: "p1",
      symbol: "VOO",
      name: "Vanguard S&P 500 ETF",
      assetType: "etf",
      shares: 120,
      averageCost: 380.0,
      currentPrice: 480.35,
      marketValue: 57_642.0,
      totalGain: 12_042.0,
      totalGainPercent: 26.4,
      dayChange: 576.0,
      dayChangePercent: 1.01,
      allocation: 45.96,
      sector: "Broad Market",
    },
    {
      id: "h5",
      portfolioId: "p1",
      symbol: "JNJ",
      name: "Johnson & Johnson",
      assetType: "stock",
      shares: 80,
      averageCost: 158.0,
      currentPrice: 155.2,
      marketValue: 12_416.0,
      totalGain: -224.0,
      totalGainPercent: -1.77,
      dayChange: -64.0,
      dayChangePercent: -0.51,
      allocation: 9.9,
      sector: "Healthcare",
    },
    {
      id: "h6",
      portfolioId: "p1",
      symbol: "BRK.B",
      name: "Berkshire Hathaway B",
      assetType: "stock",
      shares: 60,
      averageCost: 340.0,
      currentPrice: 433.32,
      marketValue: 25_999.2,
      totalGain: 5_599.2,
      totalGainPercent: 27.45,
      dayChange: 302.3,
      dayChangePercent: 1.18,
      allocation: 20.73,
      sector: "Financial Services",
    },
  ],
  p2: [
    {
      id: "h7",
      portfolioId: "p2",
      symbol: "KO",
      name: "Coca-Cola Co.",
      assetType: "stock",
      shares: 200,
      averageCost: 52.0,
      currentPrice: 60.45,
      marketValue: 12_090.0,
      totalGain: 1_690.0,
      totalGainPercent: 16.25,
      dayChange: -60.0,
      dayChangePercent: -0.49,
      allocation: 22.87,
      sector: "Consumer Defensive",
    },
    {
      id: "h8",
      portfolioId: "p2",
      symbol: "O",
      name: "Realty Income Corp.",
      assetType: "stock",
      shares: 150,
      averageCost: 58.0,
      currentPrice: 55.92,
      marketValue: 8_388.0,
      totalGain: -312.0,
      totalGainPercent: -3.59,
      dayChange: -120.0,
      dayChangePercent: -1.41,
      allocation: 15.87,
      sector: "Real Estate",
    },
    {
      id: "h9",
      portfolioId: "p2",
      symbol: "SCHD",
      name: "Schwab US Dividend Equity ETF",
      assetType: "etf",
      shares: 300,
      averageCost: 72.0,
      currentPrice: 79.12,
      marketValue: 23_736.0,
      totalGain: 2_136.0,
      totalGainPercent: 9.89,
      dayChange: -90.0,
      dayChangePercent: -0.38,
      allocation: 44.9,
      sector: "Dividend",
    },
    {
      id: "h10",
      portfolioId: "p2",
      symbol: "PEP",
      name: "PepsiCo Inc.",
      assetType: "stock",
      shares: 55,
      averageCost: 148.0,
      currentPrice: 157.2,
      marketValue: 8_646.0,
      totalGain: 506.0,
      totalGainPercent: 6.22,
      dayChange: -50.0,
      dayChangePercent: -0.57,
      allocation: 16.36,
      sector: "Consumer Defensive",
    },
  ],
  p3: [
    {
      id: "h11",
      portfolioId: "p3",
      symbol: "NVDA",
      name: "NVIDIA Corp.",
      assetType: "stock",
      shares: 25,
      averageCost: 450.0,
      currentPrice: 878.4,
      marketValue: 21_960.0,
      totalGain: 10_710.0,
      totalGainPercent: 95.2,
      dayChange: 875.0,
      dayChangePercent: 4.15,
      allocation: 27.8,
      sector: "Technology",
    },
    {
      id: "h12",
      portfolioId: "p3",
      symbol: "META",
      name: "Meta Platforms Inc.",
      assetType: "stock",
      shares: 35,
      averageCost: 290.0,
      currentPrice: 505.75,
      marketValue: 17_701.25,
      totalGain: 7_551.25,
      totalGainPercent: 74.38,
      dayChange: 525.0,
      dayChangePercent: 3.05,
      allocation: 22.41,
      sector: "Technology",
    },
    {
      id: "h13",
      portfolioId: "p3",
      symbol: "GOOG",
      name: "Alphabet Inc.",
      assetType: "stock",
      shares: 60,
      averageCost: 118.0,
      currentPrice: 155.72,
      marketValue: 9_343.2,
      totalGain: 2_263.2,
      totalGainPercent: 31.97,
      dayChange: 180.0,
      dayChangePercent: 1.96,
      allocation: 11.83,
      sector: "Technology",
    },
    {
      id: "h14",
      portfolioId: "p3",
      symbol: "TSLA",
      name: "Tesla Inc.",
      assetType: "stock",
      shares: 45,
      averageCost: 215.0,
      currentPrice: 248.42,
      marketValue: 11_178.9,
      totalGain: 1_503.9,
      totalGainPercent: 15.54,
      dayChange: 270.0,
      dayChangePercent: 2.47,
      allocation: 14.15,
      sector: "Consumer Cyclical",
    },
    {
      id: "h15",
      portfolioId: "p3",
      symbol: "QQQ",
      name: "Invesco QQQ Trust",
      assetType: "etf",
      shares: 40,
      averageCost: 365.0,
      currentPrice: 470.17,
      marketValue: 18_806.8,
      totalGain: 4_206.8,
      totalGainPercent: 28.81,
      dayChange: 256.0,
      dayChangePercent: 1.38,
      allocation: 23.81,
      sector: "Technology",
    },
  ],
};

// --- TRANSACTIONS ---
export const mockTransactions: Transaction[] = [
  { id: "t1", portfolioId: "p1", symbol: "AAPL", type: "buy", shares: 50, pricePerShare: 142.5, totalAmount: 7_125.0, fees: 0, executedAt: "2024-01-15T10:30:00Z" },
  { id: "t2", portfolioId: "p1", symbol: "MSFT", type: "buy", shares: 30, pricePerShare: 285.0, totalAmount: 8_550.0, fees: 0, executedAt: "2024-02-01T14:00:00Z" },
  { id: "t3", portfolioId: "p1", symbol: "VOO", type: "buy", shares: 80, pricePerShare: 375.0, totalAmount: 30_000.0, fees: 0, executedAt: "2024-03-10T09:30:00Z" },
  { id: "t4", portfolioId: "p1", symbol: "VOO", type: "buy", shares: 40, pricePerShare: 390.0, totalAmount: 15_600.0, fees: 0, executedAt: "2024-06-15T11:00:00Z" },
  { id: "t5", portfolioId: "p1", symbol: "AMZN", type: "buy", shares: 40, pricePerShare: 128.75, totalAmount: 5_150.0, fees: 0, executedAt: "2024-04-20T13:00:00Z" },
  { id: "t6", portfolioId: "p1", symbol: "JNJ", type: "buy", shares: 80, pricePerShare: 158.0, totalAmount: 12_640.0, fees: 0, executedAt: "2024-05-05T10:00:00Z" },
  { id: "t7", portfolioId: "p1", symbol: "BRK.B", type: "buy", shares: 60, pricePerShare: 340.0, totalAmount: 20_400.0, fees: 0, executedAt: "2024-07-01T09:30:00Z" },
  { id: "t8", portfolioId: "p2", symbol: "KO", type: "buy", shares: 200, pricePerShare: 52.0, totalAmount: 10_400.0, fees: 0, executedAt: "2024-01-20T10:00:00Z" },
  { id: "t9", portfolioId: "p2", symbol: "SCHD", type: "buy", shares: 300, pricePerShare: 72.0, totalAmount: 21_600.0, fees: 0, executedAt: "2024-02-15T11:00:00Z" },
  { id: "t10", portfolioId: "p2", symbol: "O", type: "buy", shares: 150, pricePerShare: 58.0, totalAmount: 8_700.0, fees: 0, executedAt: "2024-03-01T09:30:00Z" },
  { id: "t11", portfolioId: "p2", symbol: "PEP", type: "buy", shares: 55, pricePerShare: 148.0, totalAmount: 8_140.0, fees: 0, executedAt: "2024-04-10T14:00:00Z" },
  { id: "t12", portfolioId: "p3", symbol: "NVDA", type: "buy", shares: 25, pricePerShare: 450.0, totalAmount: 11_250.0, fees: 0, executedAt: "2024-01-10T09:30:00Z" },
  { id: "t13", portfolioId: "p3", symbol: "META", type: "buy", shares: 35, pricePerShare: 290.0, totalAmount: 10_150.0, fees: 0, executedAt: "2024-02-20T10:00:00Z" },
  { id: "t14", portfolioId: "p3", symbol: "GOOG", type: "buy", shares: 60, pricePerShare: 118.0, totalAmount: 7_080.0, fees: 0, executedAt: "2024-03-15T11:00:00Z" },
  { id: "t15", portfolioId: "p3", symbol: "TSLA", type: "buy", shares: 45, pricePerShare: 215.0, totalAmount: 9_675.0, fees: 0, executedAt: "2024-05-01T13:00:00Z" },
  { id: "t16", portfolioId: "p3", symbol: "QQQ", type: "buy", shares: 40, pricePerShare: 365.0, totalAmount: 14_600.0, fees: 0, executedAt: "2024-06-01T10:00:00Z" },
  { id: "t17", portfolioId: "p2", symbol: "KO", type: "dividend", shares: 200, pricePerShare: 0.485, totalAmount: 97.0, fees: 0, executedAt: "2024-04-01T00:00:00Z" },
  { id: "t18", portfolioId: "p2", symbol: "O", type: "dividend", shares: 150, pricePerShare: 0.2565, totalAmount: 38.48, fees: 0, executedAt: "2024-04-15T00:00:00Z" },
  { id: "t19", portfolioId: "p2", symbol: "PEP", type: "dividend", shares: 55, pricePerShare: 1.265, totalAmount: 69.58, fees: 0, executedAt: "2024-04-30T00:00:00Z" },
];

// --- DIVIDENDS ---
export const mockDividends: Dividend[] = [
  { id: "d1", portfolioId: "p2", symbol: "KO", amountPerShare: 0.485, totalAmount: 97.0, sharesHeld: 200, exDate: "2024-03-14", payDate: "2024-04-01", isReinvested: false },
  { id: "d2", portfolioId: "p2", symbol: "KO", amountPerShare: 0.485, totalAmount: 97.0, sharesHeld: 200, exDate: "2024-06-13", payDate: "2024-07-01", isReinvested: false },
  { id: "d3", portfolioId: "p2", symbol: "KO", amountPerShare: 0.485, totalAmount: 97.0, sharesHeld: 200, exDate: "2024-09-13", payDate: "2024-10-01", isReinvested: false },
  { id: "d4", portfolioId: "p2", symbol: "KO", amountPerShare: 0.485, totalAmount: 97.0, sharesHeld: 200, exDate: "2024-12-13", payDate: "2025-01-02", isReinvested: false },
  { id: "d5", portfolioId: "p2", symbol: "O", amountPerShare: 0.2565, totalAmount: 38.48, sharesHeld: 150, exDate: "2024-03-28", payDate: "2024-04-15", isReinvested: true },
  { id: "d6", portfolioId: "p2", symbol: "O", amountPerShare: 0.2565, totalAmount: 38.48, sharesHeld: 150, exDate: "2024-04-29", payDate: "2024-05-15", isReinvested: true },
  { id: "d7", portfolioId: "p2", symbol: "O", amountPerShare: 0.2565, totalAmount: 38.48, sharesHeld: 150, exDate: "2024-05-30", payDate: "2024-06-14", isReinvested: true },
  { id: "d8", portfolioId: "p2", symbol: "PEP", amountPerShare: 1.265, totalAmount: 69.58, sharesHeld: 55, exDate: "2024-03-07", payDate: "2024-03-28", isReinvested: false },
  { id: "d9", portfolioId: "p2", symbol: "PEP", amountPerShare: 1.265, totalAmount: 69.58, sharesHeld: 55, exDate: "2024-06-06", payDate: "2024-06-28", isReinvested: false },
  { id: "d10", portfolioId: "p2", symbol: "SCHD", amountPerShare: 0.6122, totalAmount: 183.66, sharesHeld: 300, exDate: "2024-03-20", payDate: "2024-03-25", isReinvested: false },
  { id: "d11", portfolioId: "p2", symbol: "SCHD", amountPerShare: 0.7488, totalAmount: 224.64, sharesHeld: 300, exDate: "2024-06-19", payDate: "2024-06-24", isReinvested: false },
  { id: "d12", portfolioId: "p1", symbol: "AAPL", amountPerShare: 0.25, totalAmount: 12.5, sharesHeld: 50, exDate: "2024-02-09", payDate: "2024-02-15", isReinvested: false },
  { id: "d13", portfolioId: "p1", symbol: "AAPL", amountPerShare: 0.25, totalAmount: 12.5, sharesHeld: 50, exDate: "2024-05-10", payDate: "2024-05-16", isReinvested: false },
  { id: "d14", portfolioId: "p1", symbol: "MSFT", amountPerShare: 0.75, totalAmount: 22.5, sharesHeld: 30, exDate: "2024-02-14", payDate: "2024-03-14", isReinvested: false },
  { id: "d15", portfolioId: "p1", symbol: "JNJ", amountPerShare: 1.24, totalAmount: 99.2, sharesHeld: 80, exDate: "2024-02-20", payDate: "2024-03-05", isReinvested: false },
];

// --- PORTFOLIO HISTORY (for charts) ---
export const mockPortfolioHistory: Record<string, PortfolioSnapshot[]> = {
  p1: [
    { date: "2024-01-15", value: 7_125, benchmarkValue: 7_125 },
    { date: "2024-02-01", value: 16_280, benchmarkValue: 16_050 },
    { date: "2024-03-01", value: 48_500, benchmarkValue: 47_200 },
    { date: "2024-04-01", value: 56_200, benchmarkValue: 54_800 },
    { date: "2024-05-01", value: 72_100, benchmarkValue: 69_500 },
    { date: "2024-06-01", value: 85_400, benchmarkValue: 82_100 },
    { date: "2024-07-01", value: 105_800, benchmarkValue: 100_200 },
    { date: "2024-08-01", value: 108_500, benchmarkValue: 103_400 },
    { date: "2024-09-01", value: 104_200, benchmarkValue: 99_800 },
    { date: "2024-10-01", value: 112_800, benchmarkValue: 107_500 },
    { date: "2024-11-01", value: 118_600, benchmarkValue: 112_900 },
    { date: "2024-12-01", value: 122_300, benchmarkValue: 116_400 },
    { date: "2025-01-01", value: 125_430, benchmarkValue: 118_700 },
  ],
  p2: [
    { date: "2024-01-20", value: 10_400, benchmarkValue: 10_400 },
    { date: "2024-03-01", value: 41_200, benchmarkValue: 40_800 },
    { date: "2024-05-01", value: 49_800, benchmarkValue: 48_500 },
    { date: "2024-07-01", value: 51_200, benchmarkValue: 49_900 },
    { date: "2024-09-01", value: 50_100, benchmarkValue: 48_700 },
    { date: "2024-11-01", value: 52_400, benchmarkValue: 50_600 },
    { date: "2025-01-01", value: 52_870, benchmarkValue: 51_200 },
  ],
  p3: [
    { date: "2024-01-10", value: 11_250, benchmarkValue: 11_250 },
    { date: "2024-03-01", value: 30_500, benchmarkValue: 29_200 },
    { date: "2024-05-01", value: 52_800, benchmarkValue: 47_600 },
    { date: "2024-07-01", value: 68_200, benchmarkValue: 58_400 },
    { date: "2024-09-01", value: 62_500, benchmarkValue: 55_200 },
    { date: "2024-11-01", value: 73_400, benchmarkValue: 63_100 },
    { date: "2025-01-01", value: 78_990, benchmarkValue: 66_800 },
  ],
};

// --- SECTOR ALLOCATION ---
export function getSectorAllocation(portfolioId: string) {
  const holdings = mockHoldings[portfolioId] || [];
  const sectors: Record<string, number> = {};
  const totalValue = holdings.reduce((sum, h) => sum + h.marketValue, 0);
  for (const h of holdings) {
    sectors[h.sector] = (sectors[h.sector] || 0) + h.marketValue;
  }
  return Object.entries(sectors).map(([sector, value]) => ({
    sector,
    value,
    percentage: totalValue > 0 ? (value / totalValue) * 100 : 0,
  }));
}

// --- AGGREGATE STATS ---
export function getAggregateStats() {
  const totalValue = mockPortfolios.reduce((s, p) => s + p.totalValue, 0);
  const totalCost = mockPortfolios.reduce((s, p) => s + p.totalCost, 0);
  const totalGain = totalValue - totalCost;
  const dayChange = mockPortfolios.reduce((s, p) => s + p.dayChange, 0);
  const totalDividends = mockDividends.reduce((s, d) => s + d.totalAmount, 0);
  return {
    totalValue,
    totalCost,
    totalGain,
    totalGainPercent: totalCost > 0 ? (totalGain / totalCost) * 100 : 0,
    dayChange,
    dayChangePercent: totalValue > 0 ? (dayChange / (totalValue - dayChange)) * 100 : 0,
    totalDividends,
    portfolioCount: mockPortfolios.length,
  };
}
