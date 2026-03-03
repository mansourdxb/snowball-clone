interface ChartPlaceholderProps {
  title: string;
  height?: string;
}

export default function ChartPlaceholder({ title, height = "h-64" }: ChartPlaceholderProps) {
  return (
    <div className={`bg-white dark:bg-surface-800 rounded-xl p-6 shadow-sm border border-surface-200 dark:border-surface-700 ${height}`}>
      <h3 className="font-semibold mb-4">{title}</h3>
      <div className="flex items-center justify-center h-[calc(100%-2rem)] text-foreground/30 border-2 border-dashed border-surface-200 dark:border-surface-700 rounded-lg">
        <p className="text-sm">Chart: {title} — connect a charting library (e.g. Recharts)</p>
      </div>
    </div>
  );
}
