import { LGraphNode } from 'litegraph.js'
import { parseUnits } from 'viem'

/**
 * parseUnits 节点 - 解析单位
 */
export class ParseUnitsNode extends LGraphNode {
  static title = 'parseUnits'
  static desc = 'Parse units'

  color = '#38a169'
  bgcolor = '#276749'

  constructor() {
    super()
    this.title = 'parseUnits'
    this.addInput('value', 'string')
    this.addInput('decimals', 'number')
    this.addOutput('parsed', 'bigint')
    this.size = [160, 60]
  }

  onExecute() {
    const value = this.getInputData(0) as string | undefined
    const decimals = this.getInputData(1) as number || 18
    
    if (value) {
      try {
        this.setOutputData(0, parseUnits(value, decimals))
      } catch {
        this.setOutputData(0, null)
      }
    } else {
      this.setOutputData(0, null)
    }
  }
}
