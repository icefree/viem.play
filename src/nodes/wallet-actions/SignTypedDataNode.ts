import { LGraphNode } from 'litegraph.js'
import { type WalletClient } from 'viem'

/**
 * signTypedData 节点 - 签名类型化数据
 */
export class SignTypedDataNode extends LGraphNode {
  static title = 'signTypedData'
  static desc = 'Sign typed data (EIP-712)'

  color = '#c53030'
  bgcolor = '#742a2a'

  constructor() {
    super()
    this.title = 'signTypedData'
    this.addInput('client', 'walletClient')
    this.addInput('typedData', 'object')
    this.addInput('trigger', -1)
    this.addOutput('signature', 'string')
    this.size = [180, 80]
  }

  async onAction(action: string) {
    if (action === 'trigger') {
      const client = this.getInputData(0) as WalletClient | undefined
      const typedData = this.getInputData(1)

      if (!client || !typedData) return

      try {
        // @ts-expect-error
        const sig = await client.signTypedData(typedData)
        this.setOutputData(0, sig)
      } catch (err) {
        console.error(err)
      }
    }
  }
}
