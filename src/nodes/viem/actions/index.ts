import { LGraphNode, LiteGraph } from 'litegraph.js'
import { type PublicClient, type Address, formatEther } from 'viem'

/**
 * GetBalance 节点 - 获取地址余额
 */
class GetBalanceNode extends LGraphNode {
  static title = 'Get Balance'
  static desc = 'Get the balance of an address'

  color = '#6b46c1'
  bgcolor = '#44337a'

  private balance: bigint | null = null
  private isLoading = false
  private error: string | null = null
  private lastAddress: string | null = null

  constructor() {
    super()
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
  static title = 'Get Block Number'
  static desc = 'Get the current block number'

  color = '#6b46c1'
  bgcolor = '#44337a'

  private blockNumber: bigint | null = null
  private isLoading = false
  private lastFetch = 0

  constructor() {
    super()
    this.addInput('client', 'publicClient')
    this.addOutput('blockNumber', 'bigint')
    this.size = [180, 60]
  }

  async onExecute() {
    const client = this.getInputData(0) as PublicClient | undefined

    if (!client) {
      this.setOutputData(0, null)
      return
    }

    // Refresh every 5 seconds
    const now = Date.now()
    if (now - this.lastFetch > 5000 && !this.isLoading) {
      this.isLoading = true
      this.lastFetch = now

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
      ctx.fillText(`#${this.blockNumber.toString()}`, 10, 40)
    } else {
      ctx.fillText('No data', 10, 40)
    }
  }
}

/**
 * GetGasPrice 节点 - 获取当前 Gas 价格
 */
class GetGasPriceNode extends LGraphNode {
  static title = 'Get Gas Price'
  static desc = 'Get the current gas price'

  color = '#6b46c1'
  bgcolor = '#44337a'

  private gasPrice: bigint | null = null
  private isLoading = false
  private lastFetch = 0

  constructor() {
    super()
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
      // Convert to Gwei (1 Gwei = 10^9 Wei)
      const gwei = Number(this.gasPrice) / 1e9
      this.setOutputData(1, gwei.toFixed(2))
    }
  }

  onDrawForeground(ctx: CanvasRenderingContext2D) {
    if (this.flags.collapsed) return

    ctx.font = '12px monospace'
    ctx.fillStyle = '#e2e8f0'

    if (this.gasPrice !== null) {
      const gwei = Number(this.gasPrice) / 1e9
      ctx.fillText(`${gwei.toFixed(2)} Gwei`, 10, 40)
    }
  }
}

export function registerActionNodes() {
  LiteGraph.registerNodeType('viem/GetBalance', GetBalanceNode)
  LiteGraph.registerNodeType('viem/GetBlockNumber', GetBlockNumberNode)
  LiteGraph.registerNodeType('viem/GetGasPrice', GetGasPriceNode)
}

export { GetBalanceNode, GetBlockNumberNode, GetGasPriceNode }
