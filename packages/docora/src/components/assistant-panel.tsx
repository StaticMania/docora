'use client'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { ArrowUp, ListX, Loader2, Search, Sparkles, Square, X } from 'lucide-react'
import { Dialog } from 'radix-ui'
import { useEffect, useRef, useState } from 'react'
import { DEFAULT_ASSISTANT_ENDPOINT } from '../assistant/config'
import { useAssistant } from '../assistant/context'
import { useDocsConfig } from '../config/context'
import { cn } from '../utils/cn'
import { AssistantMarkdown } from './assistant-markdown'

const TOOL_LABELS: Record<string, { busy: string; done: string }> = {
  'tool-search-docs': { busy: 'Searching the documentation', done: 'Searched the documentation' },
  'tool-get-page': { busy: 'Reading a page', done: 'Read a page' },
}

function toolSuffix(input: unknown): string | undefined {
  if (!input || typeof input !== 'object') return undefined

  const record = input as Record<string, unknown>
  for (const key of ['query', 'path', 'q']) {
    const value = record[key]
    if (typeof value === 'string' && value.trim()) return value
  }
}

function ToolStep({
  type,
  state,
  input,
}: Readonly<{ type: string; state?: string; input?: unknown }>) {
  const labels = TOOL_LABELS[type] ?? { busy: 'Working', done: 'Done' }
  const done = state === 'output-available' || state === 'output-error'
  const suffix = toolSuffix(input)

  return (
    <p className="mb-1 flex items-center gap-1.5 text-xs text-muted-foreground">
      {done ? (
        <Search className="size-3 shrink-0" aria-hidden />
      ) : (
        <Loader2 className="size-3 shrink-0 animate-spin" aria-hidden />
      )}
      <span className="min-w-0 truncate">
        {done ? labels.done : `${labels.busy}...`}
        {suffix ? <span className="text-dimmed"> · {suffix}</span> : null}
      </span>
    </p>
  )
}

export function AssistantPanel() {
  const config = useDocsConfig()
  const { enabled, open, setOpen, pending, clearPending } = useAssistant()
  const [input, setInput] = useState('')
  const endRef = useRef<HTMLDivElement>(null)

  const { messages, sendMessage, setMessages, status, stop, error } = useChat({
    transport: new DefaultChatTransport({
      api: config.assistant?.endpoint ?? DEFAULT_ASSISTANT_ENDPOINT,
    }),
  })

  const busy = status === 'submitted' || status === 'streaming'
  const last = messages.at(-1)
  const hasAssistantOutput =
    last?.role === 'assistant' &&
    last.parts.some(
      part => (part.type === 'text' && part.text.length > 0) || part.type.startsWith('tool-'),
    )
  const showThinking = busy && !hasAssistantOutput

  useEffect(() => {
    if (!open || !pending) return

    sendMessage({ text: pending })
    clearPending()
  }, [open, pending, sendMessage, clearPending])

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' })
  }, [messages, status])

  if (!enabled) return null

  const suggestions = config.assistant?.suggestions ?? []

  function submit(text: string) {
    const question = text.trim()
    if (!question || busy) return

    sendMessage({ text: question })
    setInput('')
  }

  function clear() {
    if (busy) stop()
    setMessages([])
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]" />

        <Dialog.Content className="fixed inset-y-0 end-0 z-50 flex w-full max-w-md flex-col border-s border-border bg-background shadow-2xl focus:outline-none">
          <div className="flex h-16 shrink-0 items-center gap-2 border-b border-border px-4">
            <Sparkles className="size-4 shrink-0 text-primary" aria-hidden />
            <Dialog.Title className="text-sm font-semibold text-highlighted">Ask AI</Dialog.Title>

            {messages.length > 0 && (
              <button
                type="button"
                onClick={clear}
                aria-label="Clear chat"
                className="ms-auto inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-elevated hover:text-highlighted"
              >
                <ListX className="size-4" />
              </button>
            )}

            <Dialog.Close
              aria-label="Close assistant"
              className={cn(
                'inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-elevated hover:text-highlighted',
                messages.length === 0 && 'ms-auto',
              )}
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
                    if (message.role === 'assistant' && part.text.length === 0) return null

                    return (
                      <div
                        key={`${message.id}-text-${index}`}
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
                          <AssistantMarkdown text={part.text} />
                        )}
                      </div>
                    )
                  }

                  if (part.type.startsWith('tool-')) {
                    return (
                      <ToolStep
                        key={`${message.id}-${part.type}-${index}`}
                        type={part.type}
                        state={(part as { state?: string }).state}
                        input={'input' in part ? part.input : undefined}
                      />
                    )
                  }

                  return null
                })}
              </div>
            ))}

            {showThinking && (
              <p className="mb-5 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Loader2 className="size-3 shrink-0 animate-spin" aria-hidden />
                Thinking...
              </p>
            )}

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
