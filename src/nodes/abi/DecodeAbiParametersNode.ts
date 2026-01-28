import { LGraphNode } from 'litegraph.js'
import { decodeAbiParameters } from 'viem'

/**
 * decodeAbiParameters 节点 - 解码 ABI 参数
 */
export class DecodeAbiParametersNode extends LGraphNode {
  static title = 'decodeAbiParameters'
  static desc = 'Decode ABI parameters'

  color = '#e53e3e'
  bgcolor = '#742a2a'

  constructor() {
    super()
    this.title = 'decodeAbiParameters'
    this.addInput('types', 'string') // Changed to string
    this.addInput('data', 'bytes')
    this.addOutput('decoded', 'array')
    this.size = [200, 70]
  }

  onExecute() {
    const typesStr = this.getInputData(0) as string
    const data = this.getInputData(1) as `0x${string}`

    if (typesStr && data) {
      try {
        let parameters
        if (typeof typesStr === 'string') {
             const types = typesStr.split(',').map(t => ({ type: t.trim() }))
             parameters = types
        } else {
             parameters = typesStr
        }

        const decoded = decodeAbiParameters(parameters, data)
        this.setOutputData(0, decoded)
      } catch (e) {
        this.setOutputData(0, null)
      }
    } else {
      this.setOutputData(0, null)
    }
  }
}
