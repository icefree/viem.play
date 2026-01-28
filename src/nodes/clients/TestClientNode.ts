import { LGraphNode } from 'litegraph.js'

/**
 * TestClient 节点 - 创建 viem 的 TestClient
 * 用于本地测试节点操作
 */
export class TestClientNode extends LGraphNode {
  static title = 'Test Client'
  static desc = 'Create a viem TestClient for local testing'

  color = '#805ad5'
  bgcolor = '#553c9a'

  constructor() {
    super()
    this.title = 'TestClient'
    this.addInput('chain', 'chain')
    this.addInput('transport', 'transport')
    this.addOutput('client', 'testClient')
    this.size = [180, 60]
  }

  onExecute() {
    // TestClient 用于 Anvil/Hardhat 本地节点
    this.setOutputData(0, null)
  }
}
