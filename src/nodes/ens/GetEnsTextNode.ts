import { LGraphNode } from 'litegraph.js'
import { type PublicClient } from 'viem'
import { normalize } from 'viem/ens'

/**
 * getEnsText 节点 - 获取 ENS 文本记录
 */
export class GetEnsTextNode extends LGraphNode {
  static title = 'getEnsText'
  static desc = 'Get ENS text record'

  color = '#319795'
  bgcolor = '#234e52'

  private value: string | null = null

  constructor() {
    super()
    this.title = 'getEnsText'
    this.addInput('client', 'publicClient')
    this.addInput('name', 'string')
    this.addInput('key', 'string')
    this.addInput('trigger', -1)
    this.addOutput('value', 'string')
    this.size = [180, 120]
  }

  async onAction(action: string) {
    if (action === 'trigger') {
      const client = this.getInputData(0) as PublicClient | undefined
      const name = this.getInputData(1) as string | undefined
      const key = this.getInputData(2) as string | undefined

      if (!client || !name || !key) return

      try {
        this.value = await client.getEnsText({
          name: normalize(name),
          key
        })
      } catch (err) {
        console.error(err)
        this.value = null
      }
    }
  }

  onExecute() {
    this.setOutputData(0, this.value)
  }
}
