import { LGraphNode } from 'litegraph.js'
import { webSocket as viemWebSocket } from 'viem'
import { createViemLogger } from '../../utils/viemLogger'

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
    this.addProperty('url', '', 'string')
    this.size = [140, 60]

    this.addWidget('text', 'URL', this.properties.url, (v: string) => {
      this.properties.url = v
    })
  }

  onExecute() {
    const url = (this.getInputData(0) as string) || (this.properties.url as string)
    const transport = viemWebSocket(url)
    
    // Intercept requests for logging
    const { onFetchRequest, onFetchResponse } = createViemLogger('WS')
    const originalRequest = transport.request
    
    transport.request = (async (args: any) => {
      // Mock a request-like object for the logger
      onFetchRequest({ 
        url: url || 'ws://localhost', 
        method: 'POST', 
        headers: new Headers() 
      } as any)
      
      try {
        const response = await originalRequest(args)
        onFetchResponse({
          clone: () => ({ json: async () => response })
        } as any)
        return response
      } catch (error) {
        onFetchResponse({
          clone: () => ({ json: async () => ({ error }) })
        } as any)
        throw error
      }
    }) as any

    this.setOutputData(0, transport) 
  }

  onPropertyChanged(name: string, value: any) {
    if (name === 'url' && (this as any).widgets) {
      const widget = ((this as any).widgets as any[]).find((w) => w.name === 'URL')
      if (widget) {
        widget.value = value
      }
    }
    return true
  }
}
