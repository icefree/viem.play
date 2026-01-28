import { test, expect } from '@playwright/test'
import { GraphController } from '../utils/graph-utils'

test.describe('Utilities Nodes Workflows', () => {
  let graph: GraphController

  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    graph = new GraphController(page)
    // Wait for canvas to be ready
    await page.waitForSelector('canvas.lgraphcanvas')
  })

  test('Format Ether Workflow: Text -> ToBigInt -> FormatEther -> Display', async () => {
    // 1. Create Nodes
    const textNode = await graph.createNode('Utilities/UI/Text', { x: 100, y: 200 })
    const toBigIntNode = await graph.createNode('Utilities/Helpers/toBigInt', { x: 400, y: 200 })
    const formatEtherNode = await graph.createNode('Utilities/Units/formatEther', { x: 700, y: 200 })
    const displayNode = await graph.createNode('Utilities/UI/Display', { x: 1000, y: 200 })

    // 2. Configure Text Input (1 ETH in Wei)
    await graph.setNodeProperty(textNode, 'value', '1000000000000000000')

    // 3. Connect Nodes
    await graph.connectNodes(textNode, 0, toBigIntNode, 0)
    await graph.connectNodes(toBigIntNode, 0, formatEtherNode, 0)
    await graph.connectNodes(formatEtherNode, 0, displayNode, 0)

    // 4. Wait for propagation and check result
    await graph.wait(100) // Give engine time to compute
    await graph.waitForDisplayValue(displayNode, '1')
  })

  test('Parse Ether Workflow: Text -> ParseEther -> Display', async () => {
    // 1. Create Nodes
    const textNode = await graph.createNode('Utilities/UI/Text', { x: 100, y: 400 })
    const parseEtherNode = await graph.createNode('Utilities/Units/parseEther', { x: 400, y: 400 })
    const displayNode = await graph.createNode('Utilities/UI/Display', { x: 700, y: 400 })

    // 2. Configure Text Input ('1.5')
    await graph.setNodeProperty(textNode, 'value', '1.5')

    // 3. Connect Nodes
    await graph.connectNodes(textNode, 0, parseEtherNode, 0)
    await graph.connectNodes(parseEtherNode, 0, displayNode, 0)

    // 4. Wait and check
    // 1.5 ETH = 1500000000000000000 Wei
    await graph.wait(100)
    await graph.waitForDisplayValue(displayNode, '1500000000000000000')
  })
})
