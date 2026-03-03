import { mockHoldings } from "@/lib/api/mock-data";
import { calculateRebalance } from "@/lib/calculations/rebalancing";
import { formatCurrency } from "@/lib/calculations/portfolio";

// Target allocations for portfolio p1
const targetAllocations: Record<string, number> = {
  AAPL: 8,
  MSFT: 10,
  AMZN: 8,
  VOO: 45,
  JNJ: 10,
  "BRK.B": 19,
};

export default function RebalancePage() {
  const holdings = mockHoldings["p1"].map((h) => ({
    symbol: h.symbol,
    name: h.name,
    marketValue: h.marketValue,
    currentPrice: h.currentPrice,
  }));

  const result = calculateRebalance(holdings, targetAllocations, 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Portfolio Rebalancing</h1>
        <p className="text-foreground/60 mt-1">Align your Long-Term Growth portfolio with target allocations</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-surface-800 rounded-xl p-6 shadow-sm border border-surface-200 dark:border-surface-700">
          <p className="text-sm text-foreground/60">Portfolio Value</p>
          <p className="text-2xl font-bold mt-1">{formatCurrency(result.totalPortfolioValue)}</p>
        </div>
        <div className="bg-white dark:bg-surface-800 rounded-xl p-6 shadow-sm border border-surface-200 dark:border-surface-700">
          <p className="text-sm text-foreground/60">Total Buys</p>
          <p className="text-2xl font-bold mt-1 text-success-500">{formatCurrency(result.totalBuyAmount)}</p>
        </div>
        <div className="bg-white dark:bg-surface-800 rounded-xl p-6 shadow-sm border border-surface-200 dark:border-surface-700">
          <p className="text-sm text-foreground/60">Total Sells</p>
          <p className="text-2xl font-bold mt-1 text-danger-500">{formatCurrency(result.totalSellAmount)}</p>
        </div>
        <div className="bg-white dark:bg-surface-800 rounded-xl p-6 shadow-sm border border-surface-200 dark:border-surface-700">
          <p className="text-sm text-foreground/60">Net Cash Needed</p>
          <p className={`text-2xl font-bold mt-1 ${result.cashNeeded > 0 ? "text-warning-500" : "text-success-500"}`}>
            {formatCurrency(Math.abs(result.cashNeeded))}
          </p>
          <p className="text-xs text-foreground/50 mt-1">{result.cashNeeded > 0 ? "You need to add cash" : "Excess cash generated"}</p>
        </div>
      </div>

      {/* Status */}
      <div className={`rounded-xl p-4 text-sm font-medium flex items-center gap-2 ${
        result.isBalanced
          ? "bg-success-500/10 text-success-500"
          : "bg-warning-500/10 text-warning-500"
      }`}>
        {result.isBalanced ? "✅ Portfolio is balanced within tolerance" : "⚠️ Portfolio needs rebalancing — see suggested trades below"}
      </div>

      {/* Rebalance Table */}
      <div className="bg-white dark:bg-surface-800 rounded-xl shadow-sm border border-surface-200 dark:border-surface-700">
        <div className="p-6 border-b border-surface-200 dark:border-surface-700">
          <h2 className="font-semibold text-lg">Rebalancing Trades</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-200 dark:border-surface-700">
                <th className="text-left py-3 px-4 font-semibold text-foreground/60">Symbol</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground/60">Name</th>
                <th className="text-right py-3 px-4 font-semibold text-foreground/60">Current %</th>
                <th className="text-right py-3 px-4 font-semibold text-foreground/60">Target %</th>
                <th className="text-right py-3 px-4 font-semibold text-foreground/60">Diff</th>
                <th className="text-right py-3 px-4 font-semibold text-foreground/60">Trade ($)</th>
                <th className="text-right py-3 px-4 font-semibold text-foreground/60">Shares</th>
                <th className="text-center py-3 px-4 font-semibold text-foreground/60">Action</th>
              </tr>
            </thead>
            <tbody>
              {result.holdings.map((h) => {
                const isBuy = h.tradeAmount > 0;
                const isSell = h.tradeAmount < 0;
                const action = Math.abs(h.difference) < 0.5 ? "HOLD" : isBuy ? "BUY" : "SELL";
                return (
                  <tr key={h.symbol} className="border-b border-surface-100 dark:border-surface-700/50">
                    <td className="py-3 px-4 font-semibold">{h.symbol}</td>
                    <td className="py-3 px-4 text-foreground/70">{h.name}</td>
                    <td className="py-3 px-4 text-right">{h.currentAllocation.toFixed(1)}%</td>
                    <td className="py-3 px-4 text-right font-medium">{h.targetAllocation.toFixed(1)}%</td>
                    <td className={`py-3 px-4 text-right font-medium ${h.difference > 0 ? "text-success-500" : h.difference < 0 ? "text-danger-500" : ""}`}>
                      {h.difference > 0 ? "+" : ""}{h.difference.toFixed(1)}%
                    </td>
                    <td className={`py-3 px-4 text-right font-medium ${isBuy ? "text-success-500" : isSell ? "text-danger-500" : ""}`}>
                      {isBuy ? "+" : ""}{formatCurrency(h.tradeAmount)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {Math.abs(h.tradeShares) < 0.01 ? "—" : `${h.tradeShares > 0 ? "+" : ""}${h.tradeShares.toFixed(2)}`}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        action === "BUY" ? "bg-success-500/10 text-success-500" :
                        action === "SELL" ? "bg-danger-500/10 text-danger-500" :
                        "bg-surface-100 dark:bg-surface-700 text-foreground/50"
                      }`}>
                        {action}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Visual allocation comparison */}
      <div className="bg-white dark:bg-surface-800 rounded-xl p-6 shadow-sm border border-surface-200 dark:border-surface-700">
        <h3 className="font-semibold mb-4">Allocation Comparison</h3>
        <div className="space-y-4">
          {result.holdings.map((h) => (
            <div key={h.symbol}>
              <div className="flex justify-between text-sm mb-1">
                <span className="font-medium">{h.symbol}</span>
                <span className="text-foreground/60">{h.currentAllocation.toFixed(1)}% → {h.targetAllocation.toFixed(1)}%</span>
              </div>
              <div className="flex gap-1 h-3">
                <div className="bg-primary-300 rounded-l-full" style={{ width: `${h.currentAllocation}%` }} title="Current" />
                <div className="bg-primary-600 rounded-r-full" style={{ width: `${h.targetAllocation}%` }} title="Target" />
              </div>
            </div>
          ))}
          <div className="flex gap-4 text-xs text-foreground/50 mt-2">
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-primary-300 rounded" /> Current</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-primary-600 rounded" /> Target</span>
          </div>
        </div>
      </div>
    </div>
  );
}
