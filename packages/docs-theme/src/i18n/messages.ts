import type { I18nConfig, Messages } from './types'

/** The theme's own strings. Any locale falls back to these. */
export const defaultMessages: Messages = {
  searchButton: 'Search...',
  searchPlaceholder: 'Search documentation...',
  searchEmpty: 'No results for',
  searchLoading: 'Loading index...',
  searchError: 'Could not load the search index.',
  searchNavigate: 'to navigate',
  searchOpen: 'to open',
  searchClose: 'to close',
  tocTitle: 'On this page',
  previous: 'Previous',
  next: 'Next',
  toggleToDark: 'Switch to dark theme',
  toggleToLight: 'Switch to light theme',
  openNavigation: 'Open navigation',
  closeNavigation: 'Close navigation',
  selectLanguage: 'Select language',
  documentation: 'Documentation',
}

/** Bundled translations. Locales beyond these come from `i18n.messages`. */
export const bundledMessages: Record<string, Partial<Messages>> = {
  fr: {
    searchButton: 'Rechercher...',
    searchPlaceholder: 'Rechercher dans la documentation...',
    searchEmpty: 'Aucun résultat pour',
    searchLoading: "Chargement de l'index...",
    searchError: "Impossible de charger l'index de recherche.",
    searchNavigate: 'pour naviguer',
    searchOpen: 'pour ouvrir',
    searchClose: 'pour fermer',
    tocTitle: 'Sur cette page',
    previous: 'Précédent',
    next: 'Suivant',
    toggleToDark: 'Passer au thème sombre',
    toggleToLight: 'Passer au thème clair',
    openNavigation: 'Ouvrir la navigation',
    closeNavigation: 'Fermer la navigation',
    selectLanguage: 'Choisir la langue',
    documentation: 'Documentation',
  },
  es: {
    searchButton: 'Buscar...',
    searchPlaceholder: 'Buscar en la documentación...',
    searchEmpty: 'Sin resultados para',
    searchLoading: 'Cargando índice...',
    searchError: 'No se pudo cargar el índice de búsqueda.',
    searchNavigate: 'para navegar',
    searchOpen: 'para abrir',
    searchClose: 'para cerrar',
    tocTitle: 'En esta página',
    previous: 'Anterior',
    next: 'Siguiente',
    toggleToDark: 'Cambiar al tema oscuro',
    toggleToLight: 'Cambiar al tema claro',
    openNavigation: 'Abrir navegación',
    closeNavigation: 'Cerrar navegación',
    selectLanguage: 'Seleccionar idioma',
    documentation: 'Documentación',
  },
}

/**
 * Strings for one locale: the theme's defaults, then any bundled translation,
 * then the site's own overrides. A missing key falls back rather than showing
 * an empty label.
 */
export function resolveMessages(locale?: string, i18n?: I18nConfig): Messages {
  if (!locale) return defaultMessages

  const base = locale.split('-')[0]

  return {
    ...defaultMessages,
    ...(base ? bundledMessages[base] : undefined),
    ...bundledMessages[locale],
    ...(base ? i18n?.messages?.[base] : undefined),
    ...i18n?.messages?.[locale],
  }
}
