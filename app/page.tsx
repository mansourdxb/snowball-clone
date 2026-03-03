import Link from "next/link";

const features = [
  { icon: "📊", title: "Portfolio Tracking", desc: "Track unlimited portfolios with stocks, ETFs, crypto, and more across 70+ global exchanges." },
  { icon: "📈", title: "Advanced Analytics", desc: "IRR, Sharpe Ratio, Sortino, Beta, Alpha — all the metrics serious investors need." },
  { icon: "💰", title: "Dividend Intelligence", desc: "Calendar, forecasting, yield analysis, and dividend ratings with 13 fundamental parameters." },
  { icon: "⚖️", title: "Rebalancing", desc: "One-click rebalancing suggestions with target allocation tracking and what-if scenarios." },
  { icon: "🔬", title: "Portfolio Lab", desc: "Backtest strategies with 30+ years of historical data, including dividend reinvestment." },
  { icon: "🌍", title: "Multi-Currency", desc: "25+ currencies with real-time FX conversion. Track global investments in your home currency." },
  { icon: "🔗", title: "Broker Sync", desc: "Auto-import from 1,000+ brokerages via Yodlee. Or upload CSV from 15+ supported brokers." },
  { icon: "📱", title: "Company Research", desc: "10+ years of financial statements, peer comparisons, and dividend history for any stock." },
];

const stats = [
  { value: "50K+", label: "Active Investors" },
  { value: "70+", label: "Exchanges Supported" },
  { value: "25+", label: "Currencies" },
  { value: "30+", label: "Years Historical Data" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-surface-900">
      {/* Nav */}
      <nav className="border-b border-surface-200 dark:border-surface-700">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <span className="text-xl font-bold">Snowball</span>
          <div className="flex items-center gap-6">
            <Link href="/pricing" className="text-sm font-medium text-foreground/70 hover:text-foreground">Pricing</Link>
            <Link href="/login" className="text-sm font-medium text-foreground/70 hover:text-foreground">Sign In</Link>
            <Link href="/register" className="text-sm font-medium bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors">
              Start Free Trial
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 py-24 text-center">
        <div className="inline-block bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
          14-day free trial — No credit card required
        </div>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight max-w-4xl mx-auto leading-tight">
          Your investments,{" "}
          <span className="text-primary-600">crystal clear</span>
        </h1>
        <p className="text-xl text-foreground/60 mt-6 max-w-2xl mx-auto">
          The all-in-one portfolio tracker with professional-grade analytics.
          Track performance, analyze risk, and grow your dividends.
        </p>
        <div className="flex gap-4 justify-center mt-10">
          <Link
            href="/register"
            className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-8 rounded-lg text-base transition-colors"
          >
            Get Started Free
          </Link>
          <Link
            href="/pricing"
            className="bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 font-medium py-3 px-8 rounded-lg text-base transition-colors"
          >
            View Pricing
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-surface-50 dark:bg-surface-800 border-y border-surface-200 dark:border-surface-700">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-bold text-primary-600">{s.value}</p>
              <p className="text-sm text-foreground/60 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold">Everything you need to manage your investments</h2>
          <p className="text-lg text-foreground/60 mt-4 max-w-2xl mx-auto">
            From basic tracking to advanced analytics — Snowball grows with your portfolio.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-white dark:bg-surface-800 rounded-xl p-6 border border-surface-200 dark:border-surface-700 hover:shadow-md transition-shadow"
            >
              <span className="text-3xl mb-4 block">{f.icon}</span>
              <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-sm text-foreground/60 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary-600 text-white">
        <div className="max-w-4xl mx-auto px-6 py-20 text-center">
          <h2 className="text-3xl font-bold">Start tracking your portfolio today</h2>
          <p className="text-lg text-white/80 mt-4">
            Join thousands of investors who use Snowball to make smarter investment decisions.
          </p>
          <Link
            href="/register"
            className="inline-block mt-8 bg-white text-primary-600 hover:bg-white/90 font-medium py-3 px-8 rounded-lg text-base transition-colors"
          >
            Start Your Free Trial
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-surface-200 dark:border-surface-700">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between gap-8">
          <div>
            <p className="font-bold text-lg">Snowball</p>
            <p className="text-sm text-foreground/50 mt-1">Portfolio analytics for modern investors.</p>
          </div>
          <div className="flex gap-12 text-sm">
            <div className="space-y-2">
              <p className="font-semibold">Product</p>
              <Link href="/pricing" className="block text-foreground/60 hover:text-foreground">Pricing</Link>
              <Link href="/register" className="block text-foreground/60 hover:text-foreground">Sign Up</Link>
            </div>
            <div className="space-y-2">
              <p className="font-semibold">Company</p>
              <span className="block text-foreground/60">About</span>
              <span className="block text-foreground/60">Contact</span>
            </div>
            <div className="space-y-2">
              <p className="font-semibold">Legal</p>
              <span className="block text-foreground/60">Privacy</span>
              <span className="block text-foreground/60">Terms</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
