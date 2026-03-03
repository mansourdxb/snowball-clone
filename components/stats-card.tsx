interface StatsCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  subtitle?: string;
}

export default function StatsCard({ title, value, change, changeType = "neutral", subtitle }: StatsCardProps) {
  const changeColor =
    changeType === "positive"
      ? "text-success-500"
      : changeType === "negative"
        ? "text-danger-500"
        : "text-foreground/60";

  return (
    <div className="bg-white dark:bg-surface-800 rounded-xl p-6 shadow-sm border border-surface-200 dark:border-surface-700">
      <p className="text-sm font-medium text-foreground/60">{title}</p>
      <p className="text-2xl font-bold mt-2">{value}</p>
      {change && (
        <p className={`text-sm mt-1 font-medium ${changeColor}`}>{change}</p>
      )}
      {subtitle && (
        <p className="text-xs text-foreground/40 mt-1">{subtitle}</p>
      )}
    </div>
  );
}
