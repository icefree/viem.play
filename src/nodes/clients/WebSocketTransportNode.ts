import { LGraphNode } from 'litegraph.js'
import { webSocket as viemWebSocket } from 'viem'

/**
 * WebSocketTransport 节点
 */
export class WebSocketTransportNode extends LGraphNode {
  static title = 'webSocket'
  static desc = 'WebSocket transport'
  
  color = '#2d3748'
  bgcolor = '#1a202c'

  constructor() {
    super()
    this.title = 'webSocket'
    this.addInput('url', 'string')
    this.addOutput('transport', 'transport')
    this.size = [140, 40]
  }

  onExecute() {
    const url = this.getInputData(0) as string | undefined
    this.setOutputData(0, viemWebSocket(url)) 
  }
}
