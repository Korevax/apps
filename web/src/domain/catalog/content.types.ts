/** Contrato oficial do domínio de catálogo do Korevax.
 * Dados externos devem passar por validação em runtime antes de entrar no domínio.
 */
export const CONTENT_TYPES = [
  "movie",
  "series",
  "animation",
  "book",
  "manga",
  "manhwa",
  "music",
  "podcast",
  "game",
  "documentary",
] as const;

export type ContentType = (typeof CONTENT_TYPES)[number];

export const CONTENT_STATUSES = ["draft", "review", "published", "archived"] as const;
export type ContentStatus = (typeof CONTENT_STATUSES)[number];

/** Classification is orthogonal to medium/type: anime can be a movie or a series. */
export const CLASSIFICATION_IDS = ["anime"] as const;
export type ClassificationId = (typeof CLASSIFICATION_IDS)[number];

export interface ExternalContentReference {
  /** Stable provider key, e.g. "imdb" or "openlibrary". */
  provider: string;
  /** Identifier assigned by that provider; never used as Korevax's canonical ID. */
  externalId: string;
  url?: string | null;
}

export interface ContentBase {
  /** Canonical Korevax identity. Must not be derived from a title or provider ID. */
  id: string;
  /** Human-readable URL key; not the canonical identity. */
  slug: string;
  title: string;
  originalTitle?: string | null;
  /** Explicit relationship to a franchise entity; never inferred from title similarity. */
  franchiseId?: string | null;
  alternativeTitles: string[];
  synopsis: string | null;
  /** Stable taxonomy references; canonical for filtering and relationships. */
  genreIds: string[];
  tagIds: string[];
  /** @deprecated Transitional display cache; remove after all consumers use taxonomy services. */
  genres: string[];
  /** @deprecated Transitional display cache; remove after all consumers use taxonomy services. */
  tags: string[];
  /** Stable classification IDs, independent from ContentType. */
  classificationIds: ClassificationId[];
  externalReferences?: ExternalContentReference[];
  status: ContentStatus;
  releaseDate?: string | null;
  originalLanguage?: string | null;
  posterUrl?: string | null;
  backdropUrl?: string | null;
  /** ISO 8601 timestamp with explicit timezone. */
  createdAt: string;
  updatedAt: string;
}

export interface MovieMetadata {
  runtimeMinutes?: number;
  productionCountries?: string[];
}

export interface SeriesMetadata {
  totalSeasons?: number;
  totalEpisodes?: number;
  seriesStatus?: "ongoing" | "ended" | "cancelled" | "unknown";
}

export interface AnimationMetadata {
  animationMedium?: "2d" | "3d" | "stop-motion" | "mixed" | "unknown";
}

export interface BookMetadata {
  pageCount?: number;
  isbn13?: string;
  publisher?: string;
}

export interface MangaMetadata {
  chapterCount?: number;
  volumeCount?: number;
  publicationStatus?: "ongoing" | "completed" | "hiatus" | "unknown";
}

export interface ManhwaMetadata {
  chapterCount?: number;
  volumeCount?: number;
  publicationStatus?: "ongoing" | "completed" | "hiatus" | "unknown";
}

export interface MusicMetadata {
  durationSeconds?: number;
  isrc?: string;
}

export interface PodcastMetadata {
  episodeCount?: number;
  podcastStatus?: "ongoing" | "ended" | "paused" | "unknown";
}

export interface GameMetadata {
  platforms?: string[];
  gameModes?: Array<"single-player" | "multiplayer" | "co-op">;
}

export interface DocumentaryMetadata {
  runtimeMinutes?: number;
  productionCountries?: string[];
}

export interface ContentMetadataByType {
  movie: MovieMetadata;
  series: SeriesMetadata;
  animation: AnimationMetadata;
  book: BookMetadata;
  manga: MangaMetadata;
  manhwa: ManhwaMetadata;
  music: MusicMetadata;
  podcast: PodcastMetadata;
  game: GameMetadata;
  documentary: DocumentaryMetadata;
}

/** The type discriminant determines the valid metadata extension. */
export type Content = {
  [T in ContentType]: ContentBase & {
    type: T;
    metadata?: ContentMetadataByType[T];
  };
}[ContentType];
