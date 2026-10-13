import type { Content } from "./content.types";
import {
  getContentValidationErrors,
  isContent,
} from "./content.validation";

/**
 * Avalia a coerência de negócio de um conteúdo estruturalmente válido.
 *
 * Não altera o objeto recebido e não lança exceções.
 */
export function getContentBusinessRuleErrors(
  content: Content,
): string[] {
  const errors: string[] = [];

  const { rating, genres } = content;

  // Sem avaliações, não existe média calculada.
  if (rating.count === 0 && rating.average !== null) {
    errors.push(
      "rating.average deve ser null quando não existem avaliações.",
    );
  }

  // Com avaliações, a média deve estar disponível.
  if (rating.count > 0 && rating.average === null) {
    errors.push(
      "rating.average deve ser um número quando existem avaliações.",
    );
  }

  // Evita gêneros repetidos por diferenças de maiúsculas ou espaços.
  const normalizedGenres = genres.map((genre) =>
    genre.trim().toLocaleLowerCase("pt-BR"),
  );

  if (new Set(normalizedGenres).size !== normalizedGenres.length) {
    errors.push("genres não pode conter gêneros duplicados.");
  }

  return errors;
}

/**
 * Valida a estrutura e as regras de negócio.
 * Dados externos devem passar por esta função antes de serem aceitos.
 */
export function getContentIntegrityErrors(value: unknown): string[] {
  const validationErrors = getContentValidationErrors(value);

  if (validationErrors.length > 0 || !isContent(value)) {
    return validationErrors;
  }

  return getContentBusinessRuleErrors(value);
}

/** Retorna true somente quando estrutura e regras estão válidas. */
export function isContentBusinessValid(value: unknown): value is Content {
  return getContentIntegrityErrors(value).length === 0;
}

/** Resultado explícito para fluxos de importação e cadastro. */
export function validateContentIntegrity(
  value: unknown,
):
  | { success: true; data: Content }
  | { success: false; errors: string[] } {
  const errors = getContentIntegrityErrors(value);

  if (errors.length > 0 || !isContent(value)) {
    return {
      success: false,
      errors:
        errors.length > 0
          ? errors
          : ["O conteúdo não passou pela validação."],
    };
  }

  return { success: true, data: value };
}
