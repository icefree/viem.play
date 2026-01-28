import { LGraphNode } from 'litegraph.js'
import { size as viemSize, type Hex } from 'viem'

/**
 * size 节点 - 获取 hex/byte 数据大小
 */
export class SizeNode extends LGraphNode {
  static title = 'size'
  static desc = 'Get size of hex/byte data'

  color = '#4a5568'
  bgcolor = '#2d3748'

  constructor() {
    super()
    this.title = 'size'
    this.addInput('data', 'bytes')
    this.addOutput('size', 'number')
    this.size = [160, 50]
  }

  onExecute() {
    const data = this.getInputData(0) as Hex | undefined
    
    if (data) {
      try {
        this.setOutputData(0, viemSize(data))
      } catch {
        this.setOutputData(0, null)
      }
    } else {
      this.setOutputData(0, null)
    }
  }
}
