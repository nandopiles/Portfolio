import { ui, defaultLang, type Lang, type UIKey } from './ui';

/**
 * Detect the active language from a URL pathname.
 * `/en/...` → 'en'; anything else → the default ('es').
 */
export function getLangFromUrl(url: URL): Lang {
  const [, seg] = url.pathname.split('/');
  if (seg in ui) return seg as Lang;
  return defaultLang;
}

/**
 * Returns a translation function bound to a language, falling back to the
 * default language (and finally the key itself) when a string is missing.
 */
export function useTranslations(lang: Lang) {
  return function t(key: UIKey): string {
    return ui[lang][key] ?? ui[defaultLang][key] ?? key;
  };
}

/**
 * Build a path for a given language. The default language has no prefix;
 * other languages are prefixed with `/<lang>`.
 *
 * localizePath('/', 'es')          → '/'
 * localizePath('/', 'en')          → '/en/'
 * localizePath('/work/x', 'en')    → '/en/work/x'
 */
export function localizePath(path: string, lang: Lang): string {
  const clean = `/${path.replace(/^\/+/, '')}`.replace(/\/+$/, '') || '/';
  if (lang === defaultLang) return clean;
  return clean === '/' ? `/${lang}/` : `/${lang}${clean}`;
}

/**
 * Strip any language prefix from a path, returning the canonical (default-lang)
 * path. Useful for building the "other language" URL of the current page.
 */
export function stripLangPrefix(pathname: string): string {
  const parts = pathname.split('/');
  if (parts[1] in ui && parts[1] !== defaultLang) {
    parts.splice(1, 1);
  }
  const result = parts.join('/') || '/';
  return result.startsWith('/') ? result : `/${result}`;
}

export { defaultLang, type Lang };
