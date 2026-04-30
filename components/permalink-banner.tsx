"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface PermalinkBannerProps {
  show: boolean
  roastId: string | null
}

export function PermalinkBanner({ show, roastId }: PermalinkBannerProps) {
  const [copied, setCopied] = useState(false)
  const [permalink, setPermalink] = useState("")

  useEffect(() => {
    if (roastId && typeof window !== "undefined") {
      setPermalink(`${window.location.origin}/r/${roastId}`)
    }
  }, [roastId])

  if (!show || !roastId) return null

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(permalink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <div
      className={cn(
        "w-full p-4 bg-secondary border border-border rounded-lg",
        "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3",
        "transform transition-all duration-500 ease-out",
        show ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      )}
    >
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">
          Share this roast
        </p>
        <p className="text-sm text-foreground truncate font-mono">{permalink}</p>
      </div>
      <button
        onClick={handleCopy}
        className={cn(
          "px-4 py-2 rounded-lg text-sm font-medium transition-all shrink-0",
          "border border-border hover:bg-accent",
          copied ? "bg-emerald-600/20 text-emerald-400 border-emerald-600/50" : "text-foreground"
        )}
      >
        {copied ? (
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Copied!
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Copy link
          </span>
        )}
      </button>
    </div>
  )
}
