import { LGraphNode } from 'litegraph.js'
import { encodeFunctionData, type Abi, type Hex } from 'viem'

/**
 * encodeFunctionData 节点 - 编码函数调用数据
 */
export class EncodeFunctionDataContractNode extends LGraphNode {
  static title = 'encodeFunctionData'
  static desc = 'Encode function data'

  color = '#3182ce'
  bgcolor = '#2a4365'

  private encoded: Hex | null = null

  constructor() {
    super()
    this.title = 'encodeFunctionData'
    this.addInput('abi', 'abi')
    this.addInput('functionName', 'string')
    this.addInput('args', 'array')
    this.addInput('trigger', -1)
    this.addOutput('data', 'bytes')
    this.size = [200, 100]
  }

  onAction(action: string) {
    if (action === 'trigger') {
      const abi = this.getInputData(0) as Abi | undefined
      const functionName = this.getInputData(1) as string | undefined
      const args = this.getInputData(2) as any[] | undefined

      if (!abi || !functionName) return

      try {
        this.encoded = encodeFunctionData({
          abi,
          functionName,
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
