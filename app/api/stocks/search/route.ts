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
    console.error("Search Error:", error);
    return NextResponse.json(
      { error: "Failed to search stocks" },
      { status: 500 }
    );
  }
}
