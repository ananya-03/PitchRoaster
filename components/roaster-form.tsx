"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Flame, Sparkles } from "lucide-react"

interface RoasterFormProps {
  onSubmit: (pitch: string, mode: "savage" | "nice") => void
  isLoading: boolean
}

export function RoasterForm({ onSubmit, isLoading }: RoasterFormProps) {
  const [pitch, setPitch] = useState("")
  const [mode, setMode] = useState<"savage" | "nice">("savage")
  const [isFocused, setIsFocused] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (pitch.trim() && !isLoading) {
      onSubmit(pitch, mode)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-8">
      {/* Textarea Container */}
      <motion.div 
        className="space-y-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <label
          htmlFor="pitch"
          className="block text-xs font-bold text-neon-pink uppercase tracking-[0.3em] font-mono"
        >
          {">> DESCRIBE YOUR STARTUP"}
        </label>
        
        <motion.div
          className={cn(
            "relative rounded-2xl transition-all duration-500",
            isFocused ? "neon-border" : ""
          )}
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <textarea
            id="pitch"
            value={pitch}
            onChange={(e) => setPitch(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="We're building an AI-powered blockchain platform for dog walking..."
            className={cn(
              "w-full h-48 p-6 rounded-2xl resize-none font-mono text-sm leading-relaxed",
              "glass-card text-foreground placeholder:text-muted-foreground/50",
              "focus:outline-none transition-all duration-300",
              "border border-white/10",
              isFocused && "border-neon-pink/50 shadow-[0_0_30px_rgba(255,50,150,0.2)]"
            )}
            disabled={isLoading}
          />
          
          {/* Character count */}
          <div className="absolute bottom-4 right-4 text-xs font-mono text-muted-foreground/50">
            {pitch.length} chars
          </div>
        </motion.div>
      </motion.div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        {/* Mode Toggle */}
        <motion.div 
          className="glass-card p-1.5 rounded-full flex items-center border border-white/10"
          whileHover={{ scale: 1.02 }}
        >
          <motion.button
            type="button"
            onClick={() => setMode("savage")}
            className={cn(
              "relative px-6 py-3 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2",
              mode === "savage"
                ? "text-white"
                : "text-muted-foreground hover:text-foreground"
            )}
            whileTap={{ scale: 0.95 }}
          >
            {mode === "savage" && (
              <motion.div
                layoutId="modeIndicator"
                className="absolute inset-0 bg-gradient-to-r from-neon-red to-neon-pink rounded-full"
                style={{ boxShadow: "0 0 20px rgba(255, 50, 100, 0.5)" }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <Flame className="w-4 h-4" />
              Savage
            </span>
          </motion.button>
          
          <motion.button
            type="button"
            onClick={() => setMode("nice")}
            className={cn(
              "relative px-6 py-3 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2",
              mode === "nice"
                ? "text-white"
                : "text-muted-foreground hover:text-foreground"
            )}
            whileTap={{ scale: 0.95 }}
          >
            {mode === "nice" && (
              <motion.div
                layoutId="modeIndicator"
                className="absolute inset-0 bg-gradient-to-r from-neon-green to-neon-cyan rounded-full"
                style={{ boxShadow: "0 0 20px rgba(0, 255, 200, 0.5)" }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
            <span className="relative z-10 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Nice
            </span>
          </motion.button>
        </motion.div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={!pitch.trim() || isLoading}
          className={cn(
            "relative px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-wider overflow-hidden",
            "bg-gradient-to-r from-neon-pink to-neon-red text-white",
            "disabled:opacity-40 disabled:cursor-not-allowed disabled:from-muted disabled:to-muted",
            "transition-all duration-300 group"
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={isLoading ? {} : { 
            boxShadow: [
              "0 0 20px rgba(255, 50, 150, 0.4)",
              "0 0 40px rgba(255, 50, 150, 0.6)",
              "0 0 20px rgba(255, 50, 150, 0.4)"
            ]
          }}
          transition={{ 
            boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          {/* Animated background */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
          
          <span className="relative z-10 flex items-center gap-3">
            {isLoading ? (
              <>
                <motion.div 
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <span className="flicker">ROASTING...</span>
              </>
            ) : (
              <>
                <Flame className="w-5 h-5 group-hover:animate-pulse" />
                ROAST ME
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  {">>"}
                </motion.span>
              </>
            )}
          </span>
        </motion.button>
      </div>

      {/* Visual hint */}
      <motion.div 
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-xs text-muted-foreground/50 font-mono">
          {mode === "savage" 
            ? "[ WARNING: NO MERCY MODE ACTIVATED ]" 
            : "[ CONSTRUCTIVE FEEDBACK MODE ]"
          }
        </p>
      </motion.div>
    </form>
  )
}
