import { test, expect } from '@playwright/test'
import { ANVIL_RPC_URL } from '../../../test-network'

test.describe('GetGasPrice 节点工作流', () => {

  test('完整工作流: 通过 API 创建节点 → 连线 → 获取 Gas 价格', async ({ page }) => {
    // 清除 localStorage 防止加载旧数据
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await page.reload()
    await page.waitForTimeout(1500) // 等待 LiteGraph 完全初始化

    // ========== 1. 通过 LiteGraph API 创建节点 ==========
    const createResult = await page.evaluate(() => {
      // @ts-expect-error LiteGraph is global
      const graph = window.graph
      // @ts-expect-error LiteGraph is global
      const LiteGraph = window.LiteGraph

      if (!graph) return { success: false, error: 'Graph not found' }
      if (!LiteGraph) return { success: false, error: 'LiteGraph not found' }

      try {
        // 创建 Chain 节点 (mainnet)
        const chainNode = LiteGraph.createNode('Chains/Chain')
        if (!chainNode) return { success: false, error: 'Failed to create Chain node' }
        chainNode.pos = [100, 150]
        graph.add(chainNode)

        // 创建 HttpTransport 节点
        const httpNode = LiteGraph.createNode('Clients & Transports/Transports/http')
        if (!httpNode) return { success: false, error: 'Failed to create Http node' }
        httpNode.pos = [100, 300]
        graph.add(httpNode)

        // 创建 PublicClient 节点
        const clientNode = LiteGraph.createNode('Clients & Transports/Clients/PublicClient')
        if (!clientNode) return { success: false, error: 'Failed to create PublicClient node' }
        clientNode.pos = [350, 220]
        graph.add(clientNode)

        // 创建 getGasPrice 节点
        const gasPriceNode = LiteGraph.createNode('Public Actions/Block/getGasPrice')
        if (!gasPriceNode) return { success: false, error: 'Failed to create getGasPrice node' }
        gasPriceNode.pos = [600, 220]
        graph.add(gasPriceNode)

        return {
          success: true,
          nodeCount: graph._nodes?.length || 0,
          nodes: [chainNode.title, httpNode.title, clientNode.title, gasPriceNode.title]
        }
      } catch (e) {
        return { success: false, error: String(e) }
      }
    })

    console.log('创建结果:', createResult)

    if (!createResult.success) {
      await page.screenshot({ path: 'test-results/getGasPrice-create-failed.png' })
      expect(createResult.success).toBe(true)
      return
    }

    // ========== 2. 连接节点 ==========
    const connectResult = await page.evaluate(() => {
      // @ts-expect-error LiteGraph is global
      const graph = window.graph
      const nodes = graph._nodes || []

      // 按位置排序节点 (从左到右)
      const sortedNodes = [...nodes].sort((a: { pos: number[] }, b: { pos: number[] }) => a.pos[0] - b.pos[0])

      const chainNode = sortedNodes[0]
      const httpNode = sortedNodes[1]
      const clientNode = sortedNodes[2]
      const gasPriceNode = sortedNodes[3]

      try {
        // 连接 Chain → PublicClient
        chainNode.connect(0, clientNode, 0)

        // 连接 HttpTransport → PublicClient
        httpNode.connect(0, clientNode, 1)

        // 连接 PublicClient → getGasPrice
        clientNode.connect(0, gasPriceNode, 0)

        // 刷新画布
        // @ts-expect-error canvas is global
        window.canvas?.setDirty?.(true, true)

        return { success: true }
      } catch (e) {
        return { success: false, error: String(e) }
      }
    })

    console.log('连接结果:', connectResult)
    expect(connectResult.success).toBe(true)

    // ========== 3. Mock getInputData 注入测试配置 ==========
    const mockResult = await page.evaluate(({ url }) => {
      // @ts-expect-error LiteGraph is global
      const graph = window.graph
      const nodes = graph._nodes || []
      const sortedNodes = [...nodes].sort((a: { pos: number[] }, b: { pos: number[] }) => a.pos[0] - b.pos[0])

      const httpNode = sortedNodes[1]

      try {
        // Mock HttpTransport URL input (Index 0)
        const originalHttpInput = httpNode.getInputData
        httpNode.getInputData = function(index: number) {
          if (index === 0) {
            console.log('HttpTransport Mock Hit: returning', url)
            return url
          }
          return originalHttpInput?.call(this, index)
        }

        return { success: true, url }
      } catch (e) {
        return { success: false, error: String(e) }
      }
    }, { url: ANVIL_RPC_URL })

    console.log('Mock 结果:', mockResult)
    expect(mockResult.success).toBe(true)

    // ========== 4. 截图记录连线结果 ==========
    await page.waitForTimeout(500)
    await page.screenshot({ path: 'test-results/getGasPrice-connected.png' })

    // ========== 5. 触发执行 ==========
    const executionResult = await page.evaluate(async () => {
      // @ts-expect-error LiteGraph is global
      const graph = window.graph
      if (!graph) return { success: false, error: 'Graph not found' }

      const nodes = graph._nodes || []
      const sortedNodes = [...nodes].sort((a: { pos: number[] }, b: { pos: number[] }) => a.pos[0] - b.pos[0])
      const gasPriceNode = sortedNodes[3]

      if (!gasPriceNode) return { success: false, error: 'Node not found' }

      try {
        // 手动触发 action，模拟 Trigger 信号
        if (gasPriceNode.onAction) {
          await gasPriceNode.onAction('trigger')
          return { success: true, triggered: true }
        }
        return { success: false, error: 'onAction not method' }
      } catch (e) {
        return { success: false, error: String(e) }
      }
    })

    console.log('触发结果:', executionResult)
    expect(executionResult.success).toBe(true)

    // 等待网络请求完成
    await page.waitForTimeout(2000)

    // 运行一次图谱更新输出
    await page.evaluate(() => {
      // @ts-expect-error LiteGraph is global
      window.graph?.runStep?.()
    })

    // ========== 6. 验证结果 ==========
    const nodeOutput = await page.evaluate(() => {
      // @ts-expect-error LiteGraph is global
      const graph = window.graph
      const nodes = graph._nodes || []
      const sortedNodes = [...nodes].sort((a: { pos: number[] }, b: { pos: number[] }) => a.pos[0] - b.pos[0])
      const gasPriceNode = sortedNodes[3]

      // 获取输出数据
      const gasPriceOutput = gasPriceNode.getOutputData(0)
      const gweiOutput = gasPriceNode.getOutputData(1)

      return {
        gasPrice: gasPriceOutput !== undefined ? String(gasPriceOutput) : null,
        gwei: gweiOutput || null,
      }
    })

    console.log('节点输出:', nodeOutput)

    // ========== 7. 最终截图 ==========
    await page.screenshot({ path: 'test-results/getGasPrice-executed.png' })

    // 验证成功
    expect(connectResult.success).toBe(true)
    // 验证确实获取到了 gas 价格
    expect(nodeOutput.gasPrice).not.toBeNull()
    expect(nodeOutput.gwei).not.toBeNull()

    // Gas 价格应该大于 0
    expect(BigInt(nodeOutput.gasPrice!)).toBeGreaterThan(0n)
    // Gwei 格式化输出应该是有效的数字
    expect(parseFloat(nodeOutput.gwei!)).toBeGreaterThan(0)
  })
})
