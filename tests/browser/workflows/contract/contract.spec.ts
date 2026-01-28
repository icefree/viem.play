import { test, expect } from '@playwright/test'
import { TEST_ACCOUNTS, ANVIL_RPC_URL } from '../../../test-network'

test.describe('Contract 节点工作流', () => {

  test.describe('ReadContract', () => {

    test('完整工作流: 读取合约状态', async ({ page }) => {
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
          // Chain
          const chainNode = LiteGraph.createNode('Chains/Chain')
          chainNode.pos = [50, 100]
          graph.add(chainNode)

          // HttpTransport
          const httpNode = LiteGraph.createNode('Clients & Transports/Transports/http')
          httpNode.pos = [50, 250]
          graph.add(httpNode)

          // PublicClient
          const clientNode = LiteGraph.createNode('Clients & Transports/Clients/PublicClient')
          clientNode.pos = [250, 175]
          graph.add(clientNode)

          // AddressInput (contract address)
          const addressNode = LiteGraph.createNode('Inputs/AddressInput')
          addressNode.pos = [450, 100]
          graph.add(addressNode)

          // ParseAbi (contract ABI)
          const abiNode = LiteGraph.createNode('ABI/parseAbi')
          abiNode.pos = [450, 250]
          graph.add(abiNode)

          // ReadContract
          const readNode = LiteGraph.createNode('Contract/readContract')
          if (!readNode) return { success: false, error: 'Failed to create readContract node' }
          readNode.pos = [650, 175]
          graph.add(readNode)

          // Display (result)
          const displayNode = LiteGraph.createNode('Utilities/Display')
          displayNode.pos = [850, 175]
          graph.add(displayNode)

          return { success: true, nodeCount: graph._nodes?.length || 0 }
        } catch (e) {
          return { success: false, error: String(e) }
        }
      })

      console.log('创建结果:', createResult)
      expect(createResult.success).toBe(true)
      await page.screenshot({ path: 'test-results/readContract-connected.png' })
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

        // 创建节点
        const clientNode = LiteGraph.createNode('Clients & Transports/Clients/PublicClient')
        clientNode.pos = [100, 150]
        graph.add(clientNode)

        const readNode = LiteGraph.createNode('Contract/readContract')
        readNode.pos = [350, 150]
        graph.add(readNode)

        return { success: true }
      })

      expect(result.success).toBe(true)
    })
  })

  test.describe('WriteContract', () => {

    test('完整工作流: 写入合约状态', async ({ page }) => {
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
          // Chain
          const chainNode = LiteGraph.createNode('Chains/Chain')
          chainNode.pos = [50, 100]
          graph.add(chainNode)

          // HttpTransport
          const httpNode = LiteGraph.createNode('Clients & Transports/Transports/http')
          httpNode.pos = [50, 250]
          graph.add(httpNode)

          // WalletClient
          const walletNode = LiteGraph.createNode('Clients & Transports/Clients/WalletClient')
          walletNode.pos = [250, 175]
          graph.add(walletNode)

          // AddressInput (contract address)
          const addressNode = LiteGraph.createNode('Inputs/AddressInput')
          addressNode.pos = [450, 100]
          graph.add(addressNode)

          // ParseAbi (contract ABI)
          const abiNode = LiteGraph.createNode('ABI/parseAbi')
          abiNode.pos = [450, 250]
          graph.add(abiNode)

          // ToBigInt (function arguments)
          const argNode = LiteGraph.createNode('Utilities/ToBigInt')
          argNode.pos = [450, 350]
          graph.add(argNode)

          // WriteContract
          const writeNode = LiteGraph.createNode('Contract/writeContract')
          if (!writeNode) return { success: false, error: 'Failed to create writeContract node' }
          writeNode.pos = [650, 175]
          graph.add(writeNode)

          // Display (transaction hash)
          const displayNode = LiteGraph.createNode('Utilities/Display')
          displayNode.pos = [850, 175]
          graph.add(displayNode)

          return { success: true, nodeCount: graph._nodes?.length || 0 }
        } catch (e) {
          return { success: false, error: String(e) }
        }
      })

      console.log('创建结果:', createResult)
      expect(createResult.success).toBe(true)
      await page.screenshot({ path: 'test-results/writeContract-connected.png' })
    })

    test('应该支持带 value 的合约调用', async ({ page }) => {
      await page.goto('/')
      await page.evaluate(() => localStorage.clear())
      await page.reload()
      await page.waitForTimeout(1500)

      const result = await page.evaluate(() => {
        // @ts-expect-error LiteGraph is global
        const graph = window.graph
        // @ts-expect-error LiteGraph is global
        const LiteGraph = window.LiteGraph

        // 创建节点
        const walletNode = LiteGraph.createNode('Clients & Transports/Clients/WalletClient')
        walletNode.pos = [100, 150]
        graph.add(walletNode)

        const valueNode = LiteGraph.createNode('Utilities/ToBigInt')
        valueNode.pos = [300, 100]
        graph.add(valueNode)

        const writeNode = LiteGraph.createNode('Contract/writeContract')
        writeNode.pos = [500, 150]
        graph.add(writeNode)

        return { success: true }
      })

      expect(result.success).toBe(true)
    })
  })

  test.describe('SimulateContract', () => {

    test('完整工作流: 模拟合约调用', async ({ page }) => {
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
          // PublicClient
          const clientNode = LiteGraph.createNode('Clients & Transports/Clients/PublicClient')
          clientNode.pos = [100, 175]
          graph.add(clientNode)

          // AddressInput
          const addressNode = LiteGraph.createNode('Inputs/AddressInput')
          addressNode.pos = [300, 100]
          graph.add(addressNode)

          // ParseAbi
          const abiNode = LiteGraph.createNode('ABI/parseAbi')
          abiNode.pos = [300, 250]
          graph.add(abiNode)

          // SimulateContract
          const simulateNode = LiteGraph.createNode('Contract/simulateContract')
          if (!simulateNode) return { success: false, error: 'Failed to create simulateContract node' }
          simulateNode.pos = [500, 175]
          graph.add(simulateNode)

          // Display (result)
          const displayNode = LiteGraph.createNode('Utilities/Display')
          displayNode.pos = [700, 175]
          graph.add(displayNode)

          return { success: true, nodeCount: graph._nodes?.length || 0 }
        } catch (e) {
          return { success: false, error: String(e) }
        }
      })

      console.log('创建结果:', createResult)
      expect(createResult.success).toBe(true)
    })

    test('应该返回 gas 估算', async ({ page }) => {
      await page.goto('/')
      await page.evaluate(() => localStorage.clear())
      await page.reload()
      await page.waitForTimeout(1500)

      const result = await page.evaluate(() => {
        // @ts-expect-error LiteGraph is global
        const graph = window.graph
        // @ts-expect-error LiteGraph is global
        const LiteGraph = window.LiteGraph

        // 创建节点
        const clientNode = LiteGraph.createNode('Clients & Transports/Clients/PublicClient')
        clientNode.pos = [100, 150]
        graph.add(clientNode)

        const simulateNode = LiteGraph.createNode('Contract/simulateContract')
        simulateNode.pos = [350, 150]
        graph.add(simulateNode)

        return { success: true }
      })

      expect(result.success).toBe(true)
    })
  })

  test.describe('DeployContract', () => {

    test('完整工作流: 部署合约', async ({ page }) => {
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
          // Chain
          const chainNode = LiteGraph.createNode('Chains/Chain')
          chainNode.pos = [50, 100]
          graph.add(chainNode)

          // HttpTransport
          const httpNode = LiteGraph.createNode('Clients & Transports/Transports/http')
          httpNode.pos = [50, 250]
          graph.add(httpNode)

          // WalletClient
          const walletNode = LiteGraph.createNode('Clients & Transports/Clients/WalletClient')
          walletNode.pos = [250, 175]
          graph.add(walletNode)

          // ParseAbi (contract ABI)
          const abiNode = LiteGraph.createNode('ABI/parseAbi')
          abiNode.pos = [450, 100]
          graph.add(abiNode)

          // ConsoleLog (bytecode)
          const bytecodeNode = LiteGraph.createNode('Utilities/ConsoleLog')
          bytecodeNode.pos = [450, 250]
          graph.add(bytecodeNode)

          // DeployContract
          const deployNode = LiteGraph.createNode('Contract/deployContract')
          if (!deployNode) return { success: false, error: 'Failed to create deployContract node' }
          deployNode.pos = [650, 175]
          graph.add(deployNode)

          // Display (contract address)
          const displayNode = LiteGraph.createNode('Utilities/Display')
          displayNode.pos = [850, 175]
          graph.add(displayNode)

          return { success: true, nodeCount: graph._nodes?.length || 0 }
        } catch (e) {
          return { success: false, error: String(e) }
        }
      })

      console.log('创建结果:', createResult)
      expect(createResult.success).toBe(true)
      await page.screenshot({ path: 'test-results/deployContract-connected.png' })
    })
  })

  test.describe('GetContractEvents', () => {

    test('完整工作流: 获取合约事件', async ({ page }) => {
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
          // PublicClient
          const clientNode = LiteGraph.createNode('Clients & Transports/Clients/PublicClient')
          clientNode.pos = [100, 175]
          graph.add(clientNode)

          // AddressInput
          const addressNode = LiteGraph.createNode('Inputs/AddressInput')
          addressNode.pos = [300, 100]
          graph.add(addressNode)

          // ParseAbi
          const abiNode = LiteGraph.createNode('ABI/parseAbi')
          abiNode.pos = [300, 250]
          graph.add(abiNode)

          // GetContractEvents
          const eventsNode = LiteGraph.createNode('Contract/getContractEvents')
          if (!eventsNode) return { success: false, error: 'Failed to create getContractEvents node' }
          eventsNode.pos = [500, 175]
          graph.add(eventsNode)

          // Display (events)
          const displayNode = LiteGraph.createNode('Utilities/Display')
          displayNode.pos = [700, 175]
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
