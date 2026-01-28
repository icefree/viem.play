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
    this.addProperty('message', '', 'string')
    
    // 添加文本输入框，当 value 端口未连接时使用
    this.addWidget('text', 'Msg', '', (v: string) => {
      this.properties.message = v
    })

    this.size = [160, 80]
  }

  onAction() {
    const value = this.getInputData(0)
    
    // 如果有输入连接，打印输入值；否则打印属性中的消息
    if (value !== undefined) {
      console.log('[ViemPlay Action]', value)
    } else {
      console.log('[ViemPlay Action]', this.properties.message)
    }
  }
}
