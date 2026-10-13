import {
  CONTENT_TYPES,
  type Content,
  type ContentRating,
  type ContentType,
} from "./content.types";

const CONTENT_TYPE_SET: ReadonlySet<string> = new Set(CONTENT_TYPES);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isContentType(value: unknown): value is ContentType {
  return typeof value === "string" && CONTENT_TYPE_SET.has(value);
}

function isValidDate(value: unknown): value is string {
  if (typeof value !== "string") {
    return false;
  }

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);

  if (!match) {
    return false;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  if (year < 1 || month < 1 || month > 12 || day < 1) {
    return false;
  }

  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();

  return day <= daysInMonth;
}

/**
 * Aceita URLs HTTP(S) absolutas ou caminhos locais iniciados por "/".
 * Rejeita protocolos executáveis e URLs relativas ambíguas.
 */
function isSafeImageUrl(value: unknown): value is string {
  if (typeof value !== "string" || value.trim() !== value) {
    return false;
  }

  if (value.startsWith("/") && !value.startsWith("//")) {
    // Bloqueia caracteres de controle para rejeitar caminhos malformados.
    // eslint-disable-next-line no-control-regex
    return !value.includes("\\") && !/[\u0000-\u001F]/.test(value);
  }

  try {
    const url = new URL(value);

    return (
      (url.protocol === "https:" || url.protocol === "http:") &&
      url.hostname.length > 0 &&
      url.username.length === 0 &&
      url.password.length === 0
    );
  } catch {
    return false;
  }
}

export function isContentRating(value: unknown): value is ContentRating {
  if (!isRecord(value)) {
    return false;
  }

  const { average, count } = value;

  const validCount =
    typeof count === "number" && Number.isSafeInteger(count) && count >= 0;

  const validAverage =
    average === null ||
    (typeof average === "number" &&
      Number.isFinite(average) &&
      average >= 0 &&
      average <= 10);

  return validCount && validAverage;
}

/**
 * Retorna todos os problemas encontrados, sem lançar exceções.
 * Adequado para validar dados vindos de APIs ou arquivos JSON.
 */
export function getContentValidationErrors(value: unknown): string[] {
  const errors: string[] = [];

  if (!isRecord(value)) {
    return ["O conteúdo precisa ser um objeto."];
  }

  if (!isNonEmptyString(value.id)) {
    errors.push("id deve ser uma string não vazia.");
  }

  if (
    !isNonEmptyString(value.slug) ||
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.slug)
  ) {
    errors.push("slug deve conter letras minúsculas, números e hífens.");
  }

  if (!isNonEmptyString(value.title)) {
    errors.push("title deve ser uma string não vazia.");
  }

  if (
    value.originalTitle !== undefined &&
    typeof value.originalTitle !== "string"
  ) {
    errors.push("originalTitle deve ser uma string, quando informado.");
  }

  if (!isContentType(value.type)) {
    errors.push("type não corresponde a uma categoria permitida.");
  }

  if (typeof value.synopsis !== "string") {
    errors.push("synopsis deve ser uma string.");
  }

  if (!Array.isArray(value.genres) || !value.genres.every(isNonEmptyString)) {
    errors.push("genres deve ser uma lista de strings não vazias.");
  }

  if (value.releaseDate !== undefined && !isValidDate(value.releaseDate)) {
    errors.push("releaseDate deve ser uma data real no formato YYYY-MM-DD.");
  }

  if (
    value.durationMinutes !== undefined &&
    (typeof value.durationMinutes !== "number" ||
      !Number.isSafeInteger(value.durationMinutes) ||
      value.durationMinutes <= 0)
  ) {
    errors.push("durationMinutes deve ser um inteiro positivo.");
  }

  if (value.posterUrl !== undefined && !isSafeImageUrl(value.posterUrl)) {
    errors.push(
      "posterUrl deve ser uma URL HTTP(S) ou um caminho local seguro.",
    );
  }

  if (value.backdropUrl !== undefined && !isSafeImageUrl(value.backdropUrl)) {
    errors.push(
      "backdropUrl deve ser uma URL HTTP(S) ou um caminho local seguro.",
    );
  }

  if (!isContentRating(value.rating)) {
    errors.push(
      "rating deve conter uma média válida e uma contagem não negativa.",
    );
  }

  return errors;
}

/** Type guard para uso após a validação estrutural. */
export function isContent(value: unknown): value is Content {
  return getContentValidationErrors(value).length === 0;
}

/** Valida e retorna o conteúdo tipado ou os erros encontrados. */
export function validateContent(
  value: unknown,
): { success: true; data: Content } | { success: false; errors: string[] } {
  const errors = getContentValidationErrors(value);

  if (errors.length > 0) {
    return { success: false, errors };
  }

  // A validação acima garante a estrutura exigida por Content.
  return { success: true, data: value as Content };
}
