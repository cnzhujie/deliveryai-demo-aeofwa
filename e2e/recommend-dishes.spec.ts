import { test, expect, type Page } from '@playwright/test'

/** Navigate from app start to the welcome view (bind table → welcome). */
async function goToWelcome(page: Page) {
  await page.goto('/')
  // Bind a table (e.g. A08)
  await page.getByRole('button', { name: /A08/ }).first().click()
  // Now on welcome view
}

test.describe('首页推荐菜品（WelcomeView Recommend Dishes）- E2E 验收测试', () => {
  test('REQ-001: 欢迎页展示推荐菜品区块，包含 4 道带 badge 标签的菜品卡片', async ({ page }) => {
    await goToWelcome(page)

    // REQ-001.1: 推荐区块标题可见
    await expect(page.getByText('今日推荐')).toBeVisible()

    // REQ-001.2: 推荐菜品区块内有 4 张菜品卡片（article 元素）
    const recommendSection = page.locator('h3:has-text("今日推荐")').locator('..')
    const cards = recommendSection.locator('article')
    await expect(cards).toHaveCount(4)

    // REQ-001.3: 每张卡片包含菜品图片、名称、价格和 badge 标签
    // 验证 4 道推荐菜品（按 products 数组顺序：p1, p2, p3, p5）
    const expectedNames = ['鎏金番茄鸳鸯锅', '牛油麻辣锅', '琥珀嫩牛肉', '鲜虾滑']
    const expectedBadges = ['人气 No.1', '招牌', '主厨推荐', '新品']
    const expectedPrices = ['¥68.00', '¥59.00', '¥42.00', '¥39.00']

    for (let i = 0; i < 4; i++) {
      const card = cards.nth(i)
      // 图片存在
      await expect(card.locator('img')).toBeVisible()
      // 菜品名称
      await expect(card.getByText(expectedNames[i])).toBeVisible()
      // 价格（经 money() 格式化）
      await expect(card.getByText(expectedPrices[i])).toBeVisible()
      // badge 标签
      await expect(card.getByText(expectedBadges[i])).toBeVisible()
    }
  })

  test('REQ-002: 英文语言下推荐区块标题和菜品名称正确显示英文', async ({ page }) => {
    // 设置语言为英文后再进入欢迎页（TopBar 仅在非 welcome 视图渲染，故通过 localStorage 设置语言）
    await page.goto('/')
    await page.evaluate(() => localStorage.setItem('i18nextLng', 'en'))
    // 重新加载以应用语言设置
    await page.reload()

    // 绑定桌台进入欢迎页
    await page.getByRole('button', { name: /A08/ }).first().click()

    // REQ-002.1: 推荐区块标题为英文 "Today's Specials"
    await expect(page.getByText("Today's Specials")).toBeVisible()
    // REQ-002.5: 菜品名称为英文
    await expect(page.getByText('Golden Tomato Dual-Flavor Pot')).toBeVisible()
    // badge 标签为英文
    await expect(page.getByText('Top Pick')).toBeVisible()
    await expect(page.getByText('Signature')).toBeVisible()
    // 价格格式不变
    await expect(page.getByText('¥68.00')).toBeVisible()
  })

  test('REQ-001: 推荐菜品区块不影响进入点餐按钮，点击后正常跳转至菜单页', async ({ page }) => {
    await goToWelcome(page)

    // 推荐菜品区块可见
    await expect(page.getByText('今日推荐')).toBeVisible()

    // 进入点餐按钮可见且可点击
    const enterBtn = page.getByRole('button', { name: /进入点餐/ })
    await expect(enterBtn).toBeVisible()
    await enterBtn.click()

    // 验证成功跳转至菜单页
    await expect(page.getByText('想吃什么，一起点。')).toBeVisible()
  })
})
