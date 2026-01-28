import { LGraphNode } from 'litegraph.js'
import { encodeErrorResult, type Abi, type Hex } from 'viem'

/**
 * encodeErrorResult 节点 - 编码错误结果
 */
export class EncodeErrorResultNode extends LGraphNode {
  static title = 'encodeErrorResult'
  static desc = 'Encode error result'

  color = '#3182ce'
  bgcolor = '#2a4365'

  private encoded: Hex | null = null

  constructor() {
    super()
    this.title = 'encodeErrorResult'
    this.addInput('abi', 'abi')
    this.addInput('errorName', 'string')
    this.addInput('args', 'array')
    this.addInput('trigger', -1)
    this.addOutput('data', 'bytes')
    this.size = [200, 100]
  }

  onAction(action: string) {
    if (action === 'trigger') {
      const abi = this.getInputData(0) as Abi | undefined
      const errorName = this.getInputData(1) as string | undefined
      const args = this.getInputData(2) as any[] | undefined

      if (!abi || !errorName) return

      try {
        this.encoded = encodeErrorResult({
          abi,
          errorName,
          ...(args && { args })
        })
      } catch (err) {
        console.error(err)
        this.encoded = null
      }
    }
  }

  onExecute() {
    this.setOutputData(0, this.encoded)
  }
}
