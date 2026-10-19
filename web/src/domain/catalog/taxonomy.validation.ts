import type { TaxonomyEntity } from "./taxonomy.types";

const TAXONOMY_KINDS = new Set([
  "genre",
  "tag",
  "classification",
  "language",
  "region",
  "age-rating",
  "format",
]);
const ID = /^[a-z0-9][a-z0-9._:-]*$/;
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const LOCALE = /^[a-z]{2,3}(?:-[A-Z]{2})?$/;
const TIMESTAMP = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/;
const LABEL_LIMIT = 160;
const ALIAS_LIMIT = 50;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isText(value: unknown, maxLength = LABEL_LIMIT): value is string {
  return typeof value === "string" &&
    value.trim().length > 0 &&
    value.trim() === value &&
    value.length <= maxLength;
}

function isTimestamp(value: unknown): value is string {
  return typeof value === "string" &&
    TIMESTAMP.test(value) &&
    Number.isFinite(Date.parse(value));
}

function normalize(value: string): string {
  return value.normalize("NFKC").trim().toLocaleLowerCase();
}

function localizedMapErrors(
  value: unknown,
  field: "labels" | "aliases",
): string[] {
  if (value === undefined && field === "aliases") return [];
  if (!isRecord(value)) return [`${field} deve ser um objeto por idioma.`];

  const errors: string[] = [];
  const normalizedNames = new Map<string, string>();

  for (const [locale, entry] of Object.entries(value)) {
    if (!LOCALE.test(locale)) {
      errors.push(`${field} contém código de idioma inválido: ${locale}.`);
      continue;
    }

    const values = field === "labels" ? [entry] : entry;
    if (field === "aliases" && (!Array.isArray(values) || values.length > ALIAS_LIMIT)) {
      errors.push(`aliases.${locale} deve ser uma lista com até ${ALIAS_LIMIT} itens.`);
      continue;
    }

    if (!Array.isArray(values)) {
      if (!isText(values)) errors.push(`labels.${locale} deve ser um texto não vazio.`);
      else {
        const key = normalize(values);
        const previousLocale = normalizedNames.get(key);
        if (previousLocale) {
          errors.push(`Rótulo duplicado após normalização entre ${previousLocale} e ${locale}.`);
        } else {
          normalizedNames.set(key, locale);
        }
      }
      continue;
    }

    const seen = new Set<string>();
    for (const alias of values) {
      if (!isText(alias)) {
        errors.push(`aliases.${locale} contém um alias inválido.`);
        continue;
      }
      const key = normalize(alias);
      if (seen.has(key)) errors.push(`aliases.${locale} contém aliases duplicados.`);
      seen.add(key);
    }
  }

  return errors;
}

export function getTaxonomyValidationErrors(value: unknown): string[] {
  if (!isRecord(value)) return ["A entidade de taxonomia precisa ser um objeto."];

  const errors: string[] = [];
  if (!isText(value.id, 128) || !ID.test(value.id)) {
    errors.push("id deve ser um identificador estável em formato válido.");
  }
  if (!TAXONOMY_KINDS.has(String(value.kind))) errors.push("kind de taxonomia inválido.");
  if (value.slug !== undefined &&
    (!isText(value.slug, 160) || !SLUG.test(value.slug))) {
    errors.push("slug deve conter letras minúsculas, números e hífens.");
  }
  if (typeof value.active !== "boolean") errors.push("active deve ser booleano.");
  if (!isTimestamp(value.createdAt)) errors.push("createdAt deve ser ISO 8601 com fuso explícito.");
  if (!isTimestamp(value.updatedAt)) errors.push("updatedAt deve ser ISO 8601 com fuso explícito.");
  if (isTimestamp(value.createdAt) && isTimestamp(value.updatedAt) &&
    Date.parse(value.updatedAt) < Date.parse(value.createdAt)) {
    errors.push("updatedAt não pode ser anterior a createdAt.");
  }

  errors.push(...localizedMapErrors(value.labels, "labels"));
  errors.push(...localizedMapErrors(value.aliases, "aliases"));

  if (value.kind === "language" &&
    (typeof value.languageTag !== "string" || !/^[A-Za-z]{2,8}(?:-[A-Za-z0-9]{1,8})*$/.test(value.languageTag))) {
    errors.push("languageTag deve ser uma tag de idioma válida.");
  }
  if (value.kind === "region" &&
    (typeof value.code !== "string" || !/^[A-Z]{2,3}$/.test(value.code))) {
    errors.push("code de region deve ser um código alfabético maiúsculo de 2 a 3 caracteres.");
  }
  if (value.kind === "age-rating") {
    if (!isText(value.regionId, 128) || !ID.test(value.regionId)) {
      errors.push("regionId deve referenciar uma região válida.");
    }
    if (!isText(value.code, 32)) errors.push("code de age-rating deve ser texto não vazio.");
  }

  return errors;
}

export function isTaxonomyEntity(value: unknown): value is TaxonomyEntity {
  return getTaxonomyValidationErrors(value).length === 0;
}

export function validateTaxonomyEntity(
  value: unknown,
): { success: true; data: TaxonomyEntity } | { success: false; errors: string[] } {
  const errors = getTaxonomyValidationErrors(value);
  return errors.length
    ? { success: false, errors }
    : { success: true, data: value as TaxonomyEntity };
}
