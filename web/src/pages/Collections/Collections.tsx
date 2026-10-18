import { Link } from "react-router-dom";
import { useLanguage } from "../../contexts/useLanguage";
import { getMovieCollections } from "../../services/catalog/collections.services";
import { ContentCard } from "../../components/Content/ContentCard/ContentCard";
import "./Collections.css";

export default function Collections() {
  const { translation } = useLanguage();
  const labels = translation.collections;
  const collections = getMovieCollections();

  return (
    <main className="collections-page">
      <header className="collections-page__hero">
        <div className="collections-page__container">
          <p className="collections-page__eyebrow">{translation.main.navigation.collections}</p>
          <h1>{labels.title}</h1>
          <p>{labels.description}</p>
        </div>
      </header>
      <section className="collections-page__container collections-page__content">
        {collections.length ? collections.map(collection => (
          <article className="collections-page__collection" key={collection.id}>
            <header><h2>{collection.name}</h2><span>{collection.movies.length} {translation.catalog.types.movie.toLocaleLowerCase()}</span></header>
            <div className="collections-page__grid">
              {collection.movies.map(movie => <ContentCard key={movie.id} content={movie} />)}
            </div>
          </article>
        )) : (
          <div className="collections-page__empty" role="status">
            <h2>{labels.emptyTitle}</h2>
            <p>{labels.emptyDescription}</p>
            <Link to="/discover">{translation.main.navigation.discover} →</Link>
          </div>
        )}
      </section>
    </main>
  );
}
