import { LGraphNode, LiteGraph } from 'litegraph.js'
import { type PublicClient, type Address, formatEther, formatGwei } from 'viem'

/**
 * GetBalance 节点 - 获取地址余额
 */
class GetBalanceNode extends LGraphNode {
  static title = 'getBalance'
  static desc = 'Get the balance of an address'

  color = '#6b46c1'
  bgcolor = '#44337a'

  private balance: bigint | null = null
  private isLoading = false
  private error: string | null = null
  private lastAddress: string | null = null

  constructor() {
    super()
    this.title = 'getBalance'
    this.addInput('client', 'publicClient')
    this.addInput('address', 'address')
    this.addOutput('balance', 'bigint')
    this.addOutput('formatted', 'string')
    this.size = [200, 80]
  }

  async onExecute() {
    const client = this.getInputData(0) as PublicClient | undefined
    const address = this.getInputData(1) as Address | undefined

    if (!client || !address) {
      this.balance = null
      this.setOutputData(0, null)
      this.setOutputData(1, null)
      return
    }

    // Only fetch if address changed
    if (address !== this.lastAddress && !this.isLoading) {
      this.lastAddress = address
      this.isLoading = true
      this.error = null

      try {
        this.balance = await client.getBalance({ address })
        this.setOutputData(0, this.balance)
        this.setOutputData(1, formatEther(this.balance))
      } catch (e) {
        this.error = (e as Error).message
        this.balance = null
      } finally {
        this.isLoading = false
      }
    } else if (this.balance !== null) {
      this.setOutputData(0, this.balance)
      this.setOutputData(1, formatEther(this.balance))
    }
  }

  onDrawForeground(ctx: CanvasRenderingContext2D) {
    if (this.flags.collapsed) return

    ctx.font = '11px monospace'

    if (this.isLoading) {
      ctx.fillStyle = '#ffd700'
      ctx.fillText('Loading...', 10, 50)
    } else if (this.error) {
      ctx.fillStyle = '#ff6b6b'
      ctx.fillText(`Error: ${this.error.slice(0, 20)}`, 10, 50)
    } else if (this.balance !== null) {
      ctx.fillStyle = '#48bb78'
      ctx.fillText(`${formatEther(this.balance)} ETH`, 10, 50)
    }
  }
}

/**
 * GetBlockNumber 节点 - 获取当前区块号
 */
class GetBlockNumberNode extends LGraphNode {
  static title = 'getBlockNumber'
  static desc = 'Get the current block number'

  color = '#6b46c1'
  bgcolor = '#44337a'

  private blockNumber: bigint | null = null
  private isLoading = false
  private pendingFetch = false

  constructor() {
    super()
    this.title = 'getBlockNumber'
    this.addInput('trigger', -1)
    this.addInput('client', 'publicClient')
    this.addOutput('blockNumber', 'bigint')
    this.size = [180, 80]
  }

  onAction() {
    // 当收到 action 时，标记需要刷新
    this.pendingFetch = true
  }

  async onExecute() {
    const client = this.getInputData(1) as PublicClient | undefined

    if (!client) {
      this.setOutputData(0, null)
      return
    }

    // 只在收到 action 触发时才请求
    if (this.pendingFetch && !this.isLoading) {
      this.isLoading = true
      this.pendingFetch = false

      try {
        this.blockNumber = await client.getBlockNumber()
      } catch (e) {
        console.error('GetBlockNumber error:', e)
      } finally {
        this.isLoading = false
      }
    }

    this.setOutputData(0, this.blockNumber)
  }

  onDrawForeground(ctx: CanvasRenderingContext2D) {
    if (this.flags.collapsed) return

    ctx.font = '12px monospace'
    ctx.fillStyle = '#e2e8f0'

    if (this.blockNumber !== null) {
      ctx.fillText(`#${this.blockNumber.toString()}`, 10, 60)
    } else {
      ctx.fillText('No data', 10, 60)
    }
  }
}

/**
 * GetGasPrice 节点 - 获取当前 Gas 价格
 */
class GetGasPriceNode extends LGraphNode {
  static title = 'getGasPrice'
  static desc = 'Get the current gas price'

  color = '#6b46c1'
  bgcolor = '#44337a'

  private gasPrice: bigint | null = null
  private isLoading = false
  private lastFetch = 0

  constructor() {
    super()
    this.title = 'getGasPrice'
    this.addInput('client', 'publicClient')
    this.addOutput('gasPrice', 'bigint')
    this.addOutput('gwei', 'string')
    this.size = [180, 60]
  }

  async onExecute() {
    const client = this.getInputData(0) as PublicClient | undefined

    if (!client) {
      this.setOutputData(0, null)
      this.setOutputData(1, null)
      return
    }

    const now = Date.now()
    if (now - this.lastFetch > 5000 && !this.isLoading) {
      this.isLoading = true
      this.lastFetch = now

      try {
        this.gasPrice = await client.getGasPrice()
      } catch (e) {
        console.error('GetGasPrice error:', e)
      } finally {
        this.isLoading = false
      }
    }

    if (this.gasPrice !== null) {
      this.setOutputData(0, this.gasPrice)
      this.setOutputData(1, formatGwei(this.gasPrice))
    }
  }

