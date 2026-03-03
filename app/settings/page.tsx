export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-foreground/60 mt-1">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-surface-800 rounded-xl p-6 shadow-sm border border-surface-200 dark:border-surface-700">
          <h2 className="font-semibold text-lg mb-4">Profile</h2>
          <form className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1.5">Full Name</label>
              <input
                id="name"
                type="text"
                defaultValue="Demo User"
                className="w-full px-4 py-2.5 rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label htmlFor="settingsEmail" className="block text-sm font-medium mb-1.5">Email</label>
              <input
                id="settingsEmail"
                type="email"
                defaultValue="demo@snowball.app"
                className="w-full px-4 py-2.5 rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <button
              type="button"
              className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2.5 px-6 rounded-lg text-sm transition-colors"
            >
              Save Changes
            </button>
          </form>
        </div>

        <div className="bg-white dark:bg-surface-800 rounded-xl p-6 shadow-sm border border-surface-200 dark:border-surface-700">
          <h2 className="font-semibold text-lg mb-4">Preferences</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="currency" className="block text-sm font-medium mb-1.5">Default Currency</label>
              <select
                id="currency"
                defaultValue="USD"
                className="w-full px-4 py-2.5 rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="CHF">CHF - Swiss Franc</option>
                <option value="JPY">JPY - Japanese Yen</option>
              </select>
            </div>
            <div>
              <label htmlFor="benchmark" className="block text-sm font-medium mb-1.5">Default Benchmark</label>
              <select
                id="benchmark"
                defaultValue="SPY"
                className="w-full px-4 py-2.5 rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="SPY">S&P 500 (SPY)</option>
                <option value="QQQ">Nasdaq 100 (QQQ)</option>
                <option value="VTI">Total US Market (VTI)</option>
                <option value="VXUS">International (VXUS)</option>
              </select>
            </div>
            <button
              type="button"
              className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2.5 px-6 rounded-lg text-sm transition-colors"
            >
              Update Preferences
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-surface-800 rounded-xl p-6 shadow-sm border border-surface-200 dark:border-surface-700">
        <h2 className="font-semibold text-lg mb-4">Connected Accounts</h2>
        <p className="text-sm text-foreground/60 mb-4">Connect your brokerage accounts to automatically sync your portfolio data.</p>
        <div className="space-y-3">
          {["Interactive Brokers", "Schwab", "Fidelity", "Robinhood"].map((broker) => (
            <div key={broker} className="flex justify-between items-center py-3 border-b border-surface-100 dark:border-surface-700/50 last:border-0">
              <span className="font-medium">{broker}</span>
              <button
                type="button"
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                Connect
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
