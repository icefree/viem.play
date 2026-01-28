import { test, expect } from '@playwright/test'
import { GraphController } from '../utils/graph-utils'

test.describe('ABI Workflows', () => {
  let graph: GraphController

  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    graph = new GraphController(page)
    await page.waitForSelector('canvas.lgraphcanvas')
  })

  test('ABI Parameters Encode/Decode Roundtrip', async () => {
    // 1. Create Nodes
    const textNode = await graph.createNode('Utilities/UI/Text', { x: 100, y: 100 })
    const jsonNode = await graph.createNode('Utilities/UI/JSON', { x: 100, y: 300 })
    const encodeNode = await graph.createNode('ABI/Encoding/encodeAbiParameters', { x: 400, y: 200 })
    const decodeNode = await graph.createNode('ABI/Decoding/decodeAbiParameters', { x: 700, y: 200 })
    const displayNode = await graph.createNode('Utilities/UI/Display', { x: 1000, y: 200 })

    // 2. Setup Data
    // Types: uint256, bool
    await graph.setNodeProperty(textNode, 'value', 'uint256, bool')
    // Values: [123, true]
    await graph.setNodeProperty(jsonNode, 'value', '[123, true]')

    // 3. Connect
    // Input -> Encode
    await graph.connectNodes(textNode, 0, encodeNode, 0) // types
    await graph.connectNodes(jsonNode, 0, encodeNode, 1) // values
    
    // Encode -> Decode
    await graph.connectNodes(encodeNode, 0, decodeNode, 1) // encoded -> data
    
    // Types -> Decode (Reuse text node)
    await graph.connectNodes(textNode, 0, decodeNode, 0) // types

    // Decode -> Display
    await graph.connectNodes(decodeNode, 0, displayNode, 0)

    // 4. Verify
    // Should display serialized array "123,true" or similar JSON
    await graph.wait(1000)
    // DisplayNode flattens array to string?
    // Let's expect "123" and "true" in the output
    await graph.waitForDisplayValue(displayNode, /123/)
    await graph.waitForDisplayValue(displayNode, /true/)
  })
})
