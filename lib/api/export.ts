/**
 * CSV/data export utilities for portfolios, holdings, and transactions.
 */

import type { Holding, Transaction, Dividend } from "@/lib/api/mock-data";

function arrayToCSV(headers: string[], rows: string[][]): string {
  const escape = (val: string) => {
    if (val.includes(",") || val.includes('"') || val.includes("\n")) {
      return `"${val.replace(/"/g, '""')}"`;
    }
    return val;
  };
  const lines = [headers.map(escape).join(",")];
  for (const row of rows) {
    lines.push(row.map(escape).join(","));
  }
  return lines.join("\n");
}

export function exportHoldingsCSV(holdings: Holding[]): string {
  const headers = ["Symbol", "Name", "Type", "Shares", "Avg Cost", "Current Price", "Market Value", "Gain/Loss", "Return %", "Allocation %", "Sector"];
  const rows = holdings.map((h) => [
    h.symbol,
    h.name,
    h.assetType,
    h.shares.toString(),
    h.averageCost.toFixed(2),
    h.currentPrice.toFixed(2),
    h.marketValue.toFixed(2),
    h.totalGain.toFixed(2),
    h.totalGainPercent.toFixed(2),
    h.allocation.toFixed(2),
    h.sector,
  ]);
  return arrayToCSV(headers, rows);
}

export function exportTransactionsCSV(transactions: Transaction[]): string {
  const headers = ["Date", "Symbol", "Type", "Shares", "Price/Share", "Total Amount", "Fees"];
  const rows = transactions.map((t) => [
    t.executedAt,
    t.symbol,
    t.type,
    t.shares.toString(),
    t.pricePerShare.toFixed(2),
    t.totalAmount.toFixed(2),
    t.fees.toFixed(2),
  ]);
  return arrayToCSV(headers, rows);
}

export function exportDividendsCSV(dividends: Dividend[]): string {
  const headers = ["Ex-Date", "Pay Date", "Symbol", "Amount/Share", "Shares", "Total", "Reinvested"];
  const rows = dividends.map((d) => [
    d.exDate,
    d.payDate,
    d.symbol,
    d.amountPerShare.toFixed(4),
    d.sharesHeld.toString(),
    d.totalAmount.toFixed(2),
    d.isReinvested ? "Yes" : "No",
  ]);
  return arrayToCSV(headers, rows);
}

export function downloadCSV(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
