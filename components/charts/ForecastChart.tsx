"use client";

import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  ComposedChart,
  Legend,
} from "recharts";
import { Select } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

interface ForecastChartProps {
  symbol: string;
}

interface ForecastResponse {
  symbol: string;
  method: string;
  historical: Array<{ date: string; close: number }>;
  forecast: Array<{
    date: string;
    predictedPrice: number;
    confidence: { lower: number; upper: number };
  }>;
}

export default function ForecastChart({ symbol }: ForecastChartProps) {
  const [data, setData] = useState<ForecastResponse | null>(null);
  const [method, setMethod] = useState("sma");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchForecast() {
      setLoading(true);
      try {
        const res = await fetch("/api/forecast", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ symbol, method }),
        });
        const result = await res.json();
        setData(result);
      } catch (error) {
        console.error("Forecast error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchForecast();
  }, [symbol, method]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Generating forecast...</span>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-[400px] text-gray-500">
        Failed to load forecast data
      </div>
    );
  }

  const chartData = [
    ...data.historical.map((item) => ({
      date: new Date(item.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      actual: item.close,
      predicted: null as number | null,
      upper: null as number | null,
      lower: null as number | null,
    })),
    ...data.forecast.map((item) => ({
      date: new Date(item.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      actual: null as number | null,
      predicted: item.predictedPrice,
      upper: item.confidence.upper,
      lower: item.confidence.lower,
    })),
  ];

  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <label className="text-sm font-medium text-gray-700">
          Forecast Method:
        </label>
        <Select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className="w-48"
        >
          <option value="sma">Simple Moving Average</option>
          <option value="linear">Linear Regression</option>
        </Select>
      </div>

      <div className="w-full h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickLine={false}
              tickFormatter={(value) => `$${value}`}
              domain={["auto", "auto"]}
            />
            <Tooltip
              formatter={(value, name) => {
                if (value == null) return ["-", name];
                return [`$${Number(value).toFixed(2)}`, name];
              }}
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="actual"
              stroke="#2563eb"
              strokeWidth={2}
              dot={false}
              name="Actual Price"
              connectNulls={false}
            />
            <Line
              type="monotone"
              dataKey="predicted"
              stroke="#f59e0b"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              name="Predicted Price"
              connectNulls={false}
            />
            <Area
              type="monotone"
              dataKey="upper"
              stroke="none"
              fill="#f59e0b"
              fillOpacity={0.1}
              name="Upper Bound"
              connectNulls={false}
            />
            <Area
              type="monotone"
              dataKey="lower"
              stroke="none"
              fill="#f59e0b"
              fillOpacity={0.1}
              name="Lower Bound"
              connectNulls={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <p className="text-sm text-amber-800">
          <strong>Disclaimer:</strong> This forecast is based on historical
          price patterns using{" "}
          {method === "sma" ? "Simple Moving Average" : "Linear Regression"}{" "}
          analysis. It should not be used as the sole basis for investment
          decisions. Past performance does not guarantee future results.
        </p>
      </div>
    </div>
  );
}
