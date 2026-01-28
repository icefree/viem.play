import { LGraphNode } from 'litegraph.js'
import { decodeFunctionResult, type Abi } from 'viem'

/**
 * decodeFunctionResult 节点 - 解码函数返回结果
 */
export class DecodeFunctionResultNode extends LGraphNode {
  static title = 'decodeFunctionResult'
  static desc = 'Decode function result'

  color = '#e53e3e'
  bgcolor = '#742a2a'

  private result: any = null

  constructor() {
    super()
    this.title = 'decodeFunctionResult'
    this.addInput('abi', 'abi')
    this.addInput('functionName', 'string')
    this.addInput('data', 'bytes')
    this.addInput('trigger', -1)
    this.addOutput('result', 'array') 
    this.size = [200, 110]
  }

  onAction(action: string) {
    if (action === 'trigger') {
       const abi = this.getInputData(0) as Abi
       const functionName = this.getInputData(1) as string
       const data = this.getInputData(2) as `0x${string}`

       if (abi && functionName && data) {
          try {
              this.result = decodeFunctionResult({
                  abi,
                  functionName,
                  data
              })
          } catch (e) {
              this.result = null
          }
       } else {
          this.result = null
       }
    }
  }

  onExecute() {
    this.setOutputData(0, this.result)
  }
}
