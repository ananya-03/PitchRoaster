# Pitch Roaster

Startup pitch roaster built with Next.js App Router, Vercel AI SDK, OpenAI, and Vercel Blob.

Paste a startup pitch, choose Savage or Nice mode, stream the AI roast, generate four score cards, save the result, and share it at `/r/[id]`.

## Requirements

- Node.js 20+
- pnpm
- OpenAI API key
- Vercel Blob read/write token

## Environment Variables

Create `.env.local`:

```bash
OPENAI_API_KEY=sk-...
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...
```

`OPENAI_API_KEY` powers `/api/roast` and `/api/scores`.

`BLOB_READ_WRITE_TOKEN` powers `/api/save` and saved roast pages at `/r/[id]`.

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
5. A share link should appear in the format `/r/[id]`.
6. Open the share link in a new tab.
7. The saved roast page should show the pitch, roast, scores, and a CTA back home.

If the API key is missing, the UI will show the fallback error message after submit.

If the Blob token is missing, roast generation can work but saving and permalinks will fail.

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
BLOB_READ_WRITE_TOKEN
```

After deployment, test the same checklist above on the `.vercel.app` URL.
