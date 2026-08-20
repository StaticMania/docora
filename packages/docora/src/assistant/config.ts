export interface AssistantConfig {
  /** Set to `false` to keep the assistant off even when a key is present. */
  enabled?: boolean
  /** AI Gateway model string. Defaults to `google/gemini-2.5-flash`. */
  model?: string
  /** Where the chat route is mounted. Defaults to `/api/assistant`. */
  endpoint?: string
  /** Replaces the built-in system prompt. */
  systemPrompt?: string
  /** Starter questions offered in an empty conversation. */
  suggestions?: string[]
  /** Show the "Explain with AI" button under the table of contents. */
  explainWithAi?: boolean
}

export const DEFAULT_ASSISTANT_MODEL = 'google/gemini-2.5-flash'
export const DEFAULT_ASSISTANT_ENDPOINT = '/api/assistant'

/**
 * Whether a credential is available to talk to the AI Gateway.
 *
 * Server-only: the key never reaches the browser. Vercel deployments
 * authenticate with an OIDC token instead of a key, so either counts.
 */
export function isAssistantConfigured(): boolean {
  return Boolean(process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN)
}

/**
 * The assistant is on when a credential exists and the config has not turned
 * it off. Without a credential there is nothing to render — the UI is absent
 * rather than disabled.
 */
export function isAssistantEnabled(config?: AssistantConfig): boolean {
  if (config?.enabled === false) return false
  return isAssistantConfigured()
}

export const DEFAULT_SYSTEM_PROMPT = [
  'You are a documentation assistant for this website.',
  '',
  'Answer only from the documentation. Use the search-docs tool to find relevant',
  'pages, then get-page to read them in full before answering. Never rely on',
  'prior knowledge about the project — if the documentation does not cover',
  'something, say so plainly and suggest what the reader might search for.',
  '',
  'Cite the pages you used as markdown links to their paths, e.g.',
  '[Installation](/docs/getting-started/installation). Keep answers short and',
  'concrete, and prefer showing a code example from the documentation over',
  'describing it.',
].join('\n')
