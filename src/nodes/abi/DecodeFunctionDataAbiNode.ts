import { LGraphNode } from 'litegraph.js'
import { decodeFunctionData, type Abi, type Hex } from 'viem'

/**
 * decodeFunctionData 节点 - 解码函数数据 (ABI)
 */
export class DecodeFunctionDataAbiNode extends LGraphNode {
  static title = 'decodeFunctionData'
  static desc = 'Decode function data'

  color = '#e53e3e'
  bgcolor = '#742a2a'

  private decoded: { functionName: string; args?: readonly unknown[] } | null = null

  constructor() {
    super()
    this.title = 'decodeFunctionData'
    this.addInput('abi', 'abi')
    this.addInput('data', 'bytes')
    this.addInput('trigger', -1)
    this.addOutput('functionName', 'string')
    this.addOutput('args', 'array')
    this.size = [200, 80]
  }

  onAction(action: string) {
    if (action === 'trigger') {
      const abi = this.getInputData(0) as Abi | undefined
      const data = this.getInputData(1) as Hex | undefined

      if (!abi || !data) return

      try {
        this.decoded = decodeFunctionData({ abi, data })
      } catch (err) {
        console.error(err)
        this.decoded = null
      }
    }
  }

  onExecute() {
    this.setOutputData(0, this.decoded?.functionName ?? null)
    this.setOutputData(1, this.decoded?.args ?? null)
  }
}
