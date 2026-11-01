import { useMemo, useState, type FocusEvent, type FormEvent, type KeyboardEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IonIcon } from "@ionic/react";
import { searchOutline } from "ionicons/icons";
import { useLanguage } from "../../../contexts/useLanguage";
import { searchContent } from "../../../services/catalog/catalog.services";
import "./SearchBar.css";

interface SearchBarProps {
  onSearch?: (query: string) => void;
}

const MAX_PREVIEW_RESULTS = 5;
const MIN_PREVIEW_QUERY_LENGTH = 2;
const TORRENT_QUERY = /^\s*\[[^\]]{1,48}\]/u;

export function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { translation } = useLanguage();
  const normalizedQuery = query.trim().slice(0, 200);
  const isTorrentQuery = TORRENT_QUERY.test(normalizedQuery);

  const previewResults = useMemo(() => {
    if (normalizedQuery.length < MIN_PREVIEW_QUERY_LENGTH || isTorrentQuery) return [];
    return searchContent({ query: normalizedQuery }).slice(0, MAX_PREVIEW_RESULTS);
  }, [normalizedQuery, isTorrentQuery]);

  const showPreview = isOpen && normalizedQuery.length >= MIN_PREVIEW_QUERY_LENGTH && !isTorrentQuery;
  const previewId = "header-search-preview";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!normalizedQuery) return;

    setIsOpen(false);
    if (onSearch) {
      onSearch(normalizedQuery);
      return;
    }

    const destination = isTorrentQuery ? "/torrents" : "/discover";
    navigate(destination + "?q=" + encodeURIComponent(normalizedQuery));
  }

  function handleBlur(event: FocusEvent<HTMLFormElement>) {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setIsOpen(false);
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") setIsOpen(false);
  }

  return (
    <form
      className="header-search"
      role="search"
      onSubmit={handleSubmit}
      onBlur={handleBlur}
    >
      <IonIcon icon={searchOutline} aria-hidden="true" className="header-search__icon" />
      <input
        className="header-search__input"
        type="search"
        name="q"
        value={query}
        onChange={event => {
          setQuery(event.currentTarget.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder={translation.header.searchbox.searchlab}
        aria-label={translation.header.searchbox.searchlab}
        aria-autocomplete="list"
        aria-expanded={showPreview}
        aria-controls={previewId}
        autoComplete="off"
        maxLength={200}
      />
      <button
        className="header-search__submit"
        type="submit"
        aria-label={translation.header.searchbox.search}
        disabled={!normalizedQuery}
      >
        {translation.header.searchbox.search}
      </button>

      {showPreview ? (
        <div className="header-search__preview" id={previewId}>
          {previewResults.length > 0 ? (
            <ul className="header-search__preview-list" role="listbox" aria-label={translation.catalog.results}>
              {previewResults.map(content => (
                <li className="header-search__preview-item" key={content.id}>
                  <Link
                    className="header-search__preview-link"
                    to={"/content/" + encodeURIComponent(content.slug)}
                    role="option"
                    aria-selected="false"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="header-search__preview-title">{content.title}</span>
                    <span className="header-search__preview-type">{translation.catalog.types[content.type]}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="header-search__preview-empty" role="status">
              {translation.catalog.noResults}
            </p>
          )}
          <button
            className="header-search__preview-all"
            type="submit"
            onClick={() => setIsOpen(false)}
          >
            {translation.catalog.results}
          </button>
        </div>
      ) : null}
    </form>
  );
}
