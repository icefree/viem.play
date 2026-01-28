import { LGraphNode } from 'litegraph.js'
import { encodeAbiParameters } from 'viem'

/**
 * encodeAbiParameters 节点 - 编码 ABI 参数
 */
export class EncodeAbiParametersNode extends LGraphNode {
  static title = 'encodeAbiParameters'
  static desc = 'Encode ABI parameters'

  color = '#e53e3e'
  bgcolor = '#742a2a'

  private encoded: string | null = null

  constructor() {
    super()
    this.title = 'encodeAbiParameters'
    this.addInput('types', 'string') 
    this.addInput('values', 'array')
    this.addInput('trigger', -1)
    this.addOutput('encoded', 'bytes')
    this.size = [200, 100]
  }

  onAction(action: string) {
    if (action === 'trigger') {
      const typesStr = this.getInputData(0) as string
      const values = this.getInputData(1) as any[]

      if (typesStr && values) {
        try {
          let parameters
          if (typeof typesStr === 'string') {
               const types = typesStr.split(',').map(t => ({ type: t.trim() }))
               parameters = types
          } else {
               parameters = typesStr
          }

          this.encoded = encodeAbiParameters(parameters, values)
        } catch (e) {
          this.encoded = null
        }
      } else {
          this.encoded = null
      }
    }
  }

  onExecute() {
    this.setOutputData(0, this.encoded)
  }
}
