import { LGraphNode } from 'litegraph.js'
import { http as viemHttp } from 'viem'

/**
 * HttpTransport 节点
 */
export class HttpTransportNode extends LGraphNode {
  static title = 'http'
  static desc = 'HTTP transport'
  
  color = '#2d3748'
  bgcolor = '#1a202c'

  constructor() {
    super()
    this.title = 'http'
    this.addInput('url', 'string')
    this.addOutput('transport', 'transport')
    this.size = [140, 40]
  }

  onExecute() {
    const url = this.getInputData(0) as string | undefined
    this.setOutputData(0, viemHttp(url))
  }
}
