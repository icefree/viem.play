import { LGraphNode } from 'litegraph.js'
import { privateKeyToAccount } from 'viem/accounts'

/**
 * privateKeyToAccount 节点 - 从私钥创建账户
 */
export class PrivateKeyToAccountNode extends LGraphNode {
  static title = 'privateKeyToAccount'
  static desc = 'Create account from private key'

  color = '#d69e2e'
  bgcolor = '#975a16'

  constructor() {
    super()
    this.title = 'privateKeyToAccount'
    this.addInput('privateKey', 'string')
    this.addOutput('account', 'account')
    this.addOutput('address', 'address')
    this.size = [200, 70]
  }

  onExecute() {
    const privateKey = this.getInputData(0) as `0x${string}` | undefined
    if (!privateKey || !privateKey.startsWith('0x')) {
      this.setOutputData(0, null)
      this.setOutputData(1, null)
      return
    }

    try {
      const account = privateKeyToAccount(privateKey)
      this.setOutputData(0, account)
      this.setOutputData(1, account.address)
    } catch (_) {
      this.setOutputData(0, null)
      this.setOutputData(1, null)
    }
  }

  onDrawForeground(ctx: CanvasRenderingContext2D) {
    if (this.flags.collapsed) return
    const privateKey = this.getInputData(0)
    if (privateKey) {
      ctx.fillStyle = '#f6ad55'
      ctx.font = '10px monospace'
      ctx.fillText('Key connected', 10, 45)
    }
  }
}
