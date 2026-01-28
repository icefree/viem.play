import { LGraphNode } from 'litegraph.js'
import { normalize } from 'viem/ens'

/**
 * normalize 节点 - 标准化 ENS 名称
 */
export class NormalizeNode extends LGraphNode {
  static title = 'normalize'
  static desc = 'Normalize an ENS name'

  color = '#319795'
  bgcolor = '#234e52'

  constructor() {
    super()
    this.title = 'normalize'
    this.addInput('name', 'string')
    this.addOutput('normalized', 'string')
    this.size = [160, 50]
  }

  onExecute() {
    const name = this.getInputData(0) as string | undefined
    
    if (name) {
      try {
        this.setOutputData(0, normalize(name))
      } catch {
        this.setOutputData(0, null)
      }
    } else {
      this.setOutputData(0, null)
    }
  }
}
