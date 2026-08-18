'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Dialog } from 'radix-ui'
import { Menu, X } from 'lucide-react'

import { useDocsConfig } from '../config/context'
import { SidebarNav } from './sidebar-nav'

/** Hamburger trigger plus the slide-in drawer holding the documentation tree. */
export function MobileNav() {
  const config = useDocsConfig()
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  // Close on navigation, including browser back/forward.
  useEffect(() => setOpen(false), [pathname])

  const items = config.navigation ?? []
  if (items.length === 0) return null

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        aria-label="Open navigation"
        className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-elevated hover:text-highlighted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none lg:hidden"
      >
        <Menu className="size-4" />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[2px]" />

        <Dialog.Content className="fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col border-r border-border bg-background shadow-lg focus:outline-none">
          <div className="flex h-16 items-center justify-between border-b border-border px-4">
            <Dialog.Title className="text-sm font-semibold tracking-tight">
              {config.header?.title ?? config.site.name}
            </Dialog.Title>

            <Dialog.Close
              aria-label="Close navigation"
              className="inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-elevated hover:text-highlighted"
            >
              <X className="size-4" />
            </Dialog.Close>
          </div>

          <Dialog.Description className="sr-only">Documentation navigation</Dialog.Description>

          <div className="flex-1 overflow-y-auto p-4">
            <SidebarNav items={items} onNavigate={() => setOpen(false)} />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
