import { test } from '@playwright/test'
import { GraphController } from '../utils/graph-utils'

test.describe('Contract Events Workflows (Anvil)', () => {
  const ANVIL_RPC = 'http://127.0.0.1:8545'
  const ANVIL_PK_0 = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'
  
  // RUNTIME BYTECODE: PUSH1 123, PUSH1 0, MSTORE, PUSH32 topic, PUSH1 32, PUSH1 0, LOG1, STOP
  const RUNTIME_BYTECODE = '0x607b6000527f002ff0672f372fbe844b353429d4510ea5e43683af134c54f75f789ff57bc0c060206000a100'
  const TARGET_ADDRESS = '0x1000000000000000000000000000000000000000'
  const ABI_STRING = '[{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"","type":"uint256"}],"name":"E","type":"event"}]'

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173')
    const canvas = page.locator('canvas').first()
    await canvas.waitFor({ state: 'visible' })
  })

  async function setupClients(graph: GraphController) {
    // Chain & Transport
    const chainNode = await graph.createNode('Chains/Chain')
    await graph.setNodeProperty(chainNode, 'chainName', 'anvil')
    
    const transportNode = await graph.createNode('Clients & Transports/Transports/http')
    await graph.setNodeProperty(transportNode, 'url', ANVIL_RPC)

    // Clients
    const publicClientNode = await graph.createNode('Clients & Transports/Clients/PublicClient')
    await graph.connectNodes(chainNode, 0, publicClientNode, 0)
    await graph.connectNodes(transportNode, 0, publicClientNode, 1)

    const walletClientNode = await graph.createNode('Clients & Transports/Clients/WalletClient')
    await graph.connectNodes(chainNode, 0, walletClientNode, 0)
    await graph.connectNodes(transportNode, 0, walletClientNode, 1)

    const testClientNode = await graph.createNode('Clients & Transports/Clients/TestClient')
    await graph.connectNodes(chainNode, 0, testClientNode, 0)
    await graph.connectNodes(transportNode, 0, testClientNode, 1)

    // Account
    const pkInputNode = await graph.createNode('Utilities/UI/Text', { x: 100, y: 300 })
    await graph.setNodeProperty(pkInputNode, 'value', ANVIL_PK_0)
    const accountNode = await graph.createNode('Accounts/Local/privateKeyToAccount', { x: 100, y: 400 })
    await graph.connectNodes(pkInputNode, 0, accountNode, 0)
    await graph.connectNodes(accountNode, 0, walletClientNode, 2)

    await graph.wait(1000)
    return { publicClientNode, walletClientNode, testClientNode }
  }

  test('Set Code and Get Contract Events', async ({ page }) => {
    const graph = new GraphController(page)
    const { publicClientNode, walletClientNode, testClientNode } = await setupClients(graph)

    // Workflow Nodes
    const setCodeNode = await graph.createNode('Test Actions/Account/setCode', { x: 700, y: 50 })
    const targetAddrNode = await graph.createNode('Utilities/UI/Text', { x: 700, y: 150 })
    await graph.setNodeProperty(targetAddrNode, 'value', TARGET_ADDRESS)
    const codeNode = await graph.createNode('Utilities/UI/Text', { x: 700, y: 300 })
    await graph.setNodeProperty(codeNode, 'value', RUNTIME_BYTECODE)

    const sendTxNode = await graph.createNode('Wallet Actions/Transaction/sendTransaction', { x: 1000, y: 50 })
    const receiptNode = await graph.createNode('Public Actions/Transaction/waitForTransactionReceipt', { x: 1300, y: 50 })
    
    const getEventsNode = await graph.createNode('Contract/Event/getContractEvents', { x: 1600, y: 50 })
    const parseAbiNode = await graph.createNode('ABI/Parsing/parseAbi', { x: 1600, y: 200 })
    const abiTextNode = await graph.createNode('Utilities/UI/Text', { x: 1600, y: 350 })
    await graph.setNodeProperty(abiTextNode, 'value', ABI_STRING)
    await graph.connectNodes(abiTextNode, 0, parseAbiNode, 0)

    const fromBlockNode = await graph.createNode('Utilities/UI/Text', { x: 1600, y: 450 })
    await graph.setNodeProperty(fromBlockNode, 'value', 'earliest')

    const displayNode = await graph.createNode('Utilities/UI/Display', { x: 1900, y: 50 })

    // Connections
    // SetCode
    await graph.connectNodes(testClientNode, 0, setCodeNode, 0)
    await graph.connectNodes(targetAddrNode, 0, setCodeNode, 1)
    await graph.connectNodes(codeNode, 0, setCodeNode, 2)

    // SendTransaction
    await graph.connectNodes(walletClientNode, 0, sendTxNode, 0)
    await graph.connectNodes(targetAddrNode, 0, sendTxNode, 1) // To

    // WaitReceipt
    await graph.connectNodes(publicClientNode, 0, receiptNode, 0)
    await graph.connectNodes(sendTxNode, 0, receiptNode, 1) // Hash (Index 1)

    // GetEvents
    await graph.connectNodes(publicClientNode, 0, getEventsNode, 0)
    await graph.connectNodes(targetAddrNode, 0, getEventsNode, 1)
    await graph.connectNodes(parseAbiNode, 0, getEventsNode, 2)
    await graph.connectNodes(fromBlockNode, 0, getEventsNode, 4) // fromBlock
    await graph.connectNodes(getEventsNode, 0, displayNode, 0)

    // Chain triggers
    await graph.connectNodes(setCodeNode, 0, sendTxNode, 4) // Done -> Trigger SendTx
    // Note: SendTransactionNode outputs hash at slot 0. receiptNode trigger is at slot 2.
    await graph.connectNodes(sendTxNode, 0, receiptNode, 2) // Hash -> Trigger Wait
    await graph.connectNodes(receiptNode, 3, getEventsNode, 5) // Done -> Trigger GetEvents

    await graph.wait(2000)

    // --- EXECUTION ---
    
    // Step A: Set Code
    await graph.triggerNodeAction(setCodeNode, 'trigger')
    
    // Step B/C: Wait for components to trigger or help them
    // Sometimes auto-trigger via slots is finicky in tests, let's ensure receipt is triggered
    await graph.wait(2000)
    await graph.triggerNodeAction(receiptNode, 'trigger')

    // Step D: Get Events should have been triggered by connection chain
    // We expect to find 123 in the events display
    await graph.waitForDisplayValue(displayNode, '123', 15000)
    
    const events = await graph.getNodeOutput(getEventsNode, 0) as any[]
    if (!events || events.length === 0) {
        throw new Error('No events found')
    }
  })
})
