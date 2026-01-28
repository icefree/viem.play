import { LGraphNode } from 'litegraph.js'
import { type WalletClient, type Abi } from 'viem'

/**
 * deployContract 节点 - 部署合约
 */
export class DeployContractNode extends LGraphNode {
  static title = 'deployContract'
  static desc = 'Deploy a contract'

  color = '#3182ce'
  bgcolor = '#2a4365'

  private hash: string | null = null

  constructor() {
    super()
    this.title = 'deployContract'
    this.addInput('client', 'walletClient')
    this.addInput('abi', 'abi')
    this.addInput('bytecode', 'bytes')
    this.addInput('args', 'array')
    this.addInput('deploy', -1)
    this.addOutput('hash', 'string')
    this.size = [180, 140]
  }

  async onAction(action: string) {
    if (action === 'deploy') {
      const client = this.getInputData(0) as WalletClient | undefined
      const abi = this.getInputData(1) as Abi | undefined
      const bytecode = this.getInputData(2) as `0x${string}` | undefined
      const args = this.getInputData(3) as any[] | undefined

      if (!client || !abi || !bytecode) return

      try {
        // @ts-expect-error - bypass complex viem client/account typing
        this.hash = await client.deployContract({
          abi,
          bytecode,
          args
        })
      } catch (err) {
        console.error(err)
      }
    }
  }

  onExecute() {
    this.setOutputData(0, this.hash)
  }
}
