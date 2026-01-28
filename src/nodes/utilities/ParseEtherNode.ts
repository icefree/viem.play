import { LGraphNode } from 'litegraph.js'
import { parseEther as viemParseEther } from 'viem'

/**
 * Parse Ether 节点
 */
export class ParseEtherNode extends LGraphNode {
  static title = 'parseEther'
  static desc = 'Parse ether string to wei'

  color = '#38a169'
  bgcolor = '#276749'

  private wei: bigint | null = null

  constructor() {
    super()
    this.title = 'parseEther'
    this.addInput('ether', 'string')
    this.addInput('trigger', -1)
    this.addOutput('wei', 'bigint')
    this.size = [160, 80]
  }

  onAction(action: string) {
    if (action === 'trigger') {
      const ether = this.getInputData(0) as string | undefined
      if (ether && typeof ether === 'string') {
        try {
          this.wei = viemParseEther(ether)
        } catch {
          this.wei = null
        }
      } else {
        this.wei = null
      }
    }
  }

  onExecute() {
    // If no trigger connected, maybe we want reactive behavior?
    // But consistent with other "verb" nodes, we'll wait for trigger.
    this.setOutputData(0, this.wei)
  }
}
