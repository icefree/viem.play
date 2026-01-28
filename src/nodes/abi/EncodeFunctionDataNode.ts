import { LGraphNode } from 'litegraph.js'
import { encodeFunctionData, type Abi } from 'viem'

/**
 * encodeFunctionData 节点 - 编码函数调用数据
 */
export class EncodeFunctionDataNode extends LGraphNode {
  static title = 'encodeFunctionData'
  static desc = 'Encode function call data'

  color = '#e53e3e'
  bgcolor = '#742a2a'

  constructor() {
    super()
    this.title = 'encodeFunctionData'
    this.addInput('abi', 'abi')
    this.addInput('functionName', 'string')
    this.addInput('args', 'array')
    this.addOutput('data', 'bytes')
    this.size = [200, 90]
  }

  onExecute() {
    const abi = this.getInputData(0) as Abi
    const functionName = this.getInputData(1) as string
    const args = this.getInputData(2) as any[]

    if (abi && functionName) {
      try {
        const data = encodeFunctionData({
            abi,
            functionName,
            args: args || []
        })
        this.setOutputData(0, data)
      } catch (e) {
        this.setOutputData(0, null)
      }
    } else {
        this.setOutputData(0, null)
    }
  }
}
