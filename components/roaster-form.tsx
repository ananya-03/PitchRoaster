"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

interface RoasterFormProps {
  onSubmit: (pitch: string, mode: "savage" | "nice") => void
  isLoading: boolean
}

export function RoasterForm({ onSubmit, isLoading }: RoasterFormProps) {
  const [pitch, setPitch] = useState("")
  const [mode, setMode] = useState<"savage" | "nice">("savage")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (pitch.trim() && !isLoading) {
      onSubmit(pitch, mode)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      <div className="space-y-2">
        <label
          htmlFor="pitch"
          className="block text-sm font-medium text-muted-foreground uppercase tracking-wider"
        >
          Describe your startup
        </label>
        <textarea
          id="pitch"
          value={pitch}
          onChange={(e) => setPitch(e.target.value)}
          placeholder="We're building an AI-powered blockchain platform for dog walking..."
          className="w-full h-40 p-4 bg-secondary border border-border rounded-lg resize-none text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
          disabled={isLoading}
        />
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Mode Toggle */}
        <div className="flex items-center p-1 bg-secondary rounded-full border border-border">
          <button
            type="button"
            onClick={() => setMode("savage")}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all",
              mode === "savage"
                ? "bg-red-600 text-white"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Savage
          </button>
          <button
            type="button"
            onClick={() => setMode("nice")}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all",
              mode === "nice"
                ? "bg-emerald-600 text-white"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Nice
          </button>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!pitch.trim() || isLoading}
          className={cn(
            "px-6 py-3 rounded-lg font-medium text-sm transition-all",
            "bg-foreground text-background hover:opacity-90",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "flex items-center gap-2"
          )}
        >
          {isLoading ? (
            <>
              <span className="inline-block w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
              Roasting...
            </>
          ) : (
            <>Roast me →</>
          )}
        </button>
      </div>
    </form>
  )
}
