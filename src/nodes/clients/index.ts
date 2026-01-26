import { LGraphNode, LiteGraph } from 'litegraph.js'
import { createPublicClient, http, type PublicClient, type Chain } from 'viem'

// Store clients to avoid recreating
const clientCache = new Map<string, PublicClient>()

/**
 * PublicClient 节点 - 创建 viem 的 PublicClient
 * 用于读取区块链数据
 */
class PublicClientNode extends LGraphNode {
  static title = 'Public Client'
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
    this.addInput('batch', 'object')
    this.addInput('cacheTime', 'number')
    this.addInput('pollingInterval', 'number')
    this.addOutput('client', 'publicClient')
    this.size = [180, 110]
  }

  onExecute() {
    const chain = this.getInputData(0) as Chain | undefined
    const transport = this.getInputData(1)
    const batch = this.getInputData(2)
    const cacheTime = this.getInputData(3)
    const pollingInterval = this.getInputData(4)

    if (!chain) {
      this.setOutputData(0, null)
      return
    }

    // Create a config object to detect changes
    const config = {
      chainId: chain.id,
      transport: transport ? 'custom' : 'default',
      batch: !!batch,
      cacheTime,
      pollingInterval
    }
    const configHash = JSON.stringify(config)

    if (this.lastConfigHash !== configHash) {
      this.lastConfigHash = configHash
      
      // We recreate the client when config changes
      // In a real app we might want a global cache but for a playground 
      // per-node instance is often enough for reactivity
      this.currentClient = createPublicClient({
        chain,
        transport: transport || http(),
        batch: batch || undefined,
        cacheTime: cacheTime || undefined,
        pollingInterval: pollingInterval || undefined,
      })
    }

    this.setOutputData(0, this.currentClient)
  }

  getTitle(): string {
    const chain = this.getInputData(0) as Chain | undefined
    if (chain) {
      return `PublicClient (${chain.name})`
    }
    return 'Public Client'
  }
}

/**
 * WalletClient 节点 - 创建 viem 的 WalletClient
 * 用于发送交易和签名
 */
class WalletClientNode extends LGraphNode {
  static title = 'Wallet Client'
  static desc = 'Create a viem WalletClient for sending transactions'

  color = '#c53030'
  bgcolor = '#742a2a'

  constructor() {
    super()
    this.title = 'WalletClient'
    this.addInput('chain', 'chain')
    this.addInput('account', 'account')
    this.addOutput('client', 'walletClient')
    this.size = [180, 70]
  }

  onExecute() {
    // WalletClient 需要 account，暂时只输出 null
    // 后续实现完整的钱包连接逻辑
    const chain = this.getInputData(0) as Chain | undefined
    const account = this.getInputData(1)
    
    if (!chain || !account) {
      this.setOutputData(0, null)
      return
    }
    
    // TODO: 实现 WalletClient 创建逻辑
    this.setOutputData(0, null)
  }
}

/**
 * TestClient 节点 - 创建 viem 的 TestClient
 * 用于本地测试节点操作
 */
class TestClientNode extends LGraphNode {
  static title = 'Test Client'
  static desc = 'Create a viem TestClient for local testing'

  color = '#805ad5'
  bgcolor = '#553c9a'

  constructor() {
    super()
    this.title = 'TestClient'
    this.addInput('chain', 'chain')
    this.addOutput('client', 'testClient')
    this.size = [180, 50]
  }

  onExecute() {
    // TestClient 用于 Anvil/Hardhat 本地节点
    // 暂时只输出 null，后续实现
    this.setOutputData(0, null)
  }
}

/**
 * Base Placeholder Node for missing actions
 */
class ClientPlaceholderNode extends LGraphNode {
  constructor(title: string, desc: string, color: string, bgcolor: string) {
    super()
    this.title = title
    this.addInput('chain', 'chain')
    this.addOutput('client', 'publicClient')
    this.properties = { description: desc }
    this.color = color
    this.bgcolor = bgcolor
    this.size = [180, 40]
  }

  onDrawForeground(ctx: CanvasRenderingContext2D) {
    if (this.flags.collapsed) return
    ctx.font = '10px Arial'
    ctx.fillStyle = '#666'
    ctx.fillText('Placeholder', 10, 30)
  }
}

export function registerClientNodes() {
  // --- Clients ---
  LiteGraph.registerNodeType('Clients & Transports/Clients/PublicClient', PublicClientNode)
  LiteGraph.registerNodeType('Clients & Transports/Clients/WalletClient', WalletClientNode)
  LiteGraph.registerNodeType('Clients & Transports/Clients/TestClient', TestClientNode)
  LiteGraph.registerNodeType('Clients & Transports/Clients/CustomClient', class extends ClientPlaceholderNode { constructor() { super('Custom Client', 'Create a custom client', '#276749', '#1c4532') } })

  // --- Transports ---
  LiteGraph.registerNodeType('Clients & Transports/Transports/http', class extends ClientPlaceholderNode { constructor() { super('http', 'HTTP transport', '#2d3748', '#1a202c') } })
  LiteGraph.registerNodeType('Clients & Transports/Transports/webSocket', class extends ClientPlaceholderNode { constructor() { super('webSocket', 'WebSocket transport', '#2d3748', '#1a202c') } })
  LiteGraph.registerNodeType('Clients & Transports/Transports/custom', class extends ClientPlaceholderNode { constructor() { super('custom', 'Custom (EIP-1193) transport', '#2d3748', '#1a202c') } })
  LiteGraph.registerNodeType('Clients & Transports/Transports/ipc', class extends ClientPlaceholderNode { constructor() { super('ipc', 'IPC transport', '#2d3748', '#1a202c') } })
  LiteGraph.registerNodeType('Clients & Transports/Transports/fallback', class extends ClientPlaceholderNode { constructor() { super('fallback', 'Fallback transport', '#2d3748', '#1a202c') } })
}

export { PublicClientNode, WalletClientNode, TestClientNode }
