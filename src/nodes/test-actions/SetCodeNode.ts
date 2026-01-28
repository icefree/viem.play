import { LGraphNode } from 'litegraph.js'
import { type TestClient, type Address } from 'viem'

export class SetCodeNode extends LGraphNode {
  static title = 'setCode'
  static desc = 'Set bytecode of a contract at an address'

  color = '#805ad5'
  bgcolor = '#553c9a' // Test Action Color

  constructor() {
    super()
    this.title = 'setCode'
    this.addInput('client', 'testClient')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.addInput('address', 0 as any)
    this.addInput('bytecode', 'string') // Use string for hex bytecode
    this.addInput('trigger', -1)
    
    this.addOutput('done', -1)
    
    this.size = [200, 100]
  }

  async onAction(action: string) {
    if (action === 'trigger') {
      const client = this.getInputData(0) as TestClient | undefined
      const address = this.getInputData(1) as Address | undefined
      const bytecode = this.getInputData(2) as `0x${string}` | undefined
      
      if (!client || !address || !bytecode) {
          return
      }

      try {
        await client.setCode({
          address,
          bytecode
        })
        this.triggerSlot(0, null)
      } catch {
        // Error handled by client proxy logging
      }
    }
  }
}
