import ptBR from "../locales/pt-BR.json";
import en from "../locales/en.json";


export const defaultLocale = "pt-BR" as const;


export const translations = {
   "pt-BR": ptBR,
   en,
} as const;


export type LocaleCode =
   keyof typeof translations;


export type Translation =
   typeof translations[typeof defaultLocale];


export function getTranslation(
   locale: LocaleCode
): Translation {
   return (
      translations[locale] ??
      translations[defaultLocale]
   );
}