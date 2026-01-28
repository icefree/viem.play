import { LGraphNode } from 'litegraph.js'
import { type WalletClient } from 'viem'

/**
 * requestPermissions 节点 - 请求钱包权限
 * 
 * ⚠️ 重要：此功能仅适用于钱包提供者（如 MetaMask），
 * 不支持普通的 JSON-RPC 节点（如 thirdweb、Alchemy 等）
 */
export class RequestPermissionsNode extends LGraphNode {
  static title = 'requestPermissions'
  static desc = 'Request wallet permissions (wallet provider only)'

  color = '#c53030'
  bgcolor = '#742a2a'

  private permissions: unknown[] | null = null
  private error: string | null = null

  constructor() {
    super()
    this.title = 'requestPermissions'
    this.addInput('client', 'walletClient')
    this.addInput('permissions', '')  // 接受任何类型
    this.addInput('trigger', -1)
    this.addOutput('permissions', 'array')
    this.addOutput('error', 'string')
    this.size = [200, 90]
  }

  async onAction(action: string) {
    if (action === 'trigger') {
      const client = this.getInputData(0) as WalletClient | undefined
      const permissionsInput = this.getInputData(1) as Array<Record<string, Record<string, unknown>>> | undefined

      if (!client) return

      try {
        // 默认请求 eth_accounts 权限
        const requestedPermissions = permissionsInput || [{ eth_accounts: {} }]
        // @ts-expect-error - viem types for requestPermissions are overly strict
        this.permissions = await client.requestPermissions(requestedPermissions)
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
