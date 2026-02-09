import { NextRequest, NextResponse } from "next/server";
import { StockAPI } from "@/lib/stockApi";

export async function GET(request: NextRequest) {
  try {
    const query = request.nextUrl.searchParams.get("q");
    if (!query) {
      return NextResponse.json([]);
    }

    const results = await StockAPI.searchStocks(query);
    return NextResponse.json(results);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error";
    console.error("Search Error:", message);
    return NextResponse.json(
      { error: `Failed to search stocks: ${message}` },
      { status: 500 }
    );
  }
}
