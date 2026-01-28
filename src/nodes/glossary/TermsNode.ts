import { LGraphNode } from 'litegraph.js'

/**
 * 术语对照节点
 */
export class TermsNode extends LGraphNode {
  static title = 'Terms'
  static desc = 'Ethereum terms glossary'

  constructor() {
    super()
    this.title = 'Terms'
    this.addOutput('definition', 'string')
    this.size = [160, 50]
    this.addProperty('term', 'Wei', 'string')
  }

  onExecute() {
    const term = this.properties.term
    // 简化处理，实际可以有一个大的 Map
    this.setOutputData(0, `${term} definition...`)
  }
}
