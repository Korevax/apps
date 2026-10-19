import { catalogGenres, catalogTags } from "./taxonomy.seed";

/** Referential-integrity checks for the current curated vocabulary/fixture adapter. */
export function getTaxonomyReferenceErrors(
  genreIds: readonly string[],
  tagIds: readonly string[],
): string[] {
  const genreSet = new Set(catalogGenres.map(genre => genre.id));
  const tagSet = new Set(catalogTags.map(tag => tag.id));
  const errors: string[] = [];

  for (const id of genreIds) {
    if (!genreSet.has(id)) errors.push(`Referência de gênero inexistente: ${id}.`);
  }
  for (const id of tagIds) {
    if (!tagSet.has(id)) errors.push(`Referência de tag inexistente: ${id}.`);
  }

  return errors;
}
