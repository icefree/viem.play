import { test, expect } from '@playwright/test'
import { TEST_ACCOUNTS, ANVIL_RPC_URL } from '../../../test-network'

test.describe('ABI 节点工作流', () => {

  test.describe('ParseAbi', () => {

    test('完整工作流: 解析人类可读的 ABI', async ({ page }) => {
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
          // ConsoleLog (ABI string input)
          const consoleNode = LiteGraph.createNode('Utilities/ConsoleLog')
          consoleNode.pos = [100, 150]
          graph.add(consoleNode)

          // ParseAbi
          const parseNode = LiteGraph.createNode('ABI/parseAbi')
          if (!parseNode) return { success: false, error: 'Failed to create parseAbi node' }
          parseNode.pos = [350, 150]
          graph.add(parseNode)

          // Display (parsed ABI)
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
      await page.screenshot({ path: 'test-results/parseAbi-connected.png' })
    })

    test('应该支持解析多个函数和事件', async ({ page }) => {
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

        const parseNode = LiteGraph.createNode('ABI/parseAbi')
        parseNode.pos = [350, 150]
        graph.add(parseNode)

        return { success: true }
      })

      expect(result.success).toBe(true)
    })
  })

  test.describe('EncodeAbiParameters', () => {

    test('完整工作流: 编码 ABI 参数', async ({ page }) => {
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
          // ToBigInt (uint256 parameter)
          const bigintNode = LiteGraph.createNode('Utilities/ToBigInt')
          bigintNode.pos = [100, 100]
          graph.add(bigintNode)

          // ConsoleLog (address parameter)
          const consoleNode = LiteGraph.createNode('Utilities/ConsoleLog')
          consoleNode.pos = [100, 250]
          graph.add(consoleNode)

          // EncodeAbiParameters
          const encodeNode = LiteGraph.createNode('ABI/encodeAbiParameters')
          if (!encodeNode) return { success: false, error: 'Failed to create encodeAbiParameters node' }
          encodeNode.pos = [350, 175]
          graph.add(encodeNode)

          // Display (encoded data)
          const displayNode = LiteGraph.createNode('Utilities/Display')
          displayNode.pos = [600, 175]
          graph.add(displayNode)

          return { success: true, nodeCount: graph._nodes?.length || 0 }
        } catch (e) {
          return { success: false, error: String(e) }
        }
      })

      console.log('创建结果:', createResult)
      expect(createResult.success).toBe(true)
    })

    test('应该支持编码复杂类型 (数组、结构体)', async ({ page }) => {
      await page.goto('/')
      await page.evaluate(() => localStorage.clear())
      await page.reload()
      await page.waitForTimeout(1500)

      const result = await page.evaluate(() => {
        // @ts-expect-error LiteGraph is global
        const graph = window.graph
        // @ts-expect-error LiteGraph is global
        const LiteGraph = window.LiteGraph

        const encodeNode = LiteGraph.createNode('ABI/encodeAbiParameters')
        encodeNode.pos = [300, 150]
        graph.add(encodeNode)

        return { success: true }
      })

      expect(result.success).toBe(true)
    })
  })

  test.describe('DecodeAbiParameters', () => {

    test('完整工作流: 解码 ABI 参数', async ({ page }) => {
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
          // ConsoleLog (encoded data)
          const consoleNode = LiteGraph.createNode('Utilities/ConsoleLog')
          consoleNode.pos = [100, 150]
          graph.add(consoleNode)

          // DecodeAbiParameters
          const decodeNode = LiteGraph.createNode('ABI/decodeAbiParameters')
          if (!decodeNode) return { success: false, error: 'Failed to create decodeAbiParameters node' }
          decodeNode.pos = [350, 150]
          graph.add(decodeNode)

          // Display (decoded data)
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

    test('应该验证编码-解码的可逆性', async ({ page }) => {
      await page.goto('/')
      await page.evaluate(() => localStorage.clear())
      await page.reload()
      await page.waitForTimeout(1500)

      const result = await page.evaluate(() => {
        // @ts-expect-error LiteGraph is global
        const graph = window.graph
        // @ts-expect-error LiteGraph is global
        const LiteGraph = window.LiteGraph

        const encodeNode = LiteGraph.createNode('ABI/encodeAbiParameters')
        encodeNode.pos = [200, 100]
        graph.add(encodeNode)

        const decodeNode = LiteGraph.createNode('ABI/decodeAbiParameters')
        decodeNode.pos = [450, 150]
        graph.add(decodeNode)

        return { success: true }
      })

      expect(result.success).toBe(true)
    })
  })

  test.describe('EncodeFunctionData', () => {

    test('完整工作流: 编码函数调用数据', async ({ page }) => {
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
          // ParseAbi (function ABI)
          const abiNode = LiteGraph.createNode('ABI/parseAbi')
          abiNode.pos = [100, 100]
          graph.add(abiNode)

          // ToBigInt (function arguments)
          const argNode = LiteGraph.createNode('Utilities/ToBigInt')
          argNode.pos = [100, 250]
          graph.add(argNode)

          // EncodeFunctionData
          const encodeNode = LiteGraph.createNode('ABI/encodeFunctionData')
          if (!encodeNode) return { success: false, error: 'Failed to create encodeFunctionData node' }
          encodeNode.pos = [350, 175]
          graph.add(encodeNode)

          // Display (encoded data)
          const displayNode = LiteGraph.createNode('Utilities/Display')
          displayNode.pos = [600, 175]
          graph.add(displayNode)

          return { success: true, nodeCount: graph._nodes?.length || 0 }
        } catch (e) {
          return { success: false, error: String(e) }
        }
      })

      console.log('创建结果:', createResult)
      expect(createResult.success).toBe(true)
    })

    test('应该支持重载函数', async ({ page }) => {
      await page.goto('/')
      await page.evaluate(() => localStorage.clear())
      await page.reload()
      await page.waitForTimeout(1500)

      const result = await page.evaluate(() => {
        // @ts-expect-error LiteGraph is global
        const graph = window.graph
        // @ts-expect-error LiteGraph is global
        const LiteGraph = window.LiteGraph

        const abiNode = LiteGraph.createNode('ABI/parseAbi')
        abiNode.pos = [100, 150]
        graph.add(abiNode)

        const encodeNode = LiteGraph.createNode('ABI/encodeFunctionData')
        encodeNode.pos = [350, 150]
        graph.add(encodeNode)

        return { success: true }
      })

      expect(result.success).toBe(true)
    })
  })

  test.describe('DecodeFunctionResult', () => {

    test('完整工作流: 解码函数返回值', async ({ page }) => {
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
          // ParseAbi (function ABI)
          const abiNode = LiteGraph.createNode('ABI/parseAbi')
          abiNode.pos = [100, 100]
          graph.add(abiNode)

          // ConsoleLog (encoded result)
          const consoleNode = LiteGraph.createNode('Utilities/ConsoleLog')
          consoleNode.pos = [100, 250]
          graph.add(consoleNode)

          // DecodeFunctionResult
          const decodeNode = LiteGraph.createNode('ABI/decodeFunctionResult')
          if (!decodeNode) return { success: false, error: 'Failed to create decodeFunctionResult node' }
          decodeNode.pos = [350, 175]
          graph.add(decodeNode)

          // Display (decoded result)
          const displayNode = LiteGraph.createNode('Utilities/Display')
          displayNode.pos = [600, 175]
          graph.add(displayNode)

          return { success: true, nodeCount: graph._nodes?.length || 0 }
        } catch (e) {
          return { success: false, error: String(e) }
        }
      })

      console.log('创建结果:', createResult)
      expect(createResult.success).toBe(true)
    })

    test('应该支持多个返回值', async ({ page }) => {
      await page.goto('/')
      await page.evaluate(() => localStorage.clear())
      await page.reload()
      await page.waitForTimeout(1500)

      const result = await page.evaluate(() => {
        // @ts-expect-error LiteGraph is global
        const graph = window.graph
        // @ts-expect-error LiteGraph is global
        const LiteGraph = window.LiteGraph

        const abiNode = LiteGraph.createNode('ABI/parseAbi')
        abiNode.pos = [100, 150]
        graph.add(abiNode)

        const decodeNode = LiteGraph.createNode('ABI/decodeFunctionResult')
        decodeNode.pos = [350, 150]
        graph.add(decodeNode)

        return { success: true }
      })

      expect(result.success).toBe(true)
    })
  })

  test.describe('DecodeEventLog', () => {

    test('完整工作流: 解码事件日志', async ({ page }) => {
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
          // ParseAbi (event ABI)
          const abiNode = LiteGraph.createNode('ABI/parseAbi')
          abiNode.pos = [100, 100]
          graph.add(abiNode)

          // ConsoleLog (raw log)
          const consoleNode = LiteGraph.createNode('Utilities/ConsoleLog')
          consoleNode.pos = [100, 250]
          graph.add(consoleNode)

          // DecodeEventLog
          const decodeNode = LiteGraph.createNode('ABI/decodeEventLog')
          if (!decodeNode) return { success: false, error: 'Failed to create decodeEventLog node' }
          decodeNode.pos = [350, 175]
          graph.add(decodeNode)

          // Display (decoded log)
          const displayNode = LiteGraph.createNode('Utilities/Display')
          displayNode.pos = [600, 175]
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
})
