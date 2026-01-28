import { test, expect } from '@playwright/test'

test.describe('Block 节点工作流', () => {
  
  test('完整工作流: 通过 API 创建节点 → 连线 → 获取区块号', async ({ page }) => {
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
        // 注意：ChainNode 默认 chainName 为 'mainnet'
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
        
        // 创建 getBlockNumber 节点
        const blockNumNode = LiteGraph.createNode('Public Actions/Block/getBlockNumber')
        if (!blockNumNode) return { success: false, error: 'Failed to create getBlockNumber node' }
        blockNumNode.pos = [600, 220]
        graph.add(blockNumNode)
        
        return { 
          success: true, 
          nodeCount: graph._nodes?.length || 0,
          nodes: [chainNode.title, httpNode.title, clientNode.title, blockNumNode.title]
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
      const blockNumNode = sortedNodes[3]
      
      try {
        // 连接 Chain → PublicClient
        chainNode.connect(0, clientNode, 0)
        
        // 连接 HttpTransport → PublicClient
        httpNode.connect(0, clientNode, 1)
        
        // 连接 PublicClient → getBlockNumber
        clientNode.connect(0, blockNumNode, 1)
        
        // 刷新画布
        // @ts-expect-error canvas is global
        window.canvas?.setDirty?.(true, true)
        
        return { success: true }
      } catch (e) {
        return { success: false, error: String(e) }
      }
    })
    
    console.log('连接结果:', connectResult)
    
    // ========== 3. 截图记录连线结果 ==========
    await page.waitForTimeout(500)
    await page.screenshot({ path: 'test-results/getBlockNumber-connected.png' })
    
    // ========== 4. 触发执行 ==========
    const executionResult = await page.evaluate(async () => {
      // @ts-expect-error LiteGraph is global
      const graph = window.graph
      if (!graph) return { success: false, error: 'Graph not found' }
      
      const nodes = graph._nodes || []
      const sortedNodes = [...nodes].sort((a: { pos: number[] }, b: { pos: number[] }) => a.pos[0] - b.pos[0])
      // 假设最后一个是 getBlockNumber 节点
      const blockNumNode = sortedNodes[3]
      
      if (!blockNumNode) return { success: false, error: 'Node not found' }
      
      try {
        // 手动触发 action，模拟 Trigger 信号
        if (blockNumNode.onAction) {
          await blockNumNode.onAction('trigger')
          return { success: true, triggered: true }
        }
        return { success: false, error: 'onAction not method' }
      } catch (e) {
        return { success: false, error: String(e) }
      }
    })
    
    console.log('触发结果:', executionResult)
    expect(executionResult.success).toBe(true)
    
    // 等待网络请求完成 (给一点缓冲时间)
    await page.waitForTimeout(3000)
    
    // 运行一次图谱更新输出
    await page.evaluate(() => {
      // @ts-expect-error LiteGraph is global
      window.graph?.runStep?.()
    })

    // ========== 5. 验证结果 ==========
    const nodeOutput = await page.evaluate(() => {
      // @ts-expect-error LiteGraph is global
      const graph = window.graph
      const nodes = graph._nodes || []
      const sortedNodes = [...nodes].sort((a: { pos: number[] }, b: { pos: number[] }) => a.pos[0] - b.pos[0])
      const blockNumNode = sortedNodes[3]
      
      // 获取私有属性 blockNumber (通过 outputData 获取更标准)
      // LiteGraph 节点 output 0 的数据
      const outputData = blockNumNode.getOutputData(0)
      
      // 也可以尝试获取直接属性，以此验证显示
      return { 
        output: outputData ? String(outputData) : null,
        // @ts-expect-error accessing private property
        blockNumber: blockNumNode.blockNumber ? String(blockNumNode.blockNumber) : null
      }
    })
    
    console.log('节点输出:', nodeOutput)
    
    // ========== 6. 最终截图 ==========
    await page.screenshot({ path: 'test-results/getBlockNumber-executed.png' })
    
    // 验证成功
    expect(connectResult.success).toBe(true)
    // 验证确实获取到了区块号
    expect(nodeOutput.blockNumber).not.toBeNull()
    // 验证输出数据也是存在的
    expect(nodeOutput.output).not.toBeNull()
    // 应该是大整数
    expect(BigInt(nodeOutput.blockNumber!).toString()).toBe(nodeOutput.blockNumber)
  })
})
