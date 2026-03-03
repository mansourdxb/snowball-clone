import Sidebar from "@/components/sidebar";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 bg-surface-50 dark:bg-surface-900 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
