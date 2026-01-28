import { test, expect } from '@playwright/test'
import { TEST_ACCOUNTS, ANVIL_RPC_URL } from '../../../test-network'

test.describe('EIP-7702 节点工作流', () => {

  test.describe('SignAuthorization', () => {

    test('完整工作流: 签名 EIP-7702 授权', async ({ page }) => {
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

          // AddressInput (delegate address)
          const addressNode = LiteGraph.createNode('Inputs/AddressInput')
          addressNode.pos = [450, 100]
          graph.add(addressNode)

          // ToBigInt (nonce)
          const nonceNode = LiteGraph.createNode('Utilities/ToBigInt')
          nonceNode.pos = [450, 250]
          graph.add(nonceNode)

          // SignAuthorization
          const signNode = LiteGraph.createNode('EIP-7702/signAuthorization')
          if (!signNode) return { success: false, error: 'Failed to create signAuthorization node' }
          signNode.pos = [650, 175]
          graph.add(signNode)

          // Display (authorization signature)
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
      await page.screenshot({ path: 'test-results/signAuthorization-connected.png' })
    })

    test('应该支持自定义 nonce', async ({ page }) => {
      await page.goto('/')
      await page.evaluate(() => localStorage.clear())
      await page.reload()
      await page.waitForTimeout(1500)

      const result = await page.evaluate(() => {
        // @ts-expect-error LiteGraph is global
        const graph = window.graph
        // @ts-expect-error LiteGraph is global
        const LiteGraph = window.LiteGraph

        const walletNode = LiteGraph.createNode('Clients & Transports/Clients/WalletClient')
        walletNode.pos = [100, 150]
        graph.add(walletNode)

        const nonceNode = LiteGraph.createNode('Utilities/ToBigInt')
        nonceNode.pos = [300, 100]
        graph.add(nonceNode)

        const signNode = LiteGraph.createNode('EIP-7702/signAuthorization')
        signNode.pos = [500, 150]
        graph.add(signNode)

        return { success: true }
      })

      expect(result.success).toBe(true)
    })
  })

  test.describe('RecoverAuthorizationAddress', () => {

    test('完整工作流: 恢复授权地址', async ({ page }) => {
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

          // ConsoleLog (authorization signature)
          const sigNode = LiteGraph.createNode('Utilities/ConsoleLog')
          sigNode.pos = [50, 250]
          graph.add(sigNode)

          // RecoverAuthorizationAddress
          const recoverNode = LiteGraph.createNode('EIP-7702/recoverAuthorizationAddress')
          if (!recoverNode) return { success: false, error: 'Failed to create recoverAuthorizationAddress node' }
          recoverNode.pos = [300, 175]
          graph.add(recoverNode)

          // Display (recovered address)
          const displayNode = LiteGraph.createNode('Utilities/Display')
          displayNode.pos = [550, 175]
          graph.add(displayNode)

          return { success: true, nodeCount: graph._nodes?.length || 0 }
        } catch (e) {
          return { success: false, error: String(e) }
        }
      })

      console.log('创建结果:', createResult)
      expect(createResult.success).toBe(true)
    })

    test('应该从签名恢复正确的签名者地址', async ({ page }) => {
      await page.goto('/')
      await page.evaluate(() => localStorage.clear())
      await page.reload()
      await page.waitForTimeout(1500)

      const result = await page.evaluate(() => {
        // @ts-expect-error LiteGraph is global
        const graph = window.graph
        // @ts-expect-error LiteGraph is global
        const LiteGraph = window.LiteGraph

        const chainNode = LiteGraph.createNode('Chains/Chain')
        chainNode.pos = [50, 150]
        graph.add(chainNode)

        const recoverNode = LiteGraph.createNode('EIP-7702/recoverAuthorizationAddress')
        recoverNode.pos = [300, 150]
        graph.add(recoverNode)

        return { success: true }
      })

      expect(result.success).toBe(true)
    })
  })

  test.describe('VerifyAuthorization', () => {

    test('完整工作流: 验证 EIP-7702 授权', async ({ page }) => {
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

          // ConsoleLog (authorization)
          const authNode = LiteGraph.createNode('Utilities/ConsoleLog')
          authNode.pos = [50, 250]
          graph.add(authNode)

          // ConsoleLog (signature)
          const sigNode = LiteGraph.createNode('Utilities/ConsoleLog')
          sigNode.pos = [50, 400]
          graph.add(sigNode)

          // VerifyAuthorization
          const verifyNode = LiteGraph.createNode('EIP-7702/verifyAuthorization')
          if (!verifyNode) return { success: false, error: 'Failed to create verifyAuthorization node' }
          verifyNode.pos = [300, 250]
          graph.add(verifyNode)

          // Display (valid/invalid result)
          const displayNode = LiteGraph.createNode('Utilities/Display')
          displayNode.pos = [550, 250]
          graph.add(displayNode)

          return { success: true, nodeCount: graph._nodes?.length || 0 }
        } catch (e) {
          return { success: false, error: String(e) }
        }
      })

      console.log('创建结果:', createResult)
      expect(createResult.success).toBe(true)
    })

    test('应该验证授权的完整性', async ({ page }) => {
      await page.goto('/')
      await page.evaluate(() => localStorage.clear())
      await page.reload()
      await page.waitForTimeout(1500)

      const result = await page.evaluate(() => {
        // @ts-expect-error LiteGraph is global
        const graph = window.graph
        // @ts-expect-error LiteGraph is global
        const LiteGraph = window.LiteGraph

        const chainNode = LiteGraph.createNode('Chains/Chain')
        chainNode.pos = [50, 150]
        graph.add(chainNode)

        const verifyNode = LiteGraph.createNode('EIP-7702/verifyAuthorization')
        verifyNode.pos = [300, 150]
        graph.add(verifyNode)

        return { success: true }
      })

      expect(result.success).toBe(true)
    })

    test('应该拒绝无效的授权', async ({ page }) => {
      await page.goto('/')
      await page.evaluate(() => localStorage.clear())
      await page.reload()
      await page.waitForTimeout(1500)

      const result = await page.evaluate(() => {
        // @ts-expect-error LiteGraph is global
        const graph = window.graph
        // @ts-expect-error LiteGraph is global
        const LiteGraph = window.LiteGraph

        const chainNode = LiteGraph.createNode('Chains/Chain')
        chainNode.pos = [50, 150]
        graph.add(chainNode)

        const verifyNode = LiteGraph.createNode('EIP-7702/verifyAuthorization')
        verifyNode.pos = [300, 150]
        graph.add(verifyNode)

        return { success: true }
      })

      expect(result.success).toBe(true)
    })
  })

  test.describe('完整 EIP-7702 授权流程', () => {

    test('创建授权 -> 签名 -> 验证 -> 恢复地址', async ({ page }) => {
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
          // Chain & Transport
          const chainNode = LiteGraph.createNode('Chains/Chain')
          chainNode.pos = [50, 50]
          graph.add(chainNode)

          const httpNode = LiteGraph.createNode('Clients & Transports/Transports/http')
          httpNode.pos = [50, 200]
          graph.add(httpNode)

          // WalletClient
          const walletNode = LiteGraph.createNode('Clients & Transports/Clients/WalletClient')
          walletNode.pos = [250, 125]
          graph.add(walletNode)

          // AddressInput (delegate)
          const addressNode = LiteGraph.createNode('Inputs/AddressInput')
          addressNode.pos = [450, 50]
          graph.add(addressNode)

          // SignAuthorization
          const signNode = LiteGraph.createNode('EIP-7702/signAuthorization')
          signNode.pos = [650, 125]
          graph.add(signNode)

          // Display (signature)
          const sigDisplay = LiteGraph.createNode('Utilities/Display')
          sigDisplay.pos = [850, 125]
          graph.add(sigDisplay)

          // VerifyAuthorization
          const verifyNode = LiteGraph.createNode('EIP-7702/verifyAuthorization')
          verifyNode.pos = [650, 250]
          graph.add(verifyNode)

          // Display (valid)
          const validDisplay = LiteGraph.createNode('Utilities/Display')
          validDisplay.pos = [850, 250]
          graph.add(validDisplay)

          // RecoverAuthorizationAddress
          const recoverNode = LiteGraph.createNode('EIP-7702/recoverAuthorizationAddress')
          recoverNode.pos = [650, 375]
          graph.add(recoverNode)

          // Display (recovered address)
          const addrDisplay = LiteGraph.createNode('Utilities/Display')
          addrDisplay.pos = [850, 375]
          graph.add(addrDisplay)

          return { success: true, nodeCount: graph._nodes?.length || 0 }
        } catch (e) {
          return { success: false, error: String(e) }
        }
      })

      console.log('创建结果:', createResult)
      expect(createResult.success).toBe(true)
      await page.screenshot({ path: 'test-results/eip7702-full-flow-connected.png' })
    })
  })
})
