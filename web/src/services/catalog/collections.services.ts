import type { Content } from "../../domain/catalog/content.types";
import { getAllContent } from "./catalog.services";

export interface MovieCollection {
  id: string;
  name: string;
  movies: Extract<Content, { type: "movie" }>[];
}

/**
 * Collection identity is canonical data, separate from movie records.
 * Add aliases/descriptions here or, once the API exists, store these definitions in its database.
 */
const collectionDefinitions: readonly Pick<MovieCollection, "id" | "name">[] = [
  { id: "terminator", name: "O Exterminador do Futuro" },
];

/** Return only collections with a canonical definition and at least two published movies. */
export function getMovieCollections(): MovieCollection[] {
  const definitions = new Map(collectionDefinitions.map(collection => [collection.id, collection]));
  const groups = new Map<string, Extract<Content, { type: "movie" }>[]>();

  for (const content of getAllContent()) {
    if (content.type !== "movie" || !content.franchiseId) continue;
    const key = content.franchiseId.trim().toLocaleLowerCase();
    if (!key || !definitions.has(key)) continue;
    const movies = groups.get(key) ?? [];
    movies.push(content);
    groups.set(key, movies);
  }

  return [...groups.entries()]
    .filter(([, movies]) => movies.length >= 2)
    .map(([id, movies]) => ({
      ...definitions.get(id)!,
      movies: movies.slice().sort((a, b) =>
        (a.releaseDate ?? "").localeCompare(b.releaseDate ?? "") || a.title.localeCompare(b.title),
      ),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}
