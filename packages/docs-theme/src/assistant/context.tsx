'use client'

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'

interface AssistantContextValue {
  enabled: boolean
  open: boolean
  setOpen: (open: boolean) => void
  /** Opens the panel and sends a question straight away. */
  ask: (question: string) => void
  /** Question queued by `ask`, consumed by the panel once it mounts. */
  pending?: string
  clearPending: () => void
}

const AssistantContext = createContext<AssistantContextValue>({
  enabled: false,
  open: false,
  setOpen: () => {},
  ask: () => {},
  clearPending: () => {},
})

export function useAssistant() {
  return useContext(AssistantContext)
}

export function AssistantProvider({ enabled, children }: { enabled: boolean; children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const [pending, setPending] = useState<string>()

  const ask = useCallback((question: string) => {
    setPending(question)
    setOpen(true)
  }, [])

  const value = useMemo(
    () => ({ enabled, open, setOpen, ask, pending, clearPending: () => setPending(undefined) }),
    [enabled, open, ask, pending],
  )

  return <AssistantContext.Provider value={value}>{children}</AssistantContext.Provider>
}
