import { LGraphNode } from 'litegraph.js'
import { type Address } from 'viem'
import { toAccount, type CustomSource } from 'viem/accounts'

/**
 * toAccount 节点 - 创建自定义本地账户 (Local)
 */
export class LocalToAccountNode extends LGraphNode {
  static title = 'toAccount (Local)'
  static desc = 'Create a custom Local Account'

  color = '#d69e2e'
  bgcolor = '#975a16'

  private account: ReturnType<typeof toAccount> | null = null

  constructor() {
    super()
    this.title = 'toAccount (Local)'
    this.addInput('address', 'address')
    this.addInput('customSource', 'object')
    this.addInput('trigger', -1)
    this.addOutput('account', 'account')
    this.size = [180, 80]
  }

  onAction(action: string) {
    if (action === 'trigger') {
      const address = this.getInputData(0) as Address | undefined
      const customSource = this.getInputData(1) as Partial<CustomSource> | undefined

      if (!address) return

      try {
        // 创建一个简单的只读账户
        this.account = toAccount({
          address,
          signMessage: customSource?.signMessage || (async () => '0x' as `0x${string}`),
          signTransaction: customSource?.signTransaction || (async () => '0x' as `0x${string}`),
          signTypedData: customSource?.signTypedData || (async () => '0x' as `0x${string}`)
        })
      } catch (err) {
        console.error(err)
        this.account = null
      }
    }
  }

  onExecute() {
    this.setOutputData(0, this.account)
  }
}
