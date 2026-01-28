import { LGraphNode } from 'litegraph.js'
import { decodeEventLog, type Abi } from 'viem'

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

  onExecute() {
    const abi = this.getInputData(0) as Abi
    const topics = this.getInputData(1) as [string, ...string[]] | []
    const data = this.getInputData(2) as `0x${string}`

    if (abi && topics && data) {
         try {
             // topics might need casting from generic array
             const decoded = decodeEventLog({
                 abi,
                 data,
                 topics: topics as any
             })
             this.setOutputData(0, decoded)
         } catch (e) {
             this.setOutputData(0, null)
         }
    } else {
         this.setOutputData(0, null)
    }
  }
}
