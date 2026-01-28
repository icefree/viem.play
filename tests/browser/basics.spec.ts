import { test, expect } from '@playwright/test'

// 主画布选择器 (排除 minimap)
const MAIN_CANVAS = 'canvas.lgraphcanvas'

test.describe('Viem Playground 基础功能', () => {
  
  test('应用应该正常加载', async ({ page }) => {
    await page.goto('/')
    
    // 验证页面标题
    await expect(page).toHaveTitle(/viem\.play/i)
    
    // 验证主画布加载
    const canvas = page.locator(MAIN_CANVAS)
    await expect(canvas).toBeVisible()
  })
})
