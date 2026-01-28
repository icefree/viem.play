import { LGraphNode } from 'litegraph.js'

/**
 * getEnsText 节点 - 获取 ENS 文本记录
 */
export class GetEnsTextNode extends LGraphNode {
  static title = 'getEnsText'
  static desc = 'Get ENS text record'

  color = '#319795'
  bgcolor = '#234e52'

  constructor() {
    super()
    this.title = 'getEnsText'
    this.addInput('client', 'publicClient')
    this.addInput('name', 'string')
    this.addInput('key', 'string')
    this.addOutput('value', 'string')
    this.size = [180, 90]
  }

  async onExecute() {
    this.setOutputData(0, null)
  }
}
