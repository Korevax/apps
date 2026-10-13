/**
 * Tipos oficiais do domínio de catálogo do Korevax.
 *
 * Este arquivo define a estrutura dos dados, não valida dados externos.
 */

export const CONTENT_TYPES = [
  "movie",
  "series",
  "animation",
  "anime",
  "book",
  "manga",
  "manhwa",
  "music",
  "podcast",
  "game",
  "documentary",
] as const;

export type ContentType = (typeof CONTENT_TYPES)[number];

export interface ContentRating {
  /** Média das avaliações ou null quando ainda não existe uma média. */
  average: number | null;

  /** Quantidade de avaliações consideradas no cálculo. */
  count: number;
}

export interface Content {
  /** Identificador interno e estável do conteúdo. */
  id: string;

  /** Identificador textual usado em URLs. */
  slug: string;

  /** Título principal apresentado no catálogo. */
  title: string;

  /** Título original, quando disponível. */
  originalTitle?: string;

  /** Categoria principal do conteúdo. */
  type: ContentType;

  /** Sinopse ou descrição do conteúdo. */
  synopsis: string;

  /** Gêneros associados ao conteúdo. */
  genres: string[];

  /** Data de lançamento no formato YYYY-MM-DD, quando conhecida. */
  releaseDate?: string;

  /** Duração em minutos, quando aplicável e conhecida. */
  durationMinutes?: number;

  /** URL da imagem de capa, quando disponível. */
  posterUrl?: string;

  /** URL da imagem de fundo, quando disponível. */
  backdropUrl?: string;

  /** Resumo agregado das avaliações do conteúdo. */
  rating: ContentRating;
}
