"use client";

import { Card } from "@/components/ui/card";
import { StockData } from "@/types/stock";
import { formatCurrency, formatLargeNumber, formatPercent } from "@/lib/utils";
import { TrendingUp, TrendingDown, BarChart3 } from "lucide-react";

interface StockOverviewProps {
  stock: StockData;
}

export default function StockOverview({ stock }: StockOverviewProps) {
  const isPositive = stock.priceChange >= 0;

  const metrics = [
    { label: "Market Cap", value: formatLargeNumber(stock.marketCap) },
    {
      label: "P/E Ratio",
      value: stock.peRatio ? stock.peRatio.toFixed(2) : "N/A",
    },
    {
      label: "Dividend Yield",
      value: stock.dividendYield
        ? `${stock.dividendYield.toFixed(2)}%`
        : "N/A",
    },
    {
      label: "52W High",
      value: formatCurrency(stock.fiftyTwoWeekHigh),
    },
    {
      label: "52W Low",
      value: formatCurrency(stock.fiftyTwoWeekLow),
    },
    {
      label: "Volume",
      value: stock.volume?.toLocaleString() || "N/A",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">
            {stock.companyName}
          </h1>
          <p className="text-lg text-gray-500 mt-1">{stock.symbol}</p>
        </div>
        <div className="text-right">
          <div className="text-4xl font-bold">
            {formatCurrency(stock.currentPrice)}
          </div>
          <div
            className={`flex items-center justify-end gap-1 text-lg ${
              isPositive ? "text-green-600" : "text-red-600"
            }`}
          >
            {isPositive ? (
              <TrendingUp className="w-5 h-5" />
            ) : (
              <TrendingDown className="w-5 h-5" />
            )}
            {formatCurrency(Math.abs(stock.priceChange))} (
            {formatPercent(stock.priceChangePercent)})
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {metrics.map((metric) => (
          <Card key={metric.label} className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <BarChart3 className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">{metric.label}</span>
            </div>
            <div className="text-xl font-semibold">{metric.value}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}
