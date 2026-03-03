/**
 * Mock company/fund detail data for stock research pages.
 */

export interface CompanyProfile {
  symbol: string;
  name: string;
  description: string;
  sector: string;
  industry: string;
  exchange: string;
  marketCap: number;
  peRatio: number;
  forwardPE: number;
  dividendYield: number;
  beta: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  currentPrice: number;
  averageVolume: number;
  employees: number;
}

export interface FinancialStatement {
  year: number;
  revenue: number;
  netIncome: number;
  eps: number;
  dividendPerShare: number;
  freeCashFlow: number;
  totalAssets: number;
  totalDebt: number;
  shareholderEquity: number;
}

export interface PeerComparison {
  symbol: string;
  name: string;
  marketCap: number;
  peRatio: number;
  dividendYield: number;
  ytdReturn: number;
}

export const mockCompanyProfiles: Record<string, CompanyProfile> = {
  AAPL: {
    symbol: "AAPL", name: "Apple Inc.", description: "Apple designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide.",
    sector: "Technology", industry: "Consumer Electronics", exchange: "NASDAQ",
    marketCap: 2_950_000_000_000, peRatio: 30.5, forwardPE: 28.2, dividendYield: 0.52,
    beta: 1.24, fiftyTwoWeekHigh: 199.62, fiftyTwoWeekLow: 164.08, currentPrice: 189.84,
    averageVolume: 58_200_000, employees: 164_000,
  },
  MSFT: {
    symbol: "MSFT", name: "Microsoft Corp.", description: "Microsoft develops and licenses consumer and enterprise software, cloud solutions, and gaming products worldwide.",
    sector: "Technology", industry: "Software - Infrastructure", exchange: "NASDAQ",
    marketCap: 3_080_000_000_000, peRatio: 35.8, forwardPE: 31.5, dividendYield: 0.72,
    beta: 0.89, fiftyTwoWeekHigh: 430.82, fiftyTwoWeekLow: 309.45, currentPrice: 415.6,
    averageVolume: 22_100_000, employees: 228_000,
  },
  KO: {
    symbol: "KO", name: "Coca-Cola Co.", description: "The Coca-Cola Company manufactures, markets, and distributes various nonalcoholic beverages worldwide.",
    sector: "Consumer Defensive", industry: "Beverages - Non-Alcoholic", exchange: "NYSE",
    marketCap: 261_000_000_000, peRatio: 23.8, forwardPE: 21.5, dividendYield: 3.12,
    beta: 0.58, fiftyTwoWeekHigh: 64.99, fiftyTwoWeekLow: 51.55, currentPrice: 60.45,
    averageVolume: 12_800_000, employees: 79_000,
  },
  NVDA: {
    symbol: "NVDA", name: "NVIDIA Corp.", description: "NVIDIA designs and manufactures graphics processing units (GPUs) and system-on-chip units for gaming, data centers, and automotive markets.",
    sector: "Technology", industry: "Semiconductors", exchange: "NASDAQ",
    marketCap: 2_160_000_000_000, peRatio: 65.2, forwardPE: 42.8, dividendYield: 0.02,
    beta: 1.68, fiftyTwoWeekHigh: 974.0, fiftyTwoWeekLow: 390.0, currentPrice: 878.4,
    averageVolume: 42_500_000, employees: 29_600,
  },
};

