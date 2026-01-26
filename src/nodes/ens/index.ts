import { LGraphNode, LiteGraph } from 'litegraph.js'

/**
 * getEnsAddress 节点 - 解析 ENS 名称到地址
 */
class GetEnsAddressNode extends LGraphNode {
  static title = 'getEnsAddress'
  static desc = 'Resolve ENS name to address'

  color = '#319795'
  bgcolor = '#234e52'

  constructor() {
    super()
    this.addInput('client', 'publicClient')
    this.addInput('name', 'string')
    this.addOutput('address', 'address')
    this.size = [180, 70]
  }

  async onExecute() {
    // TODO: 实现 ENS 解析逻辑
    this.setOutputData(0, null)
  }
}

/**
 * getEnsName 节点 - 反向解析地址到 ENS 名称
 */
class GetEnsNameNode extends LGraphNode {
  static title = 'getEnsName'
  static desc = 'Reverse resolve address to ENS name'

  color = '#319795'
  bgcolor = '#234e52'

  constructor() {
    super()
    this.addInput('client', 'publicClient')
    this.addInput('address', 'address')
    this.addOutput('name', 'string')
    this.size = [180, 70]
  }

  async onExecute() {
    this.setOutputData(0, null)
  }
}

/**
 * getEnsAvatar 节点 - 获取 ENS 头像
 */
class GetEnsAvatarNode extends LGraphNode {
  static title = 'getEnsAvatar'
  static desc = 'Get ENS avatar'

  color = '#319795'
  bgcolor = '#234e52'

  constructor() {
    super()
    this.addInput('client', 'publicClient')
    this.addInput('name', 'string')
    this.addOutput('avatar', 'string')
    this.size = [180, 70]
  }

  async onExecute() {
    this.setOutputData(0, null)
  }
}

/**
 * getEnsText 节点 - 获取 ENS 文本记录
 */
class GetEnsTextNode extends LGraphNode {
  static title = 'getEnsText'
  static desc = 'Get ENS text record'

  color = '#319795'
  bgcolor = '#234e52'

  constructor() {
    super()
    this.addInput('client', 'publicClient')
    this.addInput('name', 'string')
    this.addInput('key', 'string')
    this.addOutput('value', 'string')
    this.size = [180, 90]
  }

  async onExecute() {
    this.setOutputData(0, null)
  }
}

export function registerEnsNodes() {
  LiteGraph.registerNodeType('ENS/getEnsAddress', GetEnsAddressNode)
  LiteGraph.registerNodeType('ENS/getEnsName', GetEnsNameNode)
  LiteGraph.registerNodeType('ENS/getEnsAvatar', GetEnsAvatarNode)
  LiteGraph.registerNodeType('ENS/getEnsText', GetEnsTextNode)
}

export {
  GetEnsAddressNode,
  GetEnsNameNode,
  GetEnsAvatarNode,
  GetEnsTextNode
}
