import { LGraphNode } from 'litegraph.js'

/**
 * Address 校验/转换节点
 */
export class AddressInputNode extends LGraphNode {
  static title = 'Address'
  static desc = 'Input an Ethereum address'

  constructor() {
    super()
    this.title = 'Address'
    this.addOutput('address', 'address')
    this.addProperty('value', '', 'string')
    this.size = [260, 60]

    this.addWidget('text', 'Address', '', (v: string) => {
      this.properties.value = v
    })
  }

  onExecute() {
    this.setOutputData(0, this.properties.value)
  }
}
