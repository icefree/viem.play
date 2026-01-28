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

  private data: `0x${string}` | null = null

  constructor() {
    super()
    this.title = 'encodeFunctionData'
    this.addInput('abi', 'abi')
    this.addInput('functionName', 'string')
    this.addInput('args', 'array')
    this.addInput('trigger', -1)
    this.addOutput('data', 'bytes')
    this.size = [200, 110]
  }

  onAction(action: string) {
    if (action === 'trigger') {
      const abi = this.getInputData(0) as Abi
      const functionName = this.getInputData(1) as string
      const args = this.getInputData(2) as any[]

      if (abi && functionName) {
        try {
          this.data = encodeFunctionData({
              abi,
              functionName,
              args: args || []
          })
        } catch (e) {
          this.data = null
        }
      } else {
          this.data = null
      }
    }
  }

  onExecute() {
    this.setOutputData(0, this.data)
  }
}
