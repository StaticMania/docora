import type { Element, ElementContent } from 'hast'
import type { Handlers, State } from 'mdast-util-to-hast'

/** The shape `remark-mdc` gives its component nodes. */
interface ComponentNode {
  type: string
  name?: string
  attributes?: Record<string, unknown>
  children?: unknown[]
}

function toElement(state: State, node: ComponentNode, tagName: string, properties: Element['properties'] = {}): Element {
  return {
    type: 'element',
    tagName,
    properties: { ...(node.attributes as Element['properties']), ...properties },
    children: state.all(node as never) as ElementContent[],
  }
}

/**
 * Turns the nodes `remark-mdc` produces into plain hast elements named after
 * the component, so MDX resolves them from the component map exactly like an
 * HTML tag: `::card-group` becomes `<card-group>`, looked up as
 * `components['card-group']`.
 *
 * `mdast-util-to-hast` types `Handlers` as a closed record of standard node
 * types, so the MDC entries are attached with a cast.
 */
export const mdcHandlers = {
  containerComponent: (state: State, node: ComponentNode) => toElement(state, node, node.name ?? 'div'),
  textComponent: (state: State, node: ComponentNode) => toElement(state, node, node.name ?? 'span'),
  leafComponent: (state: State, node: ComponentNode) => toElement(state, node, node.name ?? 'div'),
  /** `#name` blocks inside a component become named slots. */
  componentContainerSection: (state: State, node: ComponentNode) =>
    toElement(state, node, 'mdc-slot', { 'data-slot': node.name ?? '' }),
} as unknown as Handlers
