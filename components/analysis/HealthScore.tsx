"use client";

import { cn } from "@/lib/utils";

interface HealthScoreProps {
  score: number;
  label: string;
}

export default function HealthScore({ score, label }: HealthScoreProps) {
  const getBarColor = (score: number) => {
    if (score >= 75) return "bg-green-500";
    if (score >= 50) return "bg-yellow-500";
    if (score >= 25) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">{label}</span>
        <span className="font-medium">{score}/100</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all", getBarColor(score))}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}
