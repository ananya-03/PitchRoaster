"use client"

import { motion } from "framer-motion"
import { Terminal } from "lucide-react"

interface StreamingTextProps {
  text: string
  isStreaming: boolean
}

export function StreamingText({ text, isStreaming }: StreamingTextProps) {
  const displayText = text.trim()

  if (!displayText && !isStreaming) return null

  return (
    <motion.div 
      className="relative glass-card rounded-2xl border border-white/10 overflow-hidden neon-border"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header bar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-black/20">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-neon-red/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-neon-green/80" />
        </div>
        <div className="flex items-center gap-2 ml-4">
          <Terminal className="w-4 h-4 text-neon-cyan" />
          <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
            roast_output.exe
          </span>
        </div>
        {isStreaming && (
          <motion.div 
            className="ml-auto flex items-center gap-2"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <div className="w-2 h-2 rounded-full bg-neon-pink" />
            <span className="text-xs font-mono text-neon-pink">LIVE</span>
          </motion.div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="font-mono text-sm leading-relaxed">
          <span className="text-neon-cyan">{">"}</span>
          <span className="text-neon-pink ml-2">$</span>
          <span className="text-foreground ml-2 whitespace-pre-wrap">
            {displayText.split('').map((char, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.02 }}
              >
                {char}
              </motion.span>
            ))}
          </span>
          {isStreaming && (
            <motion.span 
              className="inline-block w-3 h-5 ml-1 bg-neon-pink"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
          )}
        </div>
      </div>

      {/* Scanline effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'linear-gradient(transparent 50%, rgba(0, 0, 0, 0.05) 50%)',
          backgroundSize: '100% 4px',
        }}
      />

      {/* Glow effect at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-neon-pink/5 to-transparent pointer-events-none" />
    </motion.div>
  )
}
