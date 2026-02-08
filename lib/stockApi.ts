import axios from "axios";
import { StockData, HistoricalPrice } from "@/types/stock";

const FMP_KEY = process.env.FMP_API_KEY;

export class StockAPI {
  static async getQuote(symbol: string): Promise<StockData> {
    const response = await axios.get(
      `https://financialmodelingprep.com/api/v3/quote/${symbol}?apikey=${FMP_KEY}`
    );

    const data = response.data[0];
    if (!data) {
      throw new Error(`No data found for symbol: ${symbol}`);
    }

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
    const response = await axios.get(
      `https://financialmodelingprep.com/api/v3/historical-price-full/${symbol}?apikey=${FMP_KEY}`
    );

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
    const response = await axios.get(
      `https://financialmodelingprep.com/api/v3/search?query=${encodeURIComponent(query)}&limit=10&apikey=${FMP_KEY}`
    );

    return response.data;
  }

  static async getFinancialMetrics(symbol: string) {
    try {
      const response = await axios.get(
        `https://financialmodelingprep.com/api/v3/key-metrics/${symbol}?period=annual&apikey=${FMP_KEY}`
      );

      const latest = response.data[0];
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
