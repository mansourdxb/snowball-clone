/**
 * CSV import engine — parses transaction CSVs from 15+ brokers.
 * Each broker has a different CSV format; we normalize them to a common schema.
 */

export interface ParsedTransaction {
  date: string;
  symbol: string;
  type: "buy" | "sell" | "dividend";
  shares: number;
  pricePerShare: number;
  totalAmount: number;
  fees: number;
  currency: string;
}

export interface ImportResult {
  success: boolean;
  transactions: ParsedTransaction[];
  errors: string[];
  broker: string;
  rowsParsed: number;
  rowsSkipped: number;
}

export type BrokerFormat =
  | "interactive_brokers"
  | "schwab"
  | "fidelity"
  | "robinhood"
  | "etrade"
  | "td_ameritrade"
  | "vanguard"
  | "degiro"
  | "trading212"
  | "freetrade"
  | "webull"
  | "tastyworks"
  | "firstrade"
  | "alpaca"
  | "generic";

export const SUPPORTED_BROKERS: { id: BrokerFormat; name: string; columns: string[] }[] = [
  { id: "interactive_brokers", name: "Interactive Brokers", columns: ["TradeDate", "Symbol", "Buy/Sell", "Quantity", "Price", "Commission"] },
  { id: "schwab", name: "Charles Schwab", columns: ["Date", "Action", "Symbol", "Quantity", "Price", "Fees & Comm", "Amount"] },
  { id: "fidelity", name: "Fidelity", columns: ["Run Date", "Action", "Symbol", "Quantity", "Price ($)", "Commission ($)", "Amount ($)"] },
  { id: "robinhood", name: "Robinhood", columns: ["Activity Date", "Process Date", "Settle Date", "Instrument", "Trans Code", "Quantity", "Price", "Amount"] },
  { id: "etrade", name: "E*TRADE", columns: ["TransactionDate", "TransactionType", "SecurityType", "Symbol", "Quantity", "Amount", "Price", "Commission"] },
  { id: "td_ameritrade", name: "TD Ameritrade", columns: ["DATE", "TRANSACTION ID", "DESCRIPTION", "QUANTITY", "SYMBOL", "PRICE", "COMMISSION", "AMOUNT"] },
  { id: "vanguard", name: "Vanguard", columns: ["Trade Date", "Settlement Date", "Transaction Type", "Account Number", "Symbol", "Shares", "Share Price", "Principal Amount"] },
  { id: "degiro", name: "DEGIRO", columns: ["Date", "Time", "Product", "ISIN", "Exchange", "Quantity", "Price", "Local value", "Value", "Transaction costs"] },
  { id: "trading212", name: "Trading 212", columns: ["Action", "Time", "ISIN", "Ticker", "Name", "No. of shares", "Price / share", "Currency", "Total"] },
  { id: "freetrade", name: "Freetrade", columns: ["Title", "Type", "Timestamp", "Account", "Amount", "Currency", "Price per share", "Quantity"] },
  { id: "webull", name: "Webull", columns: ["Date", "Symbol", "Side", "Qty", "Price", "Status", "Filled"] },
  { id: "tastyworks", name: "Tastyworks", columns: ["Date", "Type", "Action", "Symbol", "Quantity", "Average Price", "Commissions", "Fees"] },
  { id: "firstrade", name: "Firstrade", columns: ["Trade Date", "Settlement Date", "Action", "Symbol", "Quantity", "Price", "Commission", "Net Amount"] },
  { id: "alpaca", name: "Alpaca", columns: ["date", "symbol", "side", "qty", "price", "total", "commission"] },
  { id: "generic", name: "Generic CSV", columns: ["Date", "Symbol", "Type", "Shares", "Price", "Total", "Fees"] },
];

/**
 * Parse a CSV string into an array of rows (string[][])
 */
function parseCSVRaw(csvText: string): string[][] {
  const lines = csvText.trim().split("\n");
  return lines.map((line) => {
    const values: string[] = [];
    let current = "";
    let inQuotes = false;
    for (const char of line) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        values.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    return values;
  });
}

