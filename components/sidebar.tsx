"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/portfolios/p1", label: "Portfolios", icon: "💼" },
  { href: "/analytics", label: "Analytics", icon: "📈" },
  { href: "/dividends", label: "Dividends", icon: "💰" },
  { href: "/settings", label: "Settings", icon: "⚙️" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-surface-900 text-white min-h-screen flex flex-col">
      <div className="p-6 border-b border-surface-700">
        <h1 className="text-xl font-bold tracking-tight">Snowball</h1>
        <p className="text-sm text-surface-200 mt-1">Portfolio Analytics</p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href.split("/").slice(0, 2).join("/") + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary-600 text-white"
                  : "text-surface-200 hover:bg-surface-800 hover:text-white"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-surface-700">
        <div className="flex items-center gap-3 px-4 py-2">
          <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-sm font-bold">
            U
          </div>
          <div>
            <p className="text-sm font-medium">Demo User</p>
            <p className="text-xs text-surface-200">demo@snowball.app</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
