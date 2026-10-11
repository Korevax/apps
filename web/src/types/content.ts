
export type ContentType =
  | "movie"
  | "series"
  | "animation"
  | "anime"
  | "book"
  | "manga"
  | "manhwa"
  | "music"
  | "podcast"
  | "game"
  | "documentary";

export interface ContentRating {
  average: number | null;
  count: number;
}

export interface Content {
  id: string;
  slug: string;
  title: string;
  originalTitle?: string;
  type: ContentType;
  synopsis: string;
  genres: string[];
  releaseDate?: string;
  durationMinutes?: number;
  posterUrl?: string;
  backdropUrl?: string;
  rating: ContentRating;
}