import { LGraphNode } from 'litegraph.js'
import { type PublicClient, type Address, type Abi } from 'viem'

/**
 * readContract 节点 - 读取合约
 */
export class ReadContractNode extends LGraphNode {
  static title = 'readContract'
  static desc = 'Read data from a contract'

  color = '#3182ce'
  bgcolor = '#2a4365'

  private result: any = null
  private isLoadingRead = false

  constructor() {
    super()
    this.title = 'readContract'
    this.addInput('client', 'publicClient')
    this.addInput('address', 'address')
    this.addInput('abi', 'abi')
    this.addInput('functionName', 'string')
    this.addInput('args', 'array')
    this.addInput('trigger', -1)
    this.addOutput('result', '') 
    this.size = [180, 140]
  }

  async onAction(action: string) {
    if (action === 'trigger') {
      const client = this.getInputData(0) as PublicClient | undefined
      const address = this.getInputData(1) as Address | undefined
      const abi = this.getInputData(2) as Abi | undefined
      const functionName = this.getInputData(3) as string | undefined
      const args = this.getInputData(4) as any[] | undefined

      if (!client || !address || !abi || !functionName) return

      this.isLoadingRead = true
      try {
        this.result = await client.readContract({
          address,
          abi,
          functionName,
          args
        })
      } catch (err) {
        console.error(err)
        this.result = null
      } finally {
        this.isLoadingRead = false
      }
    }
  }

  onExecute() {
    this.setOutputData(0, this.result)
  }
}
