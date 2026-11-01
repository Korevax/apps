/** Shared, localized vocabulary contracts for the Korevax catalog. */
export type LocaleCode = "pt-BR" | "en" | "es" | "ru";

export interface LocalizedText {
  /** BCP 47 locale tags mapped to display labels. */
  labels: Partial<Record<LocaleCode, string>>;
  /** Locale-scoped alternative labels used for discovery, not identity. */
  aliases?: Partial<Record<LocaleCode, string[]>>;
}

export interface TaxonomyEntityBase extends LocalizedText {
  /** Stable machine identifier; do not derive it from localized labels. */
  id: string;
  /** Optional stable URL key for human-facing routes. */
  slug?: string;
  /** Whether this value may be assigned to new content. */
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Genre describes a broad, reusable thematic/content category. */
export interface Genre extends TaxonomyEntityBase {
  kind: "genre";
}

/** Tag is a curated, more specific discovery descriptor. */
export interface Tag extends TaxonomyEntityBase {
  kind: "tag";
}

/** Cross-cutting classification, orthogonal to the primary ContentType. */
export interface Classification extends TaxonomyEntityBase {
  kind: "classification";
}

/** Language is a canonical language identifier plus localized display labels. */
export interface CatalogLanguage extends TaxonomyEntityBase {
  kind: "language";
  languageTag: string;
}

/** Region/country metadata uses stable codes instead of display names. */
export interface Region extends TaxonomyEntityBase {
  kind: "region";
  code: string;
}

/** Age ratings are jurisdiction-specific classifications, not genres/tags. */
export interface AgeRating extends TaxonomyEntityBase {
  kind: "age-rating";
  regionId: string;
  code: string;
}

/** Formats describe packaging/edition, e.g. paperback, hardcover, digital. */
export interface ContentFormat extends TaxonomyEntityBase {
  kind: "format";
}

/** Publication/release lifecycle is separate from editorial review status. */
export type ReleaseStatus =
  | "upcoming"
  | "ongoing"
  | "released"
  | "cancelled"
  | "unknown";

export interface TaxonomyByKind {
  genre: Genre;
  tag: Tag;
  classification: Classification;
  language: CatalogLanguage;
  region: Region;
  "age-rating": AgeRating;
  format: ContentFormat;
}

export type TaxonomyEntity = TaxonomyByKind[keyof TaxonomyByKind];
