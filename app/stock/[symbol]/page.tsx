"use client";

import { useState, useEffect, use } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PriceChart from "@/components/charts/PriceChart";
import ForecastChart from "@/components/charts/ForecastChart";
import AIInsights from "@/components/analysis/AIInsights";
import StockOverview from "@/components/stock/StockOverview";
import { StockData, HistoricalPrice } from "@/types/stock";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function StockPage({
  params,
}: {
  params: Promise<{ symbol: string }>;
}) {
  const { symbol: rawSymbol } = use(params);
  const symbol = rawSymbol.toUpperCase();

  const [stockData, setStockData] = useState<StockData | null>(null);
  const [historical, setHistorical] = useState<HistoricalPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const [quoteRes, forecastRes] = await Promise.all([
          fetch(`/api/stocks/${symbol}`),
          fetch("/api/forecast", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ symbol, method: "sma" }),
          }),
        ]);

        if (!quoteRes.ok) throw new Error("Failed to fetch stock data");

        const quoteData = await quoteRes.json();
        const forecastData = await forecastRes.json();

        setStockData(quoteData);
        setHistorical(forecastData.historical || []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load stock data"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [symbol]);

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-20 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        <p className="mt-4 text-gray-600">Loading {symbol} data...</p>
      </div>
    );
  }

  if (error || !stockData) {
    return (
      <div className="container mx-auto px-6 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Unable to Load Stock Data
        </h2>
        <p className="text-gray-600 mb-6">{error || "Unknown error"}</p>
        <Link
          href="/"
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          <ArrowLeft className="w-4 h-4 inline mr-1" />
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <Link
        href="/"
        className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Back to Home
      </Link>

      <StockOverview stock={stockData} />

      <div className="mt-8">
        <Tabs defaultValue="chart">
          <TabsList>
            <TabsTrigger value="chart">Price Chart</TabsTrigger>
            <TabsTrigger value="forecast">Forecast</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="chart">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Price History</h2>
              {historical.length > 0 ? (
                <PriceChart data={historical} />
              ) : (
                <p className="text-gray-500 text-center py-12">
                  No historical data available. Please configure your API keys.
                </p>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="forecast">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">30-Day Forecast</h2>
              <ForecastChart symbol={symbol} />
            </Card>
          </TabsContent>

          <TabsContent value="analysis">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                Investment Analysis
              </h2>
              <AIInsights symbol={symbol} />
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
