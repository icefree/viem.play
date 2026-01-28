import { LGraphNode } from 'litegraph.js'
import { getAddress as viemGetAddress } from 'viem'

/**
 * Address 校验/转换节点
 */
export class GetAddressNode extends LGraphNode {
  static title = 'getAddress'
  static desc = 'Checksum an address'

  constructor() {
    super()
    this.title = 'getAddress'
    this.addInput('address', 'string')
    this.addOutput('address', 'address')
    this.size = [160, 50]
  }

  onExecute() {
    const input = this.getInputData(0) as string | undefined
    if (input) {
      try {
        this.setOutputData(0, viemGetAddress(input))
      } catch {
        this.setOutputData(0, null)
      }
    } else {
      this.setOutputData(0, null)
    }
  }
}
