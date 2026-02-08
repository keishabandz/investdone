import { HistoricalPrice, ForecastData } from "@/types/stock";

export class StockForecaster {
  static simpleMovingAverage(
    prices: HistoricalPrice[],
    days: number = 30
  ): ForecastData[] {
    const closePrices = prices.map((p) => p.close);
    const forecast: ForecastData[] = [];

    const lastSMA =
      closePrices.slice(-days).reduce((a, b) => a + b, 0) / days;

    const recentPrices = closePrices.slice(-days);
    const trend =
      (recentPrices[recentPrices.length - 1] - recentPrices[0]) / days;

    const mean =
      recentPrices.reduce((a, b) => a + b, 0) / recentPrices.length;
    const variance =
      recentPrices.reduce(
        (sum, price) => sum + Math.pow(price - mean, 2),
        0
      ) / recentPrices.length;
    const stdDev = Math.sqrt(variance);

    const lastDate = new Date(prices[prices.length - 1].date);

    for (let i = 1; i <= 30; i++) {
      const forecastDate = new Date(lastDate);
      forecastDate.setDate(lastDate.getDate() + i);

      const predictedPrice = lastSMA + trend * i;
      const confidence = stdDev * 1.96;

      forecast.push({
        date: forecastDate.toISOString().split("T")[0],
        predictedPrice: Math.max(0, predictedPrice),
        confidence: {
          lower: Math.max(0, predictedPrice - confidence),
          upper: predictedPrice + confidence,
        },
      });
    }

    return forecast;
  }

  static linearRegression(
    prices: HistoricalPrice[],
    forecastDays: number = 30
  ): ForecastData[] {
    const closePrices = prices.map((p, i) => ({ x: i, y: p.close }));
    const n = closePrices.length;

    const sumX = closePrices.reduce((sum, p) => sum + p.x, 0);
    const sumY = closePrices.reduce((sum, p) => sum + p.y, 0);
    const sumXY = closePrices.reduce((sum, p) => sum + p.x * p.y, 0);
    const sumX2 = closePrices.reduce((sum, p) => sum + p.x * p.x, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    const ssResidual = closePrices.reduce((sum, p) => {
      const predicted = slope * p.x + intercept;
      return sum + Math.pow(p.y - predicted, 2);
    }, 0);

    const standardError = Math.sqrt(ssResidual / (n - 2));

    const forecast: ForecastData[] = [];
    const lastDate = new Date(prices[prices.length - 1].date);

    for (let i = 1; i <= forecastDays; i++) {
      const forecastDate = new Date(lastDate);
      forecastDate.setDate(lastDate.getDate() + i);

      const x = n + i - 1;
      const predictedPrice = slope * x + intercept;
      const confidence = standardError * 1.96;

      forecast.push({
        date: forecastDate.toISOString().split("T")[0],
        predictedPrice: Math.max(0, predictedPrice),
        confidence: {
          lower: Math.max(0, predictedPrice - confidence),
          upper: predictedPrice + confidence,
        },
      });
    }

    return forecast;
  }
}
