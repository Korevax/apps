import { mockContent } from "../../data/mockContent";
import type { Content, ContentType } from "../../domain/catalog/content.types";
import { isContentBusinessValid } from "../../domain/catalog/content.rules";

const catalogSource: readonly unknown[] = [mockContent];

/**
 * Retorna somente conteúdos estruturalmente e semanticamente válidos.
 * A fonte é de demonstração; futuramente poderá ser substituída por uma API.
 */
export function getAllContent(): Content[] {
  return catalogSource.filter(isContentBusinessValid);
}

export function getContentById(id: string): Content | undefined {
  if (!id.trim()) {
    return undefined;
  }

  return getAllContent().find((content) => content.id === id);
}

export function getContentBySlug(slug: string): Content | undefined {
  if (!slug.trim()) {
    return undefined;
  }

  return getAllContent().find((content) => content.slug === slug);
}

export function getContentByType(type: ContentType): Content[] {
  return getAllContent().filter((content) => content.type === type);
}

export interface ContentSearchOptions {
  query?: string;
  type?: ContentType;
  genre?: string;
}

/**
 * Busca por título, título original, sinopse ou gênero.
 * A pesquisa é insensível a maiúsculas e espaços nas extremidades.
 */
export function searchContent(options: ContentSearchOptions = {}): Content[] {
  const query = options.query?.trim().toLocaleLowerCase("pt-BR");
  const genre = options.genre?.trim().toLocaleLowerCase("pt-BR");

  return getAllContent().filter((content) => {
    if (options.type && content.type !== options.type) {
      return false;
    }

    if (
      genre &&
      !content.genres.some(
        (item) => item.toLocaleLowerCase("pt-BR") === genre,
      )
    ) {
      return false;
    }

    if (!query) {
      return true;
    }

    const searchableFields = [
      content.title,
      content.originalTitle ?? "",
      content.synopsis,
      ...content.genres,
    ];

    return searchableFields.some((field) =>
      field.toLocaleLowerCase("pt-BR").includes(query),
    );
  });
}
