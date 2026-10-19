# Kore API contract

**Status:** versioned API contract; runtime implementation remains pending.

## Source of truth

`api/openapi.yaml` is the public contract for Kore API v1. API handlers, request validation, response serialization and tests must follow it. Breaking changes require a new API version; additive compatible fields may be introduced within v1 after review.

## Ownership and data sources

- Korevax assigns canonical content IDs and owns catalog records, taxonomy, collections and relationships.
- External metadata providers are optional import adapters. Their IDs are stored as provider-scoped references and never replace Korevax identity.
- The browser must not connect directly to PostgreSQL or receive database credentials.
- Public read endpoints expose published records only. Draft/review/archived content requires authenticated, authorized operations.

## HTTP conventions

- JSON requests and responses use UTF-8.
- Collection/search responses use `data` plus a `page` object with an opaque cursor.
- `limit` defaults to 20 and is bounded to 1–100. The client must not manufacture or modify cursor values.
- Errors use a stable envelope with `code`, safe human-readable `message`, `requestId`, and optional field-level `details`.
- Include a server-generated `X-Request-Id` header. Do not return stack traces, SQL details, secrets or internal dependency errors.
- Use appropriate status codes: 400 validation, 401 unauthenticated, 403 unauthorized, 404 missing/unpublished resource, 409 identity/integrity conflict, 413 payload too large, 429 rate limited, and 500 unexpected server error.
- Rate-limited responses include `Retry-After`.

## Validation and security

- Validate all inputs on the server, even when the client validates the same schema.
- Apply strict request body limits, maximum query length, pagination caps, database statement timeouts and request timeouts.
- Use parameterized SQL and explicit transactions for multi-table writes.
- Enforce authorization for content creation, metadata changes, editorial status transitions, taxonomy edits and collection publication.
- Use a configured CORS allowlist. Do not combine wildcard origins with credentials.
- Keep secrets in server-side environment/secret configuration. Never expose secrets through `VITE_*` variables or commit them.
- If a future adapter fetches external URLs, independently mitigate SSRF: restrict schemes, resolve and validate destination addresses, block private/link-local/metadata ranges, re-check redirects, and cap timeouts and response sizes.
- Health liveness must not expose dependency details. Readiness may return only a safe status and request identifier.

## Implementation sequence

1. Implement the health endpoints and configuration validation.
2. Add the database pool, migration runner and repository adapters from issue #7.
3. Implement read-only content, search, taxonomy and collection endpoints.
4. Add authenticated write endpoints with role-based authorization and audit logging.
5. Run OpenAPI contract checks and PostgreSQL integration tests in CI.
6. Connect the frontend through a configurable API base URL; retain mock fixtures only for local/demo mode.

This document and the OpenAPI file define the contract, not a claim that these endpoints are already deployed.
