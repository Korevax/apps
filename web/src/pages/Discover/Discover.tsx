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
import {
  isExternalCatalogConfigured,
  searchExternalCatalog,
  type ExternalCatalogCandidate,
} from "../../services/catalog/external-catalog.client";
import { ContentCard } from "../../components/Content/ContentCard/ContentCard";
import { LoadingIndicator } from "../../components/LoadingIndicator/LoadingIndicator";
import "./Discover.css";

type ExternalSearchState = {
  status: "idle" | "loading" | "success" | "error";
  results: ExternalCatalogCandidate[];
};

function formatExternalDate(value: string | null, locale: string): string | null {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat(locale, { year: "numeric", timeZone: "UTC" }).format(date);
}

function Discover() {
  const { translation, locale } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(() => searchParams.get("q") ?? "");
  const [externalQuery, setExternalQuery] = useState(() => searchParams.get("q") ?? "");
  const [externalSearch, setExternalSearch] = useState<ExternalSearchState>({
    status: "idle",
    results: [],
  });
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
    const nextQuery = searchParams.get("q") ?? "";
    setQuery(nextQuery);
    setExternalQuery(nextQuery);
  }, [searchParams]);

  useEffect(() => {
    if (!externalQuery || !isExternalCatalogConfigured()) {
      setExternalSearch({ status: "idle", results: [] });
      return;
    }

    const supportedTypes: Array<"movie" | "series"> =
      type === "movie" || type === "series"
        ? [type]
        : type === "all"
          ? ["movie", "series"]
          : [];

    if (!supportedTypes.length) {
      setExternalSearch({ status: "idle", results: [] });
      return;
    }

    const controller = new AbortController();
    setExternalSearch({ status: "loading", results: [] });

    Promise.allSettled(
      supportedTypes.map(mediaType =>
        searchExternalCatalog({
          type: mediaType,
          query: externalQuery,
          signal: controller.signal,
        }),
      ),
    )
      .then(responses => {
        if (controller.signal.aborted) return;
        const successful = responses
          .filter((response): response is PromiseFulfilledResult<Awaited<ReturnType<typeof searchExternalCatalog>>> => response.status === "fulfilled")
          .map(response => response.value);
        if (!successful.length) {
          setExternalSearch({ status: "error", results: [] });
          return;
        }
        const results = successful.flatMap(response => response.results);
        setExternalSearch({ status: "success", results });
      });

    return () => controller.abort();
  }, [externalQuery, type]);

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
  const externalSearchEnabled = isExternalCatalogConfigured() &&
    (type === "all" || type === "movie" || type === "series");

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalized = query.trim().slice(0, 120);
    setQuery(normalized);
    setExternalQuery(normalized);
    const next = new URLSearchParams(searchParams);
    if (normalized) next.set("q", normalized);
    else next.delete("q");
    setSearchParams(next);
  }

  function clearSearch() {
    setQuery("");
    setExternalQuery("");
    const next = new URLSearchParams(searchParams);
    next.delete("q");
    setSearchParams(next);
  }

  function clearFilters() {
    setQuery("");
    setExternalQuery("");
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
              maxLength={120}
            />
            {query ? <button type="button" onClick={clearSearch}>{translation.catalog.clear}</button> : null}
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
          <>
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

            {externalQuery && externalSearchEnabled ? (
              <section className="discover-section external-results" aria-labelledby="external-results-heading">
                <div className="discover-section__header">
                  <div>
                    <p className="discover-page__eyebrow">{translation.catalog.externalEyebrow}</p>
                    <h2 id="external-results-heading">{translation.catalog.externalTitle}</h2>
                    <p className="external-results__description">{translation.catalog.externalDescription}</p>
                  </div>
                  {externalSearch.status === "success" ? (
                    <span className="discover-section__count">{externalSearch.results.length}</span>
                  ) : null}
                </div>

                {externalSearch.status === "loading" ? (
                  <LoadingIndicator className="loading-indicator--page" label={translation.catalog.externalLoading} />
                ) : null}
                {externalSearch.status === "error" ? (
                  <p className="discover-empty" role="status">{translation.catalog.externalUnavailable}</p>
                ) : null}
                {externalSearch.status === "success" && externalSearch.results.length === 0 ? (
                  <p className="discover-empty" role="status">{translation.catalog.externalNoResults}</p>
                ) : null}
                {externalSearch.status === "success" && externalSearch.results.length > 0 ? (
                  <div className="external-results__grid">
                    {externalSearch.results.map(candidate => (
                      <article className="external-result" key={candidate.mediaType + ":" + candidate.externalId}>
                        <a
                          className="external-result__poster"
                          href={candidate.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={translation.catalog.externalOpenSource + ": " + candidate.title}
                        >
                          {candidate.posterUrl ? (
                            <img src={candidate.posterUrl} alt="" loading="lazy" decoding="async" />
                          ) : (
                            <span>{translation.catalog.externalNoPoster}</span>
                          )}
                        </a>
                        <div className="external-result__body">
                          <span className="external-result__type">
                            {translation.catalog.types[candidate.mediaType]} · TMDB
                          </span>
                          <h3>{candidate.title}</h3>
                          {formatExternalDate(candidate.releaseDate, locale) ? (
                            <p className="external-result__date">{formatExternalDate(candidate.releaseDate, locale)}</p>
                          ) : null}
                          {candidate.synopsis ? <p className="external-result__synopsis">{candidate.synopsis}</p> : null}
                          <a href={candidate.sourceUrl} target="_blank" rel="noopener noreferrer">
                            {translation.catalog.externalOpenSource}
                          </a>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : null}
              </section>
            ) : null}
          </>
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
