import { LGraphNode, LiteGraph } from 'litegraph.js'
import { createWalletClient, custom, type WalletClient, type Chain, type Address, type EIP1193Provider } from 'viem'
import { mainnet, sepolia, polygon, arbitrum, optimism, base } from 'viem/chains'

// 链 ID 到链配置的映射
const chainIdToChain: Record<number, Chain> = {
  1: mainnet,
  11155111: sepolia,
  137: polygon,
  42161: arbitrum,
  10: optimism,
  8453: base,
}

/**
 * InjectedWalletClient 节点 - 使用浏览器钱包创建 WalletClient
 * 
 * 直接连接到 window.ethereum，自动检测链和账户
 */
export class InjectedWalletClientNode extends LGraphNode {
  static title = 'Injected Wallet'
  static desc = 'Create WalletClient from browser wallet'

  color = '#f6ad55'
  bgcolor = '#c05621'

  private walletClient: WalletClient | null = null
  private publicClient: PublicClient | null = null
  private account: Address | null = null
  private chainId: number | null = null
  private walletName: string = 'Not connected'
  private error: string | null = null
  private transport: any = null

  constructor() {
    super()
    this.title = 'Injected Wallet'
    this.addInput('trigger', -1)
    this.addOutput('walletClient', 'walletClient')
    this.addOutput('publicClient', 'publicClient')
    this.addOutput('transport', 'transport')
    this.addOutput('account', 'address')
    this.addOutput('chainId', 'number')
    this.addOutput('error', 'string')
    this.addOutput('connected', -1)
    this.size = [200, 140]
  }

  async onAction(action: string) {
    if (action === 'trigger') {
      console.log('[InjectedWallet] onAction triggered')
      await this.connectWallet()
    }
  }

  async connectWallet() {
    console.log('[InjectedWallet] connectWallet called')
    console.log('[InjectedWallet] window.ethereum:', window.ethereum)
    
    if (typeof window === 'undefined' || !window.ethereum) {
      this.error = '未检测到钱包，请安装 MetaMask 或其他钱包'
      this.walletName = 'No wallet'
      console.warn('[InjectedWallet] No wallet detected')
      return
    }

    const ethereum = window.ethereum as EIP1193Provider & { isMetaMask?: boolean }

    try {
      // 请求账户访问
      console.log('[InjectedWallet] Requesting eth_requestAccounts...')
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' }) as Address[]
      console.log('[InjectedWallet] Got accounts:', accounts)
      
      if (!accounts || accounts.length === 0) {
        this.error = '用户拒绝了连接请求'
        return
      }

      // 获取当前链 ID
      const chainIdHex = await ethereum.request({ method: 'eth_chainId' }) as string
      this.chainId = parseInt(chainIdHex, 16)
      console.log('[InjectedWallet] Chain ID:', this.chainId)

      // 获取对应的链配置
      const chain = chainIdToChain[this.chainId] || mainnet

      // 创建 WalletClient
      this.walletClient = createWalletClient({
        chain,
        transport: custom(ethereum),
        account: accounts[0],
      })
      
      // 创建 PublicClient
      const { createPublicClient } = await import('viem')
      this.publicClient = createPublicClient({
        chain,
        transport: custom(ethereum)
      })

      this.transport = custom(ethereum)
      console.log('[InjectedWallet] Clients created:', { wallet: this.walletClient, public: this.publicClient })

      this.account = accounts[0]
      this.walletName = ethereum.isMetaMask ? 'MetaMask' : 'Wallet'
      this.error = null

      // 触发 connected 输出
      this.triggerSlot(6)

      // 监听账户和链变化
      this.setupListeners(ethereum)
    } catch (err) {
      console.error('[InjectedWallet] Connection error:', err)
      this.error = err instanceof Error ? err.message : String(err)
      this.walletClient = null
      this.publicClient = null
      this.account = null
      this.transport = null
    }
  }

  setupListeners(ethereum: EIP1193Provider) {
    // 监听账户变化
    const handleAccountsChanged = async (accounts: string[]) => {
      if (accounts.length === 0) {
        this.account = null
        this.walletClient = null
        this.publicClient = null
        this.transport = null
        this.walletName = 'Disconnected'
      } else {
        this.account = accounts[0] as Address
        await this.connectWallet() // 重新连接
      }
    }

    // 监听链变化
    const handleChainChanged = async () => {
      await this.connectWallet() // 重新连接
    }

    const eth = ethereum as unknown as { on?: (event: string, handler: (...args: unknown[]) => void) => void }
    eth.on?.('accountsChanged', handleAccountsChanged as (...args: unknown[]) => void)
    eth.on?.('chainChanged', handleChainChanged)
  }

  onExecute() {
    this.setOutputData(0, this.walletClient)
    this.setOutputData(1, this.publicClient)
    this.setOutputData(2, this.transport)
    this.setOutputData(3, this.account)
    this.setOutputData(4, this.chainId)
    this.setOutputData(5, this.error)
  }

  onDrawForeground(ctx: CanvasRenderingContext2D) {
    const status = this.account 
      ? `${this.walletName}: ${this.account.slice(0, 6)}...${this.account.slice(-4)}`
      : this.walletName

    ctx.fillStyle = this.account ? '#48bb78' : '#fc8181'
    ctx.font = '11px Arial'
    ctx.textAlign = 'center'
    ctx.fillText(status, this.size[0] / 2, this.size[1] - 8)
  }
}

// 自动注册
LiteGraph.registerNodeType('Clients & Transports/Clients/InjectedWallet', InjectedWalletClientNode)
