import { LGraphNode } from 'litegraph.js'
import { generateMnemonic, english } from 'viem/accounts'
import { logger } from '../../stores/useLogStore'

/**
 * generateMnemonic 节点 - 生成新助记词
 */
export class GenerateMnemonicNode extends LGraphNode {
  static title = 'generateMnemonic'
  static desc = 'Generate a new mnemonic phrase'

  color = '#d69e2e'
  bgcolor = '#975a16'

  constructor() {
    super()
    this.title = 'generateMnemonic'
    this.addOutput('mnemonic', 'string')
    this.size = [180, 50]

    this.addWidget('button', 'Generate', '', () => {
      const mn = generateMnemonic(english)
      this.properties.value = mn
      logger.info('Generated new mnemonic', 'Accounts')
    })
    this.addProperty('value', '')
  }

  onExecute() {
    this.setOutputData(0, this.properties.value || null)
  }
}
