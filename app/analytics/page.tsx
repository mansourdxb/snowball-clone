import StatsCard from "@/components/stats-card";
import ChartPlaceholder from "@/components/chart-placeholder";
import { mockPortfolios, mockHoldings, getAggregateStats } from "@/lib/api/mock-data";
import { mockPortfolioMetrics, mockBenchmarks } from "@/lib/api/mock-analytics";
import { formatCurrency, formatPercent } from "@/lib/calculations/portfolio";

export default function AnalyticsPage() {
  const stats = getAggregateStats();
  const allHoldings = Object.values(mockHoldings).flat();
  const topGainers = [...allHoldings].sort((a, b) => b.totalGainPercent - a.totalGainPercent).slice(0, 5);

  // Sector breakdown
  const sectorMap: Record<string, number> = {};
  const totalValue = allHoldings.reduce((s, h) => s + h.marketValue, 0);
  for (const h of allHoldings) {
    sectorMap[h.sector] = (sectorMap[h.sector] || 0) + h.marketValue;
  }
  const sectors = Object.entries(sectorMap)
    .sort(([, a], [, b]) => b - a)
    .map(([sector, value]) => ({ sector, value, pct: (value / totalValue) * 100 }));

  // Risk metrics for primary portfolio
  const p1Metrics = mockPortfolioMetrics["p1"];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-foreground/60 mt-1">Deep dive into your investment performance</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Combined Portfolio Value"
          value={formatCurrency(stats.totalValue)}
          change={formatPercent(stats.totalGainPercent)}
          changeType={stats.totalGain >= 0 ? "positive" : "negative"}
        />
        <StatsCard
          title="Total Positions"
          value={`${allHoldings.length}`}
          subtitle={`Across ${mockPortfolios.length} portfolios`}
        />
        <StatsCard
          title="IRR (Annualized)"
          value={`${(p1Metrics.irr * 100).toFixed(2)}%`}
          subtitle="Long-Term Growth portfolio"
          changeType="positive"
        />
        <StatsCard
          title="Best Performer"
          value={topGainers[0]?.symbol || "N/A"}
          change={topGainers[0] ? formatPercent(topGainers[0].totalGainPercent) : ""}
          changeType="positive"
        />
      </div>

      {/* Risk Metrics Panel */}
      <div className="bg-white dark:bg-surface-800 rounded-xl p-6 shadow-sm border border-surface-200 dark:border-surface-700">
        <h2 className="font-semibold text-lg mb-4">Risk & Performance Metrics</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {[
            { label: "Sharpe Ratio", value: p1Metrics.sharpeRatio.toFixed(2), good: p1Metrics.sharpeRatio > 1 },
            { label: "Sortino Ratio", value: p1Metrics.sortinoRatio.toFixed(2), good: p1Metrics.sortinoRatio > 1.5 },
            { label: "Beta", value: p1Metrics.beta.toFixed(2), good: true },
            { label: "Alpha", value: `${p1Metrics.alpha.toFixed(2)}%`, good: p1Metrics.alpha > 0 },
            { label: "Max Drawdown", value: `${(p1Metrics.maxDrawdown * 100).toFixed(1)}%`, good: p1Metrics.maxDrawdown < 0.15 },
            { label: "Volatility", value: `${(p1Metrics.volatility * 100).toFixed(1)}%`, good: p1Metrics.volatility < 0.2 },
          ].map((metric) => (
            <div key={metric.label} className="text-center">
              <p className="text-xs text-foreground/50 mb-1">{metric.label}</p>
              <p className={`text-xl font-bold ${metric.good ? "text-success-500" : "text-warning-500"}`}>
                {metric.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Per-Portfolio Metrics Table */}
      <div className="bg-white dark:bg-surface-800 rounded-xl shadow-sm border border-surface-200 dark:border-surface-700">
        <div className="p-6 border-b border-surface-200 dark:border-surface-700">
          <h2 className="font-semibold text-lg">Portfolio Comparison</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-200 dark:border-surface-700">
                <th className="text-left py-3 px-4 font-semibold text-foreground/60">Portfolio</th>
                <th className="text-right py-3 px-4 font-semibold text-foreground/60">IRR</th>
                <th className="text-right py-3 px-4 font-semibold text-foreground/60">CAGR</th>
                <th className="text-right py-3 px-4 font-semibold text-foreground/60">Sharpe</th>
                <th className="text-right py-3 px-4 font-semibold text-foreground/60">Sortino</th>
                <th className="text-right py-3 px-4 font-semibold text-foreground/60">Beta</th>
                <th className="text-right py-3 px-4 font-semibold text-foreground/60">Alpha</th>
                <th className="text-right py-3 px-4 font-semibold text-foreground/60">Max DD</th>
                <th className="text-right py-3 px-4 font-semibold text-foreground/60">P/E</th>
              </tr>
            </thead>
            <tbody>
              {mockPortfolios.map((p) => {
                const m = mockPortfolioMetrics[p.id];
                if (!m) return null;
                return (
                  <tr key={p.id} className="border-b border-surface-100 dark:border-surface-700/50 hover:bg-surface-50 dark:hover:bg-surface-700/30">
                    <td className="py-3 px-4 font-medium">{p.name}</td>
                    <td className="py-3 px-4 text-right font-medium text-success-500">{(m.irr * 100).toFixed(1)}%</td>
                    <td className="py-3 px-4 text-right">{(m.cagr * 100).toFixed(1)}%</td>
                    <td className={`py-3 px-4 text-right font-medium ${m.sharpeRatio > 1 ? "text-success-500" : "text-warning-500"}`}>{m.sharpeRatio.toFixed(2)}</td>
                    <td className="py-3 px-4 text-right">{m.sortinoRatio.toFixed(2)}</td>
                    <td className="py-3 px-4 text-right">{m.beta.toFixed(2)}</td>
                    <td className={`py-3 px-4 text-right ${m.alpha > 0 ? "text-success-500" : "text-danger-500"}`}>{m.alpha.toFixed(2)}%</td>
                    <td className="py-3 px-4 text-right text-danger-500">{(m.maxDrawdown * 100).toFixed(1)}%</td>
                    <td className="py-3 px-4 text-right">{m.weightedPE.toFixed(1)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartPlaceholder title="Risk/Return Scatter Plot" height="h-80" />
        <ChartPlaceholder title="Drawdown Analysis" height="h-80" />
      </div>

      {/* Benchmark Comparison */}
      <div className="bg-white dark:bg-surface-800 rounded-xl shadow-sm border border-surface-200 dark:border-surface-700">
        <div className="p-6 border-b border-surface-200 dark:border-surface-700">
          <h2 className="font-semibold text-lg">Benchmark Comparison</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-200 dark:border-surface-700">
                <th className="text-left py-3 px-4 font-semibold text-foreground/60">Benchmark</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground/60">Symbol</th>
                <th className="text-right py-3 px-4 font-semibold text-foreground/60">YTD</th>
                <th className="text-right py-3 px-4 font-semibold text-foreground/60">1 Year</th>
                <th className="text-right py-3 px-4 font-semibold text-foreground/60">3 Year</th>
                <th className="text-right py-3 px-4 font-semibold text-foreground/60">5 Year</th>
              </tr>
            </thead>
            <tbody>
              {mockBenchmarks.map((b) => (
                <tr key={b.symbol} className="border-b border-surface-100 dark:border-surface-700/50">
                  <td className="py-3 px-4 font-medium">{b.name}</td>
                  <td className="py-3 px-4 text-foreground/60">{b.symbol}</td>
                  <td className={`py-3 px-4 text-right font-medium ${b.ytdReturn >= 0 ? "text-success-500" : "text-danger-500"}`}>{formatPercent(b.ytdReturn)}</td>
                  <td className={`py-3 px-4 text-right ${b.oneYearReturn >= 0 ? "text-success-500" : "text-danger-500"}`}>{formatPercent(b.oneYearReturn)}</td>
                  <td className={`py-3 px-4 text-right ${b.threeYearReturn >= 0 ? "text-success-500" : "text-danger-500"}`}>{formatPercent(b.threeYearReturn)}</td>
                  <td className={`py-3 px-4 text-right ${b.fiveYearReturn >= 0 ? "text-success-500" : "text-danger-500"}`}>{formatPercent(b.fiveYearReturn)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Existing sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-surface-800 rounded-xl p-6 shadow-sm border border-surface-200 dark:border-surface-700">
          <h3 className="font-semibold mb-4">Top Gainers</h3>
          <div className="space-y-3">
            {topGainers.map((h) => (
              <div key={h.id} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{h.symbol}</p>
                  <p className="text-xs text-foreground/50">{h.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-success-500 font-semibold text-sm">{formatPercent(h.totalGainPercent)}</p>
                  <p className="text-xs text-foreground/50">{formatCurrency(h.totalGain)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-surface-800 rounded-xl p-6 shadow-sm border border-surface-200 dark:border-surface-700">
          <h3 className="font-semibold mb-4">Sector Allocation (All Portfolios)</h3>
          <div className="space-y-3">
            {sectors.map((s) => (
              <div key={s.sector}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-foreground/70">{s.sector}</span>
                  <span className="font-medium">{formatCurrency(s.value)} ({s.pct.toFixed(1)}%)</span>
                </div>
                <div className="w-full h-2 bg-surface-200 dark:bg-surface-700 rounded-full">
                  <div className="h-2 bg-primary-500 rounded-full" style={{ width: `${s.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
