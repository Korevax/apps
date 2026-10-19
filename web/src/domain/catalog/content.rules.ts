import type { Content } from "./content.types";
import { getContentValidationErrors, isContent } from "./content.validation";
import { getTaxonomyReferenceErrors } from "../../services/catalog/taxonomy.services";

const normalize = (value: string) => value.trim().normalize("NFKC").toLocaleLowerCase();
const duplicates = (items: string[]) => new Set(items.map(normalize)).size !== items.length;

export function getContentBusinessRuleErrors(content: Content): string[] {
  const errors: string[] = [];

  if (duplicates(content.genreIds)) errors.push("genreIds não pode conter referências duplicadas.");
  if (duplicates(content.tagIds)) errors.push("tagIds não pode conter referências duplicadas.");
  errors.push(...getTaxonomyReferenceErrors(content.genreIds, content.tagIds));
  if (duplicates(content.genres)) errors.push("genres não pode conter gêneros duplicados.");
  if (duplicates(content.tags)) errors.push("tags não pode conter etiquetas duplicadas.");
  if (duplicates(content.classificationIds)) {
    errors.push("classificationIds não pode conter classificações duplicadas.");
  }
  if (duplicates(content.alternativeTitles)) {
    errors.push("alternativeTitles não pode conter títulos duplicados.");
  }
  if (content.externalReferences) {
    const keys = content.externalReferences.map(reference =>
      `${normalize(reference.provider)}:${normalize(reference.externalId)}`,
    );
    if (new Set(keys).size !== keys.length) {
      errors.push("externalReferences não pode repetir o mesmo provider/externalId.");
    }
  }
  if (Date.parse(content.updatedAt) < Date.parse(content.createdAt)) {
    errors.push("updatedAt não pode ser anterior a createdAt.");
  }
  if (content.originalTitle && normalize(content.originalTitle) === normalize(content.title)) {
    errors.push("originalTitle não deve repetir title.");
  }

  return errors;
}

export function getContentIntegrityErrors(value: unknown): string[] {
  const structural = getContentValidationErrors(value);
  if (structural.length || !isContent(value)) return structural;
  return getContentBusinessRuleErrors(value);
}

export function isContentBusinessValid(value: unknown): value is Content {
  return getContentIntegrityErrors(value).length === 0;
}

export function validateContentIntegrity(
  value: unknown,
): { success: true; data: Content } | { success: false; errors: string[] } {
  const errors = getContentIntegrityErrors(value);
  if (errors.length || !isContent(value)) {
    return { success: false, errors: errors.length ? errors : ["O conteúdo não passou pela validação."] };
  }
  return { success: true, data: value };
}

export function getCatalogIntegrityErrors(values: unknown): string[] {
  if (!Array.isArray(values)) return ["O catálogo precisa ser uma lista de registros."];

  const errors: string[] = [];
  const valid: Content[] = [];
  values.forEach((value, index) => {
    const recordErrors = getContentIntegrityErrors(value);
    if (recordErrors.length || !isContent(value)) {
      errors.push(`Registro ${index}: ${recordErrors.length ? recordErrors.join(" ") : "estrutura inválida."}`);
    } else {
      valid.push(value);
    }
  });

  const ids = new Set<string>();
  const slugs = new Set<string>();
  for (const content of valid) {
    if (ids.has(content.id)) errors.push("id duplicado: " + content.id);
    if (slugs.has(content.slug)) errors.push("slug duplicado: " + content.slug);
    ids.add(content.id);
    slugs.add(content.slug);
  }
  return errors;
}