/**
 * Detect broker format from CSV headers
 */
export function detectBroker(csvText: string): BrokerFormat {
  const firstLine = csvText.trim().split("\n")[0].toLowerCase();
  if (firstLine.includes("tradedate") && firstLine.includes("buy/sell")) return "interactive_brokers";
  if (firstLine.includes("action") && firstLine.includes("fees & comm")) return "schwab";
  if (firstLine.includes("run date") && firstLine.includes("commission")) return "fidelity";
  if (firstLine.includes("activity date") && firstLine.includes("trans code")) return "robinhood";
  if (firstLine.includes("transactiondate") && firstLine.includes("securitytype")) return "etrade";
  if (firstLine.includes("isin") && firstLine.includes("local value")) return "degiro";
  if (firstLine.includes("ticker") && firstLine.includes("no. of shares")) return "trading212";
  if (firstLine.includes("price per share") && firstLine.includes("title")) return "freetrade";
  return "generic";
}

/**
 * Import transactions from a generic CSV format
 */
export function importCSV(csvText: string, broker: BrokerFormat = "generic"): ImportResult {
  const rows = parseCSVRaw(csvText);
  if (rows.length < 2) {
    return { success: false, transactions: [], errors: ["CSV has no data rows"], broker, rowsParsed: 0, rowsSkipped: 0 };
  }

  const headers = rows[0].map((h) => h.toLowerCase().replace(/[^a-z0-9]/g, ""));
  const dataRows = rows.slice(1);
  const transactions: ParsedTransaction[] = [];
  const errors: string[] = [];
  let skipped = 0;

  const findCol = (names: string[]) => headers.findIndex((h) => names.some((n) => h.includes(n)));

  const dateCol = findCol(["date", "tradedate", "rundate", "activitydate", "time"]);
  const symbolCol = findCol(["symbol", "ticker", "instrument", "product"]);
  const typeCol = findCol(["type", "action", "side", "buysell", "transcode", "transactiontype"]);
  const sharesCol = findCol(["shares", "quantity", "qty", "noofshares"]);
  const priceCol = findCol(["price", "priceshare", "averageprice", "shareprice"]);
  const totalCol = findCol(["total", "amount", "netamount", "principalamount", "value"]);
  const feesCol = findCol(["fees", "commission", "commissions", "transactioncosts"]);

  for (let i = 0; i < dataRows.length; i++) {
    const row = dataRows[i];
    try {
      const rawType = (typeCol >= 0 ? row[typeCol] : "").toLowerCase();
      let type: "buy" | "sell" | "dividend" = "buy";
      if (rawType.includes("sell") || rawType.includes("sold")) type = "sell";
      else if (rawType.includes("div")) type = "dividend";

      const shares = Math.abs(parseFloat(row[sharesCol] || "0") || 0);
      const price = Math.abs(parseFloat((row[priceCol] || "0").replace(/[$,]/g, "")) || 0);
      const total = totalCol >= 0 ? Math.abs(parseFloat((row[totalCol] || "0").replace(/[$,]/g, "")) || 0) : shares * price;
      const fees = feesCol >= 0 ? Math.abs(parseFloat((row[feesCol] || "0").replace(/[$,]/g, "")) || 0) : 0;

      if (shares === 0 && total === 0) {
        skipped++;
        continue;
      }

      transactions.push({
        date: dateCol >= 0 ? row[dateCol] : "",
        symbol: symbolCol >= 0 ? row[symbolCol].toUpperCase() : "UNKNOWN",
        type,
        shares,
        pricePerShare: price || (shares > 0 ? total / shares : 0),
        totalAmount: total || shares * price,
        fees,
        currency: "USD",
      });
    } catch {
      errors.push(`Row ${i + 2}: failed to parse`);
      skipped++;
    }
  }

  return {
    success: errors.length === 0,
    transactions,
    errors,
    broker,
    rowsParsed: transactions.length,
    rowsSkipped: skipped,
  };
}
