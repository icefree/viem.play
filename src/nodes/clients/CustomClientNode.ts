import { LGraphNode } from 'litegraph.js'
import { createClient, type Chain, type Transport } from 'viem'

/**
 * CustomClient 节点 - 创建自定义客户端
 */
export class CustomClientNode extends LGraphNode {
  static title = 'Custom Client'
  static desc = 'Create a custom client'

  color = '#276749'
  bgcolor = '#1c4532'

  private client: ReturnType<typeof createClient> | null = null

  constructor() {
    super()
    this.title = 'Custom Client'
    this.addInput('chain', 'chain')
    this.addInput('transport', 'transport')
    this.addOutput('client', 'client')
    this.size = [180, 60]
  }

  onExecute() {
    const chain = this.getInputData(0) as Chain | undefined
    const transport = this.getInputData(1) as Transport | undefined

    if (chain && transport) {
      try {
        this.client = createClient({
          chain,
          transport
        })
        this.setOutputData(0, this.client)
      } catch {
        this.setOutputData(0, null)
      }
    } else {
      this.setOutputData(0, null)
    }
  }
}
