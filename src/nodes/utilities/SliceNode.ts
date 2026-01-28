import { LGraphNode } from 'litegraph.js'
import { slice as viemSlice, type Hex } from 'viem'

/**
 * slice 节点 - 切片 hex/byte 数据
 */
export class SliceNode extends LGraphNode {
  static title = 'slice'
  static desc = 'Slice hex/byte data'

  color = '#4a5568'
  bgcolor = '#2d3748'

  constructor() {
    super()
    this.title = 'slice'
    this.addInput('data', 'bytes')
    this.addInput('start', 'number')
    this.addInput('end', 'number')
    this.addOutput('result', 'bytes')
    this.size = [160, 80]
  }

  onExecute() {
    const data = this.getInputData(0) as Hex | undefined
    const start = this.getInputData(1) as number | undefined
    const end = this.getInputData(2) as number | undefined
    
    if (data) {
      try {
        this.setOutputData(0, viemSlice(data, start, end))
      } catch {
        this.setOutputData(0, null)
      }
    } else {
      this.setOutputData(0, null)
    }
  }
}
