/** Protocol revisions this server understands, newest first. */
export const SUPPORTED_PROTOCOL_VERSIONS = ['2025-06-18', '2025-03-26', '2024-11-05']

export interface JsonRpcRequest {
  jsonrpc: '2.0'
  /** Absent on notifications, which get no response. */
  id?: string | number | null
  method: string
  params?: Record<string, unknown>
}

export interface JsonRpcError {
  code: number
  message: string
  data?: unknown
}

export const ERROR_CODES = {
  parse: -32700,
  invalidRequest: -32600,
  methodNotFound: -32601,
  invalidParams: -32602,
  internal: -32603,
} as const

export function result(id: JsonRpcRequest['id'], value: unknown) {
  return { jsonrpc: '2.0' as const, id: id ?? null, result: value }
}

export function failure(id: JsonRpcRequest['id'], error: JsonRpcError) {
  return { jsonrpc: '2.0' as const, id: id ?? null, error }
}

/** A notification carries no id and must not be answered. */
export function isNotification(request: JsonRpcRequest): boolean {
  return request.id === undefined
}

export function isJsonRpcRequest(value: unknown): value is JsonRpcRequest {
  return (
    typeof value === 'object' &&
    value !== null &&
    (value as JsonRpcRequest).jsonrpc === '2.0' &&
    typeof (value as JsonRpcRequest).method === 'string'
  )
}

/**
 * Agree a protocol version with the client.
 *
 * The spec says to answer with a version the server supports; echoing the
 * client's choice when it is one of ours keeps older clients working.
 */
export function negotiateVersion(requested?: unknown): string {
  return typeof requested === 'string' && SUPPORTED_PROTOCOL_VERSIONS.includes(requested)
    ? requested
    : SUPPORTED_PROTOCOL_VERSIONS[0]!
}
