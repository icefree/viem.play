import { LGraphNode } from 'litegraph.js'
import { type WalletClient } from 'viem'

/**
 * getPermissions 节点 - 获取钱包权限
 */
export class GetPermissionsNode extends LGraphNode {
  static title = 'getPermissions'
  static desc = 'Get wallet permissions'

  color = '#c53030'
  bgcolor = '#742a2a'

  private permissions: any[] | null = null

  constructor() {
    super()
    this.title = 'getPermissions'
    this.addInput('client', 'walletClient')
    this.addInput('trigger', -1)
    this.addOutput('permissions', 'array')
    this.size = [180, 60]
  }

  async onAction(action: string) {
    if (action === 'trigger') {
      const client = this.getInputData(0) as WalletClient | undefined

      if (!client) return

      try {
        this.permissions = await client.getPermissions()
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
