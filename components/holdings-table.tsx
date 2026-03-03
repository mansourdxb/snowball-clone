import type { Holding } from "@/lib/api/mock-data";
import { formatCurrency, formatPercent } from "@/lib/calculations/portfolio";

interface HoldingsTableProps {
  holdings: Holding[];
}

export default function HoldingsTable({ holdings }: HoldingsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-surface-200 dark:border-surface-700">
            <th className="text-left py-3 px-4 font-semibold text-foreground/60">Symbol</th>
            <th className="text-left py-3 px-4 font-semibold text-foreground/60">Name</th>
            <th className="text-right py-3 px-4 font-semibold text-foreground/60">Shares</th>
            <th className="text-right py-3 px-4 font-semibold text-foreground/60">Price</th>
            <th className="text-right py-3 px-4 font-semibold text-foreground/60">Market Value</th>
            <th className="text-right py-3 px-4 font-semibold text-foreground/60">Gain/Loss</th>
            <th className="text-right py-3 px-4 font-semibold text-foreground/60">Return</th>
            <th className="text-right py-3 px-4 font-semibold text-foreground/60">Allocation</th>
          </tr>
        </thead>
        <tbody>
          {holdings.map((h) => {
            const isPositive = h.totalGain >= 0;
            return (
              <tr key={h.id} className="border-b border-surface-100 dark:border-surface-700/50 hover:bg-surface-50 dark:hover:bg-surface-700/30">
                <td className="py-3 px-4 font-semibold">{h.symbol}</td>
                <td className="py-3 px-4 text-foreground/70">{h.name}</td>
                <td className="py-3 px-4 text-right">{h.shares}</td>
                <td className="py-3 px-4 text-right">{formatCurrency(h.currentPrice)}</td>
                <td className="py-3 px-4 text-right font-medium">{formatCurrency(h.marketValue)}</td>
                <td className={`py-3 px-4 text-right font-medium ${isPositive ? "text-success-500" : "text-danger-500"}`}>
                  {formatCurrency(h.totalGain)}
                </td>
                <td className={`py-3 px-4 text-right font-medium ${isPositive ? "text-success-500" : "text-danger-500"}`}>
                  {formatPercent(h.totalGainPercent)}
                </td>
                <td className="py-3 px-4 text-right">{h.allocation.toFixed(1)}%</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
