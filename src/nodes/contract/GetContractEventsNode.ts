import { LGraphNode } from 'litegraph.js'
import { type PublicClient, type Address, type Abi } from 'viem'

/**
 * getContractEvents 节点 - 获取合约事件
 */
export class GetContractEventsNode extends LGraphNode {
  static title = 'getContractEvents'
  static desc = 'Get contract events'

  color = '#3182ce'
  bgcolor = '#2a4365'

  private events: any[] | null = null

  constructor() {
    super()
    this.title = 'getContractEvents'
    this.addInput('client', 'publicClient')
    this.addInput('address', 'address')
    this.addInput('abi', 'abi')
    this.addInput('eventName', 'string')
    this.addInput('trigger', -1)
    this.addOutput('events', 'array')
    this.size = [180, 120]
  }

  async onAction(action: string) {
    if (action === 'trigger') {
      const client = this.getInputData(0) as PublicClient | undefined
      const address = this.getInputData(1) as Address | undefined
      const abi = this.getInputData(2) as Abi | undefined
      const eventName = this.getInputData(3) as string | undefined

      if (!client || !address || !abi || !eventName) return

      try {
        // @ts-ignore
        this.events = await client.getContractEvents({
          address,
          abi,
          eventName
        })
      } catch (err) {
        console.error(err)
      }
    }
  }

  onExecute() {
    this.setOutputData(0, this.events)
  }
}
