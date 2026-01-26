import { LGraphNode, LiteGraph } from 'litegraph.js'

/**
 * parseAbi 节点 - 解析 ABI JSON
 */
class ParseAbiNode extends LGraphNode {
  static title = 'parseAbi'
  static desc = 'Parse ABI from JSON string'

  color = '#e53e3e'
  bgcolor = '#742a2a'

  constructor() {
    super()
    this.addInput('abiJson', 'string')
    this.addOutput('abi', 'abi')
    this.size = [160, 50]
  }

  onExecute() {
    const abiJson = this.getInputData(0) as string
    if (abiJson) {
      try {
        const abi = JSON.parse(abiJson)
        this.setOutputData(0, abi)
      } catch {
        this.setOutputData(0, null)
      }
    } else {
      this.setOutputData(0, null)
    }
  }
}

/**
 * encodeAbiParameters 节点 - 编码 ABI 参数
 */
class EncodeAbiParametersNode extends LGraphNode {
  static title = 'encodeAbiParameters'
  static desc = 'Encode ABI parameters'

  color = '#e53e3e'
  bgcolor = '#742a2a'

  constructor() {
    super()
    this.addInput('types', 'array')
    this.addInput('values', 'array')
    this.addOutput('encoded', 'bytes')
    this.size = [200, 70]
  }

  async onExecute() {
    // TODO: 实现 ABI 编码逻辑
    this.setOutputData(0, null)
  }
}

/**
 * decodeAbiParameters 节点 - 解码 ABI 参数
 */
class DecodeAbiParametersNode extends LGraphNode {
  static title = 'decodeAbiParameters'
  static desc = 'Decode ABI parameters'

  color = '#e53e3e'
  bgcolor = '#742a2a'

  constructor() {
    super()
    this.addInput('types', 'array')
    this.addInput('data', 'bytes')
    this.addOutput('decoded', 'array')
    this.size = [200, 70]
  }

  async onExecute() {
    this.setOutputData(0, null)
  }
}

/**
 * encodeFunctionData 节点 - 编码函数调用数据
 */
class EncodeFunctionDataNode extends LGraphNode {
  static title = 'encodeFunctionData'
  static desc = 'Encode function call data'

  color = '#e53e3e'
  bgcolor = '#742a2a'

  constructor() {
    super()
    this.addInput('abi', 'abi')
    this.addInput('functionName', 'string')
    this.addInput('args', 'array')
    this.addOutput('data', 'bytes')
    this.size = [200, 90]
  }

  async onExecute() {
    this.setOutputData(0, null)
  }
}

/**
 * decodeFunctionResult 节点 - 解码函数返回结果
 */
class DecodeFunctionResultNode extends LGraphNode {
  static title = 'decodeFunctionResult'
  static desc = 'Decode function result'

  color = '#e53e3e'
  bgcolor = '#742a2a'

  constructor() {
    super()
    this.addInput('abi', 'abi')
    this.addInput('functionName', 'string')
    this.addInput('data', 'bytes')
    this.addOutput('result', 0)
    this.size = [200, 90]
  }

  async onExecute() {
    this.setOutputData(0, null)
  }
}

/**
 * decodeEventLog 节点 - 解码事件日志
 */
class DecodeEventLogNode extends LGraphNode {
  static title = 'decodeEventLog'
  static desc = 'Decode event log'

  color = '#e53e3e'
  bgcolor = '#742a2a'

  constructor() {
    super()
    this.addInput('abi', 'abi')
    this.addInput('topics', 'array')
    this.addInput('data', 'bytes')
    this.addOutput('decoded', 'object')
    this.size = [180, 90]
  }

  async onExecute() {
    this.setOutputData(0, null)
  }
}

export function registerAbiNodes() {
  LiteGraph.registerNodeType('ABI/parseAbi', ParseAbiNode)
  LiteGraph.registerNodeType('ABI/encodeAbiParameters', EncodeAbiParametersNode)
  LiteGraph.registerNodeType('ABI/decodeAbiParameters', DecodeAbiParametersNode)
  LiteGraph.registerNodeType('ABI/encodeFunctionData', EncodeFunctionDataNode)
  LiteGraph.registerNodeType('ABI/decodeFunctionResult', DecodeFunctionResultNode)
  LiteGraph.registerNodeType('ABI/decodeEventLog', DecodeEventLogNode)
}

export {
  ParseAbiNode,
  EncodeAbiParametersNode,
  DecodeAbiParametersNode,
  EncodeFunctionDataNode,
  DecodeFunctionResultNode,
  DecodeEventLogNode
}
