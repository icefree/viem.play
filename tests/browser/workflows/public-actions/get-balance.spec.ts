import { test, expect } from '@playwright/test'
import { TEST_ACCOUNTS, ANVIL_RPC_URL } from '../../../setup'

test.describe('GetBalance 节点工作流', () => {
  
  test('完整工作流: 通过 API 创建节点 → 连线 → 获取余额', async ({ page }) => {
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
        
        // 创建 getBalance 节点
        const balanceNode = LiteGraph.createNode('Public Actions/Account/getBalance')
        if (!balanceNode) return { success: false, error: 'Failed to create getBalance node' }
        balanceNode.pos = [600, 220]
        graph.add(balanceNode)
        
        return { 
          success: true, 
          nodeCount: graph._nodes?.length || 0,
          nodes: [chainNode.title, httpNode.title, clientNode.title, balanceNode.title]
        }
      } catch (e) {
        return { success: false, error: String(e) }
      }
    })
    
    console.log('创建结果:', createResult)
    
    if (!createResult.success) {
      await page.screenshot({ path: 'test-results/create-failed.png' })
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
      const balanceNode = sortedNodes[3]
      
      try {
        // 连接 Chain → PublicClient
        chainNode.connect(0, clientNode, 0)
        
        // 连接 HttpTransport → PublicClient
        httpNode.connect(0, clientNode, 1)
        
        // 连接 PublicClient → getBalance
        clientNode.connect(0, balanceNode, 1)
        
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
    const { address: testAddress, rpcUrl } = { 
      address: TEST_ACCOUNTS.deployer.address,
      rpcUrl: ANVIL_RPC_URL 
    }

    const mockResult = await page.evaluate(({ address, url }) => {
      // @ts-expect-error LiteGraph is global
      const graph = window.graph
      const nodes = graph._nodes || []
      const sortedNodes = [...nodes].sort((a: { pos: number[] }, b: { pos: number[] }) => a.pos[0] - b.pos[0])
      
      const httpNode = sortedNodes[1]
      const balanceNode = sortedNodes[3]
      
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

        // Mock GetBalance Address input (Index 2)
        const originalBalanceInput = balanceNode.getInputData
        balanceNode.getInputData = function(index: number) {
          if (index === 2) return address
          return originalBalanceInput?.call(this, index)
        }
        
        return { success: true, address, url }
      } catch (e) {
        return { success: false, error: String(e) }
      }
    }, { address: testAddress, url: rpcUrl })
    
    console.log('Mock 结果:', mockResult)
    expect(mockResult.success).toBe(true)
    
    // ========== 4. 截图记录连线结果 ==========
    await page.waitForTimeout(500)
    await page.screenshot({ path: 'test-results/getBalance-connected.png' })
    
    // ========== 5. 触发执行 ==========
    const executionResult = await page.evaluate(async () => {
      // @ts-expect-error LiteGraph is global
      const graph = window.graph
      if (!graph) return { success: false, error: 'Graph not found' }
      
      const nodes = graph._nodes || []
      const sortedNodes = [...nodes].sort((a: { pos: number[] }, b: { pos: number[] }) => a.pos[0] - b.pos[0])
      const balanceNode = sortedNodes[3]
      
      if (!balanceNode) return { success: false, error: 'Node not found' }
      
      try {
        // 手动触发 action，模拟 Trigger 信号
        if (balanceNode.onAction) {
          await balanceNode.onAction('trigger')
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
    await page.waitForTimeout(5000)
    
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
      const balanceNode = sortedNodes[3]
      
      // 获取输出数据
      const balanceOutput = balanceNode.getOutputData(0)
      const formattedOutput = balanceNode.getOutputData(1)
      
      return { 
        balance: balanceOutput !== undefined ? String(balanceOutput) : null,
        formatted: formattedOutput || null,
      }
    })
    
    console.log('节点输出:', nodeOutput)
    
    // ========== 7. 最终截图 ==========
    await page.screenshot({ path: 'test-results/getBalance-executed.png' })
    
    // 验证成功
    expect(connectResult.success).toBe(true)
    // 验证确实获取到了余额
    expect(nodeOutput.balance).not.toBeNull()
    // 验证格式化输出也是存在的
    expect(nodeOutput.formatted).not.toBeNull()
    
    // 余额验证 (允许为0，如果是 Mainnet 或空账号，但这里预期是 Anvil 测试账号)
    if (nodeOutput.balance === '0') {
      console.warn('警告: 获取到的余额为 0。请检查是否连接到了正确的 Anvil 节点。')
    } else {
      // 格式化输出应该是字符串且包含数字
      expect(parseFloat(nodeOutput.formatted!)).toBeGreaterThan(0)
    }
  })
})
