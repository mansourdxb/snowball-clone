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
import { mockDividendRatings, calculateDividendRating } from "@/lib/calculations/dividend-rating";

// Upcoming mock dividend calendar
const upcomingDividends = [
  { symbol: "KO", exDate: "2025-03-13", payDate: "2025-04-01", amount: 0.485, shares: 200, total: 97.0 },
  { symbol: "O", exDate: "2025-03-28", payDate: "2025-04-15", amount: 0.263, shares: 150, total: 39.45 },
  { symbol: "AAPL", exDate: "2025-05-09", payDate: "2025-05-15", amount: 0.25, shares: 50, total: 12.5 },
  { symbol: "MSFT", exDate: "2025-05-14", payDate: "2025-06-12", amount: 0.75, shares: 30, total: 22.5 },
  { symbol: "PEP", exDate: "2025-06-05", payDate: "2025-06-27", amount: 1.355, shares: 55, total: 74.53 },
  { symbol: "JNJ", exDate: "2025-05-19", payDate: "2025-06-03", amount: 1.24, shares: 80, total: 99.2 },
  { symbol: "SCHD", exDate: "2025-03-19", payDate: "2025-03-24", amount: 0.65, shares: 300, total: 195.0 },
];

export default function DividendsPage() {
  const stats = getAggregateStats();
  const annualIncome = calculateAnnualDividendIncome(mockDividends);
  const dividendYield = calculateDividendYield(annualIncome, stats.totalValue);
  const monthlyAvg = getMonthlyDividendAverage(mockDividends);
  const bySymbol = groupDividendsBySymbol(mockDividends);
  const byMonth = groupDividendsByMonth(mockDividends);

  // Calculate ratings
  const ratings = Object.values(mockDividendRatings).map((input) =>
    calculateDividendRating(input)
  ).sort((a, b) => b.overallScore - a.overallScore);

  // Projected annual income (based on upcoming dividends × 4 quarters estimate)
  const projectedAnnual = upcomingDividends.reduce((s, d) => s + d.total, 0) * 2;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Dividends</h1>
        <p className="text-foreground/60 mt-1">Track your dividend income across all portfolios</p>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatsCard title="Total Dividend Income" value={formatCurrency(annualIncome)} />
        <StatsCard title="Dividend Yield" value={`${dividendYield.toFixed(2)}%`} />
        <StatsCard title="Monthly Average" value={formatCurrency(monthlyAvg)} />
        <StatsCard title="Projected Annual" value={formatCurrency(projectedAnnual)} subtitle="Based on current holdings" />
        <StatsCard title="Dividend Payments" value={`${mockDividends.length}`} subtitle="Total received" />
      </div>

      {/* Dividend Calendar */}
      <div className="bg-white dark:bg-surface-800 rounded-xl shadow-sm border border-surface-200 dark:border-surface-700">
        <div className="p-6 border-b border-surface-200 dark:border-surface-700 flex justify-between items-center">
          <h2 className="font-semibold text-lg">Upcoming Dividends</h2>
          <span className="text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-3 py-1 rounded-full">
            {upcomingDividends.length} upcoming
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-200 dark:border-surface-700">
                <th className="text-left py-3 px-4 font-semibold text-foreground/60">Symbol</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground/60">Ex-Date</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground/60">Pay Date</th>
                <th className="text-right py-3 px-4 font-semibold text-foreground/60">Amount/Share</th>
                <th className="text-right py-3 px-4 font-semibold text-foreground/60">Shares</th>
                <th className="text-right py-3 px-4 font-semibold text-foreground/60">Expected Income</th>
              </tr>
            </thead>
            <tbody>
              {upcomingDividends.map((d) => (
                <tr key={`${d.symbol}-${d.exDate}`} className="border-b border-surface-100 dark:border-surface-700/50">
                  <td className="py-3 px-4 font-medium">{d.symbol}</td>
                  <td className="py-3 px-4">{d.exDate}</td>
                  <td className="py-3 px-4">{d.payDate}</td>
                  <td className="py-3 px-4 text-right">{formatCurrency(d.amount)}</td>
                  <td className="py-3 px-4 text-right">{d.shares}</td>
                  <td className="py-3 px-4 text-right font-semibold text-success-500">{formatCurrency(d.total)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-surface-200 dark:border-surface-700">
                <td colSpan={5} className="py-3 px-4 font-semibold text-right">Total Expected</td>
                <td className="py-3 px-4 text-right font-bold text-success-500">
                  {formatCurrency(upcomingDividends.reduce((s, d) => s + d.total, 0))}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <ChartPlaceholder title="Monthly Dividend Income (Bar Chart)" height="h-72" />

      {/* Dividend Ratings */}
      <div className="bg-white dark:bg-surface-800 rounded-xl shadow-sm border border-surface-200 dark:border-surface-700">
        <div className="p-6 border-b border-surface-200 dark:border-surface-700">
          <h2 className="font-semibold text-lg">Dividend Ratings</h2>
          <p className="text-sm text-foreground/60 mt-1">Scored across 13 fundamental parameters</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-surface-200 dark:border-surface-700">
                <th className="text-left py-3 px-4 font-semibold text-foreground/60">Symbol</th>
                <th className="text-center py-3 px-4 font-semibold text-foreground/60">Grade</th>
                <th className="text-center py-3 px-4 font-semibold text-foreground/60">Score</th>
                <th className="text-right py-3 px-4 font-semibold text-foreground/60">Yield</th>
                <th className="text-right py-3 px-4 font-semibold text-foreground/60">Payout</th>
                <th className="text-right py-3 px-4 font-semibold text-foreground/60">5Y Growth</th>
                <th className="text-right py-3 px-4 font-semibold text-foreground/60">Streak</th>
                <th className="text-right py-3 px-4 font-semibold text-foreground/60">D/E</th>
              </tr>
            </thead>
            <tbody>
              {ratings.map((r) => {
                const input = mockDividendRatings[r.symbol];
                const gradeColor =
                  r.grade.startsWith("A") ? "bg-success-500" :
                  r.grade.startsWith("B") ? "bg-primary-500" :
                  r.grade.startsWith("C") ? "bg-warning-500" : "bg-danger-500";
                return (
                  <tr key={r.symbol} className="border-b border-surface-100 dark:border-surface-700/50">
                    <td className="py-3 px-4 font-semibold">{r.symbol}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-block w-8 h-8 leading-8 rounded-lg text-white text-xs font-bold ${gradeColor}`}>
                        {r.grade}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-16 h-2 bg-surface-200 dark:bg-surface-700 rounded-full">
                          <div className={`h-2 rounded-full ${gradeColor}`} style={{ width: `${r.overallScore}%` }} />
                        </div>
                        <span className="text-xs font-medium">{r.overallScore}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">{input.currentYield.toFixed(2)}%</td>
                    <td className="py-3 px-4 text-right">{input.payoutRatio.toFixed(0)}%</td>
                    <td className="py-3 px-4 text-right">{input.dividendGrowth5Y.toFixed(1)}%</td>
                    <td className="py-3 px-4 text-right font-medium">{input.increaseStreak}y</td>
                    <td className="py-3 px-4 text-right">{input.debtToEquity.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Income by Stock + Monthly Breakdown */}
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

      {/* Full History Table */}
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
