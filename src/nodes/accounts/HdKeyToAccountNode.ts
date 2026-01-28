import { LGraphNode } from 'litegraph.js'
import { hdKeyToAccount, HDKey } from 'viem/accounts'

/**
 * hdKeyToAccount 节点 - 从 HD Key 创建账户
 */
export class HdKeyToAccountNode extends LGraphNode {
  static title = 'hdKeyToAccount'
  static desc = 'Create account from HD Key'

  color = '#d69e2e'
  bgcolor = '#975a16'

  private account: ReturnType<typeof hdKeyToAccount> | null = null

  constructor() {
    super()
    this.title = 'hdKeyToAccount'
    this.addInput('seed', 'bytes')
    this.addInput('path', 'string')
    this.addInput('trigger', -1)
    this.addOutput('account', 'account')
    this.addOutput('address', 'address')
    this.size = [180, 100]
    this.addProperty('accountIndex', 0, 'number')
  }

  onAction(action: string) {
    if (action === 'trigger') {
      const seed = this.getInputData(0) as Uint8Array | undefined
      const path = this.getInputData(1) as `m/44'/60'/${string}` | undefined

      if (!seed) return

      try {
        const hdKey = HDKey.fromMasterSeed(seed)
        const accountIndex = this.properties.accountIndex as number || 0
        
        if (path) {
          this.account = hdKeyToAccount(hdKey, { path })
        } else {
          this.account = hdKeyToAccount(hdKey, { accountIndex })
        }
      } catch (err) {
        console.error(err)
        this.account = null
      }
    }
  }

  onExecute() {
    this.setOutputData(0, this.account)
    this.setOutputData(1, this.account?.address ?? null)
  }
}
