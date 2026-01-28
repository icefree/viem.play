import { LGraphNode } from 'litegraph.js'
import { recoverAddress, type Hex } from 'viem'

/**
 * recoverAddress 节点 - 从签名恢复地址
 */
export class RecoverAddressNode extends LGraphNode {
  static title = 'recoverAddress'
  static desc = 'Recover address from signature'

  color = '#4a5568'
  bgcolor = '#2d3748'

  private address: string | null = null

  constructor() {
    super()
    this.title = 'recoverAddress'
    this.addInput('hash', 'bytes32')
    this.addInput('signature', 'bytes')
    this.addInput('trigger', -1)
    this.addOutput('address', 'address')
    this.size = [180, 80]
  }

  async onAction(action: string) {
    if (action === 'trigger') {
      const hash = this.getInputData(0) as Hex | undefined
      const signature = this.getInputData(1) as Hex | undefined

      if (!hash || !signature) return

      try {
        this.address = await recoverAddress({ hash, signature })
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
