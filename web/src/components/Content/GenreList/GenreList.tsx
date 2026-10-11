
import "./GenreList.css";

interface GenreListProps {
  genres: string[];
}

export function GenreList({ genres }: GenreListProps) {
  if (genres.length === 0) {
    return null;
  }

  return (
    <ul className="genre-list" aria-label="Gêneros">
      {genres.map((genre) => (
        <li className="genre-list__item" key={genre}>
          {genre}
        </li>
      ))}
    </ul>
  );
}