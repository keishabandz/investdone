import { NextRequest, NextResponse } from "next/server";
import { StockAPI } from "@/lib/stockApi";
import { StockForecaster } from "@/lib/forecasting";

export async function POST(request: NextRequest) {
  try {
    const { symbol, method = "sma", days = 30 } = await request.json();

    const historical = await StockAPI.getHistoricalPrices(symbol, 365);

    let forecast;
    if (method === "linear") {
      forecast = StockForecaster.linearRegression(historical, days);
    } else {
      forecast = StockForecaster.simpleMovingAverage(historical, days);
    }

    return NextResponse.json({
      symbol,
      method,
      historical: historical.slice(-90),
      forecast,
    });
  } catch (error) {
    console.error("Forecast Error:", error);
    return NextResponse.json(
      { error: "Failed to generate forecast" },
      { status: 500 }
    );
  }
}
