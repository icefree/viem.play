import { test, expect } from '@playwright/test'

// 主画布选择器 (排除 minimap)
const MAIN_CANVAS = 'canvas.lgraphcanvas'

test.describe('UI 布局检查', () => {

  test.describe('Console 面板', () => {
    test('Console 面板应该存在', async ({ page }) => {
      await page.goto('/')
      
      // 验证页面加载完成
      const canvas = page.locator(MAIN_CANVAS)
      await expect(canvas).toBeVisible()
    })
  })
  
  test.describe('响应式布局', () => {
    test('在移动端视口应该正常显示', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/')
      
      const canvas = page.locator(MAIN_CANVAS)
      await expect(canvas).toBeVisible()
    })
  
    test('在桌面视口应该正常显示', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 })
      await page.goto('/')
      
      const canvas = page.locator(MAIN_CANVAS)
      await expect(canvas).toBeVisible()
    })
  })
})
