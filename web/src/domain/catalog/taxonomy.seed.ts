import type { Genre, Tag } from "./taxonomy.types";

/** Curated seed vocabulary for synthetic demo fixtures; not production editorial data. */
export const catalogGenres: readonly Genre[] = [
  {
    "id": "genre.ambient",
    "kind": "genre",
    "slug": "ambient",
    "active": true,
    "labels": {
      "pt-BR": "Ambient",
      "en": "Ambient",
      "es": "Ambient",
      "ru": "Эмбиент"
    },
    "createdAt": "2026-01-01T00:00:00Z",
    "updatedAt": "2026-01-01T00:00:00Z"
  },
  {
    "id": "genre.aventura",
    "kind": "genre",
    "slug": "aventura",
    "active": true,
    "labels": {
      "pt-BR": "Aventura",
      "en": "Adventure",
      "es": "Aventura",
      "ru": "Приключения"
    },
    "createdAt": "2026-01-01T00:00:00Z",
    "updatedAt": "2026-01-01T00:00:00Z"
  },
  {
    "id": "genre.cultura",
    "kind": "genre",
    "slug": "cultura",
    "active": true,
    "labels": {
      "pt-BR": "Cultura",
      "en": "Culture",
      "es": "Cultura",
      "ru": "Культура"
    },
    "createdAt": "2026-01-01T00:00:00Z",
    "updatedAt": "2026-01-01T00:00:00Z"
  },
  {
    "id": "genre.documentario",
    "kind": "genre",
    "slug": "documentario",
    "active": true,
    "labels": {
      "pt-BR": "Documentário",
      "en": "Documentary",
      "es": "Documental",
      "ru": "Документальный"
    },
    "createdAt": "2026-01-01T00:00:00Z",
    "updatedAt": "2026-01-01T00:00:00Z"
  },
  {
    "id": "genre.drama",
    "kind": "genre",
    "slug": "drama",
    "active": true,
    "labels": {
      "pt-BR": "Drama",
      "en": "Drama",
      "es": "Drama",
      "ru": "Драма"
    },
    "createdAt": "2026-01-01T00:00:00Z",
    "updatedAt": "2026-01-01T00:00:00Z"
  },
  {
    "id": "genre.eletronica",
    "kind": "genre",
    "slug": "eletronica",
    "active": true,
    "labels": {
      "pt-BR": "Eletrônica",
      "en": "Electronic music",
      "es": "Música electrónica",
      "ru": "Электронная музыка"
    },
    "createdAt": "2026-01-01T00:00:00Z",
    "updatedAt": "2026-01-01T00:00:00Z"
  },
  {
    "id": "genre.familia",
    "kind": "genre",
    "slug": "familia",
    "active": true,
    "labels": {
      "pt-BR": "Família",
      "en": "Family",
      "es": "Familiar",
      "ru": "Семейный"
    },
    "createdAt": "2026-01-01T00:00:00Z",
    "updatedAt": "2026-01-01T00:00:00Z"
  },
  {
    "id": "genre.fantasia",
    "kind": "genre",
    "slug": "fantasia",
    "active": true,
    "labels": {
      "pt-BR": "Fantasia",
      "en": "Fantasy",
      "es": "Fantasía",
      "ru": "Фэнтези"
    },
    "createdAt": "2026-01-01T00:00:00Z",
    "updatedAt": "2026-01-01T00:00:00Z"
  },
  {
    "id": "genre.ficcao-cientifica",
    "kind": "genre",
    "slug": "ficcao-cientifica",
    "active": true,
    "labels": {
      "pt-BR": "Ficção científica",
      "en": "Science fiction",
      "es": "Ciencia ficción",
      "ru": "Научная фантастика"
    },
    "createdAt": "2026-01-01T00:00:00Z",
    "updatedAt": "2026-01-01T00:00:00Z"
  },
  {
    "id": "genre.historia",
    "kind": "genre",
    "slug": "historia",
    "active": true,
    "labels": {
      "pt-BR": "História",
      "en": "History",
      "es": "Historia",
      "ru": "История"
    },
    "createdAt": "2026-01-01T00:00:00Z",
    "updatedAt": "2026-01-01T00:00:00Z"
  },
  {
    "id": "genre.misterio",
    "kind": "genre",
    "slug": "misterio",
    "active": true,
    "labels": {
      "pt-BR": "Mistério",
      "en": "Mystery",
      "es": "Misterio",
      "ru": "Мистика"
    },
    "createdAt": "2026-01-01T00:00:00Z",
    "updatedAt": "2026-01-01T00:00:00Z"
  },
  {
    "id": "genre.puzzle",
    "kind": "genre",
    "slug": "puzzle",
    "active": true,
    "labels": {
      "pt-BR": "Puzzle",
      "en": "Puzzle",
      "es": "Rompecabezas",
      "ru": "Головоломка"
    },
    "createdAt": "2026-01-01T00:00:00Z",
    "updatedAt": "2026-01-01T00:00:00Z"
  },
  {
    "id": "genre.slice-of-life",
    "kind": "genre",
    "slug": "slice-of-life",
    "active": true,
    "labels": {
      "pt-BR": "Slice of life",
      "en": "Slice of life",
      "es": "Recuentos de la vida",
      "ru": "Повседневность"
    },
    "createdAt": "2026-01-01T00:00:00Z",
    "updatedAt": "2026-01-01T00:00:00Z"
  },
  {
    "id": "genre.suspense",
    "kind": "genre",
    "slug": "suspense",
    "active": true,
    "labels": {
      "pt-BR": "Suspense",
      "en": "Thriller",
      "es": "Suspense",
      "ru": "Триллер"
    },
    "createdAt": "2026-01-01T00:00:00Z",
    "updatedAt": "2026-01-01T00:00:00Z"
  },
  {
    "id": "genre.tecnologia",
    "kind": "genre",
    "slug": "tecnologia",
    "active": true,
    "labels": {
      "pt-BR": "Tecnologia",
      "en": "Technology",
      "es": "Tecnología",
      "ru": "Технологии"
    },
    "createdAt": "2026-01-01T00:00:00Z",
    "updatedAt": "2026-01-01T00:00:00Z"
  }
];

