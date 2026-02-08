"use client";

import { Card } from "@/components/ui/card";
import { FinancialMetrics as Metrics } from "@/types/stock";
import { formatCurrency } from "@/lib/utils";

interface FinancialMetricsProps {
  metrics: Metrics;
}

export default function FinancialMetrics({ metrics }: FinancialMetricsProps) {
  const items = [
    {
      label: "Revenue",
      value: formatCurrency(metrics.revenue),
    },
    {
      label: "Net Income",
      value: formatCurrency(metrics.netIncome),
    },
    {
      label: "EPS",
      value: `$${metrics.eps?.toFixed(2) || "N/A"}`,
    },
    {
      label: "ROE",
      value: metrics.roe ? `${(metrics.roe * 100).toFixed(2)}%` : "N/A",
    },
    {
      label: "Debt/Equity",
      value: metrics.debtToEquity?.toFixed(2) || "N/A",
    },
    {
      label: "Current Ratio",
      value: metrics.currentRatio?.toFixed(2) || "N/A",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {items.map((item) => (
        <Card key={item.label} className="p-4">
          <div className="text-sm text-gray-600 mb-1">{item.label}</div>
          <div className="text-lg font-semibold">{item.value}</div>
        </Card>
      ))}
    </div>
  );
}
