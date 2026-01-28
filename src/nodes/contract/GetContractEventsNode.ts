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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private events: any[] | null = null

  constructor() {
    super()
    this.title = 'getContractEvents'
    this.addInput('client', 'publicClient')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.addInput('address', 0 as any) // Allow flexibility
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.addInput('abi', 0 as any)     // Allow flexibility
    this.addInput('eventName', 'string')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.addInput('fromBlock', 0 as any) // Allow flexibility
    this.addInput('trigger', -1)
    this.addOutput('events', 'array')
    this.size = [180, 140]
  }

  async onAction(action: string) {
    if (action === 'trigger') {
      const client = this.getInputData(0) as PublicClient | undefined
      const address = this.getInputData(1) as Address | undefined
      const abi = this.getInputData(2) as Abi | undefined
      const eventName = this.getInputData(3) as string | undefined
      const fromBlockInput = this.getInputData(4)
      
      let fromBlock: bigint | 'earliest' | 'latest' | 'safe' | 'finalized' | undefined = undefined
      if (typeof fromBlockInput === 'bigint') {
          fromBlock = fromBlockInput
      } else if (typeof fromBlockInput === 'string') {
          if (['earliest', 'latest', 'safe', 'finalized'].includes(fromBlockInput)) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              fromBlock = fromBlockInput as any
          } else {
              try {
                  fromBlock = BigInt(fromBlockInput)
              } catch {
                  // Ignore parse error
              }
          }
      }

      if (!client || !address || !abi) {
          return
      }

      try {
        this.events = await client.getContractEvents({
          address,
          abi,
          eventName: eventName || undefined,
          fromBlock: fromBlock
        })
      } catch {
        // Error handled by client proxy logging
      }
    }
  }

  onExecute() {
    this.setOutputData(0, this.events)
  }
}
