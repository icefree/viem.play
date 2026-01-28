import { LGraphNode } from 'litegraph.js'
import { type Address, type Hex, verifyTypedData } from 'viem'

/**
 * verifyTypedData 节点 - 验证类型化数据签名
 */
export class VerifyTypedDataNode extends LGraphNode {
  static title = 'verifyTypedData'
  static desc = 'Verify typed data signature'

  color = '#c53030'
  bgcolor = '#742a2a'

  private isValid: boolean | null = null

  constructor() {
    super()
    this.title = 'verifyTypedData'
    this.addInput('client', 'walletClient')
    this.addInput('address', 'address')
    this.addInput('typedData', 'object')
    this.addInput('signature', 'bytes')
    this.addInput('trigger', -1)
    this.addOutput('isValid', 'boolean')
    this.size = [180, 120]
  }

  async onAction(action: string) {
    if (action === 'trigger') {
      const address = this.getInputData(1) as Address | undefined
      const typedData = this.getInputData(2) as any
      const signature = this.getInputData(3) as Hex | undefined

      if (!address || !typedData || !signature) return

      try {
        this.isValid = await verifyTypedData({
          address,
          ...typedData,
          signature
        })
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
