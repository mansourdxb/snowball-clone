import StatsCard from "@/components/stats-card";
import PortfolioCard from "@/components/portfolio-card";
import ChartPlaceholder from "@/components/chart-placeholder";
import { mockPortfolios, getAggregateStats } from "@/lib/api/mock-data";
import { formatCurrency, formatPercent } from "@/lib/calculations/portfolio";

export default function DashboardPage() {
  const stats = getAggregateStats();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-foreground/60 mt-1">Overview of all your investments</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Portfolio Value"
          value={formatCurrency(stats.totalValue)}
          change={`${formatPercent(stats.dayChangePercent)} today`}
          changeType={stats.dayChange >= 0 ? "positive" : "negative"}
        />
        <StatsCard
          title="Total Return"
          value={formatCurrency(stats.totalGain)}
          change={formatPercent(stats.totalGainPercent)}
          changeType={stats.totalGain >= 0 ? "positive" : "negative"}
          subtitle={`Cost basis: ${formatCurrency(stats.totalCost)}`}
        />
        <StatsCard
          title="Day Change"
          value={formatCurrency(stats.dayChange)}
          change={formatPercent(stats.dayChangePercent)}
          changeType={stats.dayChange >= 0 ? "positive" : "negative"}
        />
        <StatsCard
          title="Dividend Income"
          value={formatCurrency(stats.totalDividends)}
          subtitle={`${stats.portfolioCount} portfolios`}
        />
      </div>

      <ChartPlaceholder title="Portfolio Performance Over Time" height="h-80" />

      <div>
        <h2 className="text-lg font-semibold mb-4">Your Portfolios</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {mockPortfolios.map((p) => (
            <PortfolioCard key={p.id} portfolio={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
