import { LGraphNode } from 'litegraph.js'
import { type PublicClient, type Address } from 'viem'
import { normalize } from 'viem/ens'

/**
 * getEnsResolver 节点 - 获取 ENS 解析器地址
 */
export class GetEnsResolverNode extends LGraphNode {
  static title = 'getEnsResolver'
  static desc = 'Get ENS resolver'

  color = '#319795'
  bgcolor = '#234e52'

  private resolverAddress: Address | null = null

  constructor() {
    super()
    this.title = 'getEnsResolver'
    this.addInput('client', 'publicClient')
    this.addInput('name', 'string')
    this.addInput('trigger', -1)
    this.addOutput('resolver', 'address')
    this.size = [180, 80]
  }

  async onAction(action: string) {
    if (action === 'trigger') {
      const client = this.getInputData(0) as PublicClient | undefined
      const name = this.getInputData(1) as string | undefined

      if (!client || !name) return

      try {
        this.resolverAddress = await client.getEnsResolver({
          name: normalize(name)
        })
      } catch (err) {
        console.error(err)
        this.resolverAddress = null
      }
    }
  }

  onExecute() {
    this.setOutputData(0, this.resolverAddress)
  }
}
