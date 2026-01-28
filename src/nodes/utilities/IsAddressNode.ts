import { LGraphNode } from 'litegraph.js'
import { isAddress as viemIsAddress } from 'viem'

/**
 * isAddress 校验节点
 */
export class IsAddressNode extends LGraphNode {
  static title = 'isAddress'
  static desc = 'Check if address is valid'

  constructor() {
    super()
    this.title = 'isAddress'
    this.addInput('address', 'string')
    this.addOutput('isValid', 'boolean')
    this.size = [160, 50]
  }

  onExecute() {
    const input = this.getInputData(0) as string | undefined
    this.setOutputData(0, input ? viemIsAddress(input) : false)
  }
}
