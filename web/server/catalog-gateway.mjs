import { createServer } from "node:http";
import { createHash } from "node:crypto";

const HOST = process.env.GATEWAY_HOST || "127.0.0.1";
const PORT = Number(process.env.GATEWAY_PORT || 8787);
const TMDB_TOKEN = process.env.TMDB_API_READ_ACCESS_TOKEN;
const ALLOWED_ORIGINS = new Set(
  (process.env.GATEWAY_ALLOWED_ORIGINS || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
);
const REQUEST_TIMEOUT_MS = 8_000;
const CACHE_TTL_MS = 60_000;
const CACHE_MAX_ENTRIES = 200;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 60;
const RATE_LIMIT_MAX_CLIENTS = 10_000;
const MAX_PROVIDER_RESPONSE_BYTES = 2 * 1024 * 1024;
const MAX_QUERY_LENGTH = 120;
const MAX_PAGE = 500;
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

if (!Number.isInteger(PORT) || PORT < 1 || PORT > 65_535) {
  throw new Error("GATEWAY_PORT must be a valid TCP port.");
}
if (!TMDB_TOKEN || TMDB_TOKEN.length < 20) {
  throw new Error("TMDB_API_READ_ACCESS_TOKEN is required.");
}

const cache = new Map();
const rateLimits = new Map();

function json(response, status, payload, extraHeaders = {}) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "no-referrer",
    "X-Frame-Options": "DENY",
    ...extraHeaders,
  });
  response.end(JSON.stringify(payload));
}

function setCors(request, response) {
  const origin = request.headers.origin;
  if (!origin) return true;
  if (!ALLOWED_ORIGINS.has(origin)) return false;

  response.setHeader("Access-Control-Allow-Origin", origin);
  response.setHeader("Vary", "Origin");
  response.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Accept, Content-Type");
  response.setHeader("Access-Control-Max-Age", "600");
  return true;
}

function clientKey(request) {
  // Do not trust X-Forwarded-For unless a trusted reverse proxy is configured.
  return request.socket.remoteAddress || "unknown";
}

function consumeRateLimit(key) {
  const now = Date.now();
  const current = rateLimits.get(key);
  if (!current || current.resetAt <= now) {
    if (rateLimits.size >= RATE_LIMIT_MAX_CLIENTS) {
      for (const [client, entry] of rateLimits) {
        if (entry.resetAt <= now) rateLimits.delete(client);
      }
      if (rateLimits.size >= RATE_LIMIT_MAX_CLIENTS) {
        return { allowed: false, remaining: 0, resetAt: now + 5_000 };
      }
    }
    rateLimits.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - 1 };
  }
  if (current.count >= RATE_LIMIT_MAX_REQUESTS) {
    return { allowed: false, remaining: 0, resetAt: current.resetAt };
  }
  current.count += 1;
  return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - current.count };
}

function cacheGet(key) {
  const entry = cache.get(key);
  if (!entry) return undefined;
  if (entry.expiresAt <= Date.now()) {
    cache.delete(key);
    return undefined;
  }
  cache.delete(key);
  cache.set(key, entry);
  return entry.value;
}

function cacheSet(key, value) {
  cache.delete(key);
  cache.set(key, { value, expiresAt: Date.now() + CACHE_TTL_MS });
  while (cache.size > CACHE_MAX_ENTRIES) {
    cache.delete(cache.keys().next().value);
  }
}

function safeImageUrl(path) {
  if (typeof path !== "string" || !/^\/[A-Za-z0-9/_-]+\.(?:jpg|jpeg|png|webp)$/i.test(path)) {
    return null;
  }
  return `${IMAGE_BASE_URL}${path}`;
}

function normalizeResult(item, mediaType) {
  if (!item || !Number.isSafeInteger(item.id) || item.id <= 0) return null;
  const title = mediaType === "movie" ? item.title : item.name;
  if (typeof title !== "string" || !title.trim()) return null;

  return {
    provider: "tmdb",
    externalId: String(item.id),
    mediaType,
    title: title.trim().slice(0, 300),
    originalTitle: (mediaType === "movie" ? item.original_title : item.original_name) || null,
    synopsis: typeof item.overview === "string" ? item.overview.slice(0, 20_000) : null,
    releaseDate: (mediaType === "movie" ? item.release_date : item.first_air_date) || null,
    originalLanguage: typeof item.original_language === "string" ? item.original_language : null,
    posterUrl: safeImageUrl(item.poster_path),
    backdropUrl: safeImageUrl(item.backdrop_path),
    popularity: Number.isFinite(item.popularity) ? item.popularity : null,
    voteAverage: Number.isFinite(item.vote_average) ? item.vote_average : null,
    voteCount: Number.isSafeInteger(item.vote_count) ? item.vote_count : 0,
    sourceUrl: `https://www.themoviedb.org/${mediaType}/${item.id}`,
  };
}

function validateQuery(url) {
  const query = url.searchParams.get("query")?.trim();
  const pageRaw = url.searchParams.get("page") || "1";
  const page = Number(pageRaw);

  if (!query || query.length > MAX_QUERY_LENGTH || /[\u0000-\u001F\u007F]/.test(query)) {
    return { error: "A non-empty query of at most 120 characters is required." };
  }
  if (!/^\d+$/.test(pageRaw) || !Number.isSafeInteger(page) || page < 1 || page > MAX_PAGE) {
    return { error: "page must be an integer between 1 and 500." };
  }
  return { query, page };
}

