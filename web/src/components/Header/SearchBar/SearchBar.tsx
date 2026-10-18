import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { IonIcon } from "@ionic/react";
import { searchOutline } from "ionicons/icons";
import { useLanguage } from "../../../contexts/useLanguage";
import "./SearchBar.css";

interface SearchBarProps {
  onSearch?: (query: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { translation } = useLanguage();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedQuery = query.trim().slice(0, 200);
    if (!normalizedQuery) return;

    if (onSearch) {
      onSearch(normalizedQuery);
      return;
    }
    navigate("/discover?q=" + encodeURIComponent(normalizedQuery));
  }

  return (
    <form className="header-search" role="search" onSubmit={handleSubmit}>
      <IonIcon icon={searchOutline} aria-hidden="true" className="header-search__icon" />
      <input
        className="header-search__input"
        type="search"
        name="q"
        value={query}
        onChange={(event) => setQuery(event.currentTarget.value)}
        placeholder={translation.header.searchbox.searchlab}
        aria-label={translation.header.searchbox.searchlab}
        autoComplete="off"
        maxLength={200}
      />
      <button
        className="header-search__submit"
        type="submit"
        aria-label={translation.header.searchbox.search}
        disabled={!query.trim()}
      >
        {translation.header.searchbox.search}
      </button>
    </form>
  );
}
