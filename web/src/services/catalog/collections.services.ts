import type { Content } from "../../domain/catalog/content.types";
import { getAllContent } from "./catalog.services";

export interface MovieCollection {
  id: string;
  name: string;
  movies: Extract<Content, { type: "movie" }>[];
}

/**
 * A collection is a franchise of at least two published movies sharing an explicit franchiseId.
 * We intentionally do not infer franchise membership from similar titles.
 */
export function getMovieCollections(): MovieCollection[] {
  const groups = new Map<string, Extract<Content, { type: "movie" }>[]>();
  for (const content of getAllContent()) {
    if (content.type !== "movie" || !content.franchiseId) continue;
    const key = content.franchiseId.trim().toLocaleLowerCase();
    if (!key) continue;
    const movies = groups.get(key) ?? [];
    movies.push(content);
    groups.set(key, movies);
  }

  return [...groups.entries()]
    .filter(([, movies]) => movies.length >= 2)
    .map(([id, movies]) => ({
      id,
      name: movies[0].franchiseName?.trim() || id.replace(/[-_]+/g, " "),
      movies: movies.slice().sort((a, b) =>
        (a.releaseDate ?? "").localeCompare(b.releaseDate ?? "") || a.title.localeCompare(b.title),
      ),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}
