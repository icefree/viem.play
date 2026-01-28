import { LGraphNode } from 'litegraph.js'

/**
 * Console Log 节点 - 将输入值输出到控制台
 */
export class ConsoleLogNode extends LGraphNode {
  static title = 'Console'
  static desc = 'Log value to console'
  
  color = '#744210'
  bgcolor = '#553c00'

  constructor() {
    super()
    this.title = 'Console'
    this.addInput('value', '')
    this.addInput('trigger', -1)
    this.size = [140, 50]
  }

  onAction() {
    const value = this.getInputData(0)
    console.log('[ViemPlay Action]', value)
  }
}
