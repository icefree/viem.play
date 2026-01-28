import { LGraphNode, LiteGraph } from 'litegraph.js'
import { custom, type EIP1193Provider } from 'viem'

/**
 * CustomTransport 节点 - 创建自定义 (EIP-1193) 传输
 */
export class CustomTransportNode extends LGraphNode {
  static title = 'custom'
  static desc = 'Custom (EIP-1193) transport'

  color = '#2d3748'
  bgcolor = '#1a202c'

  private transport: ReturnType<typeof custom> | null = null

  constructor() {
    super()
    this.title = 'custom'
    this.addInput('provider', 'object')
    this.addOutput('transport', 'transport')
    this.size = [160, 50]
  }

  onExecute() {
    const provider = this.getInputData(0) as EIP1193Provider | undefined
    
    // 如果没有连接任何 provider，尝试使用 window.ethereum
    const finalProvider = provider || (typeof window !== 'undefined' ? (window as any).ethereum : null)

    if (finalProvider) {
      try {
        this.transport = custom(finalProvider)
        this.setOutputData(0, this.transport)
      } catch {
        this.setOutputData(0, null)
      }
    } else {
      this.setOutputData(0, null)
    }
  }
}

// 自动注册
LiteGraph.registerNodeType('Clients & Transports/Transports/custom', CustomTransportNode)
