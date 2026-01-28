import { LGraphNode } from 'litegraph.js'
import { type PublicClient, type Address } from 'viem'

/**
 * getEnsName 节点 - 反向解析地址到 ENS 名称
 */
export class GetEnsNameNode extends LGraphNode {
  static title = 'getEnsName'
  static desc = 'Reverse resolve address to ENS name'

  color = '#319795'
  bgcolor = '#234e52'

  private name: string | null = null

  constructor() {
    super()
    this.title = 'getEnsName'
    this.addInput('client', 'publicClient')
    this.addInput('address', 'address')
    this.addInput('trigger', -1)
    this.addOutput('name', 'string')
    this.size = [180, 100]
  }

  async onAction(action: string) {
    if (action === 'trigger') {
      const client = this.getInputData(0) as PublicClient | undefined
      const address = this.getInputData(1) as Address | undefined

      if (!client || !address) return

      try {
        this.name = await client.getEnsName({
          address
        })
      } catch (err) {
        console.error(err)
        this.name = null
      }
    }
  }

  onExecute() {
    this.setOutputData(0, this.name)
  }
}
