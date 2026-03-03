import StatsCard from "@/components/stats-card";
import ChartPlaceholder from "@/components/chart-placeholder";
import { runBacktest } from "@/lib/calculations/backtesting";
import { formatCurrency } from "@/lib/calculations/portfolio";

export default function BacktestPage() {
  const result = runBacktest({
    startDate: "2015-01-01",
    endDate: "2025-01-01",
    initialInvestment: 10_000,
    monthlyContribution: 500,
    allocations: [
      { symbol: "VOO", weight: 0.50 },
      { symbol: "QQQ", weight: 0.25 },
      { symbol: "SCHD", weight: 0.15 },
      { symbol: "AGG", weight: 0.10 },
    ],
    rebalanceFrequency: "quarterly",
    reinvestDividends: true,
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Portfolio Lab (Backtesting)</h1>
        <p className="text-foreground/60 mt-1">Simulate portfolio performance with historical data</p>
      </div>

      {/* Configuration Summary */}
      <div className="bg-white dark:bg-surface-800 rounded-xl p-6 shadow-sm border border-surface-200 dark:border-surface-700">
        <h2 className="font-semibold mb-4">Strategy Configuration</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-foreground/50">Period</p>
            <p className="font-medium">{result.config.startDate.split("-")[0]} — {result.config.endDate.split("-")[0]} ({(parseInt(result.config.endDate) - parseInt(result.config.startDate))} years)</p>
          </div>
          <div>
            <p className="text-foreground/50">Initial Investment</p>
            <p className="font-medium">{formatCurrency(result.config.initialInvestment)}</p>
          </div>
          <div>
            <p className="text-foreground/50">Monthly Contribution</p>
            <p className="font-medium">{formatCurrency(result.config.monthlyContribution)}</p>
          </div>
          <div>
            <p className="text-foreground/50">Rebalance</p>
            <p className="font-medium capitalize">{result.config.rebalanceFrequency} / DRIP: {result.config.reinvestDividends ? "Yes" : "No"}</p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {result.config.allocations.map((a) => (
            <span key={a.symbol} className="bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs font-medium px-3 py-1 rounded-full">
              {a.symbol} {(a.weight * 100).toFixed(0)}%
            </span>
          ))}
        </div>
      </div>

      {/* Results KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Final Portfolio Value"
          value={formatCurrency(result.finalValue)}
          change={`+${result.totalReturnPercent.toFixed(1)}% total return`}
          changeType="positive"
        />
        <StatsCard
          title="Total Contributed"
          value={formatCurrency(result.totalContributed)}
          subtitle={`$${result.config.initialInvestment.toLocaleString()} initial + ${formatCurrency(result.config.monthlyContribution)}/mo`}
        />
        <StatsCard
          title="Total Return"
          value={formatCurrency(result.totalReturn)}
          change={`CAGR: ${result.cagr.toFixed(1)}%`}
          changeType="positive"
        />
        <StatsCard
          title="Dividends Earned"
          value={formatCurrency(result.totalDividends)}
          subtitle={result.config.reinvestDividends ? "Reinvested (DRIP)" : "Cash collected"}
        />
      </div>

      {/* Risk Metrics */}
      <div className="bg-white dark:bg-surface-800 rounded-xl p-6 shadow-sm border border-surface-200 dark:border-surface-700">
        <h2 className="font-semibold mb-4">Risk & Performance</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
          <div className="text-center">
            <p className="text-xs text-foreground/50 mb-1">CAGR</p>
            <p className="text-xl font-bold text-success-500">{result.cagr.toFixed(1)}%</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-foreground/50 mb-1">Max Drawdown</p>
            <p className="text-xl font-bold text-danger-500">{result.maxDrawdown.toFixed(1)}%</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-foreground/50 mb-1">Sharpe Ratio</p>
            <p className="text-xl font-bold">{result.sharpeRatio.toFixed(2)}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-foreground/50 mb-1">Best Year</p>
            <p className="text-xl font-bold text-success-500">{result.bestYear.return.toFixed(1)}%</p>
            <p className="text-xs text-foreground/40">{result.bestYear.year}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-foreground/50 mb-1">Worst Year</p>
            <p className="text-xl font-bold text-danger-500">{result.worstYear.return.toFixed(1)}%</p>
            <p className="text-xs text-foreground/40">{result.worstYear.year}</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartPlaceholder title="Portfolio Value Over Time" height="h-80" />
        <ChartPlaceholder title="Portfolio vs. Contributions" height="h-80" />
      </div>

      {/* Growth table */}
      <div className="bg-white dark:bg-surface-800 rounded-xl shadow-sm border border-surface-200 dark:border-surface-700">
        <div className="p-6 border-b border-surface-200 dark:border-surface-700">
          <h2 className="font-semibold text-lg">Year-by-Year Growth</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-200 dark:border-surface-700">
                <th className="text-left py-3 px-4 font-semibold text-foreground/60">Date</th>
                <th className="text-right py-3 px-4 font-semibold text-foreground/60">Portfolio Value</th>
                <th className="text-right py-3 px-4 font-semibold text-foreground/60">Total Contributed</th>
                <th className="text-right py-3 px-4 font-semibold text-foreground/60">Gain</th>
              </tr>
            </thead>
            <tbody>
              {result.monthlyData
                .filter((_, i) => i % 12 === 0 || i === result.monthlyData.length - 1)
                .map((d) => {
                  const gain = d.value - d.contributed;
                  return (
                    <tr key={d.date} className="border-b border-surface-100 dark:border-surface-700/50">
                      <td className="py-3 px-4 font-medium">{d.date}</td>
                      <td className="py-3 px-4 text-right font-medium">{formatCurrency(d.value)}</td>
                      <td className="py-3 px-4 text-right text-foreground/60">{formatCurrency(d.contributed)}</td>
                      <td className={`py-3 px-4 text-right font-medium ${gain >= 0 ? "text-success-500" : "text-danger-500"}`}>
                        {formatCurrency(gain)}
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
