import Link from "next/link";
import type { Portfolio } from "@/lib/api/mock-data";
import { formatCurrency, formatPercent } from "@/lib/calculations/portfolio";

interface PortfolioCardProps {
  portfolio: Portfolio;
}

export default function PortfolioCard({ portfolio }: PortfolioCardProps) {
  const isPositive = portfolio.totalGain >= 0;
  const isDayPositive = portfolio.dayChange >= 0;

  return (
    <Link href={`/portfolios/${portfolio.id}`}>
      <div className="bg-white dark:bg-surface-800 rounded-xl p-6 shadow-sm border border-surface-200 dark:border-surface-700 hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-semibold text-lg">{portfolio.name}</h3>
            <p className="text-sm text-foreground/60">{portfolio.description}</p>
          </div>
          <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300">
            {portfolio.benchmark}
          </span>
        </div>
        <p className="text-2xl font-bold">{formatCurrency(portfolio.totalValue)}</p>
        <div className="flex gap-4 mt-3">
          <div>
            <p className="text-xs text-foreground/50">Total Return</p>
            <p className={`text-sm font-semibold ${isPositive ? "text-success-500" : "text-danger-500"}`}>
              {formatCurrency(portfolio.totalGain)} ({formatPercent(portfolio.totalGainPercent)})
            </p>
          </div>
          <div>
            <p className="text-xs text-foreground/50">Day Change</p>
            <p className={`text-sm font-semibold ${isDayPositive ? "text-success-500" : "text-danger-500"}`}>
              {formatCurrency(portfolio.dayChange)} ({formatPercent(portfolio.dayChangePercent)})
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
