import { LGraphNode } from 'litegraph.js'
import { type PublicClient, type Hash } from 'viem'

/**
 * waitForTransactionReceipt 节点 - 等待交易确认
 */
export class WaitForTransactionReceiptNode extends LGraphNode {
  static title = 'waitForTransactionReceipt'
  static desc = 'Wait for a transaction receipt'

  color = '#2d3748'
  bgcolor = '#1a202c'

  constructor() {
    super()
    this.title = 'waitForTransactionReceipt'
    this.addInput('client', 'publicClient')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.addInput('hash', 0 as any) // Allow any for flexibility (e.g. from TextInput)
    this.addInput('trigger', -1)
    
    this.addOutput('receipt', 'object')
    this.addOutput('contractAddress', 'address')
    this.addOutput('status', 'string')
    this.addOutput('done', -1)
    
    this.size = [240, 100]
  }

  async onAction(action: string) {
    if (action === 'trigger') {
      const client = this.getInputData(0) as PublicClient | undefined
      const hash = this.getInputData(1) as Hash | undefined
      
      if (client && hash) {
        try {
          const receipt = await client.waitForTransactionReceipt({ hash })
          this.setOutputData(0, receipt)
          this.setOutputData(1, receipt.contractAddress)
          this.setOutputData(2, receipt.status)
          this.triggerSlot(3, null) // Trigger 'done' output
        } catch {
          this.setOutputData(0, null)
          this.setOutputData(1, null)
          this.setOutputData(2, 'error')
        }
      }
    }
  }
}
