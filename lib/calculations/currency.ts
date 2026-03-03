/**
 * Multi-currency support — FX conversion utilities.
 * Uses mock rates for now; replace with real API (e.g., exchangerate-api.com).
 */

export const SUPPORTED_CURRENCIES = [
  "USD", "EUR", "GBP", "CHF", "JPY", "CAD", "AUD", "NZD", "SEK", "NOK",
  "DKK", "SGD", "HKD", "KRW", "TWD", "CNY", "INR", "BRL", "MXN", "ZAR",
  "TRY", "PLN", "CZK", "ILS", "AED",
] as const;

export type CurrencyCode = (typeof SUPPORTED_CURRENCIES)[number];

// Mock exchange rates (relative to USD)
const MOCK_RATES: Record<string, number> = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.79,
  CHF: 0.88,
  JPY: 149.5,
  CAD: 1.36,
  AUD: 1.53,
  NZD: 1.65,
  SEK: 10.42,
  NOK: 10.58,
  DKK: 6.87,
  SGD: 1.34,
  HKD: 7.82,
  KRW: 1320.0,
  TWD: 31.5,
  CNY: 7.24,
  INR: 83.1,
  BRL: 4.97,
  MXN: 17.15,
  ZAR: 18.65,
  TRY: 30.2,
  PLN: 4.02,
  CZK: 22.8,
  ILS: 3.67,
  AED: 3.67,
};

export function getExchangeRate(from: string, to: string): number {
  const fromRate = MOCK_RATES[from] || 1;
  const toRate = MOCK_RATES[to] || 1;
  return toRate / fromRate;
}

export function convertCurrency(amount: number, from: string, to: string): number {
  if (from === to) return amount;
  return amount * getExchangeRate(from, to);
}

export function formatCurrencyValue(value: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function getCurrencySymbol(currency: string): string {
  const symbols: Record<string, string> = {
    USD: "$", EUR: "€", GBP: "£", CHF: "CHF", JPY: "¥", CAD: "C$",
    AUD: "A$", NZD: "NZ$", SGD: "S$", HKD: "HK$", KRW: "₩", CNY: "¥",
    INR: "₹", BRL: "R$", TRY: "₺", PLN: "zł", CZK: "Kč", ILS: "₪",
    AED: "د.إ",
  };
  return symbols[currency] || currency;
}
