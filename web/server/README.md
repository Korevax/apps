# Korevax Catalog Gateway

Server-side adapter for external metadata providers. The React application must call this gateway instead of contacting provider APIs directly.

## Current scope

- TMDB movie and TV-series search.
- Normalized external discovery candidates, not canonical or published Korevax `Content` records.
- Provider-scoped external identifiers (`provider` + `externalId`).
- Frontend integration in **Discover**, kept separate from local Korevax results.
- TMDB attribution in the global footer (official logo, source link, and required disclaimer).

The gateway does not create Korevax IDs, slugs, taxonomy references, editorial status, community ratings, or persisted records. External results are suggestions only. They cannot be imported or published automatically.

## Requirements

- Node.js 22.9 or newer.
- A TMDB API Read Access Token.
- No additional npm dependency.

## Local setup

1. Copy `.env.example` to `.env.local`.
2. Set `TMDB_API_READ_ACCESS_TOKEN` in `.env.local`. Never expose it through a `VITE_*` variable.
3. Keep `VITE_CATALOG_GATEWAY_URL=http://127.0.0.1:8787` for local development.
4. Start the gateway in one terminal: `npm run dev:gateway`.
5. Start the frontend in another terminal: `npm run dev`.
6. Check gateway health at `http://127.0.0.1:8787/health`.

The Vite development server normally uses `http://localhost:5173`, which is allowed by default. Set `GATEWAY_ALLOWED_ORIGINS` to a comma-separated list of exact origins if your local frontend uses another origin.

## API

### `GET /api/catalog/movie/search?query=<text>&page=1`
### `GET /api/catalog/series/search?query=<text>&page=1`

- `query`: required, trimmed, 1–120 characters; control characters are rejected.
- `page`: optional integer from 1 to 500.
- Adult content is excluded by setting `include_adult=false`.
- Provider responses are normalized and bounded before they are returned to the frontend.

### `GET /health`

Returns process health only. It does not contact TMDB.

## Security and operational boundaries

- The gateway binds to `127.0.0.1` by default.
- The TMDB token stays server-side. It is never returned to the client or included in logs.
- CORS uses an exact-origin allowlist. CORS is **not authentication**.
- Requests have an 8-second timeout; provider response bodies are limited to 2 MiB.
- The in-memory cache expires after 60 seconds, is limited to 200 entries / 32 MiB total, and skips individual entries larger than 512 KiB.
- The in-memory rate limiter allows up to 60 requests per client address per 60-second window and bounds its client map. Cache and rate limits are per process and reset on restart.
- Forwarded IP headers are not trusted. Configure client identity only when operating behind a specifically trusted proxy.
- The service has no application authentication, shared cache, distributed rate limiter, production monitoring, or production deployment configuration. **Do not expose this development gateway directly to the public internet.**
- A production frontend only enables external search when `VITE_CATALOG_GATEWAY_URL` is explicitly configured with an HTTPS origin. Do not set that variable until a production gateway has authentication, abuse protection, trusted proxy handling, shared limits, monitoring, and HTTPS.

## TMDB attribution and licensing

The footer includes the TMDB logo, a link to TMDB, and the required notice:

> This product uses the TMDB API but is not endorsed or certified by TMDB.

TMDB requires its approved logo and notice in an About/Credits-type section. The logo must be less prominent than the Korevax brand and must not imply endorsement. TMDB's API is free for non-commercial use with attribution; commercial use requires contacting TMDB for a separate license. Review the [official TMDB FAQ](https://developer.themoviedb.org/docs/faq) and [logo/attribution guidance](https://www.themoviedb.org/about/logos-attribution) before release.

## Automated verification

Run from `web/`:

```sh
npm ci
npm run build
npm run lint
npm run test:contracts
npm run test:gateway
```

The gateway test starts a local process with a dummy token. It checks health, input validation, route and method handling, and CORS without contacting TMDB.
