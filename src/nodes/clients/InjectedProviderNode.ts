import { LGraphNode, LiteGraph } from 'litegraph.js'
import { custom, type EIP1193Provider } from 'viem'

// 扩展 Window 接口以包含 ethereum
declare global {
  interface Window {
    ethereum?: EIP1193Provider & {
      isMetaMask?: boolean
      isCoinbaseWallet?: boolean
      isPhantom?: boolean
      isBraveWallet?: boolean
      isRabby?: boolean
      providers?: EIP1193Provider[]
    }
  }
}

/**
 * InjectedProvider 节点 - 检测并使用浏览器注入的钱包提供者 (window.ethereum)
 * 
 * 支持的钱包：MetaMask, Coinbase Wallet, Phantom, Brave Wallet, Rabby 等
 */
export class InjectedProviderNode extends LGraphNode {
  static title = 'Injected Provider'
  static desc = 'Detect browser wallet (window.ethereum)'

  color = '#f6ad55'
  bgcolor = '#c05621'

  private provider: EIP1193Provider | null = null
  private transport: ReturnType<typeof custom> | null = null
  private walletName: string = 'Not detected'
  private isConnected: boolean = false

  constructor() {
    super()
    this.title = 'Injected Provider'
    this.addInput('trigger', -1)
    this.addOutput('provider', 'object')
    this.addOutput('transport', 'transport')
    this.addOutput('walletName', 'string')
    this.addOutput('isAvailable', 'boolean')
    this.size = [180, 100]

    // 自动检测
    this.detectProvider()
  }

  detectProvider() {
    if (typeof window === 'undefined') {
      this.walletName = 'Not in browser'
      return
    }

    const ethereum = window.ethereum
    if (!ethereum) {
      this.walletName = 'No wallet detected'
      return
    }

    // 检测钱包类型
    if (ethereum.isMetaMask) {
      this.walletName = 'MetaMask'
    } else if (ethereum.isCoinbaseWallet) {
      this.walletName = 'Coinbase Wallet'
    } else if (ethereum.isPhantom) {
      this.walletName = 'Phantom'
    } else if (ethereum.isBraveWallet) {
      this.walletName = 'Brave Wallet'
    } else if (ethereum.isRabby) {
      this.walletName = 'Rabby'
    } else {
      this.walletName = 'Unknown Wallet'
    }

    this.provider = ethereum
    this.transport = custom(ethereum)
    this.isConnected = true
  }

  async onAction() {
    console.log('[InjectedProvider] onAction triggered')
    this.detectProvider()
    
    // 尝试请求账户访问权限
    if (this.provider) {
      try {
        console.log('[InjectedProvider] Requesting accounts...')
        const accounts = await this.provider.request({ method: 'eth_requestAccounts' })
        console.log('[InjectedProvider] Got accounts:', accounts)
      } catch (err) {
        console.error('[InjectedProvider] Failed to request accounts:', err)
      }
    } else {
      console.warn('[InjectedProvider] No provider found')
    }
  }

  onExecute() {
    this.setOutputData(0, this.provider)
    this.setOutputData(1, this.transport)
    this.setOutputData(2, this.walletName)
    this.setOutputData(3, this.isConnected)
  }

  onDrawForeground(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.isConnected ? '#48bb78' : '#fc8181'
    ctx.font = '12px Arial'
    ctx.textAlign = 'center'
    ctx.fillText(this.walletName, this.size[0] / 2, this.size[1] - 10)
  }
}

// 自动注册
LiteGraph.registerNodeType('Clients & Transports/Providers/InjectedProvider', InjectedProviderNode)
