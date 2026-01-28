import { LGraphNode } from 'litegraph.js'
import { isAddressEqual as viemIsAddressEqual, type Address } from 'viem'

/**
 * isAddressEqual 校验节点
 */
export class IsAddressEqualNode extends LGraphNode {
  static title = 'isAddressEqual'
  static desc = 'Check if addresses are equal'

  constructor() {
    super()
    this.title = 'isAddressEqual'
    this.addInput('a', 'address')
    this.addInput('b', 'address')
    this.addOutput('isEqual', 'boolean')
    this.size = [160, 70]
  }

  onExecute() {
    const a = this.getInputData(0) as Address | undefined
    const b = this.getInputData(1) as Address | undefined
    if (a && b) {
       this.setOutputData(0, viemIsAddressEqual(a, b))
    } else {
       this.setOutputData(0, false)
    }
  }
}
