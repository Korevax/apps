
import { createContext } from "react";

import type {
  LocaleCode,
  Translation,
} from "../services/i18n";

export interface LanguageContextValue {
  locale: LocaleCode;
  translation: Translation;
  setLocale: (locale: LocaleCode) => void;
}

export const LanguageContext =
  createContext<LanguageContextValue | null>(null);

  