"use client"

import { useState, useCallback, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { RoasterForm } from "@/components/roaster-form"
import { StreamingText } from "@/components/streaming-text"
import { ScoreCards } from "@/components/score-cards"
import { PhonkBackground } from "@/components/phonk-background"
import type { Scores } from "@/lib/roast"

export default function Home() {
  const [isLoading, setIsLoading] = useState(false)
  const [streamingText, setStreamingText] = useState("")
  const [isStreaming, setIsStreaming] = useState(false)
  const [scores, setScores] = useState<Scores | null>(null)
  const [showScores, setShowScores] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

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
    <main className="min-h-screen bg-background relative overflow-hidden scanlines vhs-effect">
      <PhonkBackground />
      
      {/* Cursor glow effect */}
      <div 
        className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 50, 150, 0.06), transparent 40%)`
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-12 sm:py-20">
        {/* Header */}
        <motion.header 
          className="text-center mb-16"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            className="inline-block mb-4"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <h1 className="text-5xl sm:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-neon-pink via-neon-cyan to-neon-pink glitch-text">
              PITCH ROASTER
            </h1>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="relative"
          >
            <p className="text-lg sm:text-xl text-muted-foreground max-w-lg mx-auto font-mono flicker">
              {"// BRUTAL HONESTY FOR FOUNDERS WHO CAN HANDLE THE TRUTH"}
            </p>
            <p className="text-sm text-neon-pink/60 mt-2 uppercase tracking-[0.3em]">
              Submit your pitch. Get destroyed.
            </p>
          </motion.div>

          {/* Decorative elements */}
          <motion.div 
            className="flex justify-center gap-4 mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-neon-pink"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </motion.div>
        </motion.header>

        {/* Form */}
        <motion.section 
          className="mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <RoasterForm onSubmit={handleSubmit} isLoading={isLoading} />
        </motion.section>

        {/* Streaming Output */}
        <AnimatePresence>
          {(streamingText || isStreaming) && (
            <motion.section 
              className="mb-12"
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.5 }}
            >
              <StreamingText text={streamingText} isStreaming={isStreaming} />
            </motion.section>
          )}
        </AnimatePresence>

        {/* Score Cards */}
        <AnimatePresence>
          {scores && (
            <motion.section 
              className="mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ScoreCards scores={scores} show={showScores} />
            </motion.section>
          )}
        </AnimatePresence>

        {/* Footer */}
        <motion.footer 
          className="mt-20 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="glass-card inline-block px-6 py-3 rounded-full">
            <p className="text-xs text-muted-foreground font-mono tracking-wider">
              {"<NO_FEELINGS_CONSIDERED />"}
            </p>
          </div>
        </motion.footer>
      </div>
    </main>
  )
}
