import { notFound } from "next/navigation";
import StatsCard from "@/components/stats-card";
import ChartPlaceholder from "@/components/chart-placeholder";
import { mockCompanyProfiles, mockFinancials, mockPeers } from "@/lib/api/mock-company";
import { formatCurrency } from "@/lib/calculations/portfolio";

function formatLargeNumber(n: number): string {
  if (n >= 1_000_000_000_000) return `$${(n / 1_000_000_000_000).toFixed(2)}T`;
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(0)}M`;
  return formatCurrency(n);
}

export default function StockDetailPage({ params }: { params: { symbol: string } }) {
  const symbol = params.symbol.toUpperCase();
  const company = mockCompanyProfiles[symbol];
  if (!company) return notFound();

  const financials = mockFinancials[symbol] || [];
  const peers = mockPeers[symbol] || [];
  const priceVs52High = ((company.currentPrice - company.fiftyTwoWeekHigh) / company.fiftyTwoWeekHigh * 100);
  const pricePosition = ((company.currentPrice - company.fiftyTwoWeekLow) / (company.fiftyTwoWeekHigh - company.fiftyTwoWeekLow)) * 100;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{company.symbol}</h1>
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-surface-100 dark:bg-surface-700">
              {company.exchange}
            </span>
          </div>
          <p className="text-foreground/60 mt-1">{company.name}</p>
          <p className="text-sm text-foreground/50 mt-0.5">{company.sector} · {company.industry}</p>
        </div>
        <div className="text-right">
          <p className="text-3xl font-bold">{formatCurrency(company.currentPrice)}</p>
          <p className={`text-sm font-medium ${priceVs52High > -5 ? "text-success-500" : "text-danger-500"}`}>
            {priceVs52High.toFixed(1)}% from 52w high
          </p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatsCard title="Market Cap" value={formatLargeNumber(company.marketCap)} />
        <StatsCard title="P/E Ratio" value={company.peRatio.toFixed(1)} subtitle={`Fwd: ${company.forwardPE.toFixed(1)}`} />
        <StatsCard title="Dividend Yield" value={`${company.dividendYield.toFixed(2)}%`} />
        <StatsCard title="Beta" value={company.beta.toFixed(2)} />
        <StatsCard title="Avg Volume" value={`${(company.averageVolume / 1_000_000).toFixed(1)}M`} />
        <StatsCard title="Employees" value={company.employees.toLocaleString()} />
      </div>

      {/* 52-Week Range */}
      <div className="bg-white dark:bg-surface-800 rounded-xl p-6 shadow-sm border border-surface-200 dark:border-surface-700">
        <h3 className="font-semibold mb-4">52-Week Range</h3>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium">{formatCurrency(company.fiftyTwoWeekLow)}</span>
          <div className="flex-1 h-3 bg-surface-200 dark:bg-surface-700 rounded-full relative">
            <div
              className="absolute top-0 left-0 h-3 bg-gradient-to-r from-danger-500 via-warning-500 to-success-500 rounded-full"
              style={{ width: `${pricePosition}%` }}
            />
            <div
              className="absolute top-[-2px] w-4 h-4 bg-foreground rounded-full border-2 border-white dark:border-surface-800 shadow"
              style={{ left: `calc(${pricePosition}% - 8px)` }}
            />
          </div>
          <span className="text-sm font-medium">{formatCurrency(company.fiftyTwoWeekHigh)}</span>
        </div>
      </div>

      <ChartPlaceholder title="Price History" height="h-80" />

      {/* Financial Statements */}
      {financials.length > 0 && (
        <div className="bg-white dark:bg-surface-800 rounded-xl shadow-sm border border-surface-200 dark:border-surface-700">
          <div className="p-6 border-b border-surface-200 dark:border-surface-700">
            <h2 className="font-semibold text-lg">Financial Statements (10Y)</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-200 dark:border-surface-700">
                  <th className="text-left py-3 px-4 font-semibold text-foreground/60">Year</th>
                  <th className="text-right py-3 px-4 font-semibold text-foreground/60">Revenue ($M)</th>
                  <th className="text-right py-3 px-4 font-semibold text-foreground/60">Net Income ($M)</th>
                  <th className="text-right py-3 px-4 font-semibold text-foreground/60">EPS</th>
                  <th className="text-right py-3 px-4 font-semibold text-foreground/60">Dividend/Share</th>
                  <th className="text-right py-3 px-4 font-semibold text-foreground/60">FCF ($M)</th>
                </tr>
              </thead>
              <tbody>
                {financials.map((f) => (
                  <tr key={f.year} className="border-b border-surface-100 dark:border-surface-700/50">
                    <td className="py-3 px-4 font-medium">{f.year}</td>
                    <td className="py-3 px-4 text-right">{f.revenue.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right">{f.netIncome.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right font-medium">${f.eps.toFixed(2)}</td>
                    <td className="py-3 px-4 text-right text-success-500">${f.dividendPerShare.toFixed(3)}</td>
                    <td className="py-3 px-4 text-right">{f.freeCashFlow.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Peer Comparison */}
      {peers.length > 0 && (
        <div className="bg-white dark:bg-surface-800 rounded-xl shadow-sm border border-surface-200 dark:border-surface-700">
          <div className="p-6 border-b border-surface-200 dark:border-surface-700">
            <h2 className="font-semibold text-lg">Peer Comparison</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-surface-200 dark:border-surface-700">
                  <th className="text-left py-3 px-4 font-semibold text-foreground/60">Symbol</th>
                  <th className="text-left py-3 px-4 font-semibold text-foreground/60">Name</th>
                  <th className="text-right py-3 px-4 font-semibold text-foreground/60">Market Cap ($B)</th>
                  <th className="text-right py-3 px-4 font-semibold text-foreground/60">P/E</th>
                  <th className="text-right py-3 px-4 font-semibold text-foreground/60">Div Yield</th>
                  <th className="text-right py-3 px-4 font-semibold text-foreground/60">YTD Return</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-surface-100 dark:border-surface-700/50 bg-primary-50/50 dark:bg-primary-900/10">
                  <td className="py-3 px-4 font-bold">{company.symbol}</td>
                  <td className="py-3 px-4">{company.name}</td>
                  <td className="py-3 px-4 text-right">{(company.marketCap / 1_000_000_000).toFixed(0)}</td>
                  <td className="py-3 px-4 text-right">{company.peRatio.toFixed(1)}</td>
                  <td className="py-3 px-4 text-right">{company.dividendYield.toFixed(2)}%</td>
                  <td className="py-3 px-4 text-right">—</td>
                </tr>
                {peers.map((p) => (
                  <tr key={p.symbol} className="border-b border-surface-100 dark:border-surface-700/50">
                    <td className="py-3 px-4 font-medium">{p.symbol}</td>
                    <td className="py-3 px-4 text-foreground/70">{p.name}</td>
                    <td className="py-3 px-4 text-right">{(p.marketCap).toLocaleString()}</td>
                    <td className="py-3 px-4 text-right">{p.peRatio.toFixed(1)}</td>
                    <td className="py-3 px-4 text-right">{p.dividendYield.toFixed(2)}%</td>
                    <td className={`py-3 px-4 text-right font-medium ${p.ytdReturn >= 0 ? "text-success-500" : "text-danger-500"}`}>
                      {p.ytdReturn >= 0 ? "+" : ""}{p.ytdReturn.toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartPlaceholder title="Revenue & Net Income Trend" height="h-64" />
        <ChartPlaceholder title="Dividend History" height="h-64" />
      </div>
    </div>
  );
}
