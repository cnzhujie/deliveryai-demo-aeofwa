import { test, expect, type Page } from '@playwright/test'

/** Navigate from app start to the menu view (bind table → welcome → menu). */
async function goToMenu(page: Page) {
  await page.goto('/')
  await page.getByRole('button', { name: /A08/ }).first().click()
  await page.getByRole('button', { name: /进入点餐|Enter/ }).click()
}

test.describe('夜间模式（Dark Mode）- E2E 验收测试', () => {
  test.beforeEach(async ({ page }) => {
    // 清除 localStorage，确保每个用例从已知状态开始
    await page.goto('/')
    await page.evaluate(() => {
      try { localStorage.removeItem('dark-mode') } catch { /* ignore */ }
    })
  })

  test('REQ-001: 点击夜间模式切换按钮后 dark class 在 html 上切换，localStorage 持久化，显示 toast 提示', async ({ page }) => {
    await goToMenu(page)

    // 初始状态为浅色（localStorage 已清除，emulate 未设置 dark 偏好）
    await expect(page.locator('html')).not.toHaveClass(/dark/)

    // 点击夜间模式按钮（浅色时 aria-label 为「切换至夜间模式」）
    const darkToggleBtn = page.getByRole('button', { name: '切换至夜间模式' })
    await expect(darkToggleBtn).toBeVisible()
    await darkToggleBtn.click()

    // REQ-001.2: html 上切换 dark class
    await expect(page.locator('html')).toHaveClass(/dark/)

    // REQ-001.3: localStorage 持久化
    const stored = await page.evaluate(() => localStorage.getItem('dark-mode'))
    expect(stored).toBe('true')

    // REQ-001.4: toast 提示消息显示
    await expect(page.getByText('已切换为夜间模式')).toBeVisible()

    // 切换回浅色
    const lightToggleBtn = page.getByRole('button', { name: '切换至日间模式' })
    await lightToggleBtn.click()
    await expect(page.locator('html')).not.toHaveClass(/dark/)
    const storedLight = await page.evaluate(() => localStorage.getItem('dark-mode'))
    expect(storedLight).toBe('false')
    await expect(page.getByText('已切换为日间模式')).toBeVisible()
  })

  test('REQ-002: 夜间模式下页面背景和文字呈现深色主题，视觉覆盖生效', async ({ page }) => {
    await goToMenu(page)

    // 切换至夜间模式
    await page.getByRole('button', { name: '切换至夜间模式' }).click()
    await expect(page.locator('html')).toHaveClass(/dark/)

    // 等待 250ms 过渡动画完成
    await page.waitForTimeout(400)

    // REQ-002.1/REQ-002.2: 页面根背景从浅色切换为深色 (bg-charcoal-900)
    const rootDiv = page.locator('.min-h-screen.paper-noise')
    await expect(rootDiv).toHaveClass(/bg-charcoal-900/)

    // TopBar header 在夜间模式下有深色背景
    const header = page.locator('header.sticky')
    await expect(header).toHaveClass(/dark:bg-charcoal-900/)

    // 横幅条在夜间模式下背景为黑色
    const banner = page.locator('div.bg-charcoal-900.text-center')
    await expect(banner).toHaveClass(/dark:bg-black/)

    // 品牌名称文字在夜间模式下为浅色 (dark:text-rice-50)
    const brandName = page.locator('strong.block')
    await expect(brandName).toHaveClass(/dark:text-rice-50/)
  })

  test('REQ-001.5/REQ-001.8: 刷新页面后从 localStorage 恢复夜间模式，且夜间模式与老人模式可同时生效', async ({ page }) => {
    await goToMenu(page)

    // 开启夜间模式
    await page.getByRole('button', { name: '切换至夜间模式' }).click()
    await expect(page.locator('html')).toHaveClass(/dark/)

    // 开启老人模式
    await page.getByRole('button', { name: '切换至老人模式' }).click()
    await expect(page.locator('html')).toHaveClass(/elderly/)

    // 两种模式同时启用
    await expect(page.locator('html')).toHaveClass(/dark/)
    await expect(page.locator('html')).toHaveClass(/elderly/)

    // 刷新页面，验证 localStorage 恢复夜间模式（老人模式同样持久化）
    await page.reload()

    // REQ-001.5: 刷新后从 localStorage 恢复夜间模式
    await expect(page.locator('html')).toHaveClass(/dark/)

    // 老人模式也恢复
    await expect(page.locator('html')).toHaveClass(/elderly/)

    // 刷新后仍在 menu 视图（需要重新绑定桌台后自动恢复？）
    // 应用是内存态，刷新后会回到 bind 页面，但 dark/elderly class 由内联脚本和 hook 在挂载前设置
    // 因此 dark class 应该在页面加载时就存在（由 index.html 内联脚本设置，避免 FOUC）
  })
})
