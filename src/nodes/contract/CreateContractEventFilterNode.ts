import { LGraphNode } from 'litegraph.js'
import { type PublicClient, type Address, type Abi } from 'viem'

/**
 * createContractEventFilter 节点 - 创建合约事件过滤器
 */
export class CreateContractEventFilterNode extends LGraphNode {
  static title = 'createContractEventFilter'
  static desc = 'Create filter for contract events'

  color = '#3182ce'
  bgcolor = '#2a4365'

  private filter: any = null

  constructor() {
    super()
    this.title = 'createContractEventFilter'
    this.addInput('client', 'publicClient')
    this.addInput('address', 'address')
    this.addInput('abi', 'abi')
    this.addInput('eventName', 'string')
    this.addInput('trigger', -1)
    this.addOutput('filter', 'object')
    this.size = [220, 120]
  }

  async onAction(action: string) {
    if (action === 'trigger') {
      const client = this.getInputData(0) as PublicClient | undefined
      const address = this.getInputData(1) as Address | undefined
      const abi = this.getInputData(2) as Abi | undefined
      const eventName = this.getInputData(3) as string | undefined

      if (!client || !address || !abi) return

      try {
        this.filter = await client.createContractEventFilter({
          address,
          abi,
          ...(eventName && { eventName })
        })
      } catch (err) {
        console.error(err)
        this.filter = null
      }
    }
  }

  onExecute() {
    this.setOutputData(0, this.filter)
  }
}
