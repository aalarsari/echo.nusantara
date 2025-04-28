let prefLang: string = "/auto/en";

export const setPrefLangCookie = (lang: string) => {
  prefLang = lang;
};

export const getPrefLangCookie = (): string => {
  return prefLang;
};
