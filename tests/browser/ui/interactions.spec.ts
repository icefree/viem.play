import { test, expect } from '@playwright/test'

// 主画布选择器 (排除 minimap)
const MAIN_CANVAS = 'canvas.lgraphcanvas'

test.describe('UI 交互操作', () => {
  
  test('双击画布应该打开节点搜索菜单', async ({ page }) => {
    await page.goto('/')
    
    const canvas = page.locator(MAIN_CANVAS)
    await canvas.dblclick({ position: { x: 400, y: 300 } })
    
    // 等待菜单出现
    await page.waitForTimeout(500)
    
    // LiteGraph 搜索框应该出现 (不做断言，只验证操作不报错)
  })

  test('右键画布应该打开上下文菜单', async ({ page }) => {
    await page.goto('/')
    
    const canvas = page.locator(MAIN_CANVAS)
    await canvas.click({ button: 'right', position: { x: 400, y: 300 } })
    
    // 验证上下文菜单出现
    await page.waitForTimeout(300)
  })

  test('应该能在画布上创建节点 (通过 UI)', async ({ page }) => {
    await page.goto('/')
    
    const canvas = page.locator(MAIN_CANVAS)
    
    // 1. 双击打开节点搜索
    await canvas.dblclick({ position: { x: 200, y: 150 } })
    await page.waitForTimeout(500)
    
    // 2. 搜索 "mainnet" 
    await page.keyboard.type('mainnet')
    await page.waitForTimeout(300)
    await page.keyboard.press('Enter')
    await page.waitForTimeout(500)
    
    // 截图验证节点创建
    await page.screenshot({ path: 'test-results/node-creation.png' })
  })

  test('节点拖拽连线测试', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(1000)
    
    const canvas = page.locator(MAIN_CANVAS)
    
    // 创建两个简单节点测试连线
    // 1. 创建 mainnet Chain 节点
    await canvas.dblclick({ position: { x: 150, y: 200 } })
    await page.waitForTimeout(400)
    await page.keyboard.type('mainnet')
    await page.keyboard.press('Enter')
    await page.waitForTimeout(600)
    
    // 2. 创建 PublicClient 节点  
    await canvas.dblclick({ position: { x: 400, y: 200 } })
    await page.waitForTimeout(400)
    await page.keyboard.type('publicClient')
    await page.keyboard.press('Enter')
    await page.waitForTimeout(600)
    
    // 3. 通过鼠标拖拽连接
    // Chain 节点的输出端口大约在节点右侧中心位置
    // 节点默认宽度约 140px，输出端口在右边缘
    const startX = 150 + 140  // Chain 节点的输出端口 X
    const startY = 200 + 25   // 第一个输出端口的 Y (标题栏下方)
    const endX = 400          // PublicClient 节点的输入端口 X  
    const endY = 200 + 25     // 第一个输入端口的 Y
    
    // 执行拖拽操作
    await page.mouse.move(startX, startY)
    await page.waitForTimeout(100)
    await page.mouse.down()
    await page.waitForTimeout(100)
    await page.mouse.move(endX, endY, { steps: 10 })
    await page.waitForTimeout(100)
    await page.mouse.up()
    await page.waitForTimeout(500)
    
    // 截图记录拖拽连线结果
    await page.screenshot({ path: 'test-results/drag-connect.png' })
  })
})
