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

## Connect With v0

You can connect this project to v0 in three useful ways.

### Option 1: Import This GitHub Repo Into v0

Use this when you want v0 to read and edit the full app.

1. Go to `https://v0.app`.
2. Start a new chat.
3. Click `+` in the prompt bar.
4. Choose `Import from GitHub`.
5. Select `ananya-03/PitchRoaster`.
6. Ask v0 to make UI changes.
7. v0 will create changes on its own branch.
8. Open a PR back to `main` when you are ready.

This is the simplest workflow for this repo.

### Option 2: Pull a v0 Component Into This Codebase

Use this when you generate one component in v0 and want to add it locally.

From the project root:

```bash
pnpm dlx v0@latest init
pnpm dlx v0@latest add <component-id>
```

You can get `<component-id>` from the v0 UI after generating a component.

If v0 gives you an `Add to Codebase` command, run it from this directory:

```bash
pnpm dlx shadcn@latest add "https://v0.dev/chat/b/<project_id>?token=<token>"
```

### Option 3: Connect v0 as an MCP Plugin

Use this when you want your coding agent or IDE to call v0 tools directly.

1. Create a v0 API key at:

```text
https://v0.app/chat/settings/keys
```

2. Add it to your shell environment, not to Git:

```bash
export V0_API_KEY="your_v0_key_here"
```

3. Add this MCP config to the MCP settings used by your editor/agent:

```json
{
  "mcpServers": {
    "v0": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "https://mcp.v0.dev",
        "--header",
        "Authorization: Bearer ${V0_API_KEY}"
      ]
    }
  }
}
```

Do not commit `V0_API_KEY` or any other secret.
