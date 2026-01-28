import { LGraphNode } from 'litegraph.js'
import { decodeFunctionResult, type Abi, type Hex } from 'viem'

/**
 * decodeFunctionResult 节点 - 解码函数返回结果
 */
export class DecodeFunctionResultNode extends LGraphNode {
  static title = 'decodeFunctionResult'
  static desc = 'Decode function result'

  color = '#3182ce'
  bgcolor = '#2a4365'

  private decoded: unknown = null

  constructor() {
    super()
    this.title = 'decodeFunctionResult'
    this.addInput('abi', 'abi')
    this.addInput('functionName', 'string')
    this.addInput('data', 'bytes')
    this.addInput('trigger', -1)
    this.addOutput('result', '')
    this.size = [200, 100]
  }

  onAction(action: string) {
    if (action === 'trigger') {
      const abi = this.getInputData(0) as Abi | undefined
      const functionName = this.getInputData(1) as string | undefined
      const data = this.getInputData(2) as Hex | undefined

      if (!abi || !functionName || !data) return

      try {
        this.decoded = decodeFunctionResult({ abi, functionName, data })
      } catch (err) {
        console.error(err)
        this.decoded = null
      }
    }
  }

  onExecute() {
    this.setOutputData(0, this.decoded)
  }
}
