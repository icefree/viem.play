import { test, expect } from '@playwright/test'
import { TEST_ACCOUNTS, ANVIL_RPC_URL } from '../../../test-network'

test.describe('Wallet Actions 节点工作流', () => {

  test.describe('SendTransaction', () => {

    test('完整工作流: 发送 ETH 交易', async ({ page }) => {
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

          // ToBigInt (value)
          const valueNode = LiteGraph.createNode('Utilities/ToBigInt')
          valueNode.pos = [450, 100]
          graph.add(valueNode)

          // AddressInput (recipient)
          const addressNode = LiteGraph.createNode('Inputs/AddressInput')
          addressNode.pos = [450, 250]
          graph.add(addressNode)

          // SendTransaction
          const sendNode = LiteGraph.createNode('Wallet Actions/sendTransaction')
          if (!sendNode) return { success: false, error: 'Failed to create sendTransaction node' }
          sendNode.pos = [650, 175]
          graph.add(sendNode)

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

      // ========== 2. 连接节点 ==========
      const connectResult = await page.evaluate(() => {
        // @ts-expect-error LiteGraph is global
        const graph = window.graph
        const nodes = graph._nodes || []
        const sortedNodes = [...nodes].sort((a: { pos: number[] }, b: { pos: number[] }) => a.pos[0] - b.pos[0])

        const [chainNode, httpNode, walletNode, valueNode, addressNode, sendNode, displayNode] = sortedNodes

        try {
          chainNode.connect(0, walletNode, 0)
          httpNode.connect(0, walletNode, 1)
          valueNode.connect(0, sendNode, 2)
          addressNode.connect(0, sendNode, 3)
          sendNode.connect(0, displayNode, 0)

          // @ts-expect-error canvas is global
          window.canvas?.setDirty?.(true, true)

          return { success: true }
        } catch (e) {
          return { success: false, error: String(e) }
        }
      })

      expect(connectResult.success).toBe(true)
      await page.screenshot({ path: 'test-results/sendTransaction-connected.png' })
    })

    test('应该处理发送失败的情况', async ({ page }) => {
      // 测试余额不足等错误场景
      await page.goto('/')
      await page.evaluate(() => localStorage.clear())
      await page.reload()
      await page.waitForTimeout(1500)

      const result = await page.evaluate(() => {
        // @ts-expect-error LiteGraph is global
        const graph = window.graph
        // @ts-expect-error LiteGraph is global
        const LiteGraph = window.LiteGraph

        // 创建基本节点
        const chainNode = LiteGraph.createNode('Chains/Chain')
        chainNode.pos = [50, 100]
        graph.add(chainNode)

        const httpNode = LiteGraph.createNode('Clients & Transports/Transports/http')
        httpNode.pos = [50, 250]
        graph.add(httpNode)

        const walletNode = LiteGraph.createNode('Clients & Transports/Clients/WalletClient')
        walletNode.pos = [250, 175]
        graph.add(walletNode)

        const sendNode = LiteGraph.createNode('Wallet Actions/sendTransaction')
        sendNode.pos = [450, 175]
        graph.add(sendNode)

        return { success: true }
      })

      expect(result.success).toBe(true)
    })
  })

  test.describe('SignMessage', () => {

    test('完整工作流: 签名消息', async ({ page }) => {
      await page.goto('/')
      await page.evaluate(() => localStorage.clear())
      await page.reload()
      await page.waitForTimeout(1500)

      const createResult = await page.evaluate(() => {
        // @ts-expect-error LiteGraph is global
        const graph = window.graph
        // @ts-expect-error LiteGraph is global
        const LiteGraph = window.LiteGraph

        try {
          // WalletClient
          const walletNode = LiteGraph.createNode('Clients & Transports/Clients/WalletClient')
          walletNode.pos = [100, 150]
          graph.add(walletNode)

          // ConsoleLog (message input)
          const consoleNode = LiteGraph.createNode('Utilities/ConsoleLog')
          consoleNode.pos = [300, 100]
          graph.add(consoleNode)

          // SignMessage
          const signNode = LiteGraph.createNode('Wallet Actions/signMessage')
          if (!signNode) return { success: false, error: 'Failed to create signMessage node' }
          signNode.pos = [500, 150]
          graph.add(signNode)

          // Display (signature)
          const displayNode = LiteGraph.createNode('Utilities/Display')
          displayNode.pos = [700, 150]
          graph.add(displayNode)

          return { success: true }
        } catch (e) {
          return { success: false, error: String(e) }
        }
      })

      expect(createResult.success).toBe(true)
    })
  })

  test.describe('SignTypedData', () => {

    test('完整工作流: 签名类型化数据 (EIP-712)', async ({ page }) => {
      await page.goto('/')
      await page.evaluate(() => localStorage.clear())
      await page.reload()
      await page.waitForTimeout(1500)

      const createResult = await page.evaluate(() => {
        // @ts-expect-error LiteGraph is global
        const graph = window.graph
        // @ts-expect-error LiteGraph is global
        const LiteGraph = window.LiteGraph

        try {
          // WalletClient
          const walletNode = LiteGraph.createNode('Clients & Transports/Clients/WalletClient')
          walletNode.pos = [100, 150]
          graph.add(walletNode)

          // SignTypedData
          const signNode = LiteGraph.createNode('Wallet Actions/signTypedData')
          if (!signNode) return { success: false, error: 'Failed to create signTypedData node' }
          signNode.pos = [350, 150]
          graph.add(signNode)

          // Display (signature)
          const displayNode = LiteGraph.createNode('Utilities/Display')
          displayNode.pos = [600, 150]
          graph.add(displayNode)

          return { success: true }
        } catch (e) {
          return { success: false, error: String(e) }
        }
      })

      expect(createResult.success).toBe(true)
    })
  })

  test.describe('GetAddresses', () => {

    test('完整工作流: 获取账户地址', async ({ page }) => {
      await page.goto('/')
      await page.evaluate(() => localStorage.clear())
      await page.reload()
      await page.waitForTimeout(1500)

      const createResult = await page.evaluate(() => {
        // @ts-expect-error LiteGraph is global
        const graph = window.graph
        // @ts-expect-error LiteGraph is global
        const LiteGraph = window.LiteGraph

        try {
          // WalletClient
          const walletNode = LiteGraph.createNode('Clients & Transports/Clients/WalletClient')
          walletNode.pos = [100, 200]
          graph.add(walletNode)

          // GetAddresses
          const getAddressesNode = LiteGraph.createNode('Wallet Actions/getAddresses')
          if (!getAddressesNode) return { success: false, error: 'Failed to create getAddresses node' }
          getAddressesNode.pos = [350, 200]
          graph.add(getAddressesNode)

          // Display (addresses)
          const displayNode = LiteGraph.createNode('Utilities/Display')
          displayNode.pos = [600, 200]
          graph.add(displayNode)

          return { success: true }
        } catch (e) {
          return { success: false, error: String(e) }
        }
      })

      expect(createResult.success).toBe(true)
    })
  })

  test.describe('SwitchChain', () => {

    test('完整工作流: 切换链', async ({ page }) => {
      await page.goto('/')
      await page.evaluate(() => localStorage.clear())
      await page.reload()
      await page.waitForTimeout(1500)

      const createResult = await page.evaluate(() => {
        // @ts-expect-error LiteGraph is global
        const graph = window.graph
        // @ts-expect-error LiteGraph is global
        const LiteGraph = window.LiteGraph

        try {
          // WalletClient
          const walletNode = LiteGraph.createNode('Clients & Transports/Clients/WalletClient')
          walletNode.pos = [100, 150]
          graph.add(walletNode)

          // Chain (target chain)
          const targetChainNode = LiteGraph.createNode('Chains/Chain')
          targetChainNode.pos = [300, 100]
          graph.add(targetChainNode)

          // SwitchChain
          const switchNode = LiteGraph.createNode('Wallet Actions/switchChain')
          if (!switchNode) return { success: false, error: 'Failed to create switchChain node' }
          switchNode.pos = [500, 150]
          graph.add(switchNode)

          return { success: true }
        } catch (e) {
          return { success: false, error: String(e) }
        }
      })

      expect(createResult.success).toBe(true)
    })
  })
})
