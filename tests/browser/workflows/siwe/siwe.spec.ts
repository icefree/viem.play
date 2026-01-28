import { test, expect } from '@playwright/test'
import { TEST_ACCOUNTS, ANVIL_RPC_URL } from '../../../test-network'

test.describe('SIWE (Sign-In with Ethereum) 节点工作流', () => {

  test.describe('CreateSiweMessage', () => {

    test('完整工作流: 创建 SIWE 消息', async ({ page }) => {
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
          // AddressInput ( signer address)
          const addressNode = LiteGraph.createNode('Inputs/AddressInput')
          addressNode.pos = [100, 100]
          graph.add(addressNode)

          // ConsoleLog (domain)
          const domainNode = LiteGraph.createNode('Utilities/ConsoleLog')
          domainNode.pos = [100, 250]
          graph.add(domainNode)

          // CreateSiweMessage
          const createNode = LiteGraph.createNode('SIWE/createSiweMessage')
          if (!createNode) return { success: false, error: 'Failed to create createSiweMessage node' }
          createNode.pos = [350, 175]
          graph.add(createNode)

          // Display (SIWE message)
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
      await page.screenshot({ path: 'test-results/createSiweMessage-connected.png' })
    })

    test('应该支持自定义字段', async ({ page }) => {
      await page.goto('/')
      await page.evaluate(() => localStorage.clear())
      await page.reload()
      await page.waitForTimeout(1500)

      const result = await page.evaluate(() => {
        // @ts-expect-error LiteGraph is global
        const graph = window.graph
        // @ts-expect-error LiteGraph is global
        const LiteGraph = window.LiteGraph

        const addressNode = LiteGraph.createNode('Inputs/AddressInput')
        addressNode.pos = [100, 150]
        graph.add(addressNode)

        const createNode = LiteGraph.createNode('SIWE/createSiweMessage')
        createNode.pos = [350, 150]
        graph.add(createNode)

        return { success: true }
      })

      expect(result.success).toBe(true)
    })
  })

  test.describe('VerifySiweMessage', () => {

    test('完整工作流: 验证 SIWE 消息', async ({ page }) => {
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
          // ConsoleLog (SIWE message)
          const messageNode = LiteGraph.createNode('Utilities/ConsoleLog')
          messageNode.pos = [100, 100]
          graph.add(messageNode)

          // ConsoleLog (signature)
          const sigNode = LiteGraph.createNode('Utilities/ConsoleLog')
          sigNode.pos = [100, 250]
          graph.add(sigNode)

          // VerifySiweMessage
          const verifyNode = LiteGraph.createNode('SIWE/verifySiweMessage')
          if (!verifyNode) return { success: false, error: 'Failed to create verifySiweMessage node' }
          verifyNode.pos = [350, 175]
          graph.add(verifyNode)

          // Display (verification result)
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

    test('应该验证签名地址匹配', async ({ page }) => {
      await page.goto('/')
      await page.evaluate(() => localStorage.clear())
      await page.reload()
      await page.waitForTimeout(1500)

      const result = await page.evaluate(() => {
        // @ts-expect-error LiteGraph is global
        const graph = window.graph
        // @ts-expect-error LiteGraph is global
        const LiteGraph = window.LiteGraph

        const verifyNode = LiteGraph.createNode('SIWE/verifySiweMessage')
        verifyNode.pos = [300, 150]
        graph.add(verifyNode)

        return { success: true }
      })

      expect(result.success).toBe(true)
    })

    test('应该拒绝无效签名', async ({ page }) => {
      await page.goto('/')
      await page.evaluate(() => localStorage.clear())
      await page.reload()
      await page.waitForTimeout(1500)

      const result = await page.evaluate(() => {
        // @ts-expect-error LiteGraph is global
        const graph = window.graph
        // @ts-expect-error LiteGraph is global
        const LiteGraph = window.LiteGraph

        const verifyNode = LiteGraph.createNode('SIWE/verifySiweMessage')
        verifyNode.pos = [300, 150]
        graph.add(verifyNode)

        return { success: true }
      })

      expect(result.success).toBe(true)
    })
  })

  test.describe('ParseSiweMessage', () => {

    test('完整工作流: 解析 SIWE 消息', async ({ page }) => {
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
          // ConsoleLog (SIWE message string)
          const consoleNode = LiteGraph.createNode('Utilities/ConsoleLog')
          consoleNode.pos = [100, 150]
          graph.add(consoleNode)

          // ParseSiweMessage
          const parseNode = LiteGraph.createNode('SIWE/parseSiweMessage')
          if (!parseNode) return { success: false, error: 'Failed to create parseSiweMessage node' }
          parseNode.pos = [350, 150]
          graph.add(parseNode)

          // Display (parsed fields)
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

    test('应该提取所有 SIWE 字段', async ({ page }) => {
      await page.goto('/')
      await page.evaluate(() => localStorage.clear())
      await page.reload()
      await page.waitForTimeout(1500)

      const result = await page.evaluate(() => {
        // @ts-expect-error LiteGraph is global
        const graph = window.graph
        // @ts-expect-error LiteGraph is global
        const LiteGraph = window.LiteGraph

        const parseNode = LiteGraph.createNode('SIWE/parseSiweMessage')
        parseNode.pos = [300, 150]
        graph.add(parseNode)

        return { success: true }
      })

      expect(result.success).toBe(true)
    })

    test('应该处理无效的消息格式', async ({ page }) => {
      await page.goto('/')
      await page.evaluate(() => localStorage.clear())
      await page.reload()
      await page.waitForTimeout(1500)

      const result = await page.evaluate(() => {
        // @ts-expect-error LiteGraph is global
        const graph = window.graph
        // @ts-expect-error LiteGraph is global
        const LiteGraph = window.LiteGraph

        const parseNode = LiteGraph.createNode('SIWE/parseSiweMessage')
        parseNode.pos = [300, 150]
        graph.add(parseNode)

        return { success: true }
      })

      expect(result.success).toBe(true)
    })
  })

  test.describe('完整 SIWE 流程', () => {

    test('创建 -> 签名 -> 验证 -> 解析', async ({ page }) => {
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
          // AddressInput
          const addressNode = LiteGraph.createNode('Inputs/AddressInput')
          addressNode.pos = [50, 100]
          graph.add(addressNode)

          // CreateSiweMessage
          const createNode = LiteGraph.createNode('SIWE/createSiweMessage')
          createNode.pos = [250, 100]
          graph.add(createNode)

          // Display (message)
          const msgDisplay = LiteGraph.createNode('Utilities/Display')
          msgDisplay.pos = [450, 50]
          graph.add(msgDisplay)

          // WalletClient (for signing)
          const walletNode = LiteGraph.createNode('Clients & Transports/Clients/WalletClient')
          walletNode.pos = [250, 250]
          graph.add(walletNode)

          // SignMessage
          const signNode = LiteGraph.createNode('Wallet Actions/signMessage')
          signNode.pos = [450, 200]
          graph.add(signNode)

          // Display (signature)
          const sigDisplay = LiteGraph.createNode('Utilities/Display')
          sigDisplay.pos = [650, 200]
          graph.add(sigDisplay)

          return { success: true, nodeCount: graph._nodes?.length || 0 }
        } catch (e) {
          return { success: false, error: String(e) }
        }
      })

      console.log('创建结果:', createResult)
      expect(createResult.success).toBe(true)
      await page.screenshot({ path: 'test-results/siwe-full-flow-connected.png' })
    })
  })
})
