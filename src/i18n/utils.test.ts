import { describe, it, expect } from 'vitest';
import {
  getLangFromUrl,
  useTranslations,
  localizePath,
  stripLangPrefix,
} from './utils';

/**
 * Smoke tests for the i18n pure helpers. These functions are deterministic and
 * DOM-free, which makes them the ideal first target for unit testing and TDD.
 */
describe('i18n/utils', () => {
  describe('getLangFromUrl', () => {
    it('returns "en" for a /en/ prefixed path', () => {
      expect(getLangFromUrl(new URL('https://x.dev/en/work'))).toBe('en');
    });

    it('falls back to the default language "es" for an unprefixed path', () => {
      expect(getLangFromUrl(new URL('https://x.dev/work'))).toBe('es');
    });
  });

  describe('useTranslations', () => {
    it('translates a known key for the requested language', () => {
      const t = useTranslations('en');
      expect(t('nav.work')).toBe('Work');
    });

    it('returns the key itself when it does not exist in any language', () => {
      const t = useTranslations('es');
      // @ts-expect-error — intentionally passing an unknown key to test fallback
      expect(t('does.not.exist')).toBe('does.not.exist');
    });
  });

  describe('localizePath', () => {
    it('leaves the default language unprefixed', () => {
      expect(localizePath('/', 'es')).toBe('/');
      expect(localizePath('/work/x', 'es')).toBe('/work/x');
    });

    it('prefixes non-default languages', () => {
      expect(localizePath('/', 'en')).toBe('/en/');
      expect(localizePath('/work/x', 'en')).toBe('/en/work/x');
    });
  });

  describe('stripLangPrefix', () => {
    it('removes a non-default language prefix', () => {
      expect(stripLangPrefix('/en/work/x')).toBe('/work/x');
    });

    it('leaves a default-language path untouched', () => {
      expect(stripLangPrefix('/work/x')).toBe('/work/x');
    });
  });
});
