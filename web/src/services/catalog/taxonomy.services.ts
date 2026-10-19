import { catalogGenres, catalogTags } from "../../domain/catalog/taxonomy.seed";
import type { Genre, LocaleCode, Tag } from "../../domain/catalog/taxonomy.types";

const normalize = (value: string) => value.normalize("NFKC").trim().toLocaleLowerCase();

export function getGenreById(id: string): Genre | undefined {
  return catalogGenres.find(genre => genre.id === id);
}

export function getTagById(id: string): Tag | undefined {
  return catalogTags.find(tag => tag.id === id);
}

export function getGenreLabel(genre: Genre, locale: LocaleCode): string {
  return genre.labels[locale] ?? genre.labels["pt-BR"] ?? genre.id;
}

export function getTagLabel(tag: Tag, locale: LocaleCode): string {
  return tag.labels[locale] ?? tag.labels["pt-BR"] ?? tag.id;
}

function taxonomyTerms(entity: Genre | Tag): string[] {
  return [
    ...Object.values(entity.labels),
    ...Object.values(entity.aliases ?? {}).flat(),
  ].filter((value): value is string => typeof value === "string");
}

/** Matches canonical IDs, localized labels and curated aliases without merging identities. */
export function matchesTaxonomyTerm(
  entity: Genre | Tag | undefined,
  query: string,
): boolean {
  if (!entity || !query.trim()) return false;
  const normalized = normalize(query);
  return entity.id === normalized ||
    taxonomyTerms(entity).some(term => normalize(term) === normalized);
}

export function getTaxonomySearchTerms(genreIds: readonly string[], tagIds: readonly string[]): string[] {
  return [
    ...genreIds.flatMap(id => {
      const genre = getGenreById(id);
      return genre ? taxonomyTerms(genre) : [];
    }),
    ...tagIds.flatMap(id => {
      const tag = getTagById(id);
      return tag ? taxonomyTerms(tag) : [];
    }),
  ];
}

/** Referential-integrity check for the current seeded vocabulary adapter. */
export function getTaxonomyReferenceErrors(
  genreIds: readonly string[],
  tagIds: readonly string[],
): string[] {
  const errors: string[] = [];
  for (const id of genreIds) {
    if (!getGenreById(id)) errors.push(`Referência de gênero inexistente: ${id}.`);
  }
  for (const id of tagIds) {
    if (!getTagById(id)) errors.push(`Referência de tag inexistente: ${id}.`);
  }
  return errors;
}
