import { LGraphNode } from 'litegraph.js'
import { extractChain, type Chain } from 'viem'
import * as chains from 'viem/chains'

/**
 * extractChain 节点 - 从链列表中提取链
 */
export class ExtractChainNode extends LGraphNode {
  static title = 'extractChain'
  static desc = 'Extract chain from client'

  color = '#4a5568'
  bgcolor = '#2d3748'

  constructor() {
    super()
    this.title = 'extractChain'
    this.addInput('chainId', 'number')
    this.addOutput('chain', 'chain')
    this.size = [160, 50]
  }

  onExecute() {
    const chainId = this.getInputData(0) as number | undefined
    
    if (chainId) {
      try {
        const chain = extractChain({
          chains: Object.values(chains) as Chain[],
          id: chainId
        })
        this.setOutputData(0, chain)
      } catch {
        this.setOutputData(0, null)
      }
    } else {
      this.setOutputData(0, null)
    }
  }
}
