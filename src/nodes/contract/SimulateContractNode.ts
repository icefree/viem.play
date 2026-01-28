import { LGraphNode } from 'litegraph.js'
import { type PublicClient, type Address, type Abi } from 'viem'

/**
 * simulateContract 节点 - 模拟合约调用
 */
export class SimulateContractNode extends LGraphNode {
  static title = 'simulateContract'
  static desc = 'Simulate a contract call'

  color = '#3182ce'
  bgcolor = '#2a4365'

  private result: any = null
  private request: any = null

  constructor() {
    super()
    this.title = 'simulateContract'
    this.addInput('client', 'publicClient')
    this.addInput('address', 'address')
    this.addInput('abi', 'abi')
    this.addInput('functionName', 'string')
    this.addInput('args', 'array')
    this.addInput('simulate', -1)
    this.addOutput('result', '')
    this.addOutput('request', 'object')
    this.size = [180, 160]
  }

  async onAction(action: string) {
    if (action === 'simulate') {
      const client = this.getInputData(0) as PublicClient | undefined
      const address = this.getInputData(1) as Address | undefined
      const abi = this.getInputData(2) as Abi | undefined
      const functionName = this.getInputData(3) as string | undefined
      const args = this.getInputData(4) as any[] | undefined

      if (!client || !address || !abi || !functionName) return

      try {
        const res = await client.simulateContract({
          address,
          abi,
          functionName,
          args
        } as any)
        this.result = (res as any).result
        this.request = (res as any).request
      } catch (err) {
        console.error(err)
      }
    }
  }

  onExecute() {
    this.setOutputData(0, this.result)
    this.setOutputData(1, this.request)
  }
}
