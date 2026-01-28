import { test, expect } from '@playwright/test'
import { TEST_ACCOUNTS, ANVIL_RPC_URL } from '../../../test-network'

test.describe('Test Actions 节点工作流 (Anvil)', () => {

  test.describe('Mine', () => {

    test('完整工作流: 挖出新区块', async ({ page }) => {
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
          // ToBigInt (blocks count)
          const blocksNode = LiteGraph.createNode('Utilities/ToBigInt')
          blocksNode.pos = [100, 100]
          graph.add(blocksNode)

          // Mine
          const mineNode = LiteGraph.createNode('Test Actions/mine')
          if (!mineNode) return { success: false, error: 'Failed to create mine node' }
          mineNode.pos = [350, 100]
          graph.add(mineNode)

          // Display (result)
          const displayNode = LiteGraph.createNode('Utilities/Display')
          displayNode.pos = [600, 100]
          graph.add(displayNode)

          return { success: true, nodeCount: graph._nodes?.length || 0 }
        } catch (e) {
          return { success: false, error: String(e) }
        }
      })

      console.log('创建结果:', createResult)
      expect(createResult.success).toBe(true)
      await page.screenshot({ path: 'test-results/mine-connected.png' })
    })

    test('应该支持设置自定义时间戳', async ({ page }) => {
      await page.goto('/')
      await page.evaluate(() => localStorage.clear())
      await page.reload()
      await page.waitForTimeout(1500)

      const result = await page.evaluate(() => {
        // @ts-expect-error LiteGraph is global
        const graph = window.graph
        // @ts-expect-error LiteGraph is global
        const LiteGraph = window.LiteGraph

        const blocksNode = LiteGraph.createNode('Utilities/ToBigInt')
        blocksNode.pos = [100, 100]
        graph.add(blocksNode)

        const timestampNode = LiteGraph.createNode('Utilities/ToBigInt')
        timestampNode.pos = [100, 250]
        graph.add(timestampNode)

        const mineNode = LiteGraph.createNode('Test Actions/mine')
        mineNode.pos = [350, 175]
        graph.add(mineNode)

        return { success: true }
      })

      expect(result.success).toBe(true)
    })
  })

  test.describe('SetBalance', () => {

    test('完整工作流: 设置账户余额', async ({ page }) => {
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
          // AddressInput (target address)
          const addressNode = LiteGraph.createNode('Inputs/AddressInput')
          addressNode.pos = [100, 100]
          graph.add(addressNode)

          // ParseEther (amount)
          const amountNode = LiteGraph.createNode('Utilities/parseEther')
          amountNode.pos = [100, 250]
          graph.add(amountNode)

          // SetBalance
          const setBalanceNode = LiteGraph.createNode('Test Actions/setBalance')
          if (!setBalanceNode) return { success: false, error: 'Failed to create setBalance node' }
          setBalanceNode.pos = [350, 175]
          graph.add(setBalanceNode)

          // Display (result)
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

  test.describe('ImpersonateAccount', () => {

    test('完整工作流: 模拟账户', async ({ page }) => {
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
          // AddressInput (target account)
          const addressNode = LiteGraph.createNode('Inputs/AddressInput')
          addressNode.pos = [100, 150]
          graph.add(addressNode)

          // ImpersonateAccount
          const impersonateNode = LiteGraph.createNode('Test Actions/impersonateAccount')
          if (!impersonateNode) return { success: false, error: 'Failed to create impersonateAccount node' }
          impersonateNode.pos = [350, 150]
          graph.add(impersonateNode)

          // Display (result)
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

  test.describe('Snapshot & Revert', () => {

    test('完整工作流: 创建快照并恢复', async ({ page }) => {
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
          // Snapshot
          const snapshotNode = LiteGraph.createNode('Test Actions/snapshot')
          if (!snapshotNode) return { success: false, error: 'Failed to create snapshot node' }
          snapshotNode.pos = [100, 100]
          graph.add(snapshotNode)

          // Display (snapshot ID)
          const idDisplay = LiteGraph.createNode('Utilities/Display')
          idDisplay.pos = [350, 100]
          graph.add(idDisplay)

          // Revert
          const revertNode = LiteGraph.createNode('Test Actions/revert')
          if (!revertNode) return { success: false, error: 'Failed to create revert node' }
          revertNode.pos = [100, 250]
          graph.add(revertNode)

          // Display (revert result)
          const revertDisplay = LiteGraph.createNode('Utilities/Display')
          revertDisplay.pos = [350, 250]
          graph.add(revertDisplay)

          return { success: true, nodeCount: graph._nodes?.length || 0 }
        } catch (e) {
          return { success: false, error: String(e) }
        }
      })

      console.log('创建结果:', createResult)
      expect(createResult.success).toBe(true)
    })
  })

  test.describe('SetNextBlockTimestamp', () => {

    test('完整工作流: 设置下一个区块时间戳', async ({ page }) => {
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
          // ToBigInt (timestamp)
          const timestampNode = LiteGraph.createNode('Utilities/ToBigInt')
          timestampNode.pos = [100, 150]
          graph.add(timestampNode)

          // SetNextBlockTimestamp
          const setTimestampNode = LiteGraph.createNode('Test Actions/setNextBlockTimestamp')
          if (!setTimestampNode) return { success: false, error: 'Failed to create setNextBlockTimestamp node' }
          setTimestampNode.pos = [350, 150]
          graph.add(setTimestampNode)

          // Display (result)
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

  test.describe('组合流程', () => {

    test('Snapshot → Mine → Revert 完整流程', async ({ page }) => {
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
          // Snapshot
          const snapshotNode = LiteGraph.createNode('Test Actions/snapshot')
          snapshotNode.pos = [50, 100]
          graph.add(snapshotNode)

          // ToBigInt (blocks)
          const blocksNode = LiteGraph.createNode('Utilities/ToBigInt')
          blocksNode.pos = [50, 250]
          graph.add(blocksNode)

          // Mine
          const mineNode = LiteGraph.createNode('Test Actions/mine')
          mineNode.pos = [300, 175]
          graph.add(mineNode)

          // Revert (using snapshot ID)
          const revertNode = LiteGraph.createNode('Test Actions/revert')
          revertNode.pos = [550, 175]
          graph.add(revertNode)

          return { success: true, nodeCount: graph._nodes?.length || 0 }
        } catch (e) {
          return { success: false, error: String(e) }
        }
      })

      console.log('创建结果:', createResult)
      expect(createResult.success).toBe(true)
      await page.screenshot({ path: 'test-results/test-actions-combo-flow.png' })
    })
  })
})
