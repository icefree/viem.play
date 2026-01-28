import { logger } from '../stores/useLogStore'

/**
 * Intercepts JSON-RPC requests and responses from viem transports
 */
export function createViemLogger(transportName: string) {
  return {
    onFetchRequest(request: Request) {
      // In a real browser Request object, we might need to clone it or read headers
      // But viem passes the internal request init/details sometimes depending on version
      // For standard Request objects:
      try {
        const url = request.url
        logger.debug(`[Viem:${transportName}] Request: ${url}`, 'RPC-Req', {
          method: request.method,
          headers: Object.fromEntries(request.headers.entries()),
        })
      } catch (e) {
        // Fallback for non-standard request objects if any
        logger.debug(`[Viem:${transportName}] Request started`, 'RPC-Req', request)
      }
    },
    async onFetchResponse(response: Response) {
      try {
        const clonedRes = response.clone()
        const data = await clonedRes.json()
        
        // Log based on JSON-RPC result or error
        if (data.error) {
          logger.error(`[Viem:${transportName}] RPC Error: ${data.error.message}`, 'RPC-Res', data)
        } else {
          // Compact log for success, full data in details
          const method = data.id ? `ID:${data.id}` : 'Response'
          logger.info(`[Viem:${transportName}] RPC Success: ${method}`, 'RPC-Res', data)
        }
      } catch (e) {
        logger.debug(`[Viem:${transportName}] Response received (non-json)`, 'RPC-Res')
      }
    }
  }
}
