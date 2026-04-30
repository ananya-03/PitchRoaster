# PRD: Pitch Roaster

**Project type:** Hackathon (Zero to Agent — Vercel Build Week)  
**Timeline:** 1 hour  
**Stack:** Next.js (App Router) · Vercel AI SDK · Vercel Blob · v0  
**Goal:** Build, demo, and deploy a startup pitch roaster that streams savage (or kind) AI feedback live on stage.

---

## Problem

Founders are bad at knowing when their pitch is terrible. VCs are too polite. Someone needs to tell them the truth.

---

## What it does

User pastes a startup pitch → selects Savage or Nice mode → hits "Roast me" → AI streams a brutal (or supportive) critique line-by-line, then reveals four scores. Every roast gets saved to Vercel Blob and returns a shareable permalink.

---

## Core user flow

1. User lands on the app — sees a large textarea and a mode toggle
2. User types or pastes their pitch
3. User clicks "Roast me"
4. Roast streams in character-by-character (visible streaming, not a loader)
5. Four score cards animate in after the roast completes
6. A shareable link appears — anyone can view that roast via its permalink

---

## Pages & routes

### `/` — main page
- Textarea: "Describe your startup..." (placeholder)
- Toggle: **Savage mode** / **Nice mode** (default: Savage)
- Button: "Roast me"
- Streaming output area below the form
- Score cards: Originality · Market size · Execution risk · Cringe factor (each /10)
- Permalink display after completion: `yourdomain.vercel.app/r/[id]`

### `/r/[id]` — roast permalink
- Read-only view of a saved roast fetched from Vercel Blob
- Shows the full roast text + four scores
- "Roast your own pitch" CTA back to `/`

### `/api/roast` — POST endpoint
- Accepts: `{ pitch: string, mode: "savage" | "nice" }`
- Streams the roast text using Vercel AI SDK `streamText`
- Returns a `ReadableStream` to the client

### `/api/save` — POST endpoint
- Accepts: `{ roastText: string, scores: object, pitch: string }`
- Saves to Vercel Blob as JSON
- Returns: `{ id: string, url: string }`

### `/api/scores` — POST endpoint
- Accepts: `{ pitch: string, roastText: string }`
- Uses `generateObject` with a Zod schema to return structured scores
- Returns: `{ originality, marketSize, executionRisk, cringeFactor }` (all 1–10)

---

## AI behaviour

### Savage mode system prompt
```
You are a brutally honest Silicon Valley VC who has seen 10,000 pitches and is exhausted by all of them. 
Roast the pitch like a disappointed investor at demo day. Be specific, be savage, be funny. 
Point out exactly what's wrong — vague TAM claims, "Uber for X" thinking, obvious competition they ignored. 
End with exactly one genuine, actionable piece of advice. 
Keep it under 200 words.
```

### Nice mode system prompt
```
You are a supportive but radically honest startup mentor. You want this founder to succeed, 
but you refuse to sugarcoat real problems. Give warm but direct feedback. 
Acknowledge what's genuinely good, then clearly name the 2–3 biggest risks. 
End with one concrete next step they should take this week.
Keep it under 200 words.
```

### Scores schema (Zod)
```ts
z.object({
  originality: z.number().min(1).max(10),
  marketSize: z.number().min(1).max(10),
  executionRisk: z.number().min(1).max(10),
  cringeFactor: z.number().min(1).max(10),
})
```

---

## Vercel APIs used

| API | Where | Why |
|-----|-------|-----|
| `streamText` (AI SDK) | `/api/roast` | Streams the roast character-by-character |
| `generateObject` (AI SDK) | `/api/scores` | Returns structured scores with Zod validation |
| Vercel Blob (`put`) | `/api/save` | Persists roast JSON, returns public URL |
| Vercel Blob (`head` / fetch) | `/r/[id]` | Fetches saved roast for permalink view |
| Edge Functions | All `/api/*` routes | Low latency, supports streaming responses |

---

## UI components to build (v0)

Generate each of these with v0 then assemble:

1. **`<PitchForm />`** — textarea + mode toggle + submit button
2. **`<RoastStream />`** — streaming text display with a blinking cursor while loading
3. **`<ScoreCards />`** — four cards that animate in; color-coded (green = good, red = bad)
4. **`<PermalinkBanner />`** — appears after save; shows URL with a copy button
5. **`<RoastView />`** — read-only permalink page layout

---

## v0 prompt (use this to generate the full UI shell)

> Build a startup pitch roaster web app with Next.js App Router. The main page has a dark, slightly edgy design — not goofy, more like a brutally honest design review tool. Include: a large textarea labelled "Describe your startup", a pill toggle between "Savage" and "Nice" modes (Savage selected by default with a red accent, Nice with a green accent), and a "Roast me →" button. Below the form, a streaming text area shows the roast appearing word by word with a blinking cursor. After the roast, four score cards slide in: Originality, Market size, Execution risk, Cringe factor — each showing a number out of 10 with a thin progress bar. Below that, a permalink banner appears with a copy button. Mobile responsive. No gradients. Clean sans-serif typography.

---

## Implementation order (60-minute plan)

| Time | Task |
|------|------|
| 0–10 min | Run the v0 prompt, get the full UI shell |
| 10–20 min | Build `/api/roast` with `streamText`, wire to `<RoastStream />` |
| 20–30 min | Build `/api/scores` with `generateObject`, wire to `<ScoreCards />` |
| 30–40 min | Build `/api/save` with Vercel Blob, build `/r/[id]` permalink page |
| 40–50 min | Deploy to Vercel, smoke test the full flow end to end |
| 50–60 min | Rehearse demo, prepare 2–3 test pitches, fix any edge cases |

---

## Test pitches for the demo

Use these on stage to guarantee a good reaction:

1. **"Uber for dogs"** — it's Airbnb for dog walking but with blockchain for trust. We take 30% commission. TAM is $500B.
2. **"AI for AI"** — we use AI to generate better AI prompts so your AI gets smarter AI outputs. B2B SaaS, $99/mo.
3. **Your actual hackathon project** — roast itself on stage. Very meta, always gets a laugh.

---

## Out of scope (for this hackathon)

- Auth / user accounts
- Rate limiting
- Multiple roast history per user
- Voice output
- Mobile app

---

## Success criteria

- Deployed live on a `.vercel.app` URL before presentation
- Streaming visibly works on stage (not a spinner)
- Permalink works — audience can open it on their phones
- Gets a laugh from at least 3 people during the demo
