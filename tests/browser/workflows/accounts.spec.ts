import { test, expect } from '@playwright/test'
import { GraphController } from '../utils/graph-utils'

test.describe('Accounts Workflows', () => {
  let graph: GraphController

  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    graph = new GraphController(page)
    await page.waitForSelector('canvas.lgraphcanvas')
  })

  test('PrivateKey To Account Workflow', async () => {
    // 1. Create Nodes
    const genKeyNode = await graph.createNode('Accounts/Utils/generatePrivateKey', { x: 100, y: 100 })
    const pkToAccountNode = await graph.createNode('Accounts/Local/privateKeyToAccount', { x: 400, y: 100 })
    const displayNode = await graph.createNode('Utilities/UI/Display', { x: 700, y: 100 })

    // 2. Connect
    // GeneratePrivateKey (out 0: privateKey) -> PrivateKeyToAccount (in 0: privateKey)
    await graph.connectNodes(genKeyNode, 0, pkToAccountNode, 0)
    // PrivateKeyToAccount (out 1: address) -> Display
    await graph.connectNodes(pkToAccountNode, 1, displayNode, 0)
    
    // 3. Trigger via Widget (Generate Button in GeneratePrivateKeyNode is widget 0)
    await graph.clickWidget(genKeyNode, 0)
    
    // 4. Verify
    // Should display an address starting with 0x
    await graph.waitForDisplayValue(displayNode, /^0x[a-fA-F0-9]{40}$/)
  })

  test('Mnemonic To Account Workflow', async () => {
    // 1. Create Nodes
    const genMnemonicNode = await graph.createNode('Accounts/Utils/generateMnemonic', { x: 100, y: 300 })
    const mnemonicToAccountNode = await graph.createNode('Accounts/Local/mnemonicToAccount', { x: 400, y: 300 })
    const displayNode = await graph.createNode('Utilities/UI/Display', { x: 700, y: 300 })

    // 2. Connect
    // GenerateMnemonic (out 0: mnemonic) -> MnemonicToAccount (in 0: mnemonic)
    await graph.connectNodes(genMnemonicNode, 0, mnemonicToAccountNode, 0)
    // MnemonicToAccount (out 1: address) -> Display
    await graph.connectNodes(mnemonicToAccountNode, 1, displayNode, 0)
    
    // 3. Trigger via Widget
    await graph.clickWidget(genMnemonicNode, 0)

    // 4. Verify
    await graph.waitForDisplayValue(displayNode, /^0x[a-fA-F0-9]{40}$/)
  })
})
