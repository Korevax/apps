/**
 * @deprecated Import contracts from domain/catalog and domain/ratings.
 * Kept temporarily while existing imports are migrated.
 */
export {
  CLASSIFICATION_IDS,
  CONTENT_STATUSES,
  CONTENT_TYPES,
  type AnimationMetadata,
  type BookMetadata,
  type ClassificationId,
  type Content,
  type ContentBase,
  type ContentMetadataByType,
  type ContentStatus,
  type ContentType,
  type DocumentaryMetadata,
  type ExternalContentReference,
  type GameMetadata,
  type MangaMetadata,
  type ManhwaMetadata,
  type MovieMetadata,
  type MusicMetadata,
  type PodcastMetadata,
  type SeriesMetadata,
} from "../domain/catalog/content.types";
export type { ContentRatingSummary as ContentRating } from "../domain/ratings/rating.types";
