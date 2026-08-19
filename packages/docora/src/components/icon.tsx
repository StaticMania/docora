'use client'

import {
  Blocks,
  BookOpen,
  Bot,
  Box,
  Braces,
  Brain,
  CircleAlert,
  CircleHelp,
  Code,
  Container,
  Download,
  Eye,
  FileText,
  FileCode,
  Flag,
  FolderTree,
  GitBranch,
  Globe,
  Heading1,
  House,
  Image,
  Info,
  Languages,
  Layers,
  Lightbulb,
  Link2,
  List,
  Package,
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
  TriangleAlert,
  Wrench,
  Zap,
  type LucideIcon,
} from 'lucide-react'
import { DynamicIcon, type IconName } from 'lucide-react/dynamic'

/**
 * Icons common enough in documentation to be worth bundling — these render on
 * the server with no pop-in. Anything else falls back to lucide's lazy loader,
 * so any icon name still works.
 */
const BUNDLED_ICONS: Record<string, LucideIcon> = {
  blocks: Blocks,
  'book-open': BookOpen,
  bot: Bot,
  box: Box,
  braces: Braces,
  brain: Brain,
  'circle-alert': CircleAlert,
  'circle-help': CircleHelp,
  code: Code,
  container: Container,
  download: Download,
  eye: Eye,
  'file-code': FileCode,
  'file-text': FileText,
  flag: Flag,
  'folder-tree': FolderTree,
  'git-branch': GitBranch,
  globe: Globe,
  'heading-1': Heading1,
  house: House,
  image: Image,
  info: Info,
  languages: Languages,
  layers: Layers,
  lightbulb: Lightbulb,
  link: Link2,
  list: List,
  package: Package,
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
  'triangle-alert': TriangleAlert,
  wrench: Wrench,
  zap: Zap,
}

/**
 * Accepts both plain lucide names (`rocket`) and Iconify-style names
 * (`i-lucide-rocket`). Collections other than lucide are not bundled, so they
 * fall back to a generic mark rather than breaking the page.
 */
export function normalizeIconName(name: string): string | undefined {
  if (!name) return undefined
  if (!name.startsWith('i-')) return name

  const lucide = name.match(/^i-lucide-(.+)$/)
  if (lucide) return lucide[1]

  return undefined
}

export interface IconProps {
  /** A lucide name (`folder-tree`) or Iconify name (`i-lucide-folder-tree`). */
  name: string
  className?: string
}

export function Icon({ name, className }: IconProps) {
  const resolved = normalizeIconName(name)

  if (!resolved) return <Link2 className={className} aria-hidden />

  const Bundled = BUNDLED_ICONS[resolved]
  if (Bundled) return <Bundled className={className} aria-hidden />

  return (
    <DynamicIcon
      name={resolved as IconName}
      className={className}
      aria-hidden
      fallback={() => <span className={className} />}
    />
  )
}
