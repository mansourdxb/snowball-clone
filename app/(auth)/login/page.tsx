import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-lg p-8 border border-surface-200 dark:border-surface-700">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="text-sm text-foreground/60 mt-2">Sign in to your Snowball account</p>
      </div>
      <form className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1.5">Email</label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            className="w-full px-4 py-2.5 rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1.5">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Your password"
            className="w-full px-4 py-2.5 rounded-lg border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <Link href="/dashboard">
          <button
            type="button"
            className="w-full mt-2 bg-primary-600 hover:bg-primary-700 text-white font-medium py-2.5 rounded-lg text-sm transition-colors"
          >
            Sign In
          </button>
        </Link>
      </form>
      <p className="text-center text-sm text-foreground/60 mt-6">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-primary-600 hover:underline font-medium">
          Sign up
        </Link>
      </p>
    </div>
  );
}
