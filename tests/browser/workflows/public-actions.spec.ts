import { test, expect } from '@playwright/test'
import { GraphController } from '../utils/graph-utils'

test.describe('Public Actions Workflows', () => {
  let graph: GraphController
  const ANVIL_RPC = 'http://127.0.0.1:8545'
  const ANVIL_ACCOUNT_0 = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'

  test.beforeEach(async ({ page }) => {
    // page.on('console', msg => console.log(`BROWSER LOG: ${msg.text()}`))
    await page.goto('/')
    graph = new GraphController(page)
    await page.waitForSelector('canvas.lgraphcanvas')
  })

  async function setupAnvilClient() {
    const chainNode = await graph.createNode('Chains/Chain', { x: 100, y: 100 })
    const transportNode = await graph.createNode('Clients & Transports/Transports/http', { x: 100, y: 300 })
    const clientNode = await graph.createNode('Clients & Transports/Clients/PublicClient', { x: 400, y: 200 })

    await graph.setNodeProperty(chainNode, 'chainName', 'anvil')
    await graph.setNodeProperty(transportNode, 'url', ANVIL_RPC)

    await graph.connectNodes(chainNode, 0, clientNode, 0)
    await graph.connectNodes(transportNode, 0, clientNode, 1)

    return clientNode
  }

  test('GetBlockNumber Workflow', async () => {
    const clientNode = await setupAnvilClient()
    const getBlockNumNode = await graph.createNode('Public Actions/Block/getBlockNumber', { x: 700, y: 100 })
    const displayNode = await graph.createNode('Utilities/UI/Display', { x: 1000, y: 100 })
    const buttonNode = await graph.createNode('Control/Button', { x: 700, y: 0 })

    await graph.connectNodes(clientNode, 0, getBlockNumNode, 0)
    await graph.connectNodes(getBlockNumNode, 0, displayNode, 0)
    await graph.connectNodes(buttonNode, 0, getBlockNumNode, 1)

    await graph.wait(500)
    await graph.triggerNode(buttonNode, 0)
    await graph.waitForDisplayValue(displayNode, /\d+/)
  })

  test('GetBalance Workflow', async () => {
    const clientNode = await setupAnvilClient()
    const getBalanceNode = await graph.createNode('Public Actions/Account/getBalance', { x: 700, y: 400 })
    const addressNode = await graph.createNode('Utilities/UI/Address', { x: 400, y: 550 }) 
    const displayNode = await graph.createNode('Utilities/UI/Display', { x: 1000, y: 400 })
    const buttonNode = await graph.createNode('Control/Button', { x: 700, y: 300 })

    await graph.setNodeProperty(addressNode, 'value', ANVIL_ACCOUNT_0)

    await graph.connectNodes(clientNode, 0, getBalanceNode, 0)
    await graph.connectNodes(addressNode, 0, getBalanceNode, 1)
    await graph.connectNodes(getBalanceNode, 0, displayNode, 0)
    await graph.connectNodes(buttonNode, 0, getBalanceNode, 2)

    await graph.wait(500)
    await graph.triggerNode(buttonNode, 0)
    await graph.waitForDisplayValue(displayNode, /10000000000000000000000/)
  })

  test('GetGasPrice Workflow', async () => {
    const clientNode = await setupAnvilClient()
    const getGasPriceNode = await graph.createNode('Public Actions/Other/getGasPrice', { x: 700, y: 700 })
    const displayNode = await graph.createNode('Utilities/UI/Display', { x: 1000, y: 700 })
    const buttonNode = await graph.createNode('Control/Button', { x: 700, y: 600 })

    await graph.connectNodes(clientNode, 0, getGasPriceNode, 0)
    await graph.connectNodes(getGasPriceNode, 0, displayNode, 0)
    await graph.connectNodes(buttonNode, 0, getGasPriceNode, 1)

    await graph.wait(500)
    await graph.triggerNode(buttonNode, 0)
    await graph.waitForDisplayValue(displayNode, /\d+/)
  })
})
