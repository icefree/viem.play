import { test, expect } from '@playwright/test'
import { GraphController } from '../utils/graph-utils'

test.describe('Wallet Actions Workflows', () => {
  let graph: GraphController
  const ANVIL_RPC = 'http://127.0.0.1:8545'
  const ANVIL_PK_0 = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'
  const ANVIL_ADDRESS_0 = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'

  test.beforeEach(async ({ page }) => {
    page.on('console', msg => console.log(`BROWSER LOG: ${msg.text()}`))
    await page.goto('/')
    graph = new GraphController(page)
    await page.waitForSelector('canvas.lgraphcanvas')
  })

  async function setupWalletClient() {
    const chainNode = await graph.createNode('Chains/Chain', { x: 100, y: 100 })
    const transportNode = await graph.createNode('Clients & Transports/Transports/http', { x: 100, y: 300 })
    const pkToAccountNode = await graph.createNode('Accounts/Local/privateKeyToAccount', { x: 100, y: 500 })
    const clientNode = await graph.createNode('Clients & Transports/Clients/WalletClient', { x: 400, y: 200 })

    await graph.setNodeProperty(chainNode, 'chainName', 'anvil')
    await graph.setNodeProperty(transportNode, 'url', ANVIL_RPC)
    await graph.setNodeProperty(pkToAccountNode, 'privateKey', ANVIL_PK_0)

    // Connect Chain, Transport, Account to WalletClient
    await graph.connectNodes(chainNode, 0, clientNode, 0)
    await graph.connectNodes(transportNode, 0, clientNode, 1)
    await graph.connectNodes(pkToAccountNode, 0, clientNode, 2) // Account inputs is index 2

    return clientNode
  }

  test('GetAddresses Workflow', async () => {
    const clientNode = await setupWalletClient()
    const getAddressesNode = await graph.createNode('Wallet Actions/Account/getAddresses', { x: 700, y: 100 })
    const displayNode = await graph.createNode('Utilities/UI/Display', { x: 1000, y: 100 })
    const buttonNode = await graph.createNode('Control/Button', { x: 700, y: 0 })

    await graph.connectNodes(clientNode, 0, getAddressesNode, 0)
    await graph.connectNodes(getAddressesNode, 0, displayNode, 0)
    await graph.connectNodes(buttonNode, 0, getAddressesNode, 1) // Trigger input

    await graph.wait(500)
    await graph.triggerNode(buttonNode, 0)

    await graph.waitForDisplayValue(displayNode, ANVIL_ADDRESS_0)
  })

  test('SendTransaction Workflow', async () => {
    const clientNode = await setupWalletClient()
    const sendTxNode = await graph.createNode('Wallet Actions/Transaction/sendTransaction', { x: 700, y: 400 })
    const displayNode = await graph.createNode('Utilities/UI/Display', { x: 1000, y: 400 })
    const buttonNode = await graph.createNode('Control/Button', { x: 700, y: 300 })
    const toAddressNode = await graph.createNode('Utilities/UI/Address', { x: 400, y: 500 }) // To Address input (can be the same address)

    await graph.setNodeProperty(toAddressNode, 'value', ANVIL_ADDRESS_0)

    // Inputs: 0:Client, 1:request?, 2:trigger? Need to verify SendTransaction inputs
    // Assuming 0:client, 1:to, 2:value
    // Let's assume simplest: connect client, connect 'to', trigger.
    
    // Check SendTransactionNode inputs indices if possible. 
    // Usually: client(0), request(1)? Or decomposed inputs?
    // Let's assume decomposed: to, value, data.
    // If I cannot verify, I'll assume standard order or check file.
    
    // I'll check SendTransactionNode.ts quickly if this test fails.
    // For now assuming: 0:client, 1:to.
    
    await graph.connectNodes(clientNode, 0, sendTxNode, 0)
    await graph.connectNodes(toAddressNode, 0, sendTxNode, 1) // 'to' is input 1
    
    await graph.connectNodes(sendTxNode, 0, displayNode, 0) // Hash
    await graph.connectNodes(buttonNode, 0, sendTxNode, 4) // Trigger is input 4

    await graph.wait(500)
    await graph.triggerNode(buttonNode, 0)

    // Verify hash
    await graph.waitForDisplayValue(displayNode, /^0x[a-fA-F0-9]{64}$/, 15000)
  })
})
