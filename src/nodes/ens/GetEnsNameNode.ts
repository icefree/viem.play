import { LGraphNode } from 'litegraph.js'

/**
 * getEnsName 节点 - 反向解析地址到 ENS 名称
 */
export class GetEnsNameNode extends LGraphNode {
  static title = 'getEnsName'
  static desc = 'Reverse resolve address to ENS name'

  color = '#319795'
  bgcolor = '#234e52'

  constructor() {
    super()
    this.title = 'getEnsName'
    this.addInput('client', 'publicClient')
    this.addInput('address', 'address')
    this.addOutput('name', 'string')
    this.size = [180, 70]
  }

  async onExecute() {
    this.setOutputData(0, null)
  }
}
