import { NextRequest, NextResponse } from "next/server";
import { StockAPI } from "@/lib/stockApi";
import { AnalysisScore } from "@/types/stock";

function calculateScores(
  quote: { peRatio: number; priceChangePercent: number; dividendYield: number; currentPrice: number; fiftyTwoWeekHigh: number; fiftyTwoWeekLow: number },
  metrics: { roe: number; debtToEquity: number; currentRatio: number } | null
): AnalysisScore {
  // Value score based on P/E ratio
  let valueScore = 50;
  if (quote.peRatio > 0) {
    if (quote.peRatio < 15) valueScore = 85;
    else if (quote.peRatio < 20) valueScore = 70;
    else if (quote.peRatio < 30) valueScore = 55;
    else if (quote.peRatio < 50) valueScore = 35;
    else valueScore = 20;
  }

  // Health score based on financial metrics
  let healthScore = 50;
  if (metrics) {
    const roeScore = metrics.roe > 0.15 ? 80 : metrics.roe > 0.1 ? 60 : 40;
    const debtScore =
      metrics.debtToEquity < 0.5 ? 80 : metrics.debtToEquity < 1 ? 60 : 30;
    const liquidityScore =
      metrics.currentRatio > 2 ? 80 : metrics.currentRatio > 1 ? 60 : 30;
    healthScore = Math.round((roeScore + debtScore + liquidityScore) / 3);
  }

  // Momentum score based on price performance
  const pricePosition =
    (quote.currentPrice - quote.fiftyTwoWeekLow) /
    (quote.fiftyTwoWeekHigh - quote.fiftyTwoWeekLow || 1);
  const momentumScore = Math.round(pricePosition * 100);

  // Overall score
  const overall = Math.round(
    valueScore * 0.35 + healthScore * 0.35 + momentumScore * 0.3
  );

  return {
    value: Math.min(100, Math.max(0, valueScore)),
    health: Math.min(100, Math.max(0, healthScore)),
    momentum: Math.min(100, Math.max(0, momentumScore)),
    overall: Math.min(100, Math.max(0, overall)),
  };
}

export async function GET(request: NextRequest) {
  try {
    const symbol = request.nextUrl.searchParams.get("symbol");
    if (!symbol) {
      return NextResponse.json(
        { error: "Symbol is required" },
        { status: 400 }
      );
    }

    const [quote, metrics] = await Promise.all([
      StockAPI.getQuote(symbol),
      StockAPI.getFinancialMetrics(symbol),
    ]);

    const scores = calculateScores(quote, metrics);

    return NextResponse.json({
      symbol,
      scores,
      metrics,
      quote,
    });
  } catch (error) {
    console.error("Analysis Error:", error);
    return NextResponse.json(
      { error: "Failed to generate analysis" },
      { status: 500 }
    );
  }
}
