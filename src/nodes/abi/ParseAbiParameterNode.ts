import { LGraphNode } from 'litegraph.js'
import { parseAbiParameter, type AbiParameter } from 'viem'

/**
 * parseAbiParameter 节点 - 解析单个 ABI 参数
 */
export class ParseAbiParameterNode extends LGraphNode {
  static title = 'parseAbiParameter'
  static desc = 'Parse a single ABI parameter'

  color = '#e53e3e'
  bgcolor = '#742a2a'

  constructor() {
    super()
    this.title = 'parseAbiParameter'
    this.addInput('param', 'string')
    this.addOutput('abiParameter', 'object')
    this.size = [200, 50]
  }

  onExecute() {
    const param = this.getInputData(0) as string | undefined
    
    if (param) {
      try {
        const abiParameter = parseAbiParameter(param) as AbiParameter
        this.setOutputData(0, abiParameter)
      } catch {
        this.setOutputData(0, null)
      }
    } else {
      this.setOutputData(0, null)
    }
  }
}
