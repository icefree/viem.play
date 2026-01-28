import { LGraphNode } from 'litegraph.js'
import { type WalletClient, type Address, type Abi, type Hash } from 'viem'

/**
 * writeContract 节点 - 写入合约 (Wallet Action)
 */
export class WriteContractWalletNode extends LGraphNode {
  static title = 'writeContract'
  static desc = 'Write to a contract'

  color = '#c53030'
  bgcolor = '#742a2a'

  private hash: Hash | null = null

  constructor() {
    super()
    this.title = 'writeContract'
    this.addInput('client', 'walletClient')
    this.addInput('address', 'address')
    this.addInput('abi', 'abi')
    this.addInput('functionName', 'string')
    this.addInput('args', 'array')
    this.addInput('trigger', -1)
    this.addOutput('hash', 'string')
    this.size = [180, 140]
  }

  async onAction(action: string) {
    if (action === 'trigger') {
      const client = this.getInputData(0) as WalletClient | undefined
      const address = this.getInputData(1) as Address | undefined
      const abi = this.getInputData(2) as Abi | undefined
      const functionName = this.getInputData(3) as string | undefined
      const args = this.getInputData(4) as any[] | undefined

      if (!client || !address || !abi || !functionName) return

      try {
        // @ts-expect-error
        this.hash = await client.writeContract({
          address,
          abi,
          functionName,
          args
        })
      } catch (err) {
        console.error(err)
        this.hash = null
      }
    }
  }

  onExecute() {
    this.setOutputData(0, this.hash)
  }
}
