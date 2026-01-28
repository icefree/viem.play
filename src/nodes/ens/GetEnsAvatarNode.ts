import { LGraphNode } from 'litegraph.js'
import { type PublicClient } from 'viem'
import { normalize } from 'viem/ens'

/**
 * getEnsAvatar 节点 - 获取 ENS 头像
 */
export class GetEnsAvatarNode extends LGraphNode {
  static title = 'getEnsAvatar'
  static desc = 'Get ENS avatar'

  color = '#319795'
  bgcolor = '#234e52'

  private avatar: string | null = null

  constructor() {
    super()
    this.title = 'getEnsAvatar'
    this.addInput('client', 'publicClient')
    this.addInput('name', 'string')
    this.addInput('trigger', -1)
    this.addOutput('avatar', 'string')
    this.size = [180, 100]
  }

  async onAction(action: string) {
    if (action === 'trigger') {
      const client = this.getInputData(0) as PublicClient | undefined
      const name = this.getInputData(1) as string | undefined

      if (!client || !name) return

      try {
        this.avatar = await client.getEnsAvatar({
          name: normalize(name)
        })
      } catch (err) {
        console.error(err)
        this.avatar = null
      }
    }
  }

  onExecute() {
    this.setOutputData(0, this.avatar)
  }
}
