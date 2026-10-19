# Korevax threat model and incident baseline

**Status:** baseline for the current static frontend and planned Kore API. Controls marked planned are not yet implemented; this document is not a security certification.

## Assets and trust boundaries

- Canonical catalog records, stable IDs, taxonomy and content relationships.
- Contributor/moderator accounts and editorial actions.
- Database credentials, API signing secrets and deployment configuration.
- User search queries, submitted metadata, external references and future uploads/media sources.
- Public frontend, future Kore API, PostgreSQL, CI, Netlify deployment and optional metadata-provider adapters.

The browser, user-submitted fields, imported records, provider responses and remote URLs are untrusted. Frontend validation improves user experience but does not replace server-side validation, authorization or database constraints.

## Threats and required mitigations

| Threat | Impact | Required controls | Current state |
|---|---|---|---|
| Stored/reflected XSS through titles, synopsis, tags, aliases or imported descriptions | Script execution, account/session abuse, content defacement | React text rendering; avoid unsafe HTML; sanitize any future Markdown/HTML; CSP; validate imported data | Basic validation and a Netlify CSP baseline are added; backend sanitization remains pending |
| SSRF through provider URLs, posters, web-player URLs or importers | Access to internal services, cloud metadata or private network resources | Server-side scheme/host allowlists, DNS/IP validation, block loopback/private/link-local/metadata ranges, re-check redirects, timeout/size limits | No server-side URL fetcher implemented; must be enforced before any fetch/import feature |
| Open redirect or unsafe external links | Phishing and trust abuse | Allowlist redirect destinations; validate schemes; use safe `rel` attributes for new tabs | API and external-link review remains pending |
| Unauthorized creation, editing or publishing | Catalog corruption, vandalism, exposure of draft content | Server-side authentication and role-based authorization; moderator-only editorial transitions; audit trail; rate limits | OpenAPI contract specifies auth intent; runtime authorization is not implemented |
| Query/resource exhaustion | Availability loss and higher hosting/database costs | Request/query length caps, bounded pagination, rate limits, statement/request timeouts, concurrency limits | Frontend query caps and API contract limits are defined; server enforcement remains pending |
| SQL injection | Data disclosure or corruption | Parameterized queries, least-privilege DB role, no string-built SQL, integration tests | Persistence schema exists in a dependent draft; repository/API code is not implemented |
| Duplicate or corrupted identities/relationships | Broken graph, ambiguous records, incorrect search results | Stable canonical IDs, unique constraints, taxonomy-kind foreign keys, referential-integrity tests | Domain validation and initial PostgreSQL constraints are in draft PRs |
| Secret leakage through source maps, client bundles, logs or commits | Unauthorized access to services/data | Server-only secret storage; never use `VITE_*` for secrets; secret scanning; log redaction; rotate exposed credentials | Policy documented; deployment secret audit still required |
| Dependency/supply-chain compromise | Code execution or vulnerable production dependencies | Lockfiles, automated dependency updates, vulnerability audit, minimal dependencies, CI checks and reviewed upgrades | Web CI runs build, contract tests and lint; dependency audit automation remains pending |
| Data loss or destructive migration | Permanent catalog loss and downtime | Automated backups, restore drills, migration review, least-privilege DB role, retention policy | PostgreSQL schema proposal exists; backup/restore not implemented |
| Abuse of future uploads or media playback | Malware, oversized files, content-type confusion, unsafe embeds | No uploads until requirements are defined; enforce size/type limits, quarantine and scanning; restrictive CSP/frame allowlist | Upload/player endpoints are not implemented |

## Minimum security requirements for the Kore API

1. Validate all request bodies, query parameters, path parameters and provider responses at runtime.
2. Reject unknown enum values, malformed IDs, oversized fields and unsupported metadata for the selected content type.
3. Use parameterized SQL and transactions for multi-table writes.
4. Authenticate and authorize every write; do not trust role claims supplied by the browser.
5. Keep public reads limited to published records. Do not reveal whether a private draft exists to unauthenticated callers.
6. Apply rate limits to search, login, content writes and expensive provider/import operations.
7. Return consistent error envelopes and request IDs; never return stack traces, SQL text, tokens or secrets.
8. Configure CORS to explicit trusted origins and use secure cookie settings if cookie-based authentication is selected.
9. Restrict external fetches at the server/network layer. URL validation in the browser is not an SSRF defense.
10. Record security-relevant editorial changes without logging secrets or unnecessary personal data.

## Deployment headers

The Netlify `_headers` file sets baseline browser controls including a Content Security Policy, frame denial, MIME sniffing protection, referrer policy and a restrictive Permissions Policy. Review the policy whenever a remote API, font, analytics provider, embed or web player is added. Prefer adding a narrow explicit origin rather than broadening a directive to `*`.

## Incident response

- **Triage:** identify affected assets, attack path, severity, time window and whether exploitation is ongoing.
- **Contain:** disable vulnerable functionality, block abusive traffic, revoke/rotate credentials and isolate affected services.
- **Preserve:** retain relevant access/audit logs with restricted access; avoid copying unnecessary personal data.
- **Eradicate and recover:** patch, test, redeploy, restore from known-good backups if needed, and verify monitoring.
- **Communicate:** coordinate with reporters and affected users as appropriate; do not publish exploit details before mitigation.
- **Learn:** record root cause, timeline, impact, corrective actions and owners; add regression tests and update this model.

## Release gate

Do not mark issues #6, #7 or #21 complete until their server-side controls, integration tests, secrets handling, rate limiting, backup/restore and incident-response requirements have working implementations and verification evidence.
