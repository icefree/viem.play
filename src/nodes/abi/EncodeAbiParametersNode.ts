import { LGraphNode } from 'litegraph.js'
import { encodeAbiParameters, parseAbiParameters } from 'viem'

/**
 * encodeAbiParameters 节点 - 编码 ABI 参数
 */
export class EncodeAbiParametersNode extends LGraphNode {
  static title = 'encodeAbiParameters'
  static desc = 'Encode ABI parameters'

  color = '#e53e3e'
  bgcolor = '#742a2a'

  constructor() {
    super()
    this.title = 'encodeAbiParameters'
    this.addInput('types', 'string') // Changed to string for easier input (e.g. "uint256, string") or use JSON array
    this.addInput('values', 'array')
    this.addOutput('encoded', 'bytes')
    this.size = [200, 70]
  }

  onExecute() {
    const typesStr = this.getInputData(0) as string
    const values = this.getInputData(1) as any[]

    if (typesStr && values) {
      try {
        // Support comma separated string for simple types
        // e.g. "uint256, address"
        // Or if it's already an array (if previous node outputs array)
        // But here we define input as string for simplicity with Text node, or array if JSON.
        
        // Let's assume input 0 can be string (comma sep) or array of ABI params.
        // For simplicity, let's use parseAbiParameters which takes string like 'address, uint256'
        
        // Check if typesStr is string
        let parameters
        if (typeof typesStr === 'string') {
             // parseAbiParameters expects "type name, type name" or just types? 
             // actually parseAbiParameters(['uint256 x', 'string y'])
             // If user inputs "uint256, string", we might need to format it.
             // But valid ABI Params usually need names? No, encodeAbiParameters takes inputs: [{ type: 'uint256' }]
             
             // Simplest: User provides comma separated types string: "uint256, string"
             // We split and map to { type }.
             const types = typesStr.split(',').map(t => ({ type: t.trim() }))
             parameters = types
        } else {
             parameters = typesStr
        }

        const encoded = encodeAbiParameters(parameters, values)
        this.setOutputData(0, encoded)
      } catch (e) {
        // console.error(e)
        this.setOutputData(0, null)
      }
    } else {
        this.setOutputData(0, null)
    }
  }
}
