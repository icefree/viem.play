import { LGraphNode } from 'litegraph.js'
import { type Chain } from 'viem'

/**
 * WalletClient 节点 - 创建 viem 的 WalletClient
 * 用于发送交易和签名
 */
export class WalletClientNode extends LGraphNode {
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
