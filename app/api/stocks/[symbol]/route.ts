import { NextRequest, NextResponse } from "next/server";
import { StockAPI } from "@/lib/stockApi";
import { supabase } from "@/lib/supabase";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ symbol: string }> }
) {
  try {
    const { symbol: rawSymbol } = await params;
    const symbol = rawSymbol.toUpperCase();

    // Check cache first (if Supabase is configured)
    if (supabase) {
      const { data: cached } = await supabase
        .from("stock_cache")
        .select("*")
        .eq("symbol", symbol)
        .single();

      if (
        cached &&
        new Date(cached.updated_at).getTime() > Date.now() - 15 * 60 * 1000
      ) {
        return NextResponse.json(cached.data);
      }
    }

    // Fetch fresh data
    const stockData = await StockAPI.getQuote(symbol);

    // Update cache (best effort, if Supabase is configured)
    if (supabase) {
      await supabase.from("stock_cache").upsert({
        symbol,
        company_name: stockData.companyName,
        current_price: stockData.currentPrice,
        price_change: stockData.priceChange,
        price_change_percent: stockData.priceChangePercent,
        market_cap: stockData.marketCap,
        pe_ratio: stockData.peRatio,
        dividend_yield: stockData.dividendYield,
        fifty_two_week_high: stockData.fiftyTwoWeekHigh,
        fifty_two_week_low: stockData.fiftyTwoWeekLow,
        data: stockData,
        updated_at: new Date().toISOString(),
      });
    }

    return NextResponse.json(stockData);
  } catch (error) {
    console.error("API Error:", error);
    const message =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to fetch stock data", details: message },
      { status: 500 }
    );
  }
}
