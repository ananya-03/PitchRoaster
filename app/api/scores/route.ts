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

const MAX_SCORE_CONTEXT_CHARS = 900

function truncateForModel(value: string) {
  return value.length > MAX_SCORE_CONTEXT_CHARS
    ? value.slice(0, MAX_SCORE_CONTEXT_CHARS)
    : value
}

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return Response.json({ error: "OPENAI_API_KEY is not configured." }, { status: 500 })
  }

  const parsed = requestSchema.safeParse(await req.json())

  if (!parsed.success) {
    return Response.json({ error: "Invalid pitch or roast text." }, { status: 400 })
  }

  const { pitch, roastText } = parsed.data
  const modelPitch = truncateForModel(pitch)
  const modelRoastText = truncateForModel(roastText)

  const { output } = await generateText({
    model: openai("gpt-5.4"),
    output: Output.object({ schema: scoresSchema }),
    temperature: 0,
    maxOutputTokens: 80,
    prompt: `Return only 1-10 integer scores. originality: novel. marketSize: big market. executionRisk: hard to build. cringeFactor: buzzword/embarrassing.

Pitch: ${modelPitch}

Roast: ${modelRoastText}`,
  })

  return Response.json(output)
}
