import { mockWatchlist } from "@/lib/api/mock-company";
import { formatCurrency, formatPercent } from "@/lib/calculations/portfolio";

export default function WatchlistPage() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Watchlist</h1>
          <p className="text-foreground/60 mt-1">Track stocks you&apos;re interested in buying</p>
        </div>
        <button className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2.5 px-4 rounded-lg text-sm transition-colors">
          + Add Symbol
        </button>
      </div>

      <div className="bg-white dark:bg-surface-800 rounded-xl shadow-sm border border-surface-200 dark:border-surface-700">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-200 dark:border-surface-700">
                <th className="text-left py-3 px-4 font-semibold text-foreground/60">Symbol</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground/60">Name</th>
                <th className="text-right py-3 px-4 font-semibold text-foreground/60">Price</th>
                <th className="text-right py-3 px-4 font-semibold text-foreground/60">Change</th>
                <th className="text-right py-3 px-4 font-semibold text-foreground/60">Target</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground/60">Notes</th>
                <th className="text-center py-3 px-4 font-semibold text-foreground/60">Action</th>
              </tr>
            </thead>
            <tbody>
              {mockWatchlist.map((item) => {
                const isPositive = item.change >= 0;
                const distanceToTarget = item.targetPrice ? ((item.targetPrice - item.price) / item.price) * 100 : null;
                return (
                  <tr key={item.symbol} className="border-b border-surface-100 dark:border-surface-700/50 hover:bg-surface-50 dark:hover:bg-surface-700/30">
                    <td className="py-4 px-4 font-semibold">{item.symbol}</td>
                    <td className="py-4 px-4 text-foreground/70">{item.name}</td>
                    <td className="py-4 px-4 text-right font-medium">{formatCurrency(item.price)}</td>
                    <td className={`py-4 px-4 text-right font-medium ${isPositive ? "text-success-500" : "text-danger-500"}`}>
                      {formatCurrency(item.change)} ({formatPercent(item.changePercent)})
                    </td>
                    <td className="py-4 px-4 text-right">
                      {item.targetPrice ? (
                        <div>
                          <span className="font-medium">{formatCurrency(item.targetPrice)}</span>
                          {distanceToTarget !== null && (
                            <span className={`block text-xs ${distanceToTarget > 0 ? "text-success-500" : "text-danger-500"}`}>
                              {distanceToTarget > 0 ? "+" : ""}{distanceToTarget.toFixed(1)}% away
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-foreground/30">—</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-foreground/60 text-xs max-w-48">{item.notes}</td>
                    <td className="py-4 px-4 text-center">
                      <button className="text-xs font-medium text-primary-600 hover:text-primary-700">
                        View Details
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
