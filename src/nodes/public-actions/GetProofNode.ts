import { LGraphNode } from 'litegraph.js'
import { type PublicClient, type Address, type Hex } from 'viem'

/**
 * getProof 节点 - 获取账户和存储证明
 */
export class GetProofNode extends LGraphNode {
  static title = 'getProof'
  static desc = 'Get account and storage proof'

  color = '#6b46c1'
  bgcolor = '#44337a'

  private proof: any = null

  constructor() {
    super()
    this.title = 'getProof'
    this.addInput('client', 'publicClient')
    this.addInput('address', 'address')
    this.addInput('storageKeys', 'array')
    this.addInput('trigger', -1)
    this.addOutput('proof', 'object')
    this.size = [180, 100]
  }

  async onAction(action: string) {
    if (action === 'trigger') {
      const client = this.getInputData(0) as PublicClient | undefined
      const address = this.getInputData(1) as Address | undefined
      const storageKeys = this.getInputData(2) as Hex[] | undefined

      if (!client || !address) return

      try {
        this.proof = await client.getProof({ 
          address, 
          storageKeys: storageKeys || [] 
        })
      } catch (err) {
        console.error(err)
        this.proof = null
      }
    }
  }

  onExecute() {
    this.setOutputData(0, this.proof)
  }
}
