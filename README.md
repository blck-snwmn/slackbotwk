# slackbotwk

A Slack Bot running on Cloudflare Workers

## Tech Stack

- **Runtime**: Cloudflare Workers
- **Slack SDK**: [@slack/bolt](https://tools.slack.dev/bolt-js/)
- **Lint/Format**: oxlint / oxfmt
- **Package Manager**: Bun

## Setup

### 1. Install Dependencies

```bash
bun install
```

### 2. Create Slack App

1. Create an app at https://api.slack.com/apps
2. Add Bot Token Scopes in **OAuth & Permissions**:
   - `commands`
   - `app_mentions:read`
   - `chat:write`
3. Install to your workspace

### 3. Configure Environment Variables

Copy `.dev.vars.example` to `.dev.vars`:

```bash
cp .dev.vars.example .dev.vars
```

Set the following values:
- `SLACK_SIGNING_SECRET`: Basic Information → App Credentials
- `SLACK_BOT_TOKEN`: OAuth & Permissions → Bot User OAuth Token

### 4. Local Development

```bash
bun run dev
```

Start Cloudflare Tunnel in another terminal:

```bash
cloudflared tunnel --url http://localhost:8787
```

> **Tips**: You can use a fixed URL by creating a tunnel in Cloudflare Zero Trust.
> In that case, start with `cloudflared tunnel run --token <TOKEN>`.

Configure the Tunnel URL in your Slack App:
- **Slash Commands**: Create `/hello`, `/help` → `https://<your-tunnel-url>`
- **Event Subscriptions**: `https://<your-tunnel-url>`
  - Subscribe to bot events: `app_mention`

## Deployment

### 1. Deploy to Cloudflare

```bash
bun run deploy
```

### 2. Configure Secrets

Make sure `.dev.vars` contains the correct values, then run:

```bash
wrangler secret bulk .dev.vars
```

Or set them individually:

```bash
wrangler secret put SLACK_SIGNING_SECRET
wrangler secret put SLACK_BOT_TOKEN
```

### 3. Update Slack App URL

Update the URL in your Slack App settings to the deployed URL

## Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start local development server |
| `bun run deploy` | Deploy to Cloudflare |
| `bun run lint` | Run oxlint |
| `bun run lint:fix` | Auto-fix lint errors |
| `bun run fmt` | Format with oxfmt |
| `bun run fmt:check` | Check formatting |
| `bun run test` | Run tests |
