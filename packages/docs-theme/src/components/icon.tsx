'use client'

import {
  Blocks,
  BookOpen,
  Bot,
  Brain,
  Code,
  Download,
  FileText,
  Flag,
  FolderTree,
  GitBranch,
  Globe,
  Heading1,
  House,
  Image,
  Layers,
  List,
  Palette,
  Pencil,
  Puzzle,
  Rocket,
  Search,
  Server,
  Settings,
  Sparkles,
  Star,
  Terminal,
  Wrench,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import { DynamicIcon, type IconName } from 'lucide-react/dynamic'

/**
 * Icons common enough in documentation navigation to be worth bundling — these
 * render on the server with no pop-in. Anything else falls back to lucide's
 * lazy loader, so any icon name still works.
 */
const BUNDLED_ICONS: Record<string, LucideIcon> = {
  blocks: Blocks,
  'book-open': BookOpen,
  bot: Bot,
  brain: Brain,
  code: Code,
  download: Download,
  'file-text': FileText,
  flag: Flag,
  'folder-tree': FolderTree,
  'git-branch': GitBranch,
  globe: Globe,
  'heading-1': Heading1,
  house: House,
  image: Image,
  layers: Layers,
  list: List,
  palette: Palette,
  pencil: Pencil,
  puzzle: Puzzle,
  rocket: Rocket,
  search: Search,
  server: Server,
  settings: Settings,
  sparkles: Sparkles,
  star: Star,
  terminal: Terminal,
  wrench: Wrench,
  zap: Zap,
}

export interface IconProps {
  /** A lucide icon name in kebab-case, e.g. `folder-tree`. */
  name: string
  className?: string
}

export function Icon({ name, className }: IconProps) {
  const Bundled = BUNDLED_ICONS[name]

  if (Bundled) return <Bundled className={className} aria-hidden />

  return (
    <DynamicIcon
      name={name as IconName}
      className={className}
      aria-hidden
      fallback={() => <span className={className} />}
    />
  )
}
