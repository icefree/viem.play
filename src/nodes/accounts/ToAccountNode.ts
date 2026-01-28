import { LGraphNode } from 'litegraph.js'
import { toAccount, type Address } from 'viem/accounts'

/**
 * toAccount 节点 - 创建 JSON-RPC 账户
 */
export class ToAccountNode extends LGraphNode {
  static title = 'toAccount'
  static desc = 'Create a JSON-RPC Account'

  color = '#d69e2e'
  bgcolor = '#975a16'

  constructor() {
    super()
    this.title = 'toAccount'
    this.addInput('address', 'address')
    this.addOutput('account', 'account')
    this.size = [160, 50]
  }

  onExecute() {
    const address = this.getInputData(0) as Address | undefined
    if (!address) {
      this.setOutputData(0, null)
      return
    }

    try {
      const account = toAccount(address)
      this.setOutputData(0, account)
    } catch (_) {
      this.setOutputData(0, null)
    }
  }
}
