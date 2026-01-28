import { logger } from '../stores/useLogStore'

/**
 * Intercepts JSON-RPC requests and responses from viem transports
 */
export function createViemLogger(transportName: string) {
  // Use a weak map to track requests that have already been logged to prevent duplicates
  // in case viem triggers callbacks multiple times for the same logical operation
  const seenRequests = new WeakSet<Request>()

  return {
    onFetchRequest(request: Request) {
      if (seenRequests.has(request)) return
      seenRequests.add(request)

      try {
        // Clone headers to avoid mutation issues if any
        const headers = Object.fromEntries(request.headers.entries())
        
        logger.debug(`[Viem:${transportName}] Request started`, 'RPC-Req', {
          url: request.url,
          method: request.method,
          headers
        })
      } catch {
        logger.debug(`[Viem:${transportName}] Request started`, 'RPC-Req', { url: request.url })
      }
    },
    async onFetchResponse(response: Response) {
      try {
        const clonedRes = response.clone()
        const data = await clonedRes.json()
        
        if (data.error) {
          logger.error(`[Viem:${transportName}] RPC Error: ${data.error.message}`, 'RPC-Res', data)
        } else {
          // Compact log for success, full data in details. ID is usually the JSON-RPC id.
          const id = data.id !== undefined ? ` (ID:${data.id})` : ''
          logger.info(`[Viem:${transportName}] RPC Success${id}`, 'RPC-Res', data)
        }
      } catch {
        // Not a JSON response or failed to parse
        logger.debug(`[Viem:${transportName}] Response received (Status: ${response.status})`, 'RPC-Res')
      }
    }
  }
}
