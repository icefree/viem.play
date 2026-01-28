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

  private decoded: any[] | null = null

  constructor() {
    super()
    this.title = 'decodeAbiParameters'
    this.addInput('types', 'string')
    this.addInput('data', 'bytes')
    this.addInput('trigger', -1)
    this.addOutput('decoded', 'array')
    this.size = [200, 100]
  }

  onAction(action: string) {
    if (action === 'trigger') {
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

          this.decoded = decodeAbiParameters(parameters, data) as any[]
        } catch (e) {
          this.decoded = null
        }
      } else {
        this.decoded = null
      }
    }
  }

  onExecute() {
    this.setOutputData(0, this.decoded)
  }
}
