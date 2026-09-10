// languages.ts

export interface Language {
   code: string;
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
];