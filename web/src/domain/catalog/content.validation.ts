import {
  CLASSIFICATION_IDS,
  CONTENT_STATUSES,
  CONTENT_TYPES,
  type ClassificationId,
  type Content,
  type ContentStatus,
  type ContentType,
} from "./content.types";

const TYPES: ReadonlySet<string> = new Set(CONTENT_TYPES);
const STATUSES: ReadonlySet<string> = new Set(CONTENT_STATUSES);
const CLASSIFICATIONS: ReadonlySet<string> = new Set(CLASSIFICATION_IDS);
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const IDENTIFIER = /^[a-z0-9][a-z0-9._:-]*$/;
const LANGUAGE = /^[A-Za-z]{2,8}(?:-[A-Za-z0-9]{1,8})*$/;
const TIMESTAMP = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d{1,3})?(Z|([+-])(\d{2}):(\d{2}))$/;

function record(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function nonEmpty(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function nullableString(value: unknown): boolean {
  return value === undefined || value === null || typeof value === "string";
}

function isType(value: unknown): value is ContentType {
  return typeof value === "string" && TYPES.has(value);
}

function isStatus(value: unknown): value is ContentStatus {
  return typeof value === "string" && STATUSES.has(value);
}

function validDate(value: unknown): value is string {
  if (typeof value !== "string") return false;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  return year >= 1 && month >= 1 && month <= 12 &&
    day >= 1 && day <= new Date(Date.UTC(year, month, 0)).getUTCDate();
}

function validTimestamp(value: unknown): value is string {
  if (typeof value !== "string") return false;
  const match = TIMESTAMP.exec(value);
  if (!match || !validDate(`${match[1]}-${match[2]}-${match[3]}`)) return false;
  if (Number(match[4]) > 23 || Number(match[5]) > 59 || Number(match[6]) > 59) return false;

  if (match[7] !== "Z" && (
    Number(match[9]) > 14 ||
    Number(match[10]) > 59 ||
    (Number(match[9]) === 14 && Number(match[10]) !== 0)
  )) return false;

  return Number.isFinite(Date.parse(value));
}

/** Accept safe local paths or HTTP(S) URLs without embedded credentials. */
export function isSafeImageUrl(value: unknown): value is string {
  if (
    typeof value !== "string" ||
    value.length > 2048 ||
    value.trim() !== value ||
    /[\u0000-\u001F\u007F]/.test(value)
  ) return false;

  if (value.startsWith("/")) {
    return !value.startsWith("//") && !value.includes("\\");
  }

  try {
    const url = new URL(value);
    return (url.protocol === "https:" || url.protocol === "http:") &&
      Boolean(url.hostname) && !url.username && !url.password;
  } catch {
    return false;
  }
}

function strings(value: unknown): value is string[] {
  return Array.isArray(value) &&
    value.length <= 200 &&
    value.every(item => nonEmpty(item) && item.length <= 200);
}

function referenceIdentifiers(value: unknown): value is string[] {
  return Array.isArray(value) &&
    value.length <= 200 &&
    value.every(item => typeof item === "string" && IDENTIFIER.test(item) && item.length <= 128) &&
    new Set(value).size === value.length;
}

function classificationIdentifiers(value: unknown): value is ClassificationId[] {
  return Array.isArray(value) &&
    value.length <= 100 &&
    value.every(item => typeof item === "string" && CLASSIFICATIONS.has(item));
}

function isSafeHttpUrl(value: unknown): value is string {
  if (typeof value !== "string" || value.length > 2048 || value.trim() !== value) return false;
  try {
    const url = new URL(value);
    return (url.protocol === "https:" || url.protocol === "http:") &&
      Boolean(url.hostname) && !url.username && !url.password;
  } catch {
    return false;
  }
}

function positive(value: unknown): boolean {
  return typeof value === "number" && Number.isSafeInteger(value) && value > 0;
}

function nonNegative(value: unknown): boolean {
  return typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
}

function oneOf(value: unknown, options: readonly string[]): boolean {
  return typeof value === "string" && options.includes(value);
}

function isbn13(value: unknown): boolean {
  if (typeof value !== "string" || !/^\d{13}$/.test(value)) return false;
  const sum = value.slice(0, 12).split("").reduce(
    (total, digit, index) => total + Number(digit) * (index % 2 === 0 ? 1 : 3),
    0,
  );
  return (10 - sum % 10) % 10 === Number(value[12]);
}

function externalReferencesErrors(value: unknown): string[] {
  if (value === undefined) return [];
  if (!Array.isArray(value) || value.length > 50) {
    return ["externalReferences deve ser uma lista com no máximo 50 referências."];
  }

  const errors: string[] = [];
  value.forEach((reference, index) => {
    const prefix = `externalReferences[${index}]`;
    if (!record(reference)) {
      errors.push(`${prefix} deve ser um objeto.`);
      return;
    }
    if (
      !nonEmpty(reference.provider) ||
      reference.provider.length > 64 ||
      !/^[a-z0-9][a-z0-9._-]*$/i.test(reference.provider)
    ) errors.push(`${prefix}.provider inválido.`);
    if (!nonEmpty(reference.externalId) || reference.externalId.length > 256) {
      errors.push(`${prefix}.externalId deve ser uma string não vazia de até 256 caracteres.`);
    }
    if (
      reference.url !== undefined &&
      reference.url !== null &&
      !isSafeHttpUrl(reference.url)
    ) errors.push(`${prefix}.url deve ser uma URL HTTP(S) segura.`);
  });

  return errors;
}

function metadataErrors(type: ContentType, value: unknown): string[] {
  if (value === undefined) return [];
  if (!record(value)) return ["metadata deve ser um objeto."];

  const allowed: Record<ContentType, readonly string[]> = {
    movie: ["runtimeMinutes", "productionCountries"],
    series: ["totalSeasons", "totalEpisodes", "seriesStatus"],
    animation: ["animationMedium"],
    book: ["pageCount", "isbn13", "publisher"],
    manga: ["chapterCount", "volumeCount", "publicationStatus"],
    manhwa: ["chapterCount", "volumeCount", "publicationStatus"],
    music: ["durationSeconds", "isrc"],
    podcast: ["episodeCount", "podcastStatus"],
    game: ["platforms", "gameModes"],
    documentary: ["runtimeMinutes", "productionCountries"],
  };

  const errors: string[] = [];
  for (const key of Object.keys(value)) {
    if (!allowed[type].includes(key)) {
      errors.push(`metadata.${key} não é permitido para o tipo ${type}.`);
    }
  }

  const positiveField = (key: string) => {
    if (value[key] !== undefined && !positive(value[key])) {
      errors.push(`metadata.${key} deve ser inteiro positivo.`);
    }
  };
  const nonNegativeField = (key: string) => {
    if (value[key] !== undefined && !nonNegative(value[key])) {
      errors.push(`metadata.${key} deve ser inteiro não negativo.`);
    }
  };
  const arrayField = (key: string) => {
    if (value[key] !== undefined && !strings(value[key])) {
      errors.push(`metadata.${key} deve ser uma lista de strings.`);
    }
  };
  const enumField = (key: string, options: readonly string[]) => {
    if (value[key] !== undefined && !oneOf(value[key], options)) {
      errors.push(`metadata.${key} contém valor inválido.`);
    }
  };

  switch (type) {
    case "movie":
    case "documentary":
      positiveField("runtimeMinutes");
      arrayField("productionCountries");
      break;
    case "series":
      positiveField("totalSeasons");
      positiveField("totalEpisodes");
      enumField("seriesStatus", ["ongoing", "ended", "cancelled", "unknown"]);
      break;
    case "animation":
      enumField("animationMedium", ["2d", "3d", "stop-motion", "mixed", "unknown"]);
      break;
    case "book":
      positiveField("pageCount");
      if (value.isbn13 !== undefined && !isbn13(value.isbn13)) {
        errors.push("metadata.isbn13 inválido.");
      }
      if (value.publisher !== undefined && !nonEmpty(value.publisher)) {
        errors.push("metadata.publisher deve ser string não vazia.");
      }
      break;
    case "manga":
    case "manhwa":
      positiveField("chapterCount");
      positiveField("volumeCount");
      enumField("publicationStatus", ["ongoing", "completed", "hiatus", "unknown"]);
      break;
    case "music":
      positiveField("durationSeconds");
      if (
        value.isrc !== undefined &&
        (typeof value.isrc !== "string" || !/^[A-Z]{2}[A-Z0-9]{3}\d{7}$/.test(value.isrc))
      ) errors.push("metadata.isrc inválido.");
      break;
    case "podcast":
      nonNegativeField("episodeCount");
      enumField("podcastStatus", ["ongoing", "ended", "paused", "unknown"]);
      break;
    case "game":
      arrayField("platforms");
      if (
        value.gameModes !== undefined &&
        (!Array.isArray(value.gameModes) ||
          !value.gameModes.every(mode => oneOf(mode, ["single-player", "multiplayer", "co-op"])))
      ) errors.push("metadata.gameModes inválido.");
      break;
  }

  return errors;
}

export function getContentValidationErrors(value: unknown): string[] {
  if (!record(value)) return ["O conteúdo precisa ser um objeto."];

  const errors: string[] = [];
  if (!nonEmpty(value.id) || value.id.length > 128 || value.id.trim() !== value.id) {
    errors.push("id deve ser string não vazia, sem espaços externos, de até 128 caracteres.");
  }
  if (!nonEmpty(value.slug) || value.slug.length > 160 || !SLUG.test(value.slug)) {
    errors.push("slug deve conter letras minúsculas, números e hífens.");
  }
  if (!nonEmpty(value.title) || value.title.length > 300) {
    errors.push("title deve ser string não vazia de até 300 caracteres.");
  }
  if (!nullableString(value.originalTitle) ||
    (typeof value.originalTitle === "string" && value.originalTitle.length > 300)) {
    errors.push("originalTitle inválido.");
  }
  if (value.franchiseId !== undefined && value.franchiseId !== null &&
    (typeof value.franchiseId !== "string" ||
      value.franchiseId.length > 128 ||
      !IDENTIFIER.test(value.franchiseId))) {
    errors.push("franchiseId deve ser um identificador estável válido.");
  }
  if (!isType(value.type)) errors.push("type não corresponde a categoria permitida.");
  if (!isStatus(value.status)) errors.push("status não corresponde a estado editorial permitido.");
  if (!Array.isArray(value.alternativeTitles) || value.alternativeTitles.length > 100 ||
    !value.alternativeTitles.every(title => nonEmpty(title) && title.length <= 300)) {
    errors.push("alternativeTitles deve ser lista de títulos não vazios.");
  }
  if (value.synopsis !== null &&
    (typeof value.synopsis !== "string" || value.synopsis.length > 20000)) {
    errors.push("synopsis deve ser string de até 20000 caracteres ou null.");
  }
  if (!referenceIdentifiers(value.genreIds)) errors.push("genreIds deve conter referências de gênero válidas e únicas.");
  if (!referenceIdentifiers(value.tagIds)) errors.push("tagIds deve conter referências de tag válidas e únicas.");
  if (!strings(value.genres)) errors.push("genres deve ser lista de strings não vazias.");
  if (!strings(value.tags)) errors.push("tags deve ser lista de strings não vazias.");
  if (!classificationIdentifiers(value.classificationIds)) {
    errors.push("classificationIds deve conter identificadores válidos e únicos.");
  } else if (new Set(value.classificationIds).size !== value.classificationIds.length) {
    errors.push("classificationIds não pode conter duplicatas.");
  }
  errors.push(...externalReferencesErrors(value.externalReferences));
  if (value.releaseDate !== undefined && value.releaseDate !== null && !validDate(value.releaseDate)) {
    errors.push("releaseDate deve ser data real YYYY-MM-DD.");
  }
  if (!nullableString(value.originalLanguage) ||
    (typeof value.originalLanguage === "string" && !LANGUAGE.test(value.originalLanguage))) {
    errors.push("originalLanguage inválido.");
  }
  for (const key of ["posterUrl", "backdropUrl"] as const) {
    if (value[key] !== undefined && value[key] !== null && !isSafeImageUrl(value[key])) {
      errors.push(key + " deve ser URL HTTP(S) segura ou caminho local.");
    }
  }
  if (!validTimestamp(value.createdAt)) errors.push("createdAt deve ser ISO 8601 com fuso explícito.");
  if (!validTimestamp(value.updatedAt)) errors.push("updatedAt deve ser ISO 8601 com fuso explícito.");
  if (isType(value.type)) errors.push(...metadataErrors(value.type, value.metadata));

  return errors;
}

export function isContent(value: unknown): value is Content {
  return getContentValidationErrors(value).length === 0;
}

export function validateContent(
  value: unknown,
): { success: true; data: Content } | { success: false; errors: string[] } {
  const errors = getContentValidationErrors(value);
  return errors.length ? { success: false, errors } : { success: true, data: value as Content };
}
