# Pitch Roaster

Startup pitch roaster built with Next.js App Router, Vercel AI SDK, and OpenAI.

Paste a startup pitch, choose Savage or Nice mode, stream the AI roast, and generate four score cards.

## Requirements

- Node.js 20+
- pnpm
- OpenAI API key

## Environment Variables

Create `.env.local`:

```bash
OPENAI_API_KEY=sk-...
```

`OPENAI_API_KEY` powers `/api/roast` and `/api/scores`.

## Local Setup

```bash
pnpm install
pnpm run dev
```

Open:

```text
http://localhost:3000
```

## Check That It Works

Use this test pitch:

```text
Uber for dogs. It is Airbnb for dog walking but with blockchain for trust. We take 30% commission. TAM is $500B.
```

Checklist:

1. The homepage loads with the pitch textarea and Savage/Nice toggle.
2. Click `Roast me ->`.
3. The roast should stream into the output area.
4. Four score cards should appear after streaming finishes.
5. Toggle Nice mode and submit again to verify the tone changes.

If the API key is missing, the UI will show the fallback error message after submit.

## Useful Commands

```bash
pnpm exec tsc --noEmit
pnpm run build
```

`pnpm run lint` currently requires adding ESLint as a dev dependency.

## Deploy

Import the GitHub repository into Vercel or deploy with the Vercel CLI.

Set these Vercel environment variables before testing the full flow:

```text
OPENAI_API_KEY
```

After deployment, test the same checklist above on the `.vercel.app` URL.
