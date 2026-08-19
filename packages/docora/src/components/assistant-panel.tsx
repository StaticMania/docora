'use client'

import { useEffect, useRef, useState, type ElementType } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { Dialog } from 'radix-ui'
import { ArrowUp, Loader2, Search, Sparkles, Square, X } from 'lucide-react'

import { DEFAULT_ASSISTANT_ENDPOINT } from '../assistant/config'
import { useAssistant } from '../assistant/context'
import { useDocsConfig } from '../config/context'
import { getMdxComponents } from '../mdx/components'
import { cn } from '../utils/cn'

/** Keys match the tool names in `createAssistantTools`, prefixed by the SDK. */
const TOOL_LABELS: Record<string, string> = {
  'tool-search-docs': 'Searching the documentation',
  'tool-get-page': 'Reading a page',
}

function ToolStep({ type, state }: Readonly<{ type: string; state?: string }>) {
  const label = TOOL_LABELS[type] ?? 'Working'
  const done = state === 'output-available' || state === 'output-error'

  return (
    <p className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground">
      {done ? (
        <Search className="size-3 shrink-0" aria-hidden />
      ) : (
        <Loader2 className="size-3 shrink-0 animate-spin" aria-hidden />
      )}
      {done ? label : label + '...'}
    </p>
  )
}

/**
 * Answers arrive as markdown. Running the full MDX pipeline on every streamed
 * token would be wasteful, so links and inline code are handled here and the
 * rest is rendered as text.
 */
function AnswerText({ text, link: Anchor }: Readonly<{ text: string; link: ElementType }>) {
  const chunks = text.split(/(\[[^\]]+\]\([^)]+\)|`[^`]+`)/g)

  return (
    <p className="whitespace-pre-wrap">
      {chunks.map((chunk, index) => {
        const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(chunk)
        if (link) {
          return (
            <Anchor key={index} href={link[2]}>
              {link[1]}
            </Anchor>
          )
        }

        const code = /^`([^`]+)`$/.exec(chunk)
        if (code) {
          return (
            <code
              key={index}
              className="rounded-sm border border-border bg-muted px-1 py-0.5 font-mono text-[0.85em]"
            >
              {code[1]}
            </code>
          )
        }

        return <span key={index}>{chunk}</span>
      })}
    </p>
  )
}

export function AssistantPanel() {
  const config = useDocsConfig()
  const { enabled, open, setOpen, pending, clearPending } = useAssistant()
  const [input, setInput] = useState('')
  const endRef = useRef<HTMLDivElement>(null)

  const { messages, sendMessage, status, stop, error } = useChat({
    transport: new DefaultChatTransport({
      api: config.assistant?.endpoint ?? DEFAULT_ASSISTANT_ENDPOINT,
    }),
  })

  const busy = status === 'submitted' || status === 'streaming'

  // A question raised elsewhere - "Explain with AI" - is sent once the panel opens.
  useEffect(() => {
    if (!open || !pending) return

    sendMessage({ text: pending })
    clearPending()
  }, [open, pending, sendMessage, clearPending])

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' })
  }, [messages])

  if (!enabled) return null

  const suggestions = config.assistant?.suggestions ?? []
  const anchor = getMdxComponents().a as ElementType

  function submit(text: string) {
    const question = text.trim()
    if (!question || busy) return

    sendMessage({ text: question })
    setInput('')
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]" />

        <Dialog.Content className="fixed inset-y-0 end-0 z-50 flex w-full max-w-md flex-col border-s border-border bg-background shadow-2xl focus:outline-none">
          <div className="flex h-16 shrink-0 items-center gap-2 border-b border-border px-4">
            <Sparkles className="size-4 shrink-0 text-primary" aria-hidden />
            <Dialog.Title className="text-sm font-semibold text-highlighted">Ask AI</Dialog.Title>

            <Dialog.Close
              aria-label="Close assistant"
              className="ms-auto inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-elevated hover:text-highlighted"
            >
              <X className="size-4" />
            </Dialog.Close>
          </div>

          <Dialog.Description className="sr-only">
            Ask questions about this documentation. Answers are drawn from the pages of this site.
          </Dialog.Description>

          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
            {messages.length === 0 && (
              <div className="text-sm text-muted-foreground">
                <p>Ask anything about this documentation. Answers cite the pages they come from.</p>

                {suggestions.length > 0 && (
                  <ul className="mt-4 space-y-2">
                    {suggestions.map(suggestion => (
                      <li key={suggestion}>
                        <button
                          type="button"
                          onClick={() => submit(suggestion)}
                          className="w-full rounded-md border border-border px-3 py-2 text-start text-sm transition-colors hover:border-border-accented hover:text-highlighted"
                        >
                          {suggestion}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {messages.map(message => (
              <div key={message.id} className={cn('mb-5', message.role === 'user' && 'text-end')}>
                {message.parts.map((part, index) => {
                  if (part.type === 'text') {
                    return (
                      <div
                        key={index}
                        className={cn(
                          'text-sm',
                          message.role === 'user'
                            ? 'inline-block rounded-md bg-elevated px-3 py-2 text-start text-highlighted'
                            : 'text-foreground',
                        )}
                      >
                        {message.role === 'user' ? (
                          part.text
                        ) : (
                          <AnswerText text={part.text} link={anchor} />
                        )}
                      </div>
                    )
                  }

                  if (part.type.startsWith('tool-')) {
                    return (
                      <ToolStep
                        key={index}
                        type={part.type}
                        state={(part as { state?: string }).state}
                      />
                    )
                  }

                  return null
                })}
              </div>
            ))}

            {error && (
              <p className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                {error.message || 'Something went wrong. Try again.'}
              </p>
            )}

            <div ref={endRef} />
          </div>

          <form
            onSubmit={event => {
              event.preventDefault()
              submit(input)
            }}
            className="flex shrink-0 items-end gap-2 border-t border-border p-3"
          >
            <textarea
              value={input}
              onChange={event => setInput(event.target.value)}
              onKeyDown={event => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault()
                  submit(input)
                }
              }}
              rows={1}
              placeholder="Ask a question..."
              aria-label="Ask a question"
              className="max-h-32 min-h-9 flex-1 resize-none rounded-md border border-border bg-muted px-3 py-2 text-sm text-foreground placeholder:text-dimmed focus:outline-none focus-visible:border-border-accented"
            />

            {busy ? (
              <button
                type="button"
                onClick={stop}
                aria-label="Stop generating"
                className="inline-flex size-9 shrink-0 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:text-highlighted"
              >
                <Square className="size-3.5" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!input.trim()}
                aria-label="Send"
                className="inline-flex size-9 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground transition-opacity disabled:opacity-40"
              >
                <ArrowUp className="size-4" />
              </button>
            )}
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
