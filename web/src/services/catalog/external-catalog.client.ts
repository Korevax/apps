export interface ExternalCatalogCandidate {
  provider: "tmdb";
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

export function isExternalCatalogConfigured(): boolean {
  const configured = import.meta.env.VITE_CATALOG_GATEWAY_URL;
  return !import.meta.env.PROD || (typeof configured === "string" && configured.trim().length > 0);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isAllowedUrl(value: unknown, hostname: string): value is string {
  if (typeof value !== "string") return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" &&
      url.hostname === hostname &&
      url.port === "" &&
      !url.username &&
      !url.password;
  } catch {
    return false;
  }
}

function isCandidate(
  value: unknown,
  expectedType: "movie" | "series",
): value is ExternalCatalogCandidate {
  if (!isRecord(value)) return false;

  return value.provider === "tmdb" &&
    typeof value.externalId === "string" &&
    /^[1-9]\\d{0,19}$/.test(value.externalId) &&
    value.mediaType === expectedType &&
    typeof value.title === "string" &&
    value.title.trim().length > 0 &&
    value.title.length <= 300 &&
    (value.originalTitle === null || (typeof value.originalTitle === "string" && value.originalTitle.length <= 300)) &&
    (value.synopsis === null || (typeof value.synopsis === "string" && value.synopsis.length <= 20_000)) &&
    (value.releaseDate === null || (typeof value.releaseDate === "string" && /^\\d{4}-\\d{2}-\\d{2}$/.test(value.releaseDate))) &&
    (value.originalLanguage === null || (typeof value.originalLanguage === "string" && value.originalLanguage.length <= 10)) &&
    (value.posterUrl === null || isAllowedUrl(value.posterUrl, "image.tmdb.org")) &&
    (value.backdropUrl === null || isAllowedUrl(value.backdropUrl, "image.tmdb.org")) &&
    (value.popularity === null || (typeof value.popularity === "number" && Number.isFinite(value.popularity) && value.popularity >= 0)) &&
    (value.voteAverage === null || (typeof value.voteAverage === "number" && Number.isFinite(value.voteAverage) && value.voteAverage >= 0 && value.voteAverage <= 10)) &&
    Number.isSafeInteger(value.voteCount) &&
    Number(value.voteCount) >= 0 &&
    Number(value.voteCount) <= 2_147_483_647 &&
    isAllowedUrl(value.sourceUrl, "www.themoviedb.org") &&
    /^\\/(?:movie|tv)\\/[1-9]\\d*$/.test(new URL(value.sourceUrl).pathname);
}

function gatewayBaseUrl(): string {
  const configured = import.meta.env.VITE_CATALOG_GATEWAY_URL;
  const raw = typeof configured === "string" && configured.trim()
    ? configured.trim()
    : DEFAULT_GATEWAY_URL;

  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new Error("Catalog gateway URL is invalid.");
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("Catalog gateway URL must use HTTP or HTTPS.");
  }
  if (url.username || url.password || url.search || url.hash || url.pathname !== "/") {
    throw new Error("Catalog gateway URL must be an origin without credentials, path, query, or fragment.");
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
    Number(payload.page) < 1 ||
    Number(payload.totalPages) < 1 ||
    Number(payload.totalResults) < 0 ||
    !Array.isArray(payload.results) ||
    !payload.results.every((candidate) => isCandidate(candidate, options.type))
  ) {
    throw new Error("External catalog returned an invalid response.");
  }

  return payload as unknown as ExternalCatalogSearchResult;
}
