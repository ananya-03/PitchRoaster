import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"
import { z } from "zod"

export const runtime = "edge"

const requestSchema = z.object({
  pitch: z.string().trim().min(10).max(5000),
  mode: z.enum(["savage", "nice"]),
})

const MAX_PITCH_CHARS = 1200

const prompts = {
  savage: `You are a brutally honest Silicon Valley VC. Give a specific, funny critique in 90 words or fewer. Name the biggest flaw and end with one actionable fix.`,
  nice: `You are a supportive but radically honest startup mentor. Give warm, direct feedback in 90 words or fewer. Name the top risk and one next step.`,
} satisfies Record<"savage" | "nice", string>

function truncateForModel(value: string) {
  return value.length > MAX_PITCH_CHARS
    ? `${value.slice(0, MAX_PITCH_CHARS)}\n\n[Pitch truncated to reduce API cost.]`
    : value
}

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return Response.json({ error: "OPENAI_API_KEY is not configured." }, { status: 500 })
  }

  const parsed = requestSchema.safeParse(await req.json())

  if (!parsed.success) {
    return Response.json({ error: "Invalid pitch or mode." }, { status: 400 })
  }

  const { pitch, mode } = parsed.data
  const modelPitch = truncateForModel(pitch)

  const result = streamText({
    model: openai("gpt-5.4"),
    system: prompts[mode],
    prompt: `Pitch:\n${modelPitch}`,
    temperature: mode === "savage" ? 0.7 : 0.5,
    maxOutputTokens: 180,
  })

  return result.toTextStreamResponse()
}
