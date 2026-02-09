import axios from "axios";
import { StockData, HistoricalPrice } from "@/types/stock";

const FMP_KEY = process.env.FMP_API_KEY;

export class StockAPI {
  static async getQuote(symbol: string): Promise<StockData> {
    if (!FMP_KEY) {
      throw new Error("FMP_API_KEY is not configured");
    }

    const url = `https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=${FMP_KEY}`;
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

    const url = `https://financialmodelingprep.com/api/v3/historical-price-full/${symbol}?apikey=${FMP_KEY}`;
    const response = await axios.get(url);

    if (!response.data?.historical) {
      console.error("FMP historical response:", JSON.stringify(response.data));
      throw new Error(`No historical data for symbol: ${symbol}`);
    }

    const historical = response.data.historical
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

    return historical;
  }

  static async searchStocks(query: string) {
    if (!FMP_KEY) {
      throw new Error("FMP_API_KEY is not configured");
    }

    const url = `https://financialmodelingprep.com/api/v3/search?query=${encodeURIComponent(query)}&limit=10&apikey=${FMP_KEY}`;
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
