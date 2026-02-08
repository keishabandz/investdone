export interface StockData {
  symbol: string;
  companyName: string;
  currentPrice: number;
  priceChange: number;
  priceChangePercent: number;
  marketCap: number;
  peRatio: number;
  dividendYield: number;
  fiftyTwoWeekHigh: number;
  fiftyTwoWeekLow: number;
  volume: number;
}

export interface HistoricalPrice {
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface ForecastData {
  date: string;
  predictedPrice: number;
  confidence: {
    lower: number;
    upper: number;
  };
}

export interface FinancialMetrics {
  revenue: number;
  netIncome: number;
  eps: number;
  roe: number;
  debtToEquity: number;
  currentRatio: number;
}

export interface AnalysisScore {
  value: number;
  health: number;
  momentum: number;
  overall: number;
}
