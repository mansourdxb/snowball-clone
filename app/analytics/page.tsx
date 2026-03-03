import StatsCard from "@/components/stats-card";
import ChartPlaceholder from "@/components/chart-placeholder";
import { mockPortfolios, mockHoldings, getAggregateStats } from "@/lib/api/mock-data";
import { formatCurrency, formatPercent } from "@/lib/calculations/portfolio";

export default function AnalyticsPage() {
  const stats = getAggregateStats();

  // Aggregate all holdings across portfolios
  const allHoldings = Object.values(mockHoldings).flat();
  const topGainers = [...allHoldings].sort((a, b) => b.totalGainPercent - a.totalGainPercent).slice(0, 5);
  // Sector breakdown across all portfolios
  const sectorMap: Record<string, number> = {};
  const totalValue = allHoldings.reduce((s, h) => s + h.marketValue, 0);
  for (const h of allHoldings) {
    sectorMap[h.sector] = (sectorMap[h.sector] || 0) + h.marketValue;
  }
  const sectors = Object.entries(sectorMap)
    .sort(([, a], [, b]) => b - a)
    .map(([sector, value]) => ({ sector, value, pct: (value / totalValue) * 100 }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-foreground/60 mt-1">Deep dive into your investment performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          title="Best Performer"
          value={topGainers[0]?.symbol || "N/A"}
          change={topGainers[0] ? formatPercent(topGainers[0].totalGainPercent) : ""}
          changeType="positive"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartPlaceholder title="Asset Allocation Breakdown" height="h-80" />
        <ChartPlaceholder title="Performance Comparison" height="h-80" />
      </div>

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
