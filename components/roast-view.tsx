import Link from "next/link"
import type { SavedRoast, Scores } from "@/lib/roast"
import { ScoreCards } from "@/components/score-cards"

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value))
}

export function RoastView({ roast }: { roast: SavedRoast }) {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:py-20">
        <header className="mb-8">
          <Link
            href="/"
            className="mb-6 inline-flex text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Roast your own pitch
          </Link>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-foreground">
                Saved Roast
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {roast.mode === "savage" ? "Savage mode" : "Nice mode"} · {formatDate(roast.createdAt)}
              </p>
            </div>
            <Link
              href="/"
              className="inline-flex w-fit rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
            >
              Roast me →
            </Link>
          </div>
        </header>

        <section className="mb-6 rounded-lg border border-border bg-secondary/50 p-5">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Pitch
          </p>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
            {roast.pitch}
          </p>
        </section>

        <section className="mb-8 rounded-lg border border-border bg-secondary/50 p-6">
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Roast
          </p>
          <p className="whitespace-pre-wrap leading-relaxed text-foreground">
            {roast.roastText}
          </p>
        </section>

        <ScoreCards scores={roast.scores as Scores} show />
      </div>
    </main>
  )
}
