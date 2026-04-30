import { openai } from "@ai-sdk/openai"
import { generateText, Output } from "ai"
import { z } from "zod"

export const runtime = "edge"

const scoresSchema = z.object({
  originality: z.number().int().min(1).max(10),
  marketSize: z.number().int().min(1).max(10),
  executionRisk: z.number().int().min(1).max(10),
  cringeFactor: z.number().int().min(1).max(10),
})

const requestSchema = z.object({
  pitch: z.string().trim().min(10).max(5000),
  roastText: z.string().trim().min(1).max(4000),
})

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return Response.json({ error: "OPENAI_API_KEY is not configured." }, { status: 500 })
  }

  const parsed = requestSchema.safeParse(await req.json())

  if (!parsed.success) {
    return Response.json({ error: "Invalid pitch or roast text." }, { status: 400 })
  }

  const { pitch, roastText } = parsed.data

  const { output } = await generateText({
    model: openai("gpt-5.4"),
    output: Output.object({ schema: scoresSchema }),
    temperature: 0.2,
    maxOutputTokens: 250,
    prompt: `Score this startup pitch from 1 to 10.

Use these meanings:
- originality: 10 is groundbreaking, 1 is completely derivative.
- marketSize: 10 is massive, 1 is tiny.
- executionRisk: 10 is extremely hard to build or scale, 1 is straightforward.
- cringeFactor: 10 is painfully buzzword-heavy or embarrassing, 1 is credible and crisp.

Pitch:
${pitch}

Roast:
${roastText}`,
  })

  return Response.json(output)
}
