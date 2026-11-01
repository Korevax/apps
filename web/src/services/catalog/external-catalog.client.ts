export interface ExternalCatalogCandidate {
  provider: string;
  externalId: string;
  mediaType: "movie" | "series";
  title: string;
  originalTitle: string | null;
  synopsis: string | null;
  releaseDate: string | null;
  originalLanguage: string | null;
  posterUrl: string | null;
  backdropUrl: string | null;
  popularity: number | null;
  voteAverage: number | null;
  voteCount: number;
  sourceUrl: string;
}

export interface ExternalCatalogSearchResult {
  provider: "tmdb";
  page: number;
  totalPages: number;
  totalResults: number;
  results: ExternalCatalogCandidate[];
}

export interface ExternalCatalogSearchOptions {
  type: "movie" | "series";
  query: string;
  page?: number;
  signal?: AbortSignal;
}

const DEFAULT_GATEWAY_URL = "http://127.0.0.1:8787";
const MAX_QUERY_LENGTH = 120;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isCandidate(value: unknown): value is ExternalCatalogCandidate {
  if (!isRecord(value)) return false;
  return value.provider === "tmdb" &&
    typeof value.externalId === "string" &&
    (value.mediaType === "movie" || value.mediaType === "series") &&
    typeof value.title === "string" &&
    (value.originalTitle === null || typeof value.originalTitle === "string") &&
    (value.synopsis === null || typeof value.synopsis === "string") &&
    (value.releaseDate === null || typeof value.releaseDate === "string") &&
    (value.originalLanguage === null || typeof value.originalLanguage === "string") &&
    (value.posterUrl === null || typeof value.posterUrl === "string") &&
    (value.backdropUrl === null || typeof value.backdropUrl === "string") &&
    (value.popularity === null || typeof value.popularity === "number") &&
    (value.voteAverage === null || typeof value.voteAverage === "number") &&
    Number.isSafeInteger(value.voteCount) &&
    typeof value.sourceUrl === "string";
}

function gatewayBaseUrl(): string {
  const configured = import.meta.env.VITE_CATALOG_GATEWAY_URL;
  const raw = typeof configured === "string" && configured.trim()
    ? configured.trim()
    : DEFAULT_GATEWAY_URL;

  const url = new URL(raw);
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("Catalog gateway URL must use HTTP or HTTPS.");
  }
  if (import.meta.env.PROD && url.protocol !== "https:") {
    throw new Error("Production catalog gateway must use HTTPS.");
  }
  return url.toString().replace(/\/$/, "");
}

/**
 * Fetches untrusted external discovery candidates. This does not create or publish
 * domain Content records; callers must use the domain validation/import workflow.
 */
export async function searchExternalCatalog(
  options: ExternalCatalogSearchOptions,
): Promise<ExternalCatalogSearchResult> {
  const query = options.query.trim();
  if (!query || query.length > MAX_QUERY_LENGTH) {
    throw new Error("Search query must contain between 1 and 120 characters.");
  }
  if (options.type !== "movie" && options.type !== "series") {
    throw new Error("Unsupported external catalog type.");
  }

  const page = options.page ?? 1;
  if (!Number.isSafeInteger(page) || page < 1 || page > 500) {
    throw new Error("Page must be an integer between 1 and 500.");
  }

  const url = new URL(
    `/api/catalog/${options.type}/search`,
    gatewayBaseUrl(),
  );
  url.searchParams.set("query", query);
  url.searchParams.set("page", String(page));

  const response = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
    signal: options.signal,
    credentials: "omit",
    redirect: "error",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(
      response.status === 429
        ? "External catalog rate limit reached. Try again later."
        : "External catalog is temporarily unavailable.",
    );
  }

  const payload: unknown = await response.json();
  if (
    !isRecord(payload) ||
    payload.provider !== "tmdb" ||
    !Number.isSafeInteger(payload.page) ||
    !Number.isSafeInteger(payload.totalPages) ||
    !Number.isSafeInteger(payload.totalResults) ||
    !Array.isArray(payload.results) ||
    !payload.results.every(isCandidate)
  ) {
    throw new Error("External catalog returned an invalid response.");
  }

  return payload as unknown as ExternalCatalogSearchResult;
}
