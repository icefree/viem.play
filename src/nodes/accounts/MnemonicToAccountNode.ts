import { LGraphNode } from 'litegraph.js'
import { mnemonicToAccount } from 'viem/accounts'

/**
 * mnemonicToAccount 节点 - 从助记词创建账户
 */
export class MnemonicToAccountNode extends LGraphNode {
  static title = 'mnemonicToAccount'
  static desc = 'Create account from mnemonic'

  color = '#d69e2e'
  bgcolor = '#975a16'

  constructor() {
    super()
    this.title = 'mnemonicToAccount'
    this.addInput('mnemonic', 'string')
    this.addInput('index', 'number')
    this.addOutput('account', 'account')
    this.addOutput('address', 'address')
    this.size = [200, 90]
  }

  onExecute() {
    const mnemonic = this.getInputData(0) as string | undefined
    const index = this.getInputData(1) as number | 0
    
    if (!mnemonic) {
      this.setOutputData(0, null)
      this.setOutputData(1, null)
      return
    }

    try {
      const account = mnemonicToAccount(mnemonic, { addressIndex: index })
      this.setOutputData(0, account)
      this.setOutputData(1, account.address)
    } catch (_) {
      this.setOutputData(0, null)
      this.setOutputData(1, null)
    }
  }
}
