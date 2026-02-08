"use client";

import { cn } from "@/lib/utils";

interface ValueScoreProps {
  score: number;
  label: string;
  size?: "sm" | "lg";
}

function getScoreColor(score: number): string {
  if (score >= 75) return "text-green-600";
  if (score >= 50) return "text-yellow-600";
  if (score >= 25) return "text-orange-600";
  return "text-red-600";
}

function getScoreBg(score: number): string {
  if (score >= 75) return "bg-green-100";
  if (score >= 50) return "bg-yellow-100";
  if (score >= 25) return "bg-orange-100";
  return "bg-red-100";
}

function getScoreLabel(score: number): string {
  if (score >= 75) return "Excellent";
  if (score >= 50) return "Good";
  if (score >= 25) return "Fair";
  return "Poor";
}

export default function ValueScore({
  score,
  label,
  size = "sm",
}: ValueScoreProps) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={cn(
          "relative rounded-full flex items-center justify-center",
          getScoreBg(score),
          size === "lg" ? "w-28 h-28" : "w-20 h-20"
        )}
      >
        <span
          className={cn(
            "font-bold",
            getScoreColor(score),
            size === "lg" ? "text-3xl" : "text-xl"
          )}
        >
          {score}
        </span>
      </div>
      <div className="mt-2 text-sm font-medium text-gray-700">{label}</div>
      <div className={cn("text-xs", getScoreColor(score))}>
        {getScoreLabel(score)}
      </div>
    </div>
  );
}
