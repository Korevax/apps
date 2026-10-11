import { useState, type FormEvent } from "react";
import { IonIcon } from "@ionic/react";
import { searchOutline } from "ionicons/icons";
import {
   useLanguage,
} from "../../../contexts/LanguageContext";
import "./SearchBar.css";

interface SearchBarProps {
  onSearch?: (query: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const {
      translation,
   } = useLanguage();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedQuery = query.trim();

    if (!normalizedQuery) {
      return;
    }

    onSearch?.(normalizedQuery);
  }

  return (
    <form className="header-search" role="search" onSubmit={handleSubmit}>
      <IonIcon
        icon={searchOutline}
        aria-hidden="true"
        className="header-search__icon"
      />

      <input
        className="header-search__input"
        type="search"
        name="q"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        aria-label="{translation.header.searchbox.searchlab}"
        autoComplete="off"
        maxLength={200}
      />

      <button
        className="header-search__submit"
        type="submit"
        aria-label="{translation.header.searchbox.search}"
        disabled={!query.trim()}
      >{translation.header.searchbox.search}
      </button>
    </form>
  );
}
