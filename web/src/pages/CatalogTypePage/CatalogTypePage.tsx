import { useLocation } from "react-router-dom";
import { useLanguage } from "../../contexts/useLanguage";
import type { ContentType } from "../../domain/catalog/content.types";
import { getContentByType } from "../../services/catalog/catalog.services";
import { ContentCard } from "../../components/Content/ContentCard/ContentCard";
import "./CatalogTypePage.css";

const routeTypes: Record<string, ContentType> = {
  "/movies": "movie",
  "/series": "series",
  "/music": "music",
  "/games": "game",
  "/manga": "manga",
};

export default function CatalogTypePage() {
  const { pathname } = useLocation();
  const { translation } = useLanguage();
  const normalizedPath = pathname.replace(/\/+$/, "") || "/";
  const type = routeTypes[normalizedPath] ?? "movie";
  const items = getContentByType(type);
  const title = translation.catalog.types[type];

  return (
    <main className="catalog-type-page">
      <header className="catalog-type-page__hero">
        <div className="catalog-type-page__container">
          <p className="catalog-type-page__eyebrow">{translation.main.navigation.discover}</p>
          <h1>{title}</h1>
          <p>{translation.catalog.description}</p>
        </div>
      </header>
      <section className="catalog-type-page__container catalog-type-page__content" aria-label={title}>
        <p className="catalog-type-page__notice" role="note">{translation.catalog.demoNotice}</p>
        <div className="catalog-type-page__summary">
          <h2>{title}</h2>
          <span>{items.length} {translation.catalog.results.toLocaleLowerCase()}</span>
        </div>
        {items.length ? (
          <div className="catalog-type-page__grid">
            {items.map(item => <ContentCard key={item.id} content={item} />)}
          </div>
        ) : (
          <p className="catalog-type-page__empty" role="status">{translation.catalog.noResults}</p>
        )}
      </section>
    </main>
  );
}
