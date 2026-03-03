"use client";

import { useState } from "react";
import { SUPPORTED_BROKERS, detectBroker, importCSV } from "@/lib/api/csv-import";
import type { ImportResult } from "@/lib/api/csv-import";
import { formatCurrency } from "@/lib/calculations/portfolio";

export default function ImportPage() {
  const [result, setResult] = useState<ImportResult | null>(null);
  const [dragActive, setDragActive] = useState(false);

  function handleFile(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (!text) return;
      const broker = detectBroker(text);
      const importResult = importCSV(text, broker);
      setResult(importResult);
    };
    reader.readAsText(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files?.[0]) handleFile(e.target.files[0]);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Import Transactions</h1>
        <p className="text-foreground/60 mt-1">Upload CSV files from your broker to import transactions</p>
      </div>

      {/* Drop zone */}
      <div
        className={`border-2 border-dashed rounded-2xl p-12 text-center transition-colors ${
          dragActive
            ? "border-primary-500 bg-primary-50 dark:bg-primary-900/10"
            : "border-surface-200 dark:border-surface-700"
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
      >
        <div className="text-4xl mb-4">📁</div>
        <p className="font-semibold mb-2">Drop your CSV file here</p>
        <p className="text-sm text-foreground/50 mb-4">or click to browse</p>
        <label className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-medium py-2.5 px-6 rounded-lg text-sm transition-colors cursor-pointer">
          Choose File
          <input type="file" accept=".csv" className="hidden" onChange={handleFileInput} />
        </label>
      </div>

      {/* Supported Brokers */}
      <div className="bg-white dark:bg-surface-800 rounded-xl p-6 shadow-sm border border-surface-200 dark:border-surface-700">
        <h2 className="font-semibold mb-4">Supported Brokers ({SUPPORTED_BROKERS.length})</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {SUPPORTED_BROKERS.map((b) => (
            <div key={b.id} className="text-sm font-medium px-3 py-2 bg-surface-50 dark:bg-surface-700 rounded-lg text-center">
              {b.name}
            </div>
          ))}
        </div>
      </div>

      {/* Import Results */}
      {result && (
        <div className="bg-white dark:bg-surface-800 rounded-xl shadow-sm border border-surface-200 dark:border-surface-700">
          <div className="p-6 border-b border-surface-200 dark:border-surface-700">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-lg">Import Results</h2>
              <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                result.errors.length === 0
                  ? "bg-success-500/10 text-success-500"
                  : "bg-warning-500/10 text-warning-500"
              }`}>
                {result.errors.length === 0 ? "Success" : `${result.errors.length} warnings`}
              </span>
            </div>
            <div className="flex gap-6 mt-3 text-sm">
              <span>Broker: <strong className="capitalize">{result.broker.replace(/_/g, " ")}</strong></span>
              <span>Parsed: <strong>{result.rowsParsed}</strong></span>
              <span>Skipped: <strong>{result.rowsSkipped}</strong></span>
            </div>
          </div>

          {result.errors.length > 0 && (
            <div className="px-6 py-3 bg-warning-500/5 border-b border-surface-200 dark:border-surface-700">
              <p className="text-sm font-medium text-warning-500 mb-1">Warnings:</p>
              {result.errors.map((err, i) => (
                <p key={i} className="text-xs text-foreground/60">{err}</p>
              ))}
            </div>
          )}

          {result.transactions.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-surface-200 dark:border-surface-700">
                    <th className="text-left py-3 px-4 font-semibold text-foreground/60">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground/60">Symbol</th>
                    <th className="text-center py-3 px-4 font-semibold text-foreground/60">Type</th>
                    <th className="text-right py-3 px-4 font-semibold text-foreground/60">Shares</th>
                    <th className="text-right py-3 px-4 font-semibold text-foreground/60">Price</th>
                    <th className="text-right py-3 px-4 font-semibold text-foreground/60">Total</th>
                    <th className="text-right py-3 px-4 font-semibold text-foreground/60">Fees</th>
                  </tr>
                </thead>
                <tbody>
                  {result.transactions.slice(0, 20).map((t, i) => (
                    <tr key={i} className="border-b border-surface-100 dark:border-surface-700/50">
                      <td className="py-3 px-4">{t.date}</td>
                      <td className="py-3 px-4 font-medium">{t.symbol}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          t.type === "buy" ? "bg-success-500/10 text-success-500" :
                          t.type === "sell" ? "bg-danger-500/10 text-danger-500" :
                          "bg-primary-100 text-primary-600"
                        }`}>
                          {t.type.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">{t.shares}</td>
                      <td className="py-3 px-4 text-right">{formatCurrency(t.pricePerShare)}</td>
                      <td className="py-3 px-4 text-right font-medium">{formatCurrency(t.totalAmount)}</td>
                      <td className="py-3 px-4 text-right text-foreground/50">{formatCurrency(t.fees)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {result.transactions.length > 20 && (
                <p className="px-4 py-3 text-sm text-foreground/50">
                  Showing first 20 of {result.transactions.length} transactions
                </p>
              )}
            </div>
          )}

          <div className="p-6 border-t border-surface-200 dark:border-surface-700 flex gap-3">
            <button className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2.5 px-6 rounded-lg text-sm transition-colors">
              Import {result.transactions.length} Transactions
            </button>
            <button
              onClick={() => setResult(null)}
              className="bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 font-medium py-2.5 px-6 rounded-lg text-sm transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
