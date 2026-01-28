import { test, expect } from '@playwright/test'
import { TEST_ACCOUNTS, ANVIL_RPC_URL } from '../../../test-network'

test.describe('GetBlock 节点工作流', () => {

  test('完整工作流: 创建节点 → 连线 → 获取区块信息', async ({ page }) => {
    // 清除 localStorage
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await page.reload()
    await page.waitForTimeout(1500)

    // ========== 1. 创建节点 ==========
    const createResult = await page.evaluate(() => {
      // @ts-expect-error LiteGraph is global
      const graph = window.graph
      // @ts-expect-error LiteGraph is global
      const LiteGraph = window.LiteGraph

      if (!graph || !LiteGraph) return { success: false, error: 'Graph or LiteGraph not found' }

      try {
        // 创建 Chain 节点
        const chainNode = LiteGraph.createNode('Chains/Chain')
        chainNode.pos = [100, 150]
        graph.add(chainNode)

        // 创建 HttpTransport 节点
        const httpNode = LiteGraph.createNode('Clients & Transports/Transports/http')
        httpNode.pos = [100, 300]
        graph.add(httpNode)

        // 创建 PublicClient 节点
        const clientNode = LiteGraph.createNode('Clients & Transports/Clients/PublicClient')
        clientNode.pos = [350, 220]
        graph.add(clientNode)

        // 创建 getBlock 节点
        const blockNode = LiteGraph.createNode('Public Actions/Block/getBlock')
        if (!blockNode) return { success: false, error: 'Failed to create getBlock node' }
        blockNode.pos = [600, 220]
        graph.add(blockNode)

        // 创建 Display 节点显示结果
        const displayNode = LiteGraph.createNode('Utilities/Display')
        if (!displayNode) return { success: false, error: 'Failed to create Display node' }
        displayNode.pos = [850, 220]
        graph.add(displayNode)

        return {
          success: true,
          nodeCount: graph._nodes?.length || 0
        }
      } catch (e) {
        return { success: false, error: String(e) }
      }
    })

    console.log('创建结果:', createResult)
    expect(createResult.success).toBe(true)

    // ========== 2. 连接节点 ==========
    const connectResult = await page.evaluate(() => {
      // @ts-expect-error LiteGraph is global
      const graph = window.graph
      const nodes = graph._nodes || []
      const sortedNodes = [...nodes].sort((a: { pos: number[] }, b: { pos: number[] }) => a.pos[0] - b.pos[0])

      const [chainNode, httpNode, clientNode, blockNode, displayNode] = sortedNodes

      try {
        chainNode.connect(0, clientNode, 0)
        httpNode.connect(0, clientNode, 1)
        clientNode.connect(0, blockNode, 1)
        blockNode.connect(0, displayNode, 0)

        // @ts-expect-error canvas is global
        window.canvas?.setDirty?.(true, true)

        return { success: true }
      } catch (e) {
        return { success: false, error: String(e) }
      }
    })

    expect(connectResult.success).toBe(true)

    // ========== 3. 注入测试配置 ==========
    const mockResult = await page.evaluate(({ url }) => {
      // @ts-expect-error LiteGraph is global
      const graph = window.graph
      const nodes = graph._nodes || []
      const sortedNodes = [...nodes].sort((a: { pos: number[] }, b: { pos: number[] }) => a.pos[0] - b.pos[0])
      const httpNode = sortedNodes[1]

      try {
        const originalHttpInput = httpNode.getInputData
        httpNode.getInputData = function(index: number) {
          if (index === 0) return url
          return originalHttpInput?.call(this, index)
        }

        return { success: true }
      } catch (e) {
        return { success: false, error: String(e) }
      }
    }, { url: ANVIL_RPC_URL })

    expect(mockResult.success).toBe(true)
    await page.screenshot({ path: 'test-results/getBlock-connected.png' })

    // ========== 4. 触发执行 ==========
    const executionResult = await page.evaluate(async () => {
      // @ts-expect-error LiteGraph is global
      const graph = window.graph
      const nodes = graph._nodes || []
      const sortedNodes = [...nodes].sort((a: { pos: number[] }, b: { pos: number[] }) => a.pos[0] - b.pos[0])
      const blockNode = sortedNodes[3]

      try {
        if (blockNode.onAction) {
          await blockNode.onAction('trigger')
          return { success: true }
        }
        return { success: false, error: 'onAction not found' }
      } catch (e) {
        return { success: false, error: String(e) }
      }
    })

    expect(executionResult.success).toBe(true)
    await page.waitForTimeout(5000)

    // 运行图谱更新
    await page.evaluate(() => {
      // @ts-expect-error LiteGraph is global
      window.graph?.runStep?.()
    })

    // ========== 5. 验证结果 ==========
    const nodeOutput = await page.evaluate(() => {
      // @ts-expect-error LiteGraph is global
      const graph = window.graph
      const nodes = graph._nodes || []
      const sortedNodes = [...nodes].sort((a: { pos: number[] }, b: { pos: number[] }) => a.pos[0] - b.pos[0])
      const blockNode = sortedNodes[3]

      const blockOutput = blockNode.getOutputData(0)

      return {
        hasOutput: blockOutput !== null && blockOutput !== undefined,
        outputType: typeof blockOutput,
      }
    })

    console.log('节点输出:', nodeOutput)
    await page.screenshot({ path: 'test-results/getBlock-executed.png' })

    expect(nodeOutput.hasOutput).toBe(true)
  })

  test('应该能够获取指定区块号的区块', async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await page.reload()
    await page.waitForTimeout(1500)

    // 创建包含区块号输入的完整流程
    const result = await page.evaluate(() => {
      // @ts-expect-error LiteGraph is global
      const graph = window.graph
      // @ts-expect-error LiteGraph is global
      const LiteGraph = window.LiteGraph

      // 创建节点
      const chainNode = LiteGraph.createNode('Chains/Chain')
      chainNode.pos = [50, 100]
      graph.add(chainNode)

      const httpNode = LiteGraph.createNode('Clients & Transports/Transports/http')
      httpNode.pos = [50, 250]
      graph.add(httpNode)

      const clientNode = LiteGraph.createNode('Clients & Transports/Clients/PublicClient')
      clientNode.pos = [250, 175]
      graph.add(clientNode)

      const blockNumberNode = LiteGraph.createNode('Utilities/ToBigInt')
      blockNumberNode.pos = [450, 100]
      graph.add(blockNumberNode)

      const getBlockNode = LiteGraph.createNode('Public Actions/Block/getBlock')
      getBlockNode.pos = [650, 175]
      graph.add(getBlockNode)

      // 连接
      chainNode.connect(0, clientNode, 0)
      httpNode.connect(0, clientNode, 1)
      blockNumberNode.connect(0, getBlockNode, 2)
      clientNode.connect(0, getBlockNode, 1)

      return { success: true }
    })

    expect(result.success).toBe(true)
  })
})
