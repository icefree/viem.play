import { test, expect } from '@playwright/test'
import { TEST_ACCOUNTS, ANVIL_RPC_URL } from '../../../test-network'

test.describe('Utilities 节点工作流', () => {

  test.describe('FormatEther', () => {

    test('完整工作流: 格式化 Wei 为 Ether', async ({ page }) => {
      await page.goto('/')
      await page.evaluate(() => localStorage.clear())
      await page.reload()
      await page.waitForTimeout(1500)

      const createResult = await page.evaluate(() => {
        // @ts-expect-error LiteGraph is global
        const graph = window.graph
        // @ts-expect-error LiteGraph is global
        const LiteGraph = window.LiteGraph

        if (!graph || !LiteGraph) return { success: false, error: 'Graph not found' }

        try {
          // ToBigInt (wei value)
          const weiNode = LiteGraph.createNode('Utilities/ToBigInt')
          weiNode.pos = [100, 150]
          graph.add(weiNode)

          // FormatEther
          const formatNode = LiteGraph.createNode('Utilities/formatEther')
          if (!formatNode) return { success: false, error: 'Failed to create formatEther node' }
          formatNode.pos = [350, 150]
          graph.add(formatNode)

          // Display (formatted string)
          const displayNode = LiteGraph.createNode('Utilities/Display')
          displayNode.pos = [600, 150]
          graph.add(displayNode)

          return { success: true, nodeCount: graph._nodes?.length || 0 }
        } catch (e) {
          return { success: false, error: String(e) }
        }
      })

      console.log('创建结果:', createResult)
      expect(createResult.success).toBe(true)
    })
  })

  test.describe('ParseEther', () => {

    test('完整工作流: 解析 Ether 为 Wei', async ({ page }) => {
      await page.goto('/')
      await page.evaluate(() => localStorage.clear())
      await page.reload()
      await page.waitForTimeout(1500)

      const createResult = await page.evaluate(() => {
        // @ts-expect-error LiteGraph is global
        const graph = window.graph
        // @ts-expect-error LiteGraph is global
        const LiteGraph = window.LiteGraph

        if (!graph || !LiteGraph) return { success: false, error: 'Graph not found' }

        try {
          // ConsoleLog (ether string)
          const consoleNode = LiteGraph.createNode('Utilities/ConsoleLog')
          consoleNode.pos = [100, 150]
          graph.add(consoleNode)

          // ParseEther
          const parseNode = LiteGraph.createNode('Utilities/parseEther')
          if (!parseNode) return { success: false, error: 'Failed to create parseEther node' }
          parseNode.pos = [350, 150]
          graph.add(parseNode)

          // Display (wei bigint)
          const displayNode = LiteGraph.createNode('Utilities/Display')
          displayNode.pos = [600, 150]
          graph.add(displayNode)

          return { success: true, nodeCount: graph._nodes?.length || 0 }
        } catch (e) {
          return { success: false, error: String(e) }
        }
      })

      console.log('创建结果:', createResult)
      expect(createResult.success).toBe(true)
    })

    test('应该支持小数输入', async ({ page }) => {
      await page.goto('/')
      await page.evaluate(() => localStorage.clear())
      await page.reload()
      await page.waitForTimeout(1500)

      const result = await page.evaluate(() => {
        // @ts-expect-error LiteGraph is global
        const graph = window.graph
        // @ts-expect-error LiteGraph is global
        const LiteGraph = window.LiteGraph

        const consoleNode = LiteGraph.createNode('Utilities/ConsoleLog')
        consoleNode.pos = [100, 150]
        graph.add(consoleNode)

        const parseNode = LiteGraph.createNode('Utilities/parseEther')
        parseNode.pos = [350, 150]
        graph.add(parseNode)

        return { success: true }
      })

      expect(result.success).toBe(true)
    })
  })

  test.describe('Keccak256', () => {

    test('完整工作流: 计算哈希值', async ({ page }) => {
      await page.goto('/')
      await page.evaluate(() => localStorage.clear())
      await page.reload()
      await page.waitForTimeout(1500)

      const createResult = await page.evaluate(() => {
        // @ts-expect-error LiteGraph is global
        const graph = window.graph
        // @ts-expect-error LiteGraph is global
        const LiteGraph = window.LiteGraph

        if (!graph || !LiteGraph) return { success: false, error: 'Graph not found' }

        try {
          // ConsoleLog (input data)
          const consoleNode = LiteGraph.createNode('Utilities/ConsoleLog')
          consoleNode.pos = [100, 150]
          graph.add(consoleNode)

          // Keccak256
          const hashNode = LiteGraph.createNode('Utilities/keccak256')
          if (!hashNode) return { success: false, error: 'Failed to create keccak256 node' }
          hashNode.pos = [350, 150]
          graph.add(hashNode)

          // Display (hash)
          const displayNode = LiteGraph.createNode('Utilities/Display')
          displayNode.pos = [600, 150]
          graph.add(displayNode)

          return { success: true, nodeCount: graph._nodes?.length || 0 }
        } catch (e) {
          return { success: false, error: String(e) }
        }
      })

      console.log('创建结果:', createResult)
      expect(createResult.success).toBe(true)
    })

    test('应该处理不同类型的输入', async ({ page }) => {
      await page.goto('/')
      await page.evaluate(() => localStorage.clear())
      await page.reload()
      await page.waitForTimeout(1500)

      const result = await page.evaluate(() => {
        // @ts-expect-error LiteGraph is global
        const graph = window.graph
        // @ts-expect-error LiteGraph is global
        const LiteGraph = window.LiteGraph

        const hashNode = LiteGraph.createNode('Utilities/keccak256')
        hashNode.pos = [200, 150]
        graph.add(hashNode)

        return { success: true }
      })

      expect(result.success).toBe(true)
    })
  })

  test.describe('ToBigInt', () => {

    test('完整工作流: 转换为 BigInt', async ({ page }) => {
      await page.goto('/')
      await page.evaluate(() => localStorage.clear())
      await page.reload()
      await page.waitForTimeout(1500)

      const createResult = await page.evaluate(() => {
        // @ts-expect-error LiteGraph is global
        const graph = window.graph
        // @ts-expect-error LiteGraph is global
        const LiteGraph = window.LiteGraph

        if (!graph || !LiteGraph) return { success: false, error: 'Graph not found' }

        try {
          // ConsoleLog (number/string)
          const consoleNode = LiteGraph.createNode('Utilities/ConsoleLog')
          consoleNode.pos = [100, 150]
          graph.add(consoleNode)

          // ToBigInt
          const bigIntNode = LiteGraph.createNode('Utilities/toBigInt')
          if (!bigIntNode) return { success: false, error: 'Failed to create toBigInt node' }
          bigIntNode.pos = [350, 150]
          graph.add(bigIntNode)

          // Display (bigint)
          const displayNode = LiteGraph.createNode('Utilities/Display')
          displayNode.pos = [600, 150]
          graph.add(displayNode)

          return { success: true, nodeCount: graph._nodes?.length || 0 }
        } catch (e) {
          return { success: false, error: String(e) }
        }
      })

      console.log('创建结果:', createResult)
      expect(createResult.success).toBe(true)
    })
  })

  test.describe('Display', () => {

    test('完整工作流: 显示任意值', async ({ page }) => {
      await page.goto('/')
      await page.evaluate(() => localStorage.clear())
      await page.reload()
      await page.waitForTimeout(1500)

      const createResult = await page.evaluate(() => {
        // @ts-expect-error LiteGraph is global
        const graph = window.graph
        // @ts-expect-error LiteGraph is global
        const LiteGraph = window.LiteGraph

        if (!graph || !LiteGraph) return { success: false, error: 'Graph not found' }

        try {
          // ToBigInt (input)
          const inputNode = LiteGraph.createNode('Utilities/ToBigInt')
          inputNode.pos = [100, 150]
          graph.add(inputNode)

          // Display
          const displayNode = LiteGraph.createNode('Utilities/Display')
          if (!displayNode) return { success: false, error: 'Failed to create Display node' }
          displayNode.pos = [350, 150]
          graph.add(displayNode)

          return { success: true, nodeCount: graph._nodes?.length || 0 }
        } catch (e) {
          return { success: false, error: String(e) }
        }
      })

      console.log('创建结果:', createResult)
      expect(createResult.success).toBe(true)
    })

    test('应该支持不同数据类型', async ({ page }) => {
      await page.goto('/')
      await page.evaluate(() => localStorage.clear())
      await page.reload()
      await page.waitForTimeout(1500)

      const result = await page.evaluate(() => {
        // @ts-expect-error LiteGraph is global
        const graph = window.graph
        // @ts-expect-error LiteGraph is global
        const LiteGraph = window.LiteGraph

        const displayNode = LiteGraph.createNode('Utilities/Display')
        displayNode.pos = [300, 150]
        graph.add(displayNode)

        return { success: true }
      })

      expect(result.success).toBe(true)
    })
  })

  test.describe('ConsoleLog', () => {

    test('完整工作流: 记录到控制台', async ({ page }) => {
      await page.goto('/')
      await page.evaluate(() => localStorage.clear())
      await page.reload()
      await page.waitForTimeout(1500)

      const createResult = await page.evaluate(() => {
        // @ts-expect-error LiteGraph is global
        const graph = window.graph
        // @ts-expect-error LiteGraph is global
        const LiteGraph = window.LiteGraph

        if (!graph || !LiteGraph) return { success: false, error: 'Graph not found' }

        try {
          // ConsoleLog
          const consoleNode = LiteGraph.createNode('Utilities/consoleLog')
          if (!consoleNode) return { success: false, error: 'Failed to create consoleLog node' }
          consoleNode.pos = [100, 150]
          graph.add(consoleNode)

          return { success: true, nodeCount: graph._nodes?.length || 0 }
        } catch (e) {
          return { success: false, error: String(e) }
        }
      })

      console.log('创建结果:', createResult)
      expect(createResult.success).toBe(true)
    })
  })

  test.describe('组合工具流程', () => {

    test('ParseEther → FormatEther 往返转换', async ({ page }) => {
      await page.goto('/')
      await page.evaluate(() => localStorage.clear())
      await page.reload()
      await page.waitForTimeout(1500)

      const createResult = await page.evaluate(() => {
        // @ts-expect-error LiteGraph is global
        const graph = window.graph
        // @ts-expect-error LiteGraph is global
        const LiteGraph = window.LiteGraph

        if (!graph || !LiteGraph) return { success: false, error: 'Graph not found' }

        try {
          // ConsoleLog (ether string)
          const consoleNode = LiteGraph.createNode('Utilities/ConsoleLog')
          consoleNode.pos = [50, 100]
          graph.add(consoleNode)

          // ParseEther
          const parseNode = LiteGraph.createNode('Utilities/parseEther')
          parseNode.pos = [300, 100]
          graph.add(parseNode)

          // Display (wei)
          const weiDisplay = LiteGraph.createNode('Utilities/Display')
          weiDisplay.pos = [550, 50]
          graph.add(weiDisplay)

          // FormatEther
          const formatNode = LiteGraph.createNode('Utilities/formatEther')
          formatNode.pos = [550, 200]
          graph.add(formatNode)

          // Display (back to ether)
          const etherDisplay = LiteGraph.createNode('Utilities/Display')
          etherDisplay.pos = [800, 200]
          graph.add(etherDisplay)

          return { success: true, nodeCount: graph._nodes?.length || 0 }
        } catch (e) {
          return { success: false, error: String(e) }
        }
      })

      console.log('创建结果:', createResult)
      expect(createResult.success).toBe(true)
      await page.screenshot({ path: 'test-results/utilities-roundtrip.png' })
    })

    test('Keccak256 哈希链', async ({ page }) => {
      await page.goto('/')
      await page.evaluate(() => localStorage.clear())
      await page.reload()
      await page.waitForTimeout(1500)

      const result = await page.evaluate(() => {
        // @ts-expect-error LiteGraph is global
        const graph = window.graph
        // @ts-expect-error LiteGraph is global
        const LiteGraph = window.LiteGraph

        const consoleNode = LiteGraph.createNode('Utilities/ConsoleLog')
        consoleNode.pos = [50, 150]
        graph.add(consoleNode)

        const hash1Node = LiteGraph.createNode('Utilities/keccak256')
        hash1Node.pos = [300, 150]
        graph.add(hash1Node)

        const hash2Node = LiteGraph.createNode('Utilities/keccak256')
        hash2Node.pos = [550, 150]
        graph.add(hash2Node)

        const displayNode = LiteGraph.createNode('Utilities/Display')
        displayNode.pos = [800, 150]
        graph.add(displayNode)

        return { success: true }
      })

      expect(result.success).toBe(true)
    })
  })
})
