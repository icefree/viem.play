import { LGraphNode } from 'litegraph.js'

/**
 * decodeEventLog 节点 - 解码事件日志
 */
export class DecodeEventLogNode extends LGraphNode {
  static title = 'decodeEventLog'
  static desc = 'Decode event log'

  color = '#e53e3e'
  bgcolor = '#742a2a'

  constructor() {
    super()
    this.title = 'decodeEventLog'
    this.addInput('abi', 'abi')
    this.addInput('topics', 'array')
    this.addInput('data', 'bytes')
    this.addOutput('decoded', 'object')
    this.size = [180, 90]
  }

  async onExecute() {
    this.setOutputData(0, null)
  }
}
