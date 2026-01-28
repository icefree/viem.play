import { LGraphNode } from 'litegraph.js'
import { type WalletClient } from 'viem'

/**
 * requestPermissions 节点 - 请求钱包权限
 */
export class RequestPermissionsNode extends LGraphNode {
  static title = 'requestPermissions'
  static desc = 'Request wallet permissions'

  color = '#c53030'
  bgcolor = '#742a2a'

  private permissions: any[] | null = null

  constructor() {
    super()
    this.title = 'requestPermissions'
    this.addInput('client', 'walletClient')
    this.addInput('permissions', 'array')
    this.addInput('trigger', -1)
    this.addOutput('permissions', 'array')
    this.size = [200, 80]
  }

  async onAction(action: string) {
    if (action === 'trigger') {
      const client = this.getInputData(0) as WalletClient | undefined
      const permissionsInput = this.getInputData(1) as Record<string, Record<string, any>>[] | undefined

      if (!client) return

      try {
        // 默认请求 eth_accounts 权限
        const requestedPermissions = permissionsInput || [{ eth_accounts: {} }]
        this.permissions = await client.requestPermissions(requestedPermissions as any)
      } catch (err) {
        console.error(err)
        this.permissions = null
      }
    }
  }

  onExecute() {
    this.setOutputData(0, this.permissions)
  }
}
