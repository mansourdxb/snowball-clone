import type { Dividend } from "@/lib/api/mock-data";

export function calculateAnnualDividendIncome(dividends: Dividend[]) {
  return dividends.reduce((sum, d) => sum + d.totalAmount, 0);
}

export function calculateDividendYield(annualIncome: number, portfolioValue: number) {
  if (portfolioValue === 0) return 0;
  return (annualIncome / portfolioValue) * 100;
}

export function groupDividendsByMonth(dividends: Dividend[]) {
  const months: Record<string, number> = {};
  for (const d of dividends) {
    const month = d.exDate.substring(0, 7); // YYYY-MM
    months[month] = (months[month] || 0) + d.totalAmount;
  }
  return Object.entries(months)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, amount]) => ({ month, amount }));
}

export function groupDividendsBySymbol(dividends: Dividend[]) {
  const symbols: Record<string, number> = {};
  for (const d of dividends) {
    symbols[d.symbol] = (symbols[d.symbol] || 0) + d.totalAmount;
  }
  return Object.entries(symbols)
    .sort(([, a], [, b]) => b - a)
    .map(([symbol, totalAmount]) => ({ symbol, totalAmount }));
}

export function getMonthlyDividendAverage(dividends: Dividend[]) {
  const months = groupDividendsByMonth(dividends);
  if (months.length === 0) return 0;
  const total = months.reduce((s, m) => s + m.amount, 0);
  return total / months.length;
}
