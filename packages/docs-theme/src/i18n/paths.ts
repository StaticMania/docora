import type { I18nConfig } from './types'

/** The locale a path is under, when it starts with a configured locale. */
export function localeFromPath(path: string, i18n?: I18nConfig): string | undefined {
  if (!i18n) return undefined

  const first = path.split('/').filter(Boolean)[0]
  return i18n.locales.some(locale => locale.code === first) ? first : undefined
}

/** Strips the locale segment: `/fr/docs/intro` becomes `/docs/intro`. */
export function pathWithoutLocale(path: string, i18n?: I18nConfig): string {
  const locale = localeFromPath(path, i18n)
  if (!locale) return path

  const rest = path.slice(locale.length + 1)
  return rest || '/'
}

/** The same document under another locale. */
export function pathForLocale(path: string, locale: string, i18n?: I18nConfig): string {
  const rest = pathWithoutLocale(path, i18n)
  return rest === '/' ? `/${locale}` : `/${locale}${rest}`
}
