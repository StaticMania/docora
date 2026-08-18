export interface Locale {
  /** BCP 47 code used in the URL and in `<html lang>`, e.g. `en` or `pt-BR`. */
  code: string
  /** Shown in the language switcher. */
  name: string
  dir?: 'ltr' | 'rtl'
}

/** Every string the theme renders itself. */
export interface Messages {
  searchButton: string
  searchPlaceholder: string
  searchEmpty: string
  searchLoading: string
  searchError: string
  searchNavigate: string
  searchOpen: string
  searchClose: string
  tocTitle: string
  previous: string
  next: string
  toggleToDark: string
  toggleToLight: string
  openNavigation: string
  closeNavigation: string
  selectLanguage: string
  documentation: string
}

export interface I18nConfig {
  /** Locale served when a request has none. */
  defaultLocale: string
  locales: Locale[]
  /** Per-locale overrides of the theme's own strings. */
  messages?: Record<string, Partial<Messages>>
}
