import { LGraphNode } from 'litegraph.js'
import { encodeFunctionResult, type Abi, type Hex } from 'viem'

/**
 * encodeFunctionResult 节点 - 编码函数返回结果 (ABI)
 */
export class EncodeFunctionResultAbiNode extends LGraphNode {
  static title = 'encodeFunctionResult'
  static desc = 'Encode function result'

  color = '#e53e3e'
  bgcolor = '#742a2a'

  private encoded: Hex | null = null

  constructor() {
    super()
    this.title = 'encodeFunctionResult'
    this.addInput('abi', 'abi')
    this.addInput('functionName', 'string')
    this.addInput('result', '')
    this.addInput('trigger', -1)
    this.addOutput('data', 'bytes')
    this.size = [200, 100]
  }

  onAction(action: string) {
    if (action === 'trigger') {
      const abi = this.getInputData(0) as Abi | undefined
      const functionName = this.getInputData(1) as string | undefined
      const result = this.getInputData(2)

      if (!abi || !functionName) return

      try {
        this.encoded = encodeFunctionResult({
          abi,
          functionName,
          result
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
