import { notFound } from "next/navigation";
import StatsCard from "@/components/stats-card";
import HoldingsTable from "@/components/holdings-table";
import ChartPlaceholder from "@/components/chart-placeholder";
import { mockPortfolios, mockHoldings, getSectorAllocation } from "@/lib/api/mock-data";
import { formatCurrency, formatPercent } from "@/lib/calculations/portfolio";

export default function PortfolioDetailPage({ params }: { params: { id: string } }) {
  const portfolio = mockPortfolios.find((p) => p.id === params.id);
  if (!portfolio) return notFound();

  const holdings = mockHoldings[params.id] || [];
  const sectors = getSectorAllocation(params.id);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">{portfolio.name}</h1>
        <p className="text-foreground/60 mt-1">{portfolio.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Value"
          value={formatCurrency(portfolio.totalValue)}
          change={`${formatPercent(portfolio.dayChangePercent)} today`}
          changeType={portfolio.dayChange >= 0 ? "positive" : "negative"}
        />
        <StatsCard
          title="Total Return"
          value={formatCurrency(portfolio.totalGain)}
          change={formatPercent(portfolio.totalGainPercent)}
          changeType={portfolio.totalGain >= 0 ? "positive" : "negative"}
        />
        <StatsCard
          title="Cost Basis"
          value={formatCurrency(portfolio.totalCost)}
        />
        <StatsCard
          title="Holdings"
          value={`${holdings.length} positions`}
          subtitle={`Benchmark: ${portfolio.benchmark}`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <ChartPlaceholder title="Portfolio vs Benchmark" height="h-72" />
        </div>
        <div>
          <div className="bg-white dark:bg-surface-800 rounded-xl p-6 shadow-sm border border-surface-200 dark:border-surface-700 h-72">
            <h3 className="font-semibold mb-4">Sector Allocation</h3>
            <div className="space-y-3">
              {sectors.map((s) => (
                <div key={s.sector}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-foreground/70">{s.sector}</span>
                    <span className="font-medium">{s.percentage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full h-2 bg-surface-200 dark:bg-surface-700 rounded-full">
                    <div
                      className="h-2 bg-primary-500 rounded-full"
                      style={{ width: `${s.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-surface-800 rounded-xl shadow-sm border border-surface-200 dark:border-surface-700">
        <div className="p-6 border-b border-surface-200 dark:border-surface-700">
          <h2 className="font-semibold text-lg">Holdings</h2>
        </div>
        <HoldingsTable holdings={holdings} />
      </div>
    </div>
  );
}
