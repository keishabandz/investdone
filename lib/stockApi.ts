import axios from "axios";
import { StockData, HistoricalPrice } from "@/types/stock";

const FMP_KEY = process.env.FMP_API_KEY;
const FMP_STABLE_BASE_URL = "https://financialmodelingprep.com/stable";

export class StockAPI {
  static async getQuote(symbol: string): Promise<StockData> {
    if (!FMP_KEY) {
      throw new Error("FMP_API_KEY is not configured");
    }

    const response = await axios.get(`${FMP_STABLE_BASE_URL}/quote`, {
      params: {
        symbol,
        apikey: FMP_KEY,
      },
    });

    const payload = response.data;
    const data = Array.isArray(payload) ? payload[0] : payload;

    if (
      data &&
      typeof data === "object" &&
      ("Error Message" in data || "error" in data || "message" in data)
    ) {
      const upstreamError =
        (data["Error Message"] as string) ||
        (data.error as string) ||
        (data.message as string) ||
        "Unknown FMP quote error";
      throw new Error(`FMP quote failed: ${upstreamError}`);
    }

    if (!data || typeof data !== "object") {
      console.error("FMP quote response:", JSON.stringify(payload));
      throw new Error(`No quote data found for symbol: ${symbol}`);
    }

    const parseChangesPercentage = (value: unknown) => {
      if (typeof value === "number") return value;
      if (typeof value === "string") {
        return Number(value.replace("%", "").trim()) || 0;
      }
      return 0;
    };

    return {
      symbol: (data.symbol as string) || symbol,
      companyName: (data.name as string) || symbol,
      currentPrice: Number(data.price) || 0,
      priceChange: Number(data.change) || 0,
      priceChangePercent: parseChangesPercentage(data.changesPercentage),
      marketCap: Number(data.marketCap) || 0,
      peRatio: Number(data.pe) || 0,
      dividendYield: Number(data.yield) || 0,
      fiftyTwoWeekHigh: Number(data.yearHigh) || 0,
      fiftyTwoWeekLow: Number(data.yearLow) || 0,
      volume: Number(data.volume) || 0,
    };
  }

  static async getHistoricalPrices(
    symbol: string,
    days: number = 365
  ): Promise<HistoricalPrice[]> {
    if (!FMP_KEY) {
      throw new Error("FMP_API_KEY is not configured");
    }

    const response = await axios.get(
      `${FMP_STABLE_BASE_URL}/historical-price-eod/full`,
      {
        params: {
          symbol,
          apikey: FMP_KEY,
        },
      }
    );

    const payload = response.data;
    const rows = Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.historical)
      ? payload.historical
      : Array.isArray(payload?.data)
      ? payload.data
      : [];

    if (
      payload &&
      typeof payload === "object" &&
      !Array.isArray(payload) &&
      ("Error Message" in payload ||
        "error" in payload ||
        "message" in payload)
    ) {
      const upstreamError =
        (payload["Error Message"] as string) ||
        (payload.error as string) ||
        (payload.message as string) ||
        "Unknown FMP historical error";
      throw new Error(`FMP historical failed: ${upstreamError}`);
    }

    if (!rows.length) {
      console.error("FMP historical response:", JSON.stringify(payload));
      throw new Error(`No historical data found for symbol: ${symbol}`);
    }

    const historical = rows
      .map((item: Record<string, unknown>) => ({
        date: item.date as string,
        open: Number(item.open) || Number(item.price) || 0,
        high: Number(item.high) || Number(item.price) || 0,
        low: Number(item.low) || Number(item.price) || 0,
        close: Number(item.close) || Number(item.price) || 0,
        volume: Number(item.volume) || 0,
      }));
    historical.sort((a, b) => a.date.localeCompare(b.date));

    return historical.slice(-days);
  }

  static async searchStocks(query: string) {
    if (!FMP_KEY) {
      throw new Error("FMP_API_KEY is not configured");
    }

    const url = "https://financialmodelingprep.com/stable/search-symbol";

    const response = await axios.get(url, {
      params: {
        query,
        limit: 10,
        apikey: FMP_KEY,
      },
    });

    if (!Array.isArray(response.data)) {
      console.error("FMP search response:", JSON.stringify(response.data));
      throw new Error("Invalid search response from FMP");
    }

    return response.data.map((item: Record<string, unknown>) => ({
      symbol: item.symbol as string,
      name: item.name as string,
      currency: (item.currency as string) || "",
      stockExchange:
        (item.exchangeFullName as string) ||
        (item.stockExchange as string) ||
        (item.exchange as string) ||
        "",
    }));
  }

  static async getFinancialMetrics(symbol: string) {
    if (!FMP_KEY) return null;

    try {
      const url = `https://financialmodelingprep.com/api/v3/key-metrics/${symbol}?period=annual&apikey=${FMP_KEY}`;
      const response = await axios.get(url);

      const latest = response.data?.[0];
      if (!latest) return null;

      return {
        revenue: latest.revenue,
        netIncome: latest.netIncome,
        eps: latest.netIncomePerShare,
        roe: latest.roe,
        debtToEquity: latest.debtToEquity,
        currentRatio: latest.currentRatio,
      };
    } catch {
      return null;
    }
  }
}
