import { LGraphNode } from 'litegraph.js'

/**
 * getEnsAvatar 节点 - 获取 ENS 头像
 */
export class GetEnsAvatarNode extends LGraphNode {
  static title = 'getEnsAvatar'
  static desc = 'Get ENS avatar'

  color = '#319795'
  bgcolor = '#234e52'

  constructor() {
    super()
    this.title = 'getEnsAvatar'
    this.addInput('client', 'publicClient')
    this.addInput('name', 'string')
    this.addOutput('avatar', 'string')
    this.size = [180, 70]
  }

  async onExecute() {
    this.setOutputData(0, null)
  }
}