  onDrawForeground(ctx: CanvasRenderingContext2D) {
    if (this.flags.collapsed) return

    ctx.font = '12px monospace'
    ctx.fillStyle = '#e2e8f0'

    if (this.gasPrice !== null) {
      ctx.fillText(`${formatGwei(this.gasPrice)} Gwei`, 10, 40)
    }
  }
}

/**
 * GetBlock 节点 - 获取区块信息
 */
class GetBlockNode extends LGraphNode {
  static title = 'getBlock'
  static desc = 'Get block information'

  color = '#6b46c1'
  bgcolor = '#44337a'

  private block: object | null = null
  private isLoading = false

  constructor() {
    super()
    this.title = 'getBlock'
    this.addInput('client', 'publicClient')
    this.addInput('blockNumber', 'bigint')
    this.addOutput('block', 'object')
    this.addOutput('timestamp', 'bigint')
    this.addOutput('hash', 'string')
    this.size = [180, 90]
  }

  async onExecute() {
    const client = this.getInputData(0) as PublicClient | undefined
    const blockNumber = this.getInputData(1) as bigint | undefined

    if (!client) {
      this.setOutputData(0, null)
      return
    }

    if (!this.isLoading) {
      this.isLoading = true
      try {
        const block = await client.getBlock(
          blockNumber ? { blockNumber } : {}
        )
        this.block = block
        this.setOutputData(0, block)
        this.setOutputData(1, block.timestamp)
        this.setOutputData(2, block.hash)
      } catch (e) {
        console.error('GetBlock error:', e)
      } finally {
        this.isLoading = false
      }
    }
  }
}

/**
 * GetTransactionCount 节点 - 获取地址的交易数量 (nonce)
 */
class GetTransactionCountNode extends LGraphNode {
  static title = 'getTransactionCount'
  static desc = 'Get the number of transactions sent from an address (nonce)'

  color = '#6b46c1'
  bgcolor = '#44337a'

  private count: number | null = null
  private isLoading = false
  private lastAddress: string | null = null

  constructor() {
    super()
    this.title = 'getTransactionCount'
    this.addInput('client', 'publicClient')
    this.addInput('address', 'address')
    this.addOutput('count', 'number')
    this.size = [200, 60]
  }

  async onExecute() {
    const client = this.getInputData(0) as PublicClient | undefined
    const address = this.getInputData(1) as Address | undefined

    if (!client || !address) {
      this.setOutputData(0, null)
      return
    }

    if (address !== this.lastAddress && !this.isLoading) {
      this.lastAddress = address
      this.isLoading = true

      try {
        this.count = await client.getTransactionCount({ address })
        this.setOutputData(0, this.count)
      } catch (e) {
        console.error('GetTransactionCount error:', e)
      } finally {
        this.isLoading = false
      }
    } else if (this.count !== null) {
      this.setOutputData(0, this.count)
    }
  }

  onDrawForeground(ctx: CanvasRenderingContext2D) {
    if (this.flags.collapsed) return

    ctx.font = '12px monospace'
    ctx.fillStyle = '#e2e8f0'

    if (this.count !== null) {
      ctx.fillText(`Nonce: ${this.count}`, 10, 40)
    }
  }
}

/**
 * Base Placeholder Node for missing actions
 */
class PublicActionPlaceholderNode extends LGraphNode {
  constructor(title: string, desc: string) {
    super()
    this.title = title
    this.addInput('client', 'publicClient')
    this.properties = { description: desc }
    this.color = '#6b46c1'
    this.bgcolor = '#44337a'
    this.size = [180, 40]
  }

  onDrawForeground(ctx: CanvasRenderingContext2D) {
    if (this.flags.collapsed) return
    ctx.font = '10px Arial'
    ctx.fillStyle = '#666'
    ctx.fillText('Placeholder', 10, 30)
  }
}

