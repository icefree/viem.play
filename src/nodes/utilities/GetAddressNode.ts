import { LGraphNode } from 'litegraph.js'
import { getAddress as viemGetAddress } from 'viem'

/**
 * Address 校验/转换节点
 */
export class GetAddressNode extends LGraphNode {
  static title = 'getAddress'
  static desc = 'Checksum an address'

  private checksummed: string | null = null

  constructor() {
    super()
    this.title = 'getAddress'
    this.addInput('address', 'string')
    this.addInput('trigger', -1)
    this.addOutput('address', 'address')
    this.size = [160, 80]
  }

  onAction(action: string) {
    if (action === 'trigger') {
      const input = this.getInputData(0) as string | undefined
      if (input) {
        try {
          this.checksummed = viemGetAddress(input)
        } catch {
          this.checksummed = null
        }
      } else {
        this.checksummed = null
      }
    }
  }

  onExecute() {
    this.setOutputData(0, this.checksummed)
  }
}
