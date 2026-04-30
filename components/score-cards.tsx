"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Lightbulb, TrendingUp, AlertTriangle, Skull } from "lucide-react"

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

const scoreLabels: { 
  key: keyof Scores
  label: string
  description: string
  icon: React.ElementType
  gradient: string
  glowColor: string
}[] = [
  { 
    key: "originality", 
    label: "ORIGINALITY", 
    description: "How novel is this idea?",
    icon: Lightbulb,
    gradient: "from-neon-cyan to-blue-500",
    glowColor: "rgba(0, 255, 255, 0.3)"
  },
  { 
    key: "marketSize", 
    label: "MARKET SIZE", 
    description: "How big is the opportunity?",
    icon: TrendingUp,
    gradient: "from-neon-green to-emerald-500",
    glowColor: "rgba(0, 255, 150, 0.3)"
  },
  { 
    key: "executionRisk", 
    label: "EXEC RISK", 
    description: "How hard to build?",
    icon: AlertTriangle,
    gradient: "from-yellow-500 to-orange-500",
    glowColor: "rgba(255, 200, 0, 0.3)"
  },
  { 
    key: "cringeFactor", 
    label: "CRINGE", 
    description: "How embarrassing is this?",
    icon: Skull,
    gradient: "from-neon-pink to-neon-red",
    glowColor: "rgba(255, 50, 150, 0.3)"
  },
]

function getScoreColor(score: number, key: keyof Scores): string {
  const isInverted = key === "executionRisk" || key === "cringeFactor"
  const effectiveScore = isInverted ? 10 - score : score

  if (effectiveScore >= 7) return "from-neon-green to-emerald-400"
  if (effectiveScore >= 4) return "from-yellow-500 to-orange-400"
  return "from-neon-red to-red-600"
}

export function ScoreCards({ scores, show }: ScoreCardsProps) {
  if (!scores || !show) return null

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-xs font-bold text-neon-cyan uppercase tracking-[0.4em] font-mono">
          {">> ANALYSIS COMPLETE"}
        </h2>
      </motion.div>

      {/* Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {scoreLabels.map(({ key, label, description, icon: Icon, gradient, glowColor }, index) => (
          <motion.div
            key={key}
            className="relative group"
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              delay: index * 0.1,
              duration: 0.5,
              type: "spring",
              stiffness: 200
            }}
          >
            <motion.div
              className="glass-card p-5 rounded-2xl border border-white/10 relative overflow-hidden h-full"
              whileHover={{ 
                scale: 1.05,
                transition: { type: "spring", stiffness: 400 }
              }}
              style={{
                boxShadow: `0 0 30px ${glowColor}`
              }}
            >
              {/* Background gradient */}
              <div 
                className={cn(
                  "absolute inset-0 opacity-10 bg-gradient-to-br",
                  gradient
                )}
              />
              
              {/* Icon */}
              <motion.div 
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br",
                  gradient
                )}
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <Icon className="w-5 h-5 text-white" />
              </motion.div>

              {/* Label */}
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] font-mono mb-2">
                {label}
              </p>

              {/* Score */}
              <div className="flex items-baseline gap-1 mb-3">
                <motion.span 
                  className="text-4xl font-black text-foreground"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    delay: index * 0.1 + 0.3,
                    type: "spring",
                    stiffness: 300
                  }}
                >
                  {scores[key]}
                </motion.span>
                <span className="text-sm text-muted-foreground font-mono">/10</span>
              </div>

              {/* Progress bar */}
              <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-3">
                <motion.div
                  className={cn(
                    "h-full rounded-full bg-gradient-to-r",
                    getScoreColor(scores[key], key)
                  )}
                  initial={{ width: 0 }}
                  animate={{ width: `${scores[key] * 10}%` }}
                  transition={{ 
                    delay: index * 0.1 + 0.5,
                    duration: 1,
                    ease: "easeOut"
                  }}
                />
              </div>

              {/* Description */}
              <p className="text-xs text-muted-foreground/70">{description}</p>

              {/* Hover glow */}
              <motion.div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at center, ${glowColor}, transparent 70%)`
                }}
              />
            </motion.div>
          </motion.div>
        ))}
      </div>

      {/* Overall verdict */}
      <motion.div 
        className="glass-card p-6 rounded-2xl border border-white/10 text-center mt-8"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-neon-pink to-transparent" />
          <span className="text-xs font-bold text-neon-pink uppercase tracking-[0.3em] font-mono">
            VERDICT
          </span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-neon-pink to-transparent" />
        </div>
        <motion.p 
          className="text-lg font-bold text-foreground"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {getVerdict(scores)}
        </motion.p>
      </motion.div>
    </div>
  )
}

function getVerdict(scores: Scores): string {
  const avg = (scores.originality + scores.marketSize + (10 - scores.executionRisk) + (10 - scores.cringeFactor)) / 4
  
  if (avg >= 8) return "Actually... this might work. Don't let it get to your head."
  if (avg >= 6) return "Not terrible. But also not great. Keep iterating."
  if (avg >= 4) return "Your idea needs serious CPR. Call a mentor."
  return "Maybe try a different career? Just saying..."
}
