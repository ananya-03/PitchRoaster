"use client"

import { useState, useCallback } from "react"
import { RoasterForm } from "@/components/roaster-form"
import { StreamingText } from "@/components/streaming-text"
import { ScoreCards } from "@/components/score-cards"
import type { Scores } from "@/lib/roast"

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [streamingText, setStreamingText] = useState("")
  const [isStreaming, setIsStreaming] = useState(false)
  const [scores, setScores] = useState<Scores | null>(null)
  const [showScores, setShowScores] = useState(false)

  const handleSubmit = useCallback(async (pitch: string, mode: "savage" | "nice") => {
    setIsLoading(true)
    setStreamingText("")
    setIsStreaming(true)
    setScores(null)
    setShowScores(false)

    try {
      const response = await fetch("/api/roast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pitch, mode }),
      })

      if (!response.ok) throw new Error("Failed to get roast")

      const reader = response.body?.getReader()
      if (!reader) throw new Error("No reader available")

      const decoder = new TextDecoder()
      let fullText = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        fullText += chunk
        setStreamingText(fullText)
      }

      setIsStreaming(false)

      const scoresResponse = await fetch("/api/scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pitch, roastText: fullText }),
      })

      if (!scoresResponse.ok) throw new Error("Failed to score roast")

      const generatedScores = (await scoresResponse.json()) as Scores
      setScores(generatedScores)
      setTimeout(() => setShowScores(true), 300)

    } catch (error) {
      console.error("[v0] Error during roast:", error)
      setStreamingText("Something went wrong. Even your API request failed - that's a bad sign for your startup.")
      setIsStreaming(false)
    } finally {
      setIsLoading(false)
    }
  }, [])

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-12 sm:py-20">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight mb-4">
            Pitch Roaster
          </h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Brutal honesty for founders who can handle the truth. 
            Submit your pitch. Get destroyed.
          </p>
        </header>

        {/* Form */}
        <section className="mb-8">
          <RoasterForm onSubmit={handleSubmit} isLoading={isLoading} />
        </section>

        {/* Streaming Output */}
        {(streamingText || isStreaming) && (
          <section className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <StreamingText text={streamingText} isStreaming={isStreaming} />
          </section>
        )}

        {/* Score Cards */}
        {scores && (
          <section className="mb-8">
            <ScoreCards scores={scores} show={showScores} />
          </section>
        )}

        {/* Footer */}
        <footer className="mt-16 text-center">
          <p className="text-xs text-muted-foreground">
            Built for founders with thick skin. No feelings were considered in the making of this app.
          </p>
        </footer>
      </div>
    </main>
  )
}
