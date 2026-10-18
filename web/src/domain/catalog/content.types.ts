/** Contrato oficial do domínio de catálogo do Korevax. Dados externos precisam de validação em runtime. */
export const CONTENT_TYPES = ["movie","series","animation","anime","book","manga","manhwa","music","podcast","game","documentary"] as const;
export type ContentType = (typeof CONTENT_TYPES)[number];
export const CONTENT_STATUSES = ["draft","review","published","archived"] as const;
export type ContentStatus = (typeof CONTENT_STATUSES)[number];
export interface ContentBase {
  id: string; slug: string; title: string;
  originalTitle?: string | null;
  /** Explicit franchise relationship; never inferred from title similarity. */
  franchiseId?: string | null;
  alternativeTitles: string[];
  synopsis: string | null;
  genres: string[]; tags: string[];
  status: ContentStatus;
  releaseDate?: string | null;
  originalLanguage?: string | null;
  posterUrl?: string | null; backdropUrl?: string | null;
  /** ISO 8601 with explicit timezone. */ createdAt: string; updatedAt: string;
}
export interface MovieMetadata { runtimeMinutes?: number; productionCountries?: string[] }
export interface SeriesMetadata { totalSeasons?: number; totalEpisodes?: number; seriesStatus?: "ongoing"|"ended"|"cancelled"|"unknown" }
export interface AnimationMetadata { animationMedium?: "2d"|"3d"|"stop-motion"|"mixed"|"unknown" }
export interface AnimeMetadata { animationMedium?: "2d"|"3d"|"stop-motion"|"mixed"|"unknown" }
export interface BookMetadata { pageCount?: number; isbn13?: string; publisher?: string }
export interface MangaMetadata { chapterCount?: number; volumeCount?: number; publicationStatus?: "ongoing"|"completed"|"hiatus"|"unknown" }
export interface ManhwaMetadata { chapterCount?: number; volumeCount?: number; publicationStatus?: "ongoing"|"completed"|"hiatus"|"unknown" }
export interface MusicMetadata { durationSeconds?: number; isrc?: string }
export interface PodcastMetadata { episodeCount?: number; podcastStatus?: "ongoing"|"ended"|"paused"|"unknown" }
export interface GameMetadata { platforms?: string[]; gameModes?: Array<"single-player"|"multiplayer"|"co-op"> }
export interface DocumentaryMetadata { runtimeMinutes?: number; productionCountries?: string[] }
export interface ContentMetadataByType {
  movie: MovieMetadata; series: SeriesMetadata; animation: AnimationMetadata; anime: AnimeMetadata;
  book: BookMetadata; manga: MangaMetadata; manhwa: ManhwaMetadata; music: MusicMetadata;
  podcast: PodcastMetadata; game: GameMetadata; documentary: DocumentaryMetadata;
}
/** type determines the valid metadata extension. */
export type Content = { [T in ContentType]: ContentBase & { type: T; metadata?: ContentMetadataByType[T] } }[ContentType];
