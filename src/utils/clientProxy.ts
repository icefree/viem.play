import { logger } from '../stores/useLogStore'

/**
 * Wraps a viem client with a Proxy to log all method calls
 */
export function wrapClientWithLogger<T extends object>(client: T, clientType: string): T {
  return new Proxy(client, {
    get(target: any, prop: string | symbol) {
      const value = target[prop]
      if (typeof value === 'function') {
        return (...args: any[]) => {
          if (typeof prop === 'string') {
            logger.info(`[Viem:${clientType}] Calling ${prop}`, 'ViemAction', {
              method: prop,
              args: args.map(arg => {
                // Pre-process args for better readability in logs (e.g. stringify bigints)
                try {
                  return JSON.parse(JSON.stringify(arg, (_, v) => typeof v === 'bigint' ? v.toString() : v))
                } catch {
                  return String(arg)
                }
              })
            })
            
            try {
              const result = value.apply(target, args)
              if (result instanceof Promise) {
                return result.then(res => {
                  logger.debug(`[Viem:${clientType}] ${prop} Success`, 'ViemAction', {
                    method: prop,
                    result: JSON.parse(JSON.stringify(res, (_, v) => typeof v === 'bigint' ? v.toString() : v))
                  })
                  return res
                }).catch(err => {
                  logger.error(`[Viem:${clientType}] ${prop} Failed: ${err.message}`, 'ViemAction', { method: prop, error: err })
                  throw err
                })
              }
              return result
            } catch (err: any) {
              logger.error(`[Viem:${clientType}] ${prop} Error: ${err.message}`, 'ViemAction', { method: prop, error: err })
              throw err
            }
          }
          return value.apply(target, args)
        }
      }
      return value
    }
  })
}