export const mockFinancials: Record<string, FinancialStatement[]> = {
  AAPL: [
    { year: 2024, revenue: 383_300, netIncome: 97_000, eps: 6.42, dividendPerShare: 1.0, freeCashFlow: 111_400, totalAssets: 352_600, totalDebt: 108_000, shareholderEquity: 74_100 },
    { year: 2023, revenue: 383_285, netIncome: 96_995, eps: 6.16, dividendPerShare: 0.96, freeCashFlow: 99_584, totalAssets: 352_583, totalDebt: 111_088, shareholderEquity: 62_146 },
    { year: 2022, revenue: 394_328, netIncome: 99_803, eps: 6.15, dividendPerShare: 0.92, freeCashFlow: 111_443, totalAssets: 352_755, totalDebt: 120_069, shareholderEquity: 50_672 },
    { year: 2021, revenue: 365_817, netIncome: 94_680, eps: 5.67, dividendPerShare: 0.865, freeCashFlow: 92_953, totalAssets: 351_002, totalDebt: 124_719, shareholderEquity: 63_090 },
    { year: 2020, revenue: 274_515, netIncome: 57_411, eps: 3.28, dividendPerShare: 0.82, freeCashFlow: 73_365, totalAssets: 323_888, totalDebt: 112_436, shareholderEquity: 65_339 },
    { year: 2019, revenue: 260_174, netIncome: 55_256, eps: 2.97, dividendPerShare: 0.77, freeCashFlow: 58_896, totalAssets: 338_516, totalDebt: 108_047, shareholderEquity: 90_488 },
    { year: 2018, revenue: 265_595, netIncome: 59_531, eps: 2.98, dividendPerShare: 0.73, freeCashFlow: 64_121, totalAssets: 365_725, totalDebt: 114_483, shareholderEquity: 107_147 },
    { year: 2017, revenue: 229_234, netIncome: 48_351, eps: 2.30, dividendPerShare: 0.63, freeCashFlow: 51_774, totalAssets: 375_319, totalDebt: 115_680, shareholderEquity: 134_047 },
    { year: 2016, revenue: 215_639, netIncome: 45_687, eps: 2.08, dividendPerShare: 0.57, freeCashFlow: 53_090, totalAssets: 321_686, totalDebt: 87_032, shareholderEquity: 128_249 },
    { year: 2015, revenue: 233_715, netIncome: 53_394, eps: 2.31, dividendPerShare: 0.52, freeCashFlow: 69_778, totalAssets: 290_479, totalDebt: 64_328, shareholderEquity: 119_355 },
  ],
};

export const mockPeers: Record<string, PeerComparison[]> = {
  AAPL: [
    { symbol: "MSFT", name: "Microsoft", marketCap: 3_080_000, peRatio: 35.8, dividendYield: 0.72, ytdReturn: 18.5 },
    { symbol: "GOOG", name: "Alphabet", marketCap: 1_920_000, peRatio: 25.1, dividendYield: 0.0, ytdReturn: 22.3 },
    { symbol: "AMZN", name: "Amazon", marketCap: 1_890_000, peRatio: 62.5, dividendYield: 0.0, ytdReturn: 15.8 },
    { symbol: "META", name: "Meta Platforms", marketCap: 1_280_000, peRatio: 28.9, dividendYield: 0.35, ytdReturn: 31.2 },
    { symbol: "SAMSUNG", name: "Samsung Elec.", marketCap: 362_000, peRatio: 12.8, dividendYield: 2.1, ytdReturn: -5.4 },
  ],
};

export const mockWatchlist = [
  { symbol: "AMD", name: "Advanced Micro Devices", price: 178.45, change: 3.24, changePercent: 1.85, targetPrice: 200, notes: "Watch for earnings beat" },
  { symbol: "COST", name: "Costco Wholesale", price: 742.80, change: -5.10, changePercent: -0.68, targetPrice: 800, notes: "Waiting for pullback to $700" },
  { symbol: "V", name: "Visa Inc.", price: 282.15, change: 1.85, changePercent: 0.66, targetPrice: 300, notes: "Strong payment volumes" },
  { symbol: "UNH", name: "UnitedHealth Group", price: 528.90, change: -12.30, changePercent: -2.27, targetPrice: 550, notes: "Healthcare exposure" },
  { symbol: "LLY", name: "Eli Lilly & Co.", price: 785.20, change: 15.80, changePercent: 2.05, targetPrice: null, notes: "GLP-1 growth story" },
];
