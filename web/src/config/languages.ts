import type { LocaleCode } from "../services/i18n";

export interface Language {
  code: LocaleCode;
  shortCode: string;
  name: string;
  flag: string;
}

export const languages: Language[] = [
  { code: "pt-BR", shortCode: "PT-BR", name: "Português", flag: "🇧🇷" },
  { code: "en", shortCode: "EN", name: "English", flag: "🇬🇧" },
  { code: "es", shortCode: "ES", name: "Español", flag: "🇪🇸" },
  { code: "ru", shortCode: "RU", name: "Русский", flag: "🇷🇺" },
];
