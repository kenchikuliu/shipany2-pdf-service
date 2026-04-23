# World Models Atlas

World Models Atlas is a bilingual research navigation site for world-model papers, systems, milestone timelines, and high-signal weekly updates.

## Local

1. Install dependencies
   `pnpm install`
2. Generate MDX source
   `pnpm postinstall`
3. Set local env
   Copy `.env.example` to `.env.local` and fill:
   - `NEXT_PUBLIC_APP_URL`
   - `NEXT_PUBLIC_APP_NAME`
   - `DATABASE_PROVIDER`
   - `DATABASE_URL`
   - `AUTH_SECRET`
4. Start dev
   `pnpm dev`

## Verify

- Type check: `pnpm exec tsc --noEmit --pretty false`
- Lint: `pnpm lint`
- Build: `pnpm build:fast`

## Cloudflare

1. Review local `wrangler.toml`
   - `name = "world-models-atlas"`
   - R2 incremental cache is already wired to `NEXT_INC_CACHE_R2_BUCKET`
   - If preview uses the same bucket as production, keep:
     `bucket_name = "world-models-atlas"`
     `preview_bucket_name = "world-models-atlas"`
2. Create local preview secrets
   Copy `.dev.vars.example` to `.dev.vars` and fill:
   - `DATABASE_URL`
   - `AUTH_SECRET`
3. Preview locally
   `pnpm cf:preview`
4. Set production secrets
   - `wrangler secret put DATABASE_URL`
   - `wrangler secret put AUTH_SECRET`
5. Deploy
   `pnpm cf:deploy`

Notes:

- Current runtime is configured for `DATABASE_PROVIDER = "postgresql"`, not D1.
- Empty `hyperdrive` / `d1_databases` bindings were intentionally removed because they break local preview when left blank.
- Verified local Cloudflare preview reaches `http://localhost:8787` with the current OpenNext + R2 setup.

## Content

World-model data lives in:

- `content/world-models/papers`
- `content/world-models/projects`
- `content/world-models/updates`
- `content/world-models/timeline`
- `content/world-models/topics`
