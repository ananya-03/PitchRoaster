"use client"

import { cn } from "@/lib/utils"

interface Scores {
  originality: number
  marketSize: number
  executionRisk: number
  cringeFactor: number
}

interface ScoreCardsProps {
  scores: Scores | null
  show: boolean
}

const scoreLabels: { key: keyof Scores; label: string; description: string }[] = [
  { key: "originality", label: "Originality", description: "How novel is this idea?" },
  { key: "marketSize", label: "Market Size", description: "How big is the opportunity?" },
  { key: "executionRisk", label: "Execution Risk", description: "How hard to build?" },
  { key: "cringeFactor", label: "Cringe Factor", description: "How embarrassing is this?" },
]

function getScoreColor(score: number, key: keyof Scores): string {
  // For execution risk and cringe factor, lower is better (so we invert the logic)
  const isInverted = key === "executionRisk" || key === "cringeFactor"
  const effectiveScore = isInverted ? 10 - score : score

  if (effectiveScore >= 7) return "bg-emerald-500"
  if (effectiveScore >= 4) return "bg-amber-500"
  return "bg-red-500"
}

export function ScoreCards({ scores, show }: ScoreCardsProps) {
  if (!scores || !show) return null

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {scoreLabels.map(({ key, label, description }, index) => (
        <div
          key={key}
          className={cn(
            "p-4 bg-secondary border border-border rounded-lg",
            "transform transition-all duration-500 ease-out",
            show
              ? "translate-y-0 opacity-100"
              : "translate-y-4 opacity-0"
          )}
          style={{
            transitionDelay: `${index * 100}ms`,
          }}
        >
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {label}
            </span>
            <span className="text-2xl font-bold text-foreground">
              {scores[key]}
              <span className="text-sm text-muted-foreground font-normal">/10</span>
            </span>
          </div>
          <div className="h-1.5 bg-border rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-1000 ease-out",
                getScoreColor(scores[key], key)
              )}
              style={{
                width: show ? `${scores[key] * 10}%` : "0%",
                transitionDelay: `${index * 100 + 300}ms`,
              }}
            />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">{description}</p>
        </div>
      ))}
    </div>
  )
}
