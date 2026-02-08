"use client";

import { useState, useCallback } from "react";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface SearchResult {
  symbol: string;
  name: string;
  currency: string;
  stockExchange: string;
}

export default function StockSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const router = useRouter();

  const handleSearch = useCallback(async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(
        `/api/stocks/search?q=${encodeURIComponent(query)}`
      );
      const data = await res.json();
      setResults(data);
      setShowResults(true);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  }, [query]);

  const handleSelect = (symbol: string) => {
    setShowResults(false);
    setQuery("");
    router.push(`/stock/${symbol}`);
  };

  return (
    <div className="w-full max-w-2xl relative">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Search stocks (e.g., AAPL, TSLA, MSFT)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          onFocus={() => results.length > 0 && setShowResults(true)}
          className="flex-1"
        />
        <Button onClick={handleSearch} disabled={loading}>
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Search className="w-4 h-4" />
          )}
        </Button>
      </div>

      {showResults && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border z-50 max-h-96 overflow-y-auto">
          {results.map((stock) => (
            <button
              key={stock.symbol}
              onClick={() => handleSelect(stock.symbol)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b last:border-b-0 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-900">
                    {stock.symbol}
                  </div>
                  <div className="text-sm text-gray-600">{stock.name}</div>
                </div>
                <div className="text-xs text-gray-400">
                  {stock.stockExchange}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
