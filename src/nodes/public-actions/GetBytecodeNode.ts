import { LGraphNode } from 'litegraph.js'
import { type PublicClient, type Address, type Hex } from 'viem'

/**
 * getBytecode 节点 - 获取合约字节码
 */
export class GetBytecodeNode extends LGraphNode {
  static title = 'getBytecode'
  static desc = 'Get bytecode of a contract'

  color = '#6b46c1'
  bgcolor = '#44337a'

  private bytecode: Hex | null = null

  constructor() {
    super()
    this.title = 'getBytecode'
    this.addInput('client', 'publicClient')
    this.addInput('address', 'address')
    this.addInput('trigger', -1)
    this.addOutput('bytecode', 'bytes')
    this.size = [180, 80]
  }

  async onAction(action: string) {
    if (action === 'trigger') {
      const client = this.getInputData(0) as PublicClient | undefined
      const address = this.getInputData(1) as Address | undefined

      if (!client || !address) return

      try {
        this.bytecode = await client.getCode({ address }) || null
      } catch (err) {
        console.error(err)
        this.bytecode = null
      }
    }
  }

  onExecute() {
    this.setOutputData(0, this.bytecode)
  }
}
