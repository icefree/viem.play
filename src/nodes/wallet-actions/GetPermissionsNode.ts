import { LGraphNode } from 'litegraph.js'
import { type WalletClient } from 'viem'

/**
 * getPermissions 节点 - 获取钱包权限
 * 
 * ⚠️ 重要：此功能仅适用于钱包提供者（如 MetaMask），
 * 不支持普通的 JSON-RPC 节点（如 thirdweb、Alchemy 等）
 */
export class GetPermissionsNode extends LGraphNode {
  static title = 'getPermissions'
  static desc = 'Get wallet permissions (wallet provider only)'

  color = '#c53030'
  bgcolor = '#742a2a'

  private permissions: unknown[] | null = null
  private error: string | null = null

  constructor() {
    super()
    this.title = 'getPermissions'
    this.addInput('client', 'walletClient')
    this.addInput('trigger', -1)
    this.addOutput('permissions', 'array')
    this.addOutput('error', 'string')
    this.size = [180, 70]
  }

  async onAction(action: string) {
    if (action === 'trigger') {
      const client = this.getInputData(0) as WalletClient | undefined

      if (!client) return

      try {
        this.permissions = await client.getPermissions()
        this.error = null
      } catch (err) {
        console.error(err)
        this.permissions = null
        // 提供更有意义的错误信息
        if (err instanceof Error && err.message.includes('not supported')) {
          this.error = '此方法仅支持钱包提供者（如 MetaMask），不支持普通 RPC 节点'
        } else {
          this.error = err instanceof Error ? err.message : String(err)
        }
      }
    }
  }

  onExecute() {
    this.setOutputData(0, this.permissions)
    this.setOutputData(1, this.error)
  }
}
