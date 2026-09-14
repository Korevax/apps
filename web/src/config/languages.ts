// languages.ts
import type { LocaleCode, } from "../services/i18n";
   
export interface Language {
   code: LocaleCode;
   shortCode: string;
   name: string;
   flag: string;
}


export const languages: Language[] = [
   {
      code: "pt-BR",
      shortCode: "PT",
      name: "Português",
      flag: "🇧🇷",
   },

   {
      code: "en",
      shortCode: "EN",
      name: "English",
      flag: "🇺🇸",
   },

   {
      code: "es" as LocaleCode,
      shortCode: "ES",
      name: "Español",
      flag: "🇪🇸",
   }
];