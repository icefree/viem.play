import { LGraphNode } from 'litegraph.js'

/**
 * getEnsAddress 节点 - 解析 ENS 名称到地址
 */
export class GetEnsAddressNode extends LGraphNode {
  static title = 'getEnsAddress'
  static desc = 'Resolve ENS name to address'

  color = '#319795'
  bgcolor = '#234e52'

  constructor() {
    super()
    this.title = 'getEnsAddress'
    this.addInput('client', 'publicClient')
    this.addInput('name', 'string')
    this.addOutput('address', 'address')
    this.size = [180, 70]
  }

  async onExecute() {
    // TODO: 实现 ENS 解析逻辑
    this.setOutputData(0, null)
  }
}
