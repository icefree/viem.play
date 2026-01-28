import { LGraphNode } from 'litegraph.js'

/**
 * JSON 输入节点
 */
export class JsonInputNode extends LGraphNode {
  static title = 'JSON'
  static desc = 'Input JSON object or string'

  constructor() {
    super()
    this.title = 'JSON'
    this.addOutput('json', 'object')
    this.addProperty('value', '', 'string')
    this.size = [260, 60]

    this.addWidget('text', 'Value', '', (v: string) => {
      this.properties.value = v
    })
  }

  onExecute() {
    try {
      this.setOutputData(0, JSON.parse(this.properties.value))
    } catch {
      this.setOutputData(0, this.properties.value)
    }
  }
}
