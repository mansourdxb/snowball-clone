/**
 * Portfolio rebalancing engine.
 * Computes trades needed to align current allocation with target allocation.
 */

export interface RebalanceHolding {
  symbol: string;
  name: string;
  currentValue: number;
  currentAllocation: number;
  targetAllocation: number;
  difference: number;        // target - current
  tradeAmount: number;       // $ amount to buy (positive) or sell (negative)
  tradeShares: number;       // estimated shares (tradeAmount / currentPrice)
  currentPrice: number;
}

export interface RebalanceResult {
  holdings: RebalanceHolding[];
  totalPortfolioValue: number;
  totalBuyAmount: number;
  totalSellAmount: number;
  cashNeeded: number;       // net cash needed (buys - sells)
  isBalanced: boolean;
}

export function calculateRebalance(
  holdings: { symbol: string; name: string; marketValue: number; currentPrice: number }[],
  targetAllocations: Record<string, number>, // symbol -> target %
  additionalCash = 0
): RebalanceResult {
  const totalValue = holdings.reduce((s, h) => s + h.marketValue, 0) + additionalCash;

  const result: RebalanceHolding[] = holdings.map((h) => {
    const currentAllocation = totalValue > 0 ? (h.marketValue / totalValue) * 100 : 0;
    const targetAllocation = targetAllocations[h.symbol] ?? currentAllocation;
    const difference = targetAllocation - currentAllocation;
    const tradeAmount = (difference / 100) * totalValue;
    const tradeShares = h.currentPrice > 0 ? tradeAmount / h.currentPrice : 0;

    return {
      symbol: h.symbol,
      name: h.name,
      currentValue: h.marketValue,
      currentAllocation,
      targetAllocation,
      difference,
      tradeAmount,
      tradeShares,
      currentPrice: h.currentPrice,
    };
  });

  const totalBuyAmount = result.filter((r) => r.tradeAmount > 0).reduce((s, r) => s + r.tradeAmount, 0);
  const totalSellAmount = Math.abs(result.filter((r) => r.tradeAmount < 0).reduce((s, r) => s + r.tradeAmount, 0));

  return {
    holdings: result,
    totalPortfolioValue: totalValue,
    totalBuyAmount,
    totalSellAmount,
    cashNeeded: totalBuyAmount - totalSellAmount,
    isBalanced: result.every((r) => Math.abs(r.difference) < 0.5),
  };
}

/**
 * "What-if" scenario: compute new allocations after buying a specific stock
 */
export function whatIfBuy(
  holdings: { symbol: string; marketValue: number }[],
  buySymbol: string,
  buyAmount: number
): { symbol: string; allocation: number }[] {
  const totalValue = holdings.reduce((s, h) => s + h.marketValue, 0) + buyAmount;
  return holdings.map((h) => ({
    symbol: h.symbol,
    allocation: (((h.symbol === buySymbol ? h.marketValue + buyAmount : h.marketValue) / totalValue) * 100),
  }));
}
