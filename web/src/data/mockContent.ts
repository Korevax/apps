
import type { Content } from "../domain/catalog/content.types";

export const mockContent: Content = {
  id: "movie-filme-x",
  slug: "filme-x",
  title: "FilmeX",
  originalTitle: "Film X",
  type: "movie",
  synopsis:
    "Em um futuro próximo, uma descoberta inesperada " +
    "coloca em risco as fronteiras entre a memória e a realidade. " +
    "Uma jornada de mistério, escolhas e consequências.",
  genres: [
    "Ficção científica",
    "Drama",
    "Mistério",
  ],
  releaseDate: "2026-05-15",
  durationMinutes: 128,
  rating: {
    average: 8.7,
    count: 1248,
  },
};