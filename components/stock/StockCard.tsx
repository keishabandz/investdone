"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";
import Link from "next/link";
import { formatCurrency, formatLargeNumber, formatPercent } from "@/lib/utils";

interface StockCardProps {
  symbol: string;
  companyName: string;
  currentPrice: number;
  priceChange: number;
  priceChangePercent: number;
  marketCap: number;
}

export default function StockCard({
  symbol,
  companyName,
  currentPrice,
  priceChange,
  priceChangePercent,
  marketCap,
}: StockCardProps) {
  const isPositive = priceChange >= 0;

  return (
    <Link href={`/stock/${symbol}`}>
      <Card className="p-5 hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-bold text-lg">{symbol}</h3>
            <p className="text-sm text-gray-600 truncate max-w-[200px]">
              {companyName}
            </p>
          </div>
          <Badge variant={isPositive ? "success" : "destructive"}>
            {isPositive ? (
              <TrendingUp className="w-3 h-3 mr-1" />
            ) : (
              <TrendingDown className="w-3 h-3 mr-1" />
            )}
            {formatPercent(priceChangePercent)}
          </Badge>
        </div>
        <div className="flex items-end justify-between">
          <div className="text-2xl font-bold">
            {formatCurrency(currentPrice)}
          </div>
          <div className="text-sm text-gray-500">
            {formatLargeNumber(marketCap)}
          </div>
        </div>
      </Card>
    </Link>
  );
}
