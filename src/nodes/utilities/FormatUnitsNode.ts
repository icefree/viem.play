import { LGraphNode } from 'litegraph.js'
import { formatUnits } from 'viem'

/**
 * formatUnits 节点 - 格式化单位
 */
export class FormatUnitsNode extends LGraphNode {
  static title = 'formatUnits'
  static desc = 'Format units'

  color = '#38a169'
  bgcolor = '#276749'

  constructor() {
    super()
    this.title = 'formatUnits'
    this.addInput('value', 'bigint')
    this.addInput('decimals', 'number')
    this.addOutput('formatted', 'string')
    this.size = [160, 60]
  }

  onExecute() {
    const value = this.getInputData(0) as bigint | undefined
    const decimals = this.getInputData(1) as number || 18
    
    if (typeof value === 'bigint') {
      try {
        this.setOutputData(0, formatUnits(value, decimals))
      } catch {
        this.setOutputData(0, null)
      }
    } else {
      this.setOutputData(0, null)
    }
  }
}
