import { LGraphNode } from 'litegraph.js'
import { recoverAuthorizationAddress } from 'viem/experimental'

/**
 * recoverAuthorizationAddress 节点 - 从 EIP-7702 授权中恢复地址
 */
export class RecoverAuthorizationAddressNode extends LGraphNode {
  static title = 'recoverAuthorizationAddress'
  static desc = 'Recover address from EIP-7702 authorization'

  color = '#667eea'
  bgcolor = '#4c51bf'

  private address: string | null = null

  constructor() {
    super()
    this.title = 'recoverAuthorizationAddress'
    this.addInput('authorization', 'object')
    this.addInput('trigger', -1)
    this.addOutput('address', 'address')
    this.size = [240, 80]
  }

  async onAction(action: string) {
    if (action === 'trigger') {
      const authorization = this.getInputData(0)
      if (!authorization) return

      try {
        this.address = await recoverAuthorizationAddress({ authorization })
      } catch (err) {
        console.error(err)
        this.address = null
      }
    }
  }

  onExecute() {
    this.setOutputData(0, this.address)
  }
}
