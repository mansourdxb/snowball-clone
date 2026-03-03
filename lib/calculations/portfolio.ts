import type { Holding, PortfolioSnapshot } from "@/lib/api/mock-data";

export function calculateTotalReturn(cost: number, currentValue: number) {
  if (cost === 0) return 0;
  return ((currentValue - cost) / cost) * 100;
}

export function calculateAllocation(holdings: Holding[]) {
  const totalValue = holdings.reduce((sum, h) => sum + h.marketValue, 0);
  return holdings.map((h) => ({
    symbol: h.symbol,
    name: h.name,
    allocation: totalValue > 0 ? (h.marketValue / totalValue) * 100 : 0,
    marketValue: h.marketValue,
  }));
}

export function calculatePortfolioReturn(history: PortfolioSnapshot[]) {
  if (history.length < 2) return 0;
  const first = history[0].value;
  const last = history[history.length - 1].value;
  return calculateTotalReturn(first, last);
}

export function calculateBenchmarkReturn(history: PortfolioSnapshot[]) {
  if (history.length < 2) return 0;
  const first = history[0].benchmarkValue;
  const last = history[history.length - 1].benchmarkValue;
  return calculateTotalReturn(first, last);
}

export function calculateAlpha(history: PortfolioSnapshot[]) {
  return calculatePortfolioReturn(history) - calculateBenchmarkReturn(history);
}

export function formatCurrency(value: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPercent(value: number) {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}
