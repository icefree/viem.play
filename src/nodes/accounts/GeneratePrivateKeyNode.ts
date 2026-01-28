import { LGraphNode } from 'litegraph.js'
import { generatePrivateKey } from 'viem/accounts'
import { logger } from '../../stores/useLogStore'

/**
 * generatePrivateKey 节点 - 生成新私钥
 */
export class GeneratePrivateKeyNode extends LGraphNode {
  static title = 'generatePrivateKey'
  static desc = 'Generate a new private key'

  color = '#d69e2e'
  bgcolor = '#975a16'

  constructor() {
    super()
    this.title = 'generatePrivateKey'
    this.addOutput('privateKey', 'string')
    this.size = [180, 50]
    
    this.addWidget('button', 'Generate', '', () => {
      const pk = generatePrivateKey()
      this.properties.value = pk
      logger.info('Generated new private key', 'Accounts')
    })
    this.addProperty('value', '')
  }

  onExecute() {
    this.setOutputData(0, this.properties.value || null)
  }

  onDrawForeground(ctx: CanvasRenderingContext2D) {
    if (this.flags.collapsed) return
    if (this.properties.value) {
      ctx.fillStyle = '#63b3ed'
      ctx.font = '10px monospace'
      ctx.fillText('PK Ready', 10, 45)
    }
  }
}
