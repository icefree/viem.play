import { LGraphNode } from 'litegraph.js'
import { type Address, type Account } from 'viem'

/**
 * parseAccount 节点 - 解析账户（将地址转换为账户对象）
 * 
 * 注意：viem 2.x 中 parseAccount 作为一个类型工具，实际应用中
 * 我们可以简单地将地址包装成一个基础账户对象
 */
export class ParseAccountNode extends LGraphNode {
  static title = 'parseAccount'
  static desc = 'Parse an account from address'

  color = '#38a169'
  bgcolor = '#276749'

  constructor() {
    super()
    this.title = 'parseAccount'
    this.addInput('address', 'address')
    this.addOutput('account', 'account')
    this.size = [180, 50]
  }

  onExecute() {
    const address = this.getInputData(0) as Address | undefined
    
    if (address) {
      try {
        // 创建一个基本的账户对象
        const account: Account = {
          address,
          type: 'json-rpc'
        }
        this.setOutputData(0, account)
      } catch {
        this.setOutputData(0, null)
      }
    } else {
      this.setOutputData(0, null)
    }
  }
}
