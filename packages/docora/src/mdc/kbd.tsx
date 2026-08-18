import type { ReactNode } from 'react'

import { cn } from '../utils/cn'

export interface KbdProps {
  children?: ReactNode
  value?: string
  className?: string
}

const KEYS: Record<string, string> = {
  meta: '⌘',
  command: '⌘',
  cmd: '⌘',
  ctrl: 'Ctrl',
  control: 'Ctrl',
  alt: 'Alt',
  option: '⌥',
  shift: '⇧',
  enter: '↵',
  return: '↵',
  backspace: '⌫',
  delete: '⌦',
  escape: 'Esc',
  esc: 'Esc',
  tab: 'Tab',
  space: 'Space',
  up: '↑',
  down: '↓',
  left: '←',
  right: '→',
}

export function Kbd({ children, value, className }: KbdProps) {
  const label = value ? (KEYS[value.toLowerCase()] ?? value) : children

  return (
    <kbd
      className={cn(
        'inline-flex min-w-5 items-center justify-center rounded-sm border border-border bg-elevated px-1.5 py-0.5 font-sans text-xs font-medium text-foreground',
        className,
      )}
    >
      {label}
    </kbd>
  )
}
