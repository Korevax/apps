import type { LocaleCode } from "../../../domain/catalog/taxonomy.types";
import { getGenreById, getGenreLabel } from "../../../services/catalog/taxonomy.services";
import "./GenreList.css";

interface GenreListProps {
  genreIds: readonly string[];
  locale: LocaleCode;
}

export function GenreList({ genreIds, locale }: GenreListProps) {
  const genres = genreIds
    .map(getGenreById)
    .filter((genre): genre is NonNullable<typeof genre> => Boolean(genre))
    .map(genre => ({ id: genre.id, label: getGenreLabel(genre, locale) }));

  if (genres.length === 0) return null;

  return (
    <ul className="genre-list" aria-label="Gêneros">
      {genres.map(genre => (
        <li className="genre-list__item" key={genre.id}>
          {genre.label}
        </li>
      ))}
    </ul>
  );
}