export function registerPublicActionNodes() {
  // --- Account ---
  LiteGraph.registerNodeType('Public Actions/Account/getBalance', GetBalanceNode)
  LiteGraph.registerNodeType('Public Actions/Account/getTransactionCount', GetTransactionCountNode)
  LiteGraph.registerNodeType('Public Actions/Account/getBytecode', class extends PublicActionPlaceholderNode { constructor() { super('getBytecode', 'Get bytecode of a contract') } })
  LiteGraph.registerNodeType('Public Actions/Account/getStorageAt', class extends PublicActionPlaceholderNode { constructor() { super('getStorageAt', 'Get storage selection at a contract address') } })
  LiteGraph.registerNodeType('Public Actions/Account/getProof', class extends PublicActionPlaceholderNode { constructor() { super('getProof', 'Get account and storage proof') } })

  // --- Block ---
  LiteGraph.registerNodeType('Public Actions/Block/getBlock', GetBlockNode)
  LiteGraph.registerNodeType('Public Actions/Block/getBlockNumber', GetBlockNumberNode)
  LiteGraph.registerNodeType('Public Actions/Block/getBlockTransactionCount', class extends PublicActionPlaceholderNode { constructor() { super('getBlockTransactionCount', 'Get transaction count of a block') } })
  LiteGraph.registerNodeType('Public Actions/Block/watchBlocks', class extends PublicActionPlaceholderNode { constructor() { super('watchBlocks', 'Watch for new blocks') } })
  LiteGraph.registerNodeType('Public Actions/Block/watchBlockNumber', class extends PublicActionPlaceholderNode { constructor() { super('watchBlockNumber', 'Watch for new block numbers') } })

  // --- Transaction ---
  LiteGraph.registerNodeType('Public Actions/Transaction/getTransaction', class extends PublicActionPlaceholderNode { constructor() { super('getTransaction', 'Get transaction information') } })
  LiteGraph.registerNodeType('Public Actions/Transaction/getTransactionReceipt', class extends PublicActionPlaceholderNode { constructor() { super('getTransactionReceipt', 'Get transaction receipt') } })
  LiteGraph.registerNodeType('Public Actions/Transaction/waitForTransactionReceipt', class extends PublicActionPlaceholderNode { constructor() { super('waitForTransactionReceipt', 'Wait for transaction receipt') } })
  LiteGraph.registerNodeType('Public Actions/Transaction/watchPendingTransactions', class extends PublicActionPlaceholderNode { constructor() { super('watchPendingTransactions', 'Watch for pending transactions') } })
  LiteGraph.registerNodeType('Public Actions/Transaction/call', class extends PublicActionPlaceholderNode { constructor() { super('call', 'Executes a new message call') } })
  LiteGraph.registerNodeType('Public Actions/Transaction/estimateGas', class extends PublicActionPlaceholderNode { constructor() { super('estimateGas', 'Estimate gas for a transaction') } })
  LiteGraph.registerNodeType('Public Actions/Transaction/createPendingTransactionFilter', class extends PublicActionPlaceholderNode { constructor() { super('createPendingTransactionFilter', 'Create filter for pending transactions') } })

  // --- Event ---
  LiteGraph.registerNodeType('Public Actions/Event/getLogs', class extends PublicActionPlaceholderNode { constructor() { super('getLogs', 'Get historical logs') } })
  LiteGraph.registerNodeType('Public Actions/Event/watchEvent', class extends PublicActionPlaceholderNode { constructor() { super('watchEvent', 'Watch for events') } })
  LiteGraph.registerNodeType('Public Actions/Event/createEventFilter', class extends PublicActionPlaceholderNode { constructor() { super('createEventFilter', 'Create filter for events') } })
  LiteGraph.registerNodeType('Public Actions/Event/getFilterChanges', class extends PublicActionPlaceholderNode { constructor() { super('getFilterChanges', 'Get changes since last poll') } })
  LiteGraph.registerNodeType('Public Actions/Event/getFilterLogs', class extends PublicActionPlaceholderNode { constructor() { super('getFilterLogs', 'Get logs matching a filter') } })
  LiteGraph.registerNodeType('Public Actions/Event/uninstallFilter', class extends PublicActionPlaceholderNode { constructor() { super('uninstallFilter', 'Uninstall a filter') } })

  // --- Other ---
  LiteGraph.registerNodeType('Public Actions/Other/getGasPrice', GetGasPriceNode)
  LiteGraph.registerNodeType('Public Actions/Other/getChainId', class extends PublicActionPlaceholderNode { constructor() { super('getChainId', 'Get chain ID') } })
  LiteGraph.registerNodeType('Public Actions/Other/getFeeHistory', class extends PublicActionPlaceholderNode { constructor() { super('getFeeHistory', 'Get fee history') } })
  LiteGraph.registerNodeType('Public Actions/Other/estimateMaxPriorityFeePerGas', class extends PublicActionPlaceholderNode { constructor() { super('estimateMaxPriorityFeePerGas', 'Estimate max priority fee per gas') } })
  LiteGraph.registerNodeType('Public Actions/Other/estimateFeesPerGas', class extends PublicActionPlaceholderNode { constructor() { super('estimateFeesPerGas', 'Estimate fees per gas') } })
  LiteGraph.registerNodeType('Public Actions/Other/prepareTransactionRequest', class extends PublicActionPlaceholderNode { constructor() { super('prepareTransactionRequest', 'Prepare transaction request') } })
}

export {
  GetBalanceNode,
  GetBlockNumberNode,
  GetGasPriceNode,
  GetBlockNode,
  GetTransactionCountNode
}
