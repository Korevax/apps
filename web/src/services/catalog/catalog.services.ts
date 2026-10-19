import { mockContents } from "../../data/mockContent";
import type { ClassificationId, Content, ContentType } from "../../domain/catalog/content.types";
import { getContentIntegrityErrors, isContentBusinessValid } from "../../domain/catalog/content.rules";
import { getContentRatingSummary } from "../ratings/ratings.services";
import { getGenreById, getTagById, getTaxonomySearchTerms, matchesTaxonomyTerm } from "./taxonomy.services";

/** Mock data is the current read-only adapter; persistence will replace this boundary. */
const source: readonly unknown[] = mockContents;

function validCatalog(): Content[] {
  const valid = source.filter(isContentBusinessValid);
  const ids = new Map<string, number>();
  const slugs = new Map<string, number>();

  for (const content of valid) {
    ids.set(content.id, (ids.get(content.id) ?? 0) + 1);
    slugs.set(content.slug, (slugs.get(content.slug) ?? 0) + 1);
  }

  return valid.filter(content => ids.get(content.id) === 1 && slugs.get(content.slug) === 1);
}

export function getAllContent(): Content[] {
  return validCatalog().filter(content => content.status === "published");
}

export function getContentById(id: string): Content | undefined {
  if (typeof id !== "string" || !id.trim()) return undefined;
  return getAllContent().find(content => content.id === id);
}

export function getContentBySlug(slug: string): Content | undefined {
  if (typeof slug !== "string" || !slug.trim()) return undefined;
  return getAllContent().find(content => content.slug === slug);
}

export function getContentByType(type: ContentType): Content[] {
  return getAllContent().filter(content => content.type === type);
}

export function getContentByClassification(classificationId: ClassificationId): Content[] {
  return getAllContent().filter(content => content.classificationIds.includes(classificationId));
}

export interface ContentSearchOptions {
  query?: string;
  type?: ContentType;
  classificationId?: ClassificationId;
  genre?: string;
  tag?: string;
}

const normalize = (value: string) => value.trim().normalize("NFKC").toLocaleLowerCase();

export function searchContent(options: ContentSearchOptions = {}): Content[] {
  const query = typeof options.query === "string" ? normalize(options.query) : "";
  const genre = typeof options.genre === "string" ? normalize(options.genre) : "";
  const tag = typeof options.tag === "string" ? normalize(options.tag) : "";

  return getAllContent().filter(content => {
    if (options.type && content.type !== options.type) return false;
    if (options.classificationId && !content.classificationIds.includes(options.classificationId)) return false;
    if (genre && !content.genreIds.some(id => matchesTaxonomyTerm(getGenreById(id), options.genre ?? "")) &&
      !content.genres.some(value => normalize(value) === genre)) return false;
    if (tag && !content.tagIds.some(id => matchesTaxonomyTerm(getTagById(id), options.tag ?? "")) &&
      !content.tags.some(value => normalize(value) === tag)) return false;
    if (!query) return true;

    return [
      content.title,
      content.originalTitle ?? "",
      ...content.alternativeTitles,
      content.synopsis ?? "",
      ...content.genres,
      ...content.tags,
      ...content.classificationIds,
      ...getTaxonomySearchTerms(content.genreIds, content.tagIds),
    ].some(value => normalize(value).includes(query));
  });
}

function limitValue(value: number): number {
  return Number.isSafeInteger(value) ? Math.max(0, Math.min(value, 100)) : 8;
}

export function getRecentContent(limit = 8): Content[] {
  return getAllContent()
    .slice()
    .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))
    .slice(0, limitValue(limit));
}

export function getPopularContent(limit = 8): Content[] {
  return getAllContent()
    .slice()
    .sort((a, b) =>
      getContentRatingSummary(b.id).count - getContentRatingSummary(a.id).count ||
      a.title.localeCompare(b.title),
    )
    .slice(0, limitValue(limit));
}

export function validateCatalogRecord(value: unknown): string[] {
  return getContentIntegrityErrors(value);
}
