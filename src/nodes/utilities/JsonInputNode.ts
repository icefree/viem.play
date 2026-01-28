import { LGraphNode } from 'litegraph.js'

/**
 * JSON 输入节点 - 允许用户输入 object/array
 */
export class JsonInputNode extends LGraphNode {
  static title = 'JSON'
  static desc = 'Input JSON object/array'

  constructor() {
    super()
    this.title = 'JSON'
    this.addOutput('value', 'object,array')
    this.addProperty('value', '')
    this.size = [220, 60]

    this.addWidget('text', 'JSON', '', (v: string) => {
      this.properties.value = v
    }, {})
  }

  onExecute() {
    const value = this.properties.value as string
    if (!value) {
      this.setOutputData(0, null)
      return
    }
    try {
      const parsed = JSON.parse(value)
      if (parsed !== null && (Array.isArray(parsed) || typeof parsed === 'object')) {
        this.setOutputData(0, parsed)
      } else {
        this.setOutputData(0, null)
      }
    } catch {
      this.setOutputData(0, null)
    }
  }
}
