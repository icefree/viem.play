import { LGraphNode } from 'litegraph.js'
import { type PublicClient, type Address } from 'viem'
import { normalize } from 'viem/ens'

/**
 * getEnsAddress 节点 - 解析 ENS 名称到地址
 */
export class GetEnsAddressNode extends LGraphNode {
  static title = 'getEnsAddress'
  static desc = 'Resolve ENS name to address'

  color = '#319795'
  bgcolor = '#234e52'

  private address: Address | null = null

  constructor() {
    super()
    this.title = 'getEnsAddress'
    this.addInput('client', 'publicClient')
    this.addInput('name', 'string')
    this.addInput('trigger', -1)
    this.addOutput('address', 'address')
    this.size = [180, 100]
  }

  async onAction(action: string) {
    if (action === 'trigger') {
      const client = this.getInputData(0) as PublicClient | undefined
      const name = this.getInputData(1) as string | undefined

      if (!client || !name) return

      try {
        this.address = await client.getEnsAddress({
          name: normalize(name)
        })
      } catch (err) {
        console.error(err)
        this.address = null
      }
    }
  }

  onExecute() {
    this.setOutputData(0, this.address)
  }
}
