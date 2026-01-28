import { LGraphNode } from 'litegraph.js'
import { pad, type Hex } from 'viem'

/**
 * pad 节点 - 填充 hex/byte 数据
 */
export class PadNode extends LGraphNode {
  static title = 'pad'
  static desc = 'Pad hex/byte data'

  color = '#4a5568'
  bgcolor = '#2d3748'

  constructor() {
    super()
    this.title = 'pad'
    this.addInput('data', 'bytes')
    this.addInput('size', 'number')
    this.addOutput('result', 'bytes')
    this.size = [160, 60]
    this.addProperty('dir', 'left', 'enum', { values: ['left', 'right'] })
  }

  onExecute() {
    const data = this.getInputData(0) as Hex | undefined
    const size = this.getInputData(1) as number | undefined
    
    if (data) {
      try {
        const dir = this.properties.dir as 'left' | 'right'
        this.setOutputData(0, pad(data, { dir, size }))
      } catch {
        this.setOutputData(0, null)
      }
    } else {
      this.setOutputData(0, null)
    }
  }
}
