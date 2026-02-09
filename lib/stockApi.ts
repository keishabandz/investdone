import axios from "axios";
import { StockData, HistoricalPrice } from "@/types/stock";

const FMP_KEY = process.env.FMP_API_KEY;
const BASE_URL = "https://financialmodelingprep.com/stable";

export class StockAPI {
  static async getQuote(symbol: string): Promise<StockData> {
    if (!FMP_KEY) {
      throw new Error("FMP_API_KEY is not configured");
    }

    const url = `${BASE_URL}/quote?symbol=${encodeURIComponent(symbol)}&apikey=${FMP_KEY}`;
    const response = await axios.get(url);

    if (!Array.isArray(response.data) || !response.data[0]) {
      console.error("FMP quote response:", JSON.stringify(response.data));
      throw new Error(`No data found for symbol: ${symbol}`);
    }

    const data = response.data[0];

    return {
      symbol: data.symbol,
      companyName: data.name,
      currentPrice: data.price,
      priceChange: data.change,
      priceChangePercent: data.changesPercentage,
      marketCap: data.marketCap,
      peRatio: data.pe,
      dividendYield: data.yield || 0,
      fiftyTwoWeekHigh: data.yearHigh,
      fiftyTwoWeekLow: data.yearLow,
      volume: data.volume,
    };
  }

  static async getHistoricalPrices(
    symbol: string,
    days: number = 365
  ): Promise<HistoricalPrice[]> {
    if (!FMP_KEY) {
      throw new Error("FMP_API_KEY is not configured");
    }

    const url = `${BASE_URL}/historical-price-eod/full?symbol=${encodeURIComponent(symbol)}&apikey=${FMP_KEY}`;
    const response = await axios.get(url);

    const historical = Array.isArray(response.data) ? response.data : response.data?.historical;

    if (!Array.isArray(historical)) {
      console.error("FMP historical response:", JSON.stringify(response.data));
      throw new Error(`No historical data for symbol: ${symbol}`);
    }

    return historical
      .slice(0, days)
      .reverse()
      .map((item: Record<string, unknown>) => ({
        date: item.date as string,
        open: item.open as number,
        high: item.high as number,
        low: item.low as number,
        close: item.close as number,
        volume: item.volume as number,
      }));
  }

  static async searchStocks(query: string) {
    if (!FMP_KEY) {
      throw new Error("FMP_API_KEY is not configured");
    }

    const url = `${BASE_URL}/search-symbol?query=${encodeURIComponent(query)}&limit=10&apikey=${FMP_KEY}`;
    const response = await axios.get(url);

    if (!Array.isArray(response.data)) {
      console.error("FMP search response:", JSON.stringify(response.data));
      throw new Error("Invalid search response from FMP");
    }

    return response.data;
  }

  static async getFinancialMetrics(symbol: string) {
    if (!FMP_KEY) return null;

    try {
      const url = `${BASE_URL}/key-metrics?symbol=${encodeURIComponent(symbol)}&period=annual&apikey=${FMP_KEY}`;
      const response = await axios.get(url);

      const data = Array.isArray(response.data) ? response.data : null;
      const latest = data?.[0];
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
