"use client"

import { cn } from "@/lib/utils"

interface StreamingTextProps {
  text: string
  isStreaming: boolean
}

export function StreamingText({ text, isStreaming }: StreamingTextProps) {
  const displayText = text.trim()

  if (!displayText && !isStreaming) return null

  return (
    <div className="w-full p-6 bg-secondary/50 border border-border rounded-lg">
      <p className="text-foreground leading-relaxed whitespace-pre-wrap">
        {displayText}
        {isStreaming && (
          <span className="inline-block w-2 h-5 ml-1 bg-foreground animate-pulse" />
        )}
      </p>
    </div>
  )
}
