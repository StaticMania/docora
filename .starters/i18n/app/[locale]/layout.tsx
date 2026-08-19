import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { DocsRoot, createRootMetadata, isAssistantEnabled } from 'docora'

import docsConfig from '../../docs.config'
import { source } from '../../lib/source'
import '../globals.css'

export const metadata: Metadata = createRootMetadata(docsConfig)

/**
 * Every route is locale-prefixed, so this is the app's root layout: it owns
 * `<html>` and `<body>` and knows the locale from the URL.
 */
export function generateStaticParams() {
  return docsConfig.i18n!.locales.map(locale => ({ locale: locale.code }))
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) {
  const { locale } = await params

  if (!docsConfig.i18n!.locales.some(entry => entry.code === locale)) notFound()

  return (
    <DocsRoot
      config={docsConfig}
      locale={locale}
      navigation={await source.getNavigation(locale)}
      assistantEnabled={isAssistantEnabled(docsConfig.assistant)}
    >
      {children}
    </DocsRoot>
  )
}
