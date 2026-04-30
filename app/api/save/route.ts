import { put } from "@vercel/blob"
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
  mode: z.enum(["savage", "nice"]),
  roastText: z.string().trim().min(1).max(4000),
  scores: scoresSchema,
})

function createRoastId() {
  return crypto.randomUUID().slice(0, 8)
}

export async function POST(req: Request) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return Response.json({ error: "BLOB_READ_WRITE_TOKEN is not configured." }, { status: 500 })
  }

  const parsed = requestSchema.safeParse(await req.json())

  if (!parsed.success) {
    return Response.json({ error: "Invalid roast payload." }, { status: 400 })
  }

  const id = createRoastId()
  const pathname = `roasts/${id}.json`
  const payload = {
    id,
    ...parsed.data,
    createdAt: new Date().toISOString(),
  }

  const blob = await put(pathname, JSON.stringify(payload), {
    access: "public",
    addRandomSuffix: false,
    contentType: "application/json",
  })

  return Response.json({ id, url: `/r/${id}`, blobUrl: blob.url })
}
