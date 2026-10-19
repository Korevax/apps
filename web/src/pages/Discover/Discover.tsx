import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { IonIcon } from "@ionic/react";
import { arrowForward, searchOutline } from "ionicons/icons";
import { useLanguage } from "../../contexts/useLanguage";
import { CONTENT_TYPES, type ContentType } from "../../domain/catalog/content.types";
import type { LocaleCode } from "../../domain/catalog/taxonomy.types";
import { getGenreById, getGenreLabel } from "../../services/catalog/taxonomy.services";
import { getAllContent, getPopularContent, getRecentContent, searchContent } from "../../services/catalog/catalog.services";
import { getContentRatingSummary } from "../../services/ratings/ratings.services";
import { ContentCard } from "../../components/Content/ContentCard/ContentCard";
import "./Discover.css";

function Discover() {
  const { translation, locale } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(() => searchParams.get("q") ?? "");
  const [type, setType] = useState<ContentType | "all">("all");
  const [genre, setGenre] = useState("all");
  const sort = searchParams.get("sort");
  const all = getAllContent();
  const recent = getRecentContent(6);
  const popular = getPopularContent(6);
  const genres = [...new Set(all.flatMap(item => item.genreIds))]
    .map(id => getGenreById(id))
    .filter((genre): genre is NonNullable<typeof genre> => Boolean(genre))
    .map(genre => ({ id: genre.id, label: getGenreLabel(genre, locale as LocaleCode) }))
    .sort((a, b) => a.label.localeCompare(b.label, locale));

  useEffect(() => {
    setQuery(searchParams.get("q") ?? "");
  }, [searchParams]);

  const results = useMemo(() => {
    const found = searchContent({
      query,
      type: type === "all" ? undefined : type,
      genre: genre === "all" ? undefined : genre,
    });
    if (sort === "recent") {
      return found.slice().sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt));
    }
    if (sort === "popular") {
      return found.slice().sort((a, b) =>
        getContentRatingSummary(b.id).count - getContentRatingSummary(a.id).count ||
        a.title.localeCompare(b.title)
      );
    }
    return found;
  }, [query, type, genre, sort]);

  const filtering = Boolean(query.trim()) || type !== "all" || genre !== "all" ||
    sort === "recent" || sort === "popular";

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalized = query.trim().slice(0, 200);
    setQuery(normalized);
    const next = new URLSearchParams(searchParams);
    if (normalized) next.set("q", normalized);
    else next.delete("q");
    setSearchParams(next);
  }

  function clearFilters() {
    setQuery("");
    setType("all");
    setGenre("all");
    setSearchParams({});
  }

  return (
    <main className="discover-page">
      <section className="discover-page__hero">
        <div className="discover-page__hero-inner">
          <p className="discover-page__eyebrow">{translation.main.navigation.discover}</p>
          <h1>{translation.catalog.title}</h1>
          <p>{translation.catalog.description}</p>
          <form className="discover-search" role="search" onSubmit={submitSearch}>
            <IonIcon icon={searchOutline} aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={event => setQuery(event.currentTarget.value)}
              placeholder={translation.catalog.searchPlaceholder}
              aria-label={translation.catalog.searchLabel}
              maxLength={200}
            />
            {query ? <button type="button" onClick={() => setQuery("")}>{translation.catalog.clear}</button> : null}
          </form>
          <div className="discover-page__filters">
            <label className="discover-filter">
              <span>{translation.catalog.filterType}</span>
              <select value={type} onChange={event => setType(event.currentTarget.value as ContentType | "all")}>
                <option value="all">{translation.catalog.allTypes}</option>
                {CONTENT_TYPES.map(item => <option key={item} value={item}>{translation.catalog.types[item]}</option>)}
              </select>
            </label>
            <label className="discover-filter">
              <span>{translation.catalog.filterGenre}</span>
              <select value={genre} onChange={event => setGenre(event.currentTarget.value)}>
                <option value="all">{translation.catalog.allGenres}</option>
                {genres.map(item => <option key={item.id} value={item.id}>{item.label}</option>)}
              </select>
            </label>
            {filtering ? <button className="discover-clear" type="button" onClick={clearFilters}>{translation.catalog.clear}</button> : null}
          </div>
        </div>
      </section>

      <div className="discover-page__content">
        <p className="discover-demo-notice" role="note">{translation.catalog.demoNotice}</p>
        {filtering ? (
          <section className="discover-section" aria-labelledby="discover-results-heading">
            <div className="discover-section__header">
              <div>
                <p className="discover-page__eyebrow">{translation.catalog.results}</p>
                <h2 id="discover-results-heading">
                  {sort === "recent" ? translation.catalog.recentTitle : sort === "popular" ? translation.catalog.popularTitle : translation.catalog.results}
                </h2>
              </div>
              <span className="discover-section__count">{results.length}</span>
            </div>
            {results.length ? <div className="content-grid">{results.map(item => <ContentCard key={item.id} content={item} />)}</div> :
              <p className="discover-empty" role="status">{translation.catalog.noResults}</p>}
          </section>
        ) : (
          <>
            <section className="discover-section" id="recent-content" aria-labelledby="recent-heading">
              <div className="discover-section__header">
                <div><p className="discover-page__eyebrow">{translation.main.navigation.recent}</p><h2 id="recent-heading">{translation.catalog.recentTitle}</h2></div>
                <Link className="discover-more" to="/discover?sort=recent">{translation.main.navigation.seeMore}<IonIcon icon={arrowForward} aria-hidden="true" /></Link>
              </div>
              <div className="content-grid">{recent.map(item => <ContentCard key={item.id} content={item} />)}</div>
            </section>
            <section className="discover-section" id="popular-content" aria-labelledby="popular-heading">
              <div className="discover-section__header">
                <div><p className="discover-page__eyebrow">{translation.main.navigation.popular}</p><h2 id="popular-heading">{translation.catalog.popularTitle}</h2></div>
                <Link className="discover-more" to="/discover?sort=popular">{translation.main.navigation.seeMore}<IonIcon icon={arrowForward} aria-hidden="true" /></Link>
              </div>
              <div className="content-grid">{popular.map(item => <ContentCard key={item.id} content={item} />)}</div>
            </section>
            <section className="discover-section" id="all-content" aria-labelledby="all-heading">
              <div className="discover-section__header">
                <div><p className="discover-page__eyebrow">{translation.catalog.collection}</p><h2 id="all-heading">{translation.catalog.allContent}</h2></div>
                <span className="discover-section__count">{all.length}</span>
              </div>
              <div className="content-grid">{all.map(item => <ContentCard key={item.id} content={item} />)}</div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}

export default Discover;
