import StatsCard from "@/components/stats-card";
import ChartPlaceholder from "@/components/chart-placeholder";
import { mockDividends, getAggregateStats } from "@/lib/api/mock-data";
import { formatCurrency } from "@/lib/calculations/portfolio";
import {
  calculateAnnualDividendIncome,
  calculateDividendYield,
  groupDividendsByMonth,
  groupDividendsBySymbol,
  getMonthlyDividendAverage,
} from "@/lib/calculations/dividends";

export default function DividendsPage() {
  const stats = getAggregateStats();
  const annualIncome = calculateAnnualDividendIncome(mockDividends);
  const dividendYield = calculateDividendYield(annualIncome, stats.totalValue);
  const monthlyAvg = getMonthlyDividendAverage(mockDividends);
  const bySymbol = groupDividendsBySymbol(mockDividends);
  const byMonth = groupDividendsByMonth(mockDividends);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Dividends</h1>
        <p className="text-foreground/60 mt-1">Track your dividend income across all portfolios</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Dividend Income" value={formatCurrency(annualIncome)} />
        <StatsCard title="Dividend Yield" value={`${dividendYield.toFixed(2)}%`} />
        <StatsCard title="Monthly Average" value={formatCurrency(monthlyAvg)} />
        <StatsCard title="Dividend Payments" value={`${mockDividends.length}`} subtitle="Total received" />
      </div>

      <ChartPlaceholder title="Monthly Dividend Income" height="h-72" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-surface-800 rounded-xl p-6 shadow-sm border border-surface-200 dark:border-surface-700">
          <h3 className="font-semibold mb-4">Income by Stock</h3>
          <div className="space-y-3">
            {bySymbol.map((item) => (
              <div key={item.symbol} className="flex justify-between items-center">
                <span className="font-medium">{item.symbol}</span>
                <span className="text-sm font-semibold">{formatCurrency(item.totalAmount)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-surface-800 rounded-xl p-6 shadow-sm border border-surface-200 dark:border-surface-700">
          <h3 className="font-semibold mb-4">Monthly Breakdown</h3>
          <div className="space-y-3">
            {byMonth.map((item) => (
              <div key={item.month} className="flex justify-between items-center">
                <span className="text-foreground/70">{item.month}</span>
                <span className="text-sm font-semibold">{formatCurrency(item.amount)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-surface-800 rounded-xl shadow-sm border border-surface-200 dark:border-surface-700">
        <div className="p-6 border-b border-surface-200 dark:border-surface-700">
          <h2 className="font-semibold text-lg">Dividend History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-200 dark:border-surface-700">
                <th className="text-left py-3 px-4 font-semibold text-foreground/60">Symbol</th>
                <th className="text-right py-3 px-4 font-semibold text-foreground/60">Amount/Share</th>
                <th className="text-right py-3 px-4 font-semibold text-foreground/60">Shares</th>
                <th className="text-right py-3 px-4 font-semibold text-foreground/60">Total</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground/60">Ex-Date</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground/60">Pay Date</th>
                <th className="text-center py-3 px-4 font-semibold text-foreground/60">DRIP</th>
              </tr>
            </thead>
            <tbody>
              {mockDividends.map((d) => (
                <tr key={d.id} className="border-b border-surface-100 dark:border-surface-700/50">
                  <td className="py-3 px-4 font-medium">{d.symbol}</td>
                  <td className="py-3 px-4 text-right">{formatCurrency(d.amountPerShare)}</td>
                  <td className="py-3 px-4 text-right">{d.sharesHeld}</td>
                  <td className="py-3 px-4 text-right font-semibold text-success-500">{formatCurrency(d.totalAmount)}</td>
                  <td className="py-3 px-4">{d.exDate}</td>
                  <td className="py-3 px-4">{d.payDate}</td>
                  <td className="py-3 px-4 text-center">{d.isReinvested ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
