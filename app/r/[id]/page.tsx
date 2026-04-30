import { list } from "@vercel/blob"
import { notFound } from "next/navigation"
import { RoastView } from "@/components/roast-view"
import type { SavedRoast } from "@/lib/roast"

export const runtime = "edge"

async function getRoast(id: string): Promise<SavedRoast | null> {
  try {
    const pathname = `roasts/${id}.json`
    const { blobs } = await list({ prefix: pathname, limit: 1 })
    const blob = blobs.find((item) => item.pathname === pathname)

    if (!blob) {
      return null
    }

    const response = await fetch(blob.url, { cache: "no-store" })

    if (!response.ok) {
      return null
    }

    return response.json()
  } catch {
    return null
  }
}

export default async function SavedRoastPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const roast = await getRoast(id)

  if (!roast) {
    notFound()
  }

  return <RoastView roast={roast} />
}
