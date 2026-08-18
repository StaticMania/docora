'use client'

import { createContext, useContext, useMemo, type ReactNode } from 'react'

import { resolveMessages } from './messages'
import type { I18nConfig, Messages } from './types'

interface I18nContextValue {
  locale?: string
  i18n?: I18nConfig
  messages: Messages
}

const I18nContext = createContext<I18nContextValue>({ messages: resolveMessages() })

export function I18nProvider({
  locale,
  i18n,
  children,
}: {
  locale?: string
  i18n?: I18nConfig
  children: ReactNode
}) {
  const value = useMemo(
    () => ({ locale, i18n, messages: resolveMessages(locale, i18n) }),
    [locale, i18n],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

/** The active locale and its configuration. */
export function useLocale() {
  const { locale, i18n } = useContext(I18nContext)
  return { locale, i18n, locales: i18n?.locales ?? [] }
}

/** The theme's own strings for the active locale. */
export function useMessages(): Messages {
  return useContext(I18nContext).messages
}
