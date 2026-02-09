"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { AnalysisScore } from "@/types/stock";
import ValueScore from "./ValueScore";
import HealthScore from "./HealthScore";
import { Loader2 } from "lucide-react";

interface AIInsightsProps {
  symbol: string;
}

interface AnalysisData {
  scores: AnalysisScore;
  metrics: Record<string, number> | null;
}

interface AIExplainData {
  headline?: string;
  summary?: string;
  nextStep?: string;
}

export default function AIInsights({ symbol }: AIInsightsProps) {
  const [data, setData] = useState<AnalysisData | null>(null);
  const [explain, setExplain] = useState<AIExplainData | null>(null);
  const [explainLoading, setExplainLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalysis() {
      setLoading(true);
      try {
        const res = await fetch(`/api/analysis?symbol=${symbol}`);
        const result = await res.json();
        setData(result);
      } catch (error) {
        console.error("Analysis error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalysis();
  }, [symbol]);

  useEffect(() => {
    async function fetchExplain() {
      if (!data?.scores) return;

      setExplainLoading(true);
      try {
        const res = await fetch("/api/ai/explain", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ symbol, scores: data.scores }),
        });

        if (!res.ok) return;

        const result = await res.json();
        setExplain(result);
      } catch (error) {
        console.error("AI explain error:", error);
      } finally {
        setExplainLoading(false);
      }
    }

    fetchExplain();
  }, [data, symbol]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Analyzing {symbol}...</span>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12 text-gray-500">
        Failed to load analysis data
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <ValueScore
          score={data.scores.overall}
          label="Overall Score"
          size="lg"
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <ValueScore score={data.scores.value} label="Value" />
        <ValueScore score={data.scores.health} label="Health" />
        <ValueScore score={data.scores.momentum} label="Momentum" />
      </div>

      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4">Detailed Scores</h3>
        <div className="space-y-4">
          <HealthScore score={data.scores.value} label="Value Score" />
          <HealthScore score={data.scores.health} label="Financial Health" />
          <HealthScore score={data.scores.momentum} label="Price Momentum" />
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-3">Analysis Summary</h3>
        <div className="space-y-2 text-sm text-gray-700">
          <p>
            <strong>Value:</strong>{" "}
            {data.scores.value >= 60
              ? "The stock appears to be reasonably valued based on its P/E ratio and earnings metrics."
              : "The stock may be overvalued relative to its earnings. Consider waiting for a better entry point."}
          </p>
          <p>
            <strong>Health:</strong>{" "}
            {data.scores.health >= 60
              ? "The company shows strong financial health with solid fundamentals."
              : "The company's financial health shows some areas of concern. Review debt levels and profitability."}
          </p>
          <p>
            <strong>Momentum:</strong>{" "}
            {data.scores.momentum >= 60
              ? "Strong price momentum suggests positive market sentiment."
              : "Price momentum is weak, indicating potential headwinds or consolidation."}
          </p>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-3">AI Learning Coach</h3>
        {explainLoading ? (
          <p className="text-sm text-gray-500">Generating AI guidance...</p>
        ) : explain?.summary ? (
          <div className="space-y-2 text-sm text-gray-700">
            {explain.headline ? (
              <p className="font-semibold text-gray-900">{explain.headline}</p>
            ) : null}
            <p>{explain.summary}</p>
            {explain.nextStep ? (
              <p>
                <strong>Next step:</strong> {explain.nextStep}
              </p>
            ) : null}
          </div>
        ) : (
          <p className="text-sm text-gray-500">
            AI guidance unavailable. Check OPEN_AI_API_KEY in deployment
            settings.
          </p>
        )}
      </Card>
    </div>
  );
}
