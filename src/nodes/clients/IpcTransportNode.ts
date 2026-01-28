import { LGraphNode } from 'litegraph.js'

/**
 * IpcTransport 节点 - 用于通过 IPC 连接到区块链节点
 * 注意：此 Transport 通常仅在 Node.js 环境下有效
 */
export class IpcTransportNode extends LGraphNode {
  static title = 'ipc'
  static desc = 'IPC transport (Typically Node.js only)'
  
  color = '#2d3748'
  bgcolor = '#1a202c'

  constructor() {
    super()
    this.title = 'ipc'
    this.addInput('path', 'string')
    this.addOutput('transport', 'transport')
    this.addProperty('path', '/tmp/reth.ipc', 'string')
    this.size = [180, 60]

    this.addWidget('text', 'Path', this.properties.path, (v: string) => {
      this.properties.path = v
    })
  }

  async onExecute() {
    const path = (this.getInputData(0) as string) || (this.properties.path as string)
    
    try {
      // 动态导入以避免在非 Node 环境下静态链接错误
      // @ts-ignore - viem/node might not be available in browser bundle
      const { ipc } = await import('viem/node')
      
      this.setOutputData(0, ipc(path))
    } catch (e) {
      // 在浏览器环境中，这通常会失败
      if (!this.properties._warned) {
        console.warn('IPC Transport is not supported in this environment (Browser).', e)
        this.properties._warned = true
      }
      this.setOutputData(0, null)
    }
  }

  onPropertyChanged(name: string, value: any) {
    if (name === 'path' && (this as any).widgets) {
      const widget = ((this as any).widgets as any[]).find((w) => w.name === 'Path')
      if (widget) {
        widget.value = value
      }
    }
    return true
  }
}
