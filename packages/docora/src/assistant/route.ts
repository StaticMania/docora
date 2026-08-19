import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  isStepCount,
  streamText,
  toUIMessageStream,
  type UIMessage,
} from 'ai'

import type { DocsConfig } from '../config/types'
import type { DocsSource } from '../content/index'
import { DEFAULT_ASSISTANT_MODEL, DEFAULT_SYSTEM_PROMPT, isAssistantEnabled } from './config'
import { createAssistantTools } from './tools'

/** How many tool round-trips the model may take before it must answer. */
const MAX_STEPS = 6

/**
 * Streaming chat route for the in-page assistant.
 *
 * ```ts
 * // app/api/assistant/route.ts
 * export const { POST } = createAssistantRoute(source, docsConfig)
 * ```
 *
 * Returns 503 when no credential is configured, so a misconfigured deployment
 * fails loudly on the server rather than showing a chat box that never answers.
 */
export function createAssistantRoute(source: DocsSource, config: DocsConfig) {
  return {
    async POST(request: Request) {
      if (!isAssistantEnabled(config.assistant)) {
        return Response.json(
          { error: 'The assistant is not configured. Set AI_GATEWAY_API_KEY to enable it.' },
          { status: 503 },
        )
      }

      let messages: UIMessage[]

      try {
        ;({ messages } = (await request.json()) as { messages: UIMessage[] })
      } catch {
        return Response.json({ error: 'Invalid JSON body.' }, { status: 400 })
      }

      if (!Array.isArray(messages)) {
        return Response.json({ error: '`messages` must be an array.' }, { status: 400 })
      }

      const result = streamText({
        model: config.assistant?.model ?? DEFAULT_ASSISTANT_MODEL,
        system: config.assistant?.systemPrompt ?? DEFAULT_SYSTEM_PROMPT,
        messages: await convertToModelMessages(messages),
        stopWhen: isStepCount(MAX_STEPS),
        tools: createAssistantTools(source, config),
      })

      return createUIMessageStreamResponse({
        stream: toUIMessageStream({ stream: result.stream }),
      })
    },
  }
}
