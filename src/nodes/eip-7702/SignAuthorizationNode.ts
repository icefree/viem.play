import { LGraphNode } from 'litegraph.js'
import { type WalletClient, type Address } from 'viem'

/**
 * signAuthorization 节点 - 签名 EIP-7702 授权
 */
export class SignAuthorizationNode extends LGraphNode {
  static title = 'signAuthorization'
  static desc = 'Sign EIP-7702 authorization'

  color = '#667eea'
  bgcolor = '#4c51bf'

  private authorization: any = null

  constructor() {
    super()
    this.title = 'signAuthorization'
    this.addInput('client', 'walletClient')
    this.addInput('contractAddress', 'address')
    this.addInput('chainId', 'number')
    this.addInput('nonce', 'bigint')
    this.addInput('trigger', -1)
    this.addOutput('authorization', 'object')
    this.size = [200, 130]
  }

  async onAction(action: string) {
    if (action === 'trigger') {
      const client = this.getInputData(0) as WalletClient | undefined
      const contractAddress = this.getInputData(1) as Address | undefined
      const chainId = this.getInputData(2) as number | undefined
      const nonce = this.getInputData(3) as number | undefined

      if (!client || !contractAddress) return

      try {
        // @ts-expect-error - EIP-7702 might be new in types
        this.authorization = await client.signAuthorization({
          contractAddress,
          chainId,
          nonce
        })
      } catch (err) {
        console.error(err)
        this.authorization = null
      }
    }
  }

  onExecute() {
    this.setOutputData(0, this.authorization)
  }
}
