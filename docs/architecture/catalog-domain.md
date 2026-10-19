# Korevax catalog domain contract

**Status:** initial contract; implementation is being migrated in phases.

## Identity

- `Content.id` is the canonical Korevax identity. It must remain stable if the title, language, slug, provider or external URL changes.
- `Content.slug` is a human-readable route key, not a primary key. A published catalog must not contain duplicate IDs or slugs.
- `title` is the preferred display title. `originalTitle` is optional and must not duplicate the preferred title after Unicode normalization and case folding. `alternativeTitles` contains searchable title variants and must not contain duplicates.
- Provider IDs are scoped by provider. `externalReferences` stores the provider key and provider-assigned ID; these values must never replace the Korevax ID.
- `franchiseId` represents an explicit relationship to a separately managed franchise entity. Similar titles are not sufficient evidence to infer a franchise relationship.

## Content type vs. classification

`ContentType` describes the primary medium/form of a catalog record:

- `movie`, `series`, `animation`
- `book`, `manga`, `manhwa`
- `music`, `podcast`, `game`, `documentary`

Anime is a classification, not a mutually exclusive content type. An anime may be a movie or series, and the `anime` classification must not replace its medium/type. Classification IDs are independent from type and can be extended without changing the content discriminant.

A future migration must not silently reinterpret existing records. Existing `type: "anime"` records need an explicit decision about their medium before migration; do not assume every anime is a series.

## Lifecycle and time

- Editorial status is one of `draft`, `review`, `published`, or `archived`.
- Only published records are returned by the public catalog read service.
- `releaseDate` is a calendar date (`YYYY-MM-DD`), not a timestamp.
- `createdAt` and `updatedAt` are ISO 8601 timestamps with an explicit timezone. `updatedAt` must not precede `createdAt`.
- Unknown or absent metadata must remain absent or explicitly unknown; the application must not invent dates or lifecycle states.

## Type-specific metadata

The discriminant controls the permitted `metadata` fields. Common fields stay on `ContentBase`; type-specific facts belong in `ContentMetadataByType`. Auxiliary concepts such as music releases, seasons, episodes, chapters and editions should be separate entities when they have their own identity or relationships.

## Taxonomy migration

The current `genres` and `tags` string arrays are transitional. Issue #13 will replace free-form labels with stable taxonomy references:

- **Genre** expresses a recognized thematic/content category.
- **Tag** is a flexible, curated descriptor for a specific topic, attribute or discovery facet.
- **Classification** describes a cross-cutting classification such as anime and is not a genre or a content type.
- Display names, aliases and localized labels belong to taxonomy entities, not to canonical content identity.

The migration must preserve existing visible labels, normalize comparisons with Unicode normalization and case folding, detect duplicates, and avoid silently merging distinct concepts solely because their display names look similar.

## Runtime validation and trust boundaries

TypeScript types do not validate JSON, browser input, imports or third-party responses at runtime. All untrusted values must pass runtime validation before they enter the domain. Validation should reject malformed structure, unsupported enum values, excessive lengths, invalid dates, unsafe URLs and malformed external references.

URL validation in the frontend is defense-in-depth, not a server-side SSRF control. Any future backend fetcher must independently restrict schemes, resolve and validate destination addresses, block private/link-local/metadata ranges, re-check redirects, and apply timeouts and response-size limits.

## Compatibility and evolution

1. Change the domain contract and validators together.
2. Migrate fixtures and service consumers in the same change.
3. Keep deprecated re-exports temporarily to reduce churn; do not create a second canonical model.
4. Add migration tests before removing compatibility paths.
5. Treat breaking schema changes as explicit migrations; never infer identity from titles or silently discard fields.
6. The mock catalog is demonstration data, not the production source of truth. Persistence and API work belong to issues #7 and #6 respectively.

## Taxonomy entity contract

The initial shared contracts live in `web/src/domain/catalog/taxonomy.types.ts`; runtime checks live in `taxonomy.validation.ts`.

- `Genre`, `Tag`, and `Classification` are distinct entity kinds even when their display labels overlap.
- `CatalogLanguage` uses a language tag; `Region` uses a stable region code; `AgeRating` references a region and keeps its jurisdiction-specific rating code; `ContentFormat` describes packaging/edition rather than a genre.
- Each entity has a stable `id`, optional route `slug`, lifecycle flag, timestamps, localized `labels`, and optional locale-scoped `aliases`.
- IDs are canonical and independent from localized labels. Localized labels may change without changing identity.
- Aliases are for discovery and input normalization, not for automatic identity merging. Normalize with Unicode NFKC and case folding before duplicate comparisons.
- Editorial status (`draft | review | published | archived`) is separate from a work's release/publication lifecycle (`upcoming | ongoing | released | cancelled | unknown`). Do not infer cancellation from missing or stale metadata.

**Migration note:** `Content.genres` and `Content.tags` are still legacy label arrays in this PR. The next migration step must introduce taxonomy IDs on content, add a curated seed vocabulary, migrate fixtures and search/detail consumers, and preserve labels for display. Issue #13 remains open until that migration and runtime tests are complete.
