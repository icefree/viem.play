import { test, expect } from '@playwright/test'
import { GraphController } from '../utils/graph-utils'

test.describe('Contract Workflows', () => {
  let graph: GraphController
  const ANVIL_RPC = 'http://127.0.0.1:8545'
  const ANVIL_PK_0 = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80'
  
  // Simple Counter Contract
  const ABI_STRING = '["constructor(uint256 initialValue)", "function getValue() view returns (uint256)"]'
  const BYTECODE = '0x6080604052348015600f57600080fd5b50603f80601d6000396000f3fe6080604052600080fdfea264697066735822122000000000000000000000000000000000000000000000000000000064736f6c63430008070033'

  test.beforeEach(async ({ page }) => {
    // page.on('console', msg => console.log(`BROWSER LOG: ${msg.text()}`))
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

    await graph.connectNodes(chainNode, 0, clientNode, 0)
    await graph.connectNodes(transportNode, 0, clientNode, 1)
    await graph.connectNodes(pkToAccountNode, 0, clientNode, 2)

    return clientNode
  }

    test('Deploy Contract Workflow', async () => {
    const clientNode = await setupWalletClient()
    const deployNode = await graph.createNode('Contract/Actions/deployContract', { x: 700, y: 100 })
    const parseAbiNode = await graph.createNode('ABI/Parsing/parseAbi', { x: 400, y: 0 })
    const displayNode = await graph.createNode('Utilities/UI/Display', { x: 1000, y: 100 })
    const buttonNode = await graph.createNode('Control/Button', { x: 700, y: 0 })

    // Setup ABI (ParseAbi inputs string)
    // Create Text Node for ABI JSON
    const abiTextNode = await graph.createNode('Utilities/UI/Text', { x: 100, y: 0 }) 
    // Usually Text node uses 'value' property or widget? 
    // Checking TextInputNode: properties.value.
    await graph.setNodeProperty(abiTextNode, 'value', ABI_STRING)
    
    // Setup Bytecode (Input 2 of Deploy)
    const bytecodeNode = await graph.createNode('Utilities/UI/Text', { x: 400, y: 300 })
    await graph.setNodeProperty(bytecodeNode, 'value', BYTECODE)

    // Setup Args (Input 3 of Deploy)
    const argsNode = await graph.createNode('Utilities/UI/JSON', { x: 400, y: 400 })
    await graph.setNodeProperty(argsNode, 'value', '[123]')

    // Connect
    // ABI Flow: Text -> ParseAbi -> Deploy
    await graph.connectNodes(abiTextNode, 0, parseAbiNode, 0)
    await graph.connectNodes(parseAbiNode, 0, deployNode, 1) // ABI is input 1
    
    await graph.connectNodes(clientNode, 0, deployNode, 0) // Client
    await graph.connectNodes(bytecodeNode, 0, deployNode, 2) // Bytecode
    await graph.connectNodes(argsNode, 0, deployNode, 3) // Args
    await graph.connectNodes(buttonNode, 0, deployNode, 4) // Trigger

    // Output Hash
    await graph.connectNodes(deployNode, 0, displayNode, 0)

    await graph.wait(500)
    await graph.triggerNode(buttonNode, 0)

    await graph.waitForDisplayValue(displayNode, /^0x[a-fA-F0-9]{64}$/, 15000)
  })
})
