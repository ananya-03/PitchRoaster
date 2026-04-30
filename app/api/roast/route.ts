import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"
import { z } from "zod"

export const runtime = "edge"

const requestSchema = z.object({
  pitch: z.string().trim().min(10).max(5000),
  mode: z.enum(["savage", "nice"]),
})

const prompts = {
  savage: `You are a brutally honest Silicon Valley VC who has seen 10,000 pitches and is exhausted by all of them.
Roast the pitch like a disappointed investor at demo day. Be specific, be savage, be funny.
Point out exactly what's wrong: vague TAM claims, "Uber for X" thinking, obvious competition they ignored.
End with exactly one genuine, actionable piece of advice.
Keep it under 200 words.`,
  nice: `You are a supportive but radically honest startup mentor. You want this founder to succeed,
but you refuse to sugarcoat real problems. Give warm but direct feedback.
Acknowledge what's genuinely good, then clearly name the 2-3 biggest risks.
End with one concrete next step they should take this week.
Keep it under 200 words.`,
} satisfies Record<"savage" | "nice", string>

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return Response.json({ error: "OPENAI_API_KEY is not configured." }, { status: 500 })
  }

  const parsed = requestSchema.safeParse(await req.json())

  if (!parsed.success) {
    return Response.json({ error: "Invalid pitch or mode." }, { status: 400 })
  }

  const { pitch, mode } = parsed.data

  const result = streamText({
    model: openai("gpt-5.4"),
    system: prompts[mode],
    prompt: `Startup pitch:\n\n${pitch}`,
    temperature: mode === "savage" ? 0.9 : 0.65,
    maxOutputTokens: 500,
  })

  return result.toTextStreamResponse()
}
