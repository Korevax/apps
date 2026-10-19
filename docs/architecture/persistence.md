# Korevax persistence architecture

**Status:** proposed foundation for issue #7; not yet wired to a running database.

## Decision

Use PostgreSQL as the canonical persistent store and SQL migrations as the schema source of truth. Keep the React application as a client of the Kore API; browser state and demo fixtures must not be treated as production persistence.

PostgreSQL is a fit because Korevax needs relational integrity across content, taxonomy, external identifiers, franchises, collections and graph relationships, alongside JSONB for type-specific metadata that is validated by the domain contract.

## Boundaries

- **Domain contract:** TypeScript types and runtime validation define accepted API/domain payloads.
- **Persistence:** migrations define durable constraints, keys and indexes. Repositories map between rows and domain records.
- **API:** server-side validation and authorization run before writes; browser validation is only defense-in-depth.
- **Frontend:** calls the Kore API and does not connect directly to PostgreSQL or carry database credentials.
- **External metadata providers:** optional import/adaptation sources only; they are not the catalog's source of truth.

## Initial schema

The first migration creates:
- canonical content records with editorial status and type-specific JSON metadata;
- stable taxonomy entities with localized labels and aliases;
- explicit content-to-genre/tag/classification relationships;
- alternative titles and provider-scoped external references;
- franchise entities and directed content relationships;
- collections and ordered collection membership.

The taxonomy join stores both the taxonomy ID and expected kind, using a composite foreign key to prevent attaching a tag where a genre is required. Content type is a database check constraint and does not include `anime`; anime is stored as a classification.

## Data integrity and migrations

- IDs are assigned by Korevax and remain stable across title, locale, slug or provider changes.
- Slugs are unique route keys, not canonical IDs.
- Provider identifiers are unique within a provider and never replace the Korevax ID.
- Alternative titles, localized taxonomy labels and aliases have locale-scoped normalized keys.
- Type-specific metadata remains JSONB in the initial schema, but the API must validate the allowed fields for the selected `ContentType` before writes.
- Published collections must contain at least two distinct content records; the database trigger guards this invariant.
- Every schema change is a new numbered migration. Do not edit a migration after it has been applied to a shared environment.
- Seeds are separate from schema migrations and are explicitly marked as synthetic/demo data.
- Backups and restore drills must be in place before production data is accepted.

## Deployment and secrets

The existing Netlify configuration deploys only the static web application. It does not provide a persistent API runtime or database by itself. Deploying the API and provisioning PostgreSQL are separate infrastructure tasks. Credentials must be stored in server-side environment/secret configuration, never in Vite-prefixed variables or committed files.

## Remaining work for issue #7

- Select and provision the PostgreSQL hosting environment.
- Implement the Kore API's database connection lifecycle and repository adapters.
- Add integration tests that run migrations against a real PostgreSQL service.
- Implement CRUD through the service/API layer and remove mock data from production read paths.
- Document backup, restoration, retention and migration operations.
- Define authorization policy for draft/review/published transitions.

The migration in `api/db/migrations/0001_initial_catalog.sql` is the initial schema proposal; issue #7 must remain open until repositories, integration tests and production wiring are complete.
