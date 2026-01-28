import { LGraphNode } from 'litegraph.js'
import { verifyAuthorization } from 'viem/experimental'

/**
 * verifyAuthorization 节点 - 验证 EIP-7702 授权
 */
export class VerifyAuthorizationNode extends LGraphNode {
  static title = 'verifyAuthorization'
  static desc = 'Check if EIP-7702 authorization is valid'

  color = '#667eea'
  bgcolor = '#4c51bf'

  private isValid: boolean | null = null

  constructor() {
    super()
    this.title = 'verifyAuthorization'
    this.addInput('authorization', 'object')
    this.addInput('trigger', -1)
    this.addOutput('isValid', 'boolean')
    this.size = [200, 80]
  }

  async onAction(action: string) {
    if (action === 'trigger') {
      const authorization = this.getInputData(0)
      if (!authorization) return

      try {
        // @ts-expect-error - eip7702 is experimental
        this.isValid = await verifyAuthorization({ authorization })
      } catch (err) {
        console.error(err)
        this.isValid = false
      }
    }
  }

  onExecute() {
    this.setOutputData(0, this.isValid)
  }
}
