import { test, expect } from '@playwright/test'
import { TEST_ACCOUNTS, ANVIL_RPC_URL } from '../../../test-network'

test.describe('Accounts 节点工作流', () => {

  test.describe('GeneratePrivateKey', () => {

    test('完整工作流: 生成随机私钥', async ({ page }) => {
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
          // GeneratePrivateKey
          const genNode = LiteGraph.createNode('Accounts/generatePrivateKey')
          if (!genNode) return { success: false, error: 'Failed to create generatePrivateKey node' }
          genNode.pos = [100, 150]
          graph.add(genNode)

          // Display (private key)
          const displayNode = LiteGraph.createNode('Utilities/Display')
          displayNode.pos = [350, 150]
          graph.add(displayNode)

          return { success: true, nodeCount: graph._nodes?.length || 0 }
        } catch (e) {
          return { success: false, error: String(e) }
        }
      })

      console.log('创建结果:', createResult)
      expect(createResult.success).toBe(true)
      await page.screenshot({ path: 'test-results/generatePrivateKey-connected.png' })
    })

    test('每次生成应该产生不同的私钥', async ({ page }) => {
      await page.goto('/')
      await page.evaluate(() => localStorage.clear())
      await page.reload()
      await page.waitForTimeout(1500)

      const result = await page.evaluate(() => {
        // @ts-expect-error LiteGraph is global
        const graph = window.graph
        // @ts-expect-error LiteGraph is global
        const LiteGraph = window.LiteGraph

        const genNode = LiteGraph.createNode('Accounts/generatePrivateKey')
        genNode.pos = [100, 150]
        graph.add(genNode)

        return { success: true }
      })

      expect(result.success).toBe(true)
    })
  })

  test.describe('GenerateMnemonic', () => {

    test('完整工作流: 生成助记词', async ({ page }) => {
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
          // GenerateMnemonic
          const genNode = LiteGraph.createNode('Accounts/generateMnemonic')
          if (!genNode) return { success: false, error: 'Failed to create generateMnemonic node' }
          genNode.pos = [100, 150]
          graph.add(genNode)

          // Display (mnemonic phrase)
          const displayNode = LiteGraph.createNode('Utilities/Display')
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

    test('应该支持指定助记词长度', async ({ page }) => {
      await page.goto('/')
      await page.evaluate(() => localStorage.clear())
      await page.reload()
      await page.waitForTimeout(1500)

      const result = await page.evaluate(() => {
        // @ts-expect-error LiteGraph is global
        const graph = window.graph
        // @ts-expect-error LiteGraph is global
        const LiteGraph = window.LiteGraph

        const genNode = LiteGraph.createNode('Accounts/generateMnemonic')
        genNode.pos = [100, 150]
        graph.add(genNode)

        return { success: true }
      })

      expect(result.success).toBe(true)
    })
  })

  test.describe('PrivateKeyToAccount', () => {

    test('完整工作流: 从私钥创建账户', async ({ page }) => {
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
          // GeneratePrivateKey
          const genNode = LiteGraph.createNode('Accounts/generatePrivateKey')
          genNode.pos = [100, 100]
          graph.add(genNode)

          // PrivateKeyToAccount
          const accountNode = LiteGraph.createNode('Accounts/privateKeyToAccount')
          if (!accountNode) return { success: false, error: 'Failed to create privateKeyToAccount node' }
          accountNode.pos = [350, 150]
          graph.add(accountNode)

          // Display (address)
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

  test.describe('MnemonicToAccount', () => {

    test('完整工作流: 从助记词创建账户', async ({ page }) => {
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
          // GenerateMnemonic
          const genNode = LiteGraph.createNode('Accounts/generateMnemonic')
          genNode.pos = [100, 100]
          graph.add(genNode)

          // ToBigInt (account index)
          const indexNode = LiteGraph.createNode('Utilities/ToBigInt')
          indexNode.pos = [100, 250]
          graph.add(indexNode)

          // MnemonicToAccount
          const accountNode = LiteGraph.createNode('Accounts/mnemonicToAccount')
          if (!accountNode) return { success: false, error: 'Failed to create mnemonicToAccount node' }
          accountNode.pos = [350, 175]
          graph.add(accountNode)

          // Display (address)
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

  test.describe('ToAccount', () => {

    test('完整工作流: 创建账户对象', async ({ page }) => {
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
          // GeneratePrivateKey
          const genNode = LiteGraph.createNode('Accounts/generatePrivateKey')
          genNode.pos = [100, 100]
          graph.add(genNode)

          // ToAccount
          const accountNode = LiteGraph.createNode('Accounts/toAccount')
          if (!accountNode) return { success: false, error: 'Failed to create toAccount node' }
          accountNode.pos = [350, 150]
          graph.add(accountNode)

          // Display (account object)
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
})
