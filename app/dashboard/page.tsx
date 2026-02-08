"use client";

import { useState } from "react";
import StockSearch from "@/components/stock/StockSearch";
import StockCard from "@/components/stock/StockCard";
import { Card } from "@/components/ui/card";
import { BarChart3, Clock, Star } from "lucide-react";

const WATCHLIST_STOCKS = [
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
];

const RECENT_SEARCHES = ["TSLA", "NVDA", "AMZN", "META"];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"watchlist" | "recent">(
    "watchlist"
  );

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Track your favorite stocks and recent searches
        </p>
      </div>

      <div className="mb-8">
        <StockSearch />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Star className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Watchlist Items</div>
              <div className="text-2xl font-bold">
                {WATCHLIST_STOCKS.length}
              </div>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <BarChart3 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Analyses Run</div>
              <div className="text-2xl font-bold">12</div>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="text-sm text-gray-600">Recent Searches</div>
              <div className="text-2xl font-bold">
                {RECENT_SEARCHES.length}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("watchlist")}
          className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "watchlist"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <Star className="w-4 h-4 inline mr-1" />
          Watchlist
        </button>
        <button
          onClick={() => setActiveTab("recent")}
          className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === "recent"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          <Clock className="w-4 h-4 inline mr-1" />
          Recent Searches
        </button>
      </div>

      {/* Content */}
      {activeTab === "watchlist" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {WATCHLIST_STOCKS.map((stock) => (
            <StockCard key={stock.symbol} {...stock} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {RECENT_SEARCHES.map((symbol) => (
            <Card key={symbol} className="p-4 hover:shadow-md transition-shadow">
              <a href={`/stock/${symbol}`} className="block text-center">
                <div className="text-lg font-bold text-blue-600">{symbol}</div>
                <div className="text-sm text-gray-500">View Details</div>
              </a>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
