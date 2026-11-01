# Korevax Catalog Gateway

Temporary server-side adapter for external metadata providers. The frontend must call this gateway rather than third-party APIs directly.

## Current scope

- TMDB movie and TV-series search.
- Normalized discovery candidates, not published Korevax `Content` records.
- Provider-scoped external IDs (`provider` + `externalId`).
- Bounded in-memory cache, request timeout, per-client rate limit, exact-origin CORS allowlist, and safe error responses.

The gateway deliberately does not create canonical Korevax IDs, slugs, taxonomy references, editorial status, ratings, or persisted records. Search results are candidates for a future review/import workflow.

## Requirements

- Node.js 22.9 or newer (native `fetch` support).
- A TMDB API Read Access Token.
- No additional npm dependency.

## Local setup

1. Copy `.env.example` to `.env.local`.
2. Set `TMDB_API_READ_ACCESS_TOKEN` using the TMDB API Read Access Token. Do not use a browser-exposed Vite variable.
3. Start the gateway with `npm run dev:gateway`.
4. Check `http://127.0.0.1:8787/health`.
5. Search with `http://127.0.0.1:8787/api/catalog/movie/search?query=matrix` or `/api/catalog/series/search?query=dark`.

The Vite development server normally runs at `http://localhost:5173`; that origin is allowed by default. Set `GATEWAY_ALLOWED_ORIGINS` to a comma-separated exact allowlist when using another frontend origin.

## API

### `GET /api/catalog/movie/search?query=<text>&page=1`
### `GET /api/catalog/series/search?query=<text>&page=1`

- `query`: required, trimmed, maximum 120 characters.
- `page`: optional integer from 1 to 500.
- `include_adult` is always disabled.
- Results are normalized into discovery candidates and include TMDB provider IDs and source URLs.

### `GET /health`

Returns process health only. It does not make a provider request.

## Security and operational notes

- Bind to loopback by default. Put a trusted reverse proxy in front before exposing the service publicly.
- Keep the access token in server environment variables; never prefix it with `VITE_`, return it, or log it.
- CORS is not authentication. Add application authentication and abuse protection before public deployment.
- The in-memory rate limiter and cache are per-process and reset on restart; use a shared store when horizontally scaling.
- Do not trust forwarded IP headers unless the gateway is behind a specifically configured trusted proxy.
- For non-commercial developer use, TMDB requires its approved logo and the prominent notice: “This product uses the TMDB API but is not endorsed or certified by TMDB.” The attribution belongs in an About/Credits section. Commercial use requires contacting TMDB for a license. The current frontend does not yet expose TMDB results, so implement the required attribution UI before connecting this provider to public-facing screens.
- Search candidates are not automatically imported or published. Validate and review them against the Korevax domain contract first.

## TMDB attribution\n\nOfficial requirements: display an approved TMDB logo and the notice “This product uses the TMDB API but is not endorsed or certified by TMDB.” Place the attribution in an About/Credits section. The TMDB logo must be less prominent than the Korevax brand and must not imply endorsement. Commercial use requires a separate license from TMDB. See the [official TMDB FAQ](https://developer.themoviedb.org/docs/faq).\n\n## Automated verification

Run `npm run build`, `npm run lint`, `npm run test:contracts`, and `npm run test:gateway` from `web/`. The gateway test starts a local process with a dummy token and checks health, invalid input handling, methods, routes, and CORS without contacting TMDB.
