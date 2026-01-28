import { LGraphNode } from 'litegraph.js'
import { createPublicClient, http, type PublicClient, type Chain } from 'viem'
import { logger } from '../../stores/useLogStore'
import { createViemLogger } from '../../utils/viemLogger'

/**
 * PublicClient 节点 - 创建 viem 的 PublicClient
 * 用于读取区块链数据
 */
export class PublicClientNode extends LGraphNode {
  static title = 'PublicClient'
  static desc = 'Create a viem PublicClient for reading blockchain data'

  color = '#276749'
  bgcolor = '#1c4532'

  private currentClient: PublicClient | null = null
  private lastConfigHash: string | null = null

  constructor() {
    super()
    this.title = 'PublicClient'
    this.addInput('chain', 'chain')
    this.addInput('transport', 'transport')
    this.addOutput('client', 'publicClient')
    this.size = [180, 60]
  }

  onExecute() {
    const chain = this.getInputData(0) as Chain | undefined
    const transport = this.getInputData(1)

    if (!chain) {
      this.setOutputData(0, null)
      return
    }

    // Create a config identifier to detect changes
    const transportId = transport ? (transport.uid || transport.url || 'custom-transport') : 'default'
    const configHash = `${chain.id}-${transportId}`

    if (this.lastConfigHash !== configHash || (transport && !this.currentClient)) {
      this.lastConfigHash = configHash
      
      let finalTransport = transport
      if (!finalTransport) {
        const { onFetchRequest, onFetchResponse } = createViemLogger('HTTP-Default')
        finalTransport = http(undefined, { onFetchRequest, onFetchResponse })
      }

      const client = createPublicClient({
        chain,
        transport: finalTransport
      })

      // Wrap client in a Proxy to log all method calls
      this.currentClient = new Proxy(client, {
        get(target: any, prop: string | symbol) {
          const value = target[prop]
          if (typeof value === 'function') {
            return (...args: any[]) => {
              // Only log viem action-related methods (exclude internal or symbol access)
              if (typeof prop === 'string') {
                logger.info(`[Viem:Action] Calling ${prop}`, 'ViemAction', {
                  method: prop,
                  args: args.map(arg => {
                    // Pre-process args for better readability in logs (e.g. stringify bigints)
                    return JSON.parse(JSON.stringify(arg, (_, v) => typeof v === 'bigint' ? v.toString() : v))
                  })
                })
                
                try {
                  const result = value.apply(target, args)
                  // If result is a promise, log when it resolves
                  if (result instanceof Promise) {
                    return result.then(res => {
                      logger.debug(`[Viem:Action] ${prop} Success`, 'ViemAction', {
                        method: prop,
                        result: JSON.parse(JSON.stringify(res, (_, v) => typeof v === 'bigint' ? v.toString() : v))
                      })
                      return res
                    }).catch(err => {
                      logger.error(`[Viem:Action] ${prop} Failed: ${err.message}`, 'ViemAction', { method: prop, error: err })
                      throw err
                    })
                  }
                  return result
                } catch (err: any) {
                  logger.error(`[Viem:Action] ${prop} Error: ${err.message}`, 'ViemAction', { method: prop, error: err })
                  throw err
                }
              }
              return value.apply(target, args)
            }
          }
          return value
        }
      }) as PublicClient
      
      const transportType = transport ? (transport.type || 'Custom') : 'Http-Default'
      logger.info(`Created Proactive PublicClient for ${chain.name} via ${transportType}`, 'PublicClient', { chainId: chain.id })
    }

    this.setOutputData(0, this.currentClient)
  }

  getTitle(): string {
    const chain = this.getInputData(0) as Chain | undefined
    const transport = this.getInputData(1)
    if (chain) {
      const transportType = transport ? (transport.type || 'Custom') : ''
      return `PublicClient (${chain.name}${transportType ? ' : ' + transportType : ''})`
    }
    return 'PublicClient'
  }
}