async function readBoundedJson(response) {
  if (!response.body) throw new Error("Provider response body is missing.");
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let bytes = 0;
  let text = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > MAX_PROVIDER_RESPONSE_BYTES) {
        await reader.cancel();
        const sizeError = new Error("Provider response exceeded the configured size limit.");
        sizeError.status = 502;
        throw sizeError;
      }
      text += decoder.decode(value, { stream: true });
    }
    text += decoder.decode();
    return JSON.parse(text);
  } catch (error) {
    if (error instanceof SyntaxError) {
      const parseError = new Error("Provider returned invalid JSON.");
      parseError.status = 502;
      throw parseError;
    }
    throw error;
  } finally {
    reader.releaseLock();
  }
}

async function tmdbRequest(path, parameters) {
  const target = new URL(path, "https://api.themoviedb.org/3/");
  for (const [key, value] of Object.entries(parameters)) {
    target.searchParams.set(key, String(value));
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const result = await fetch(target, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${TMDB_TOKEN}`,
        "User-Agent": "Korevax-Catalog-Gateway/0.1",
      },
      signal: controller.signal,
    });
    if (!result.ok) {
      const error = new Error("The metadata provider returned an unsuccessful response.");
      error.status = result.status === 404 ? 404 : 502;
      throw error;
    }
    const declaredLength = Number(result.headers.get("content-length") || 0);
    if (declaredLength > MAX_PROVIDER_RESPONSE_BYTES) {
      const sizeError = new Error("Provider response exceeded the configured size limit.");
      sizeError.status = 502;
      throw sizeError;
    }
    return await readBoundedJson(result);
  } catch (error) {
    if (error.name === "AbortError") {
      const timeoutError = new Error("The metadata provider timed out.");
      timeoutError.status = 504;
      throw timeoutError;
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

async function handleCatalogRequest(url) {
  const match = /^\/api\/catalog\/(movie|series)\/search$/.exec(url.pathname);
  if (!match) return { status: 404, body: { error: "Route not found." } };

  const mediaType = match[1];
  const validated = validateQuery(url);
  if (validated.error) return { status: 400, body: { error: validated.error } };

  const cacheKey = createHash("sha256")
    .update(`${mediaType}\n${validated.query.toLocaleLowerCase("en")}\n${validated.page}`)
    .digest("hex");
  const cached = cacheGet(cacheKey);
  if (cached) return { status: 200, body: cached };

  const endpoint = mediaType === "movie" ? "search/movie" : "search/tv";
  const data = await tmdbRequest(endpoint, {
    query: validated.query,
    page: validated.page,
    include_adult: false,
  });

  const results = Array.isArray(data.results)
    ? data.results.map((item) => normalizeResult(item, mediaType)).filter(Boolean)
    : [];
  const body = {
    provider: "tmdb",
    page: Number.isSafeInteger(data.page) ? data.page : validated.page,
    totalPages: Number.isSafeInteger(data.total_pages) ? Math.min(data.total_pages, MAX_PAGE) : 1,
    totalResults: Number.isSafeInteger(data.total_results) ? data.total_results : results.length,
    results,
  };
  cacheSet(cacheKey, body);
  return { status: 200, body };
}

const server = createServer(async (request, response) => {
  if (!setCors(request, response)) {
    json(response, 403, { error: "Origin not allowed." });
    return;
  }

  if (request.method === "OPTIONS") {
    response.writeHead(204);
    response.end();
    return;
  }
  if (request.method !== "GET") {
    json(response, 405, { error: "Method not allowed." }, { Allow: "GET, OPTIONS" });
    return;
  }

  let url;
  try {
    url = new URL(request.url || "/", "http://localhost");
  } catch {
    json(response, 400, { error: "Invalid request URL." });
    return;
  }

  if (url.pathname === "/health") {
    json(response, 200, { status: "ok", provider: "tmdb" });
    return;
  }

  const rate = consumeRateLimit(clientKey(request));
  response.setHeader("RateLimit-Limit", String(RATE_LIMIT_MAX_REQUESTS));
  response.setHeader("RateLimit-Remaining", String(rate.remaining));
  if (!rate.allowed) {
    json(response, 429, { error: "Rate limit exceeded." }, {
      "Retry-After": String(Math.max(1, Math.ceil((rate.resetAt - Date.now()) / 1000))),
    });
    return;
  }

  try {
    const result = await handleCatalogRequest(url);
    json(response, result.status, result.body);
  } catch (error) {
    const status = Number.isInteger(error.status) ? error.status : 502;
    // Provider response bodies and credentials are deliberately never forwarded or logged.
    json(response, status, {
      error: status === 504
        ? "Metadata provider timeout."
        : status === 404
          ? "Metadata not found."
          : "Metadata provider unavailable.",
    });
  }
});

server.listen(PORT, HOST, () => {
  process.stdout.write(`Korevax catalog gateway listening on http://${HOST}:${PORT}\n`);
});

function shutdown() {
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 5_000).unref();
}
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
