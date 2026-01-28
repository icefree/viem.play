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

  constructor() {
    super()
    this.title = 'decodeFunctionResult'
    this.addInput('abi', 'abi')
    this.addInput('functionName', 'string')
    this.addInput('data', 'bytes')
    this.addOutput('result', 'array') // Result is usually array or single value, let's say 'any' or 'array'
    this.size = [200, 90]
  }

  onExecute() {
     const abi = this.getInputData(0) as Abi
     const functionName = this.getInputData(1) as string
     const data = this.getInputData(2) as `0x${string}`

     if (abi && functionName && data) {
        try {
            const result = decodeFunctionResult({
                abi,
                functionName,
                data
            })
            this.setOutputData(0, result)
        } catch (e) {
            this.setOutputData(0, null)
        }
     } else {
        this.setOutputData(0, null)
     }
  }
}
