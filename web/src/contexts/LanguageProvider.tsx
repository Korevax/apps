
import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  defaultLocale,
  getTranslation,
  type LocaleCode,
} from "../services/i18n";

import { languages } from "../config/languages";

import {
  LanguageContext,
  type LanguageContextValue,
} from "./LanguageContext";

interface LanguageProviderProps {
  children: ReactNode;
}

const LANGUAGE_STORAGE_KEY = "korevax:locale";

function isLocaleCode(
  value: string | null,
): value is LocaleCode {
  if (value === null) {
    return false;
  }

  return languages.some(
    (language) => language.code === value,
  );
}

function getInitialLocale(): LocaleCode {
  try {
    const storedLocale = localStorage.getItem(
      LANGUAGE_STORAGE_KEY,
    );

    if (isLocaleCode(storedLocale)) {
      return storedLocale;
    }
  } catch {
    // O armazenamento pode estar indisponível.
  }

  return defaultLocale;
}

export function LanguageProvider({
  children,
}: LanguageProviderProps) {
  const [locale, setLocale] =
    useState<LocaleCode>(getInitialLocale);

  const translation = useMemo(
    () => getTranslation(locale),
    [locale],
  );

  useEffect(() => {
    try {
      localStorage.setItem(
        LANGUAGE_STORAGE_KEY,
        locale,
      );
    } catch {
      // A aplicação continua funcionando sem persistência.
    }
  }, [locale]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      locale,
      translation,
      setLocale,
    }),
    [locale, translation],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}