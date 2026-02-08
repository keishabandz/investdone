import StockSearch from "@/components/stock/StockSearch";
import StockCard from "@/components/stock/StockCard";
import { BarChart3, TrendingUp, Shield, Zap } from "lucide-react";

const POPULAR_STOCKS = [
  {
    symbol: "AAPL",
    companyName: "Apple Inc.",
    currentPrice: 178.72,
    priceChange: 2.34,
    priceChangePercent: 1.33,
    marketCap: 2800000000000,
  },
  {
    symbol: "MSFT",
    companyName: "Microsoft Corporation",
    currentPrice: 378.91,
    priceChange: -1.23,
    priceChangePercent: -0.32,
    marketCap: 2810000000000,
  },
  {
    symbol: "GOOGL",
    companyName: "Alphabet Inc.",
    currentPrice: 141.8,
    priceChange: 0.95,
    priceChangePercent: 0.67,
    marketCap: 1780000000000,
  },
  {
    symbol: "TSLA",
    companyName: "Tesla, Inc.",
    currentPrice: 248.42,
    priceChange: 5.67,
    priceChangePercent: 2.33,
    marketCap: 789000000000,
  },
  {
    symbol: "AMZN",
    companyName: "Amazon.com, Inc.",
    currentPrice: 178.25,
    priceChange: -0.45,
    priceChangePercent: -0.25,
    marketCap: 1850000000000,
  },
  {
    symbol: "NVDA",
    companyName: "NVIDIA Corporation",
    currentPrice: 495.22,
    priceChange: 12.34,
    priceChangePercent: 2.56,
    marketCap: 1220000000000,
  },
];

const FEATURES = [
  {
    icon: TrendingUp,
    title: "Price Forecasting",
    description:
      "AI-powered stock price predictions using multiple forecasting models",
  },
  {
    icon: BarChart3,
    title: "Financial Analysis",
    description:
      "Comprehensive financial metrics and scoring for any publicly traded stock",
  },
  {
    icon: Shield,
    title: "Health Scoring",
    description:
      "Evaluate company financial health with our proprietary scoring system",
  },
  {
    icon: Zap,
    title: "Real-time Data",
    description: "Up-to-date stock prices and market data at your fingertips",
  },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-6 py-20 text-center">
          <h1 className="text-5xl font-bold mb-4">
            Smart Investment Analysis
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Make informed investment decisions with AI-powered forecasting,
            financial analysis, and comprehensive stock scoring.
          </p>
          <div className="flex justify-center">
            <StockSearch />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">
          Powerful Investment Tools
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            >
              <feature.icon className="w-10 h-10 text-blue-600 mb-4" />
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Stocks Section */}
      <section className="container mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-4">Popular Stocks</h2>
        <p className="text-center text-gray-600 mb-8">
          Quick access to the most popular stocks. Click any stock to see
          detailed analysis.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {POPULAR_STOCKS.map((stock) => (
            <StockCard key={stock.symbol} {...stock} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-gray-900">InvestDone</span>
            </div>
            <p className="text-sm text-gray-500">
              Disclaimer: This app provides financial data and forecasts for
              educational purposes only. Not financial advice.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