export const catalogTags: readonly Tag[] = [
  {
    "id": "tag.amizade",
    "kind": "tag",
    "slug": "amizade",
    "active": true,
    "labels": {
      "pt-BR": "amizade",
      "en": "Friendship",
      "es": "Amistad",
      "ru": "Дружба"
    },
    "createdAt": "2026-01-01T00:00:00Z",
    "updatedAt": "2026-01-01T00:00:00Z"
  },
  {
    "id": "tag.arquivo",
    "kind": "tag",
    "slug": "arquivo",
    "active": true,
    "labels": {
      "pt-BR": "arquivo",
      "en": "Archive",
      "es": "Archivo",
      "ru": "Архив"
    },
    "createdAt": "2026-01-01T00:00:00Z",
    "updatedAt": "2026-01-01T00:00:00Z"
  },
  {
    "id": "tag.cartografia",
    "kind": "tag",
    "slug": "cartografia",
    "active": true,
    "labels": {
      "pt-BR": "cartografia",
      "en": "Cartography",
      "es": "Cartografía",
      "ru": "Картография"
    },
    "createdAt": "2026-01-01T00:00:00Z",
    "updatedAt": "2026-01-01T00:00:00Z"
  },
  {
    "id": "tag.cidade",
    "kind": "tag",
    "slug": "cidade",
    "active": true,
    "labels": {
      "pt-BR": "cidade",
      "en": "City",
      "es": "Ciudad",
      "ru": "Город"
    },
    "createdAt": "2026-01-01T00:00:00Z",
    "updatedAt": "2026-01-01T00:00:00Z"
  },
  {
    "id": "tag.comunicacao",
    "kind": "tag",
    "slug": "comunicacao",
    "active": true,
    "labels": {
      "pt-BR": "comunicação",
      "en": "Communication",
      "es": "Comunicación",
      "ru": "Коммуникация"
    },
    "createdAt": "2026-01-01T00:00:00Z",
    "updatedAt": "2026-01-01T00:00:00Z"
  },
  {
    "id": "tag.comunidade",
    "kind": "tag",
    "slug": "comunidade",
    "active": true,
    "labels": {
      "pt-BR": "comunidade",
      "en": "Community",
      "es": "Comunidad",
      "ru": "Сообщество"
    },
    "createdAt": "2026-01-01T00:00:00Z",
    "updatedAt": "2026-01-01T00:00:00Z"
  },
  {
    "id": "tag.conspiracao",
    "kind": "tag",
    "slug": "conspiracao",
    "active": true,
    "labels": {
      "pt-BR": "conspiração",
      "en": "Conspiracy",
      "es": "Conspiración",
      "ru": "Заговор"
    },
    "createdAt": "2026-01-01T00:00:00Z",
    "updatedAt": "2026-01-01T00:00:00Z"
  },
  {
    "id": "tag.cotidiano",
    "kind": "tag",
    "slug": "cotidiano",
    "active": true,
    "labels": {
      "pt-BR": "cotidiano",
      "en": "Everyday life",
      "es": "Vida cotidiana",
      "ru": "Повседневность"
    },
    "createdAt": "2026-01-01T00:00:00Z",
    "updatedAt": "2026-01-01T00:00:00Z"
  },
  {
    "id": "tag.criatividade",
    "kind": "tag",
    "slug": "criatividade",
    "active": true,
    "labels": {
      "pt-BR": "criatividade",
      "en": "Creativity",
      "es": "Creatividad",
      "ru": "Творчество"
    },
    "createdAt": "2026-01-01T00:00:00Z",
    "updatedAt": "2026-01-01T00:00:00Z"
  },
  {
    "id": "tag.curtas",
    "kind": "tag",
    "slug": "curtas",
    "active": true,
    "labels": {
      "pt-BR": "curtas",
      "en": "Short films",
      "es": "Cortometrajes",
      "ru": "Короткометражки"
    },
    "createdAt": "2026-01-01T00:00:00Z",
    "updatedAt": "2026-01-01T00:00:00Z"
  },
  {
    "id": "tag.energia",
    "kind": "tag",
    "slug": "energia",
    "active": true,
    "labels": {
      "pt-BR": "energia",
      "en": "Energy",
      "es": "Energía",
      "ru": "Энергия"
    },
    "createdAt": "2026-01-01T00:00:00Z",
    "updatedAt": "2026-01-01T00:00:00Z"
  },
  {
    "id": "tag.enigmas",
    "kind": "tag",
    "slug": "enigmas",
    "active": true,
    "labels": {
      "pt-BR": "enigmas",
      "en": "Riddles",
      "es": "Acertijos",
      "ru": "Загадки"
    },
    "createdAt": "2026-01-01T00:00:00Z",
    "updatedAt": "2026-01-01T00:00:00Z"
  },
  {
    "id": "tag.entrevista",
    "kind": "tag",
    "slug": "entrevista",
    "active": true,
    "labels": {
      "pt-BR": "entrevista",
      "en": "Interview",
      "es": "Entrevista",
      "ru": "Интервью"
    },
    "createdAt": "2026-01-01T00:00:00Z",
    "updatedAt": "2026-01-01T00:00:00Z"
  },
  {
    "id": "tag.equipe",
    "kind": "tag",
    "slug": "equipe",
    "active": true,
    "labels": {
      "pt-BR": "equipe",
      "en": "Team",
      "es": "Equipo",
      "ru": "Команда"
    },
    "createdAt": "2026-01-01T00:00:00Z",
    "updatedAt": "2026-01-01T00:00:00Z"
  },
  {
    "id": "tag.espaco",
    "kind": "tag",
    "slug": "espaco",
    "active": true,
    "labels": {
      "pt-BR": "espaço",
      "en": "Space",
      "es": "Espacio",
      "ru": "Космос"
    },
    "createdAt": "2026-01-01T00:00:00Z",
    "updatedAt": "2026-01-01T00:00:00Z"
  },
  {
    "id": "tag.exploracao",
    "kind": "tag",
    "slug": "exploracao",
    "active": true,
    "labels": {
      "pt-BR": "exploração",
      "en": "Exploration",
      "es": "Exploración",
      "ru": "Исследование"
    },
    "createdAt": "2026-01-01T00:00:00Z",
    "updatedAt": "2026-01-01T00:00:00Z"
  },
  {
    "id": "tag.ferrovia",
    "kind": "tag",
    "slug": "ferrovia",
    "active": true,
    "labels": {
      "pt-BR": "ferrovia",
      "en": "Railway",
      "es": "Ferrocarril",
      "ru": "Железная дорога"
    },
    "createdAt": "2026-01-01T00:00:00Z",
    "updatedAt": "2026-01-01T00:00:00Z"
  },
  {
    "id": "tag.futuro",
    "kind": "tag",
    "slug": "futuro",
    "active": true,
    "labels": {
      "pt-BR": "futuro",
      "en": "Future",
      "es": "Futuro",
      "ru": "Будущее"
    },
    "createdAt": "2026-01-01T00:00:00Z",
    "updatedAt": "2026-01-01T00:00:00Z"
  },
  {
    "id": "tag.instrumental",
    "kind": "tag",
    "slug": "instrumental",
    "active": true,
    "labels": {
      "pt-BR": "instrumental",
      "en": "Instrumental",
      "es": "Instrumental",
      "ru": "Инструментальная музыка"
    },
    "createdAt": "2026-01-01T00:00:00Z",
    "updatedAt": "2026-01-01T00:00:00Z"
  },
  {
    "id": "tag.investigacao",
    "kind": "tag",
    "slug": "investigacao",
    "active": true,
    "labels": {
      "pt-BR": "investigação",
      "en": "Investigation",
      "es": "Investigación",
      "ru": "Расследование"
    },
    "createdAt": "2026-01-01T00:00:00Z",
    "updatedAt": "2026-01-01T00:00:00Z"
  },
  {
    "id": "tag.jardim",
    "kind": "tag",
    "slug": "jardim",
    "active": true,
    "labels": {
      "pt-BR": "jardim",
      "en": "Garden",
      "es": "Jardín",
      "ru": "Сад"
    },
    "createdAt": "2026-01-01T00:00:00Z",
    "updatedAt": "2026-01-01T00:00:00Z"
  },
  {
    "id": "tag.jornada",
    "kind": "tag",
    "slug": "jornada",
    "active": true,
    "labels": {
      "pt-BR": "jornada",
      "en": "Journey",
      "es": "Viaje",
      "ru": "Путешествие"
    },
    "createdAt": "2026-01-01T00:00:00Z",
    "updatedAt": "2026-01-01T00:00:00Z"
  },
  {
    "id": "tag.memoria",
    "kind": "tag",
    "slug": "memoria",
    "active": true,
    "labels": {
      "pt-BR": "memória",
      "en": "Memory",
      "es": "Memoria",
      "ru": "Память"
    },
    "createdAt": "2026-01-01T00:00:00Z",
    "updatedAt": "2026-01-01T00:00:00Z"
  },
  {
    "id": "tag.mensagens",
    "kind": "tag",
    "slug": "mensagens",
    "active": true,
    "labels": {
      "pt-BR": "mensagens",
      "en": "Messages",
      "es": "Mensajes",
      "ru": "Сообщения"
    },
    "createdAt": "2026-01-01T00:00:00Z",
    "updatedAt": "2026-01-01T00:00:00Z"
  },
  {
    "id": "tag.misterio",
    "kind": "tag",
    "slug": "misterio",
    "active": true,
    "labels": {
      "pt-BR": "mistério",
      "en": "Mystery",
      "es": "Misterio",
      "ru": "Тайна"
    },
    "createdAt": "2026-01-01T00:00:00Z",
    "updatedAt": "2026-01-01T00:00:00Z"
  },
  {
    "id": "tag.narrativa",
    "kind": "tag",
    "slug": "narrativa",
    "active": true,
    "labels": {
      "pt-BR": "narrativa",
      "en": "Narrative",
      "es": "Narrativa",
      "ru": "Повествование"
    },
    "createdAt": "2026-01-01T00:00:00Z",
    "updatedAt": "2026-01-01T00:00:00Z"
  },
  {
    "id": "tag.noturno",
    "kind": "tag",
    "slug": "noturno",
    "active": true,
    "labels": {
      "pt-BR": "noturno",
      "en": "Nocturnal",
      "es": "Nocturno",
      "ru": "Ночной"
    },
    "createdAt": "2026-01-01T00:00:00Z",
    "updatedAt": "2026-01-01T00:00:00Z"
  },
  {
    "id": "tag.oceano",
    "kind": "tag",
    "slug": "oceano",
    "active": true,
    "labels": {
      "pt-BR": "oceano",
      "en": "Ocean",
      "es": "Océano",
      "ru": "Океан"
    },
    "createdAt": "2026-01-01T00:00:00Z",
    "updatedAt": "2026-01-01T00:00:00Z"
  },
  {
    "id": "tag.pesquisa",
    "kind": "tag",
    "slug": "pesquisa",
    "active": true,
    "labels": {
      "pt-BR": "pesquisa",
      "en": "Research",
      "es": "Investigación",
      "ru": "Исследование"
    },
    "createdAt": "2026-01-01T00:00:00Z",
    "updatedAt": "2026-01-01T00:00:00Z"
  },
  {
    "id": "tag.radio",
    "kind": "tag",
    "slug": "radio",
    "active": true,
    "labels": {
      "pt-BR": "rádio",
      "en": "Radio",
      "es": "Radio",
      "ru": "Радио"
    },
    "createdAt": "2026-01-01T00:00:00Z",
    "updatedAt": "2026-01-01T00:00:00Z"
  },
  {
    "id": "tag.sobrevivencia",
    "kind": "tag",
    "slug": "sobrevivencia",
    "active": true,
    "labels": {
      "pt-BR": "sobrevivência",
      "en": "Survival",
      "es": "Supervivencia",
      "ru": "Выживание"
    },
    "createdAt": "2026-01-01T00:00:00Z",
    "updatedAt": "2026-01-01T00:00:00Z"
  },
  {
    "id": "tag.tecnologia",
    "kind": "tag",
    "slug": "tecnologia",
    "active": true,
    "labels": {
      "pt-BR": "tecnologia",
      "en": "Technology",
      "es": "Tecnología",
      "ru": "Технологии"
    },
    "createdAt": "2026-01-01T00:00:00Z",
    "updatedAt": "2026-01-01T00:00:00Z"
  },
  {
    "id": "tag.tripulacao",
    "kind": "tag",
    "slug": "tripulacao",
    "active": true,
    "labels": {
      "pt-BR": "tripulação",
      "en": "Crew",
      "es": "Tripulación",
      "ru": "Экипаж"
    },
    "createdAt": "2026-01-01T00:00:00Z",
    "updatedAt": "2026-01-01T00:00:00Z"
  }
];
