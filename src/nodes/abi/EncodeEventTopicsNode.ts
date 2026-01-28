import { LGraphNode } from 'litegraph.js'
import { encodeEventTopics, type Abi, type Hex } from 'viem'

/**
 * encodeEventTopics 节点 - 编码事件主题
 */
export class EncodeEventTopicsNode extends LGraphNode {
  static title = 'encodeEventTopics'
  static desc = 'Encode event topics'

  color = '#e53e3e'
  bgcolor = '#742a2a'

  private topics: Hex[] | null = null

  constructor() {
    super()
    this.title = 'encodeEventTopics'
    this.addInput('abi', 'abi')
    this.addInput('eventName', 'string')
    this.addInput('args', 'object')
    this.addInput('trigger', -1)
    this.addOutput('topics', 'array')
    this.size = [200, 100]
  }

  onAction(action: string) {
    if (action === 'trigger') {
      const abi = this.getInputData(0) as Abi | undefined
      const eventName = this.getInputData(1) as string | undefined
      const args = this.getInputData(2) as Record<string, unknown> | undefined

      if (!abi || !eventName) return

      try {
        this.topics = encodeEventTopics({
          abi,
          eventName,
          ...(args && { args })
        }) as Hex[]
      } catch (err) {
        console.error(err)
        this.topics = null
      }
    }
  }

  onExecute() {
    this.setOutputData(0, this.topics)
  }
}
