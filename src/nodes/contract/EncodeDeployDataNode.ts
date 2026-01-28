import { LGraphNode } from 'litegraph.js'
import { encodeDeployData, type Abi, type Hex } from 'viem'

/**
 * encodeDeployData 节点 - 编码部署数据
 */
export class EncodeDeployDataNode extends LGraphNode {
  static title = 'encodeDeployData'
  static desc = 'Encode deployment data'

  color = '#3182ce'
  bgcolor = '#2a4365'

  private encoded: Hex | null = null

  constructor() {
    super()
    this.title = 'encodeDeployData'
    this.addInput('abi', 'abi')
    this.addInput('bytecode', 'bytes')
    this.addInput('args', 'array')
    this.addInput('trigger', -1)
    this.addOutput('data', 'bytes')
    this.size = [200, 100]
  }

  onAction(action: string) {
    if (action === 'trigger') {
      const abi = this.getInputData(0) as Abi | undefined
      const bytecode = this.getInputData(1) as Hex | undefined
      const args = this.getInputData(2) as any[] | undefined

      if (!abi || !bytecode) return

      try {
        this.encoded = encodeDeployData({
          abi,
          bytecode,
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
