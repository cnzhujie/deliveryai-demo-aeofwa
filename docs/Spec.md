---
spec_id: SPEC-DARK-MODE-001
title: 夜间模式（Dark Mode）
status: confirmed
template_id: requirement-spec-v1
schema_version: 1
product_area: 沸点火锅点单演示应用 / 全局 UI
baseline_spec: 无（首次新增）
depends_on_specs: []
supersedes_specs: []
source_documents:
  - 仓库 AGENTS.md（技术栈、样式约定、编码约定）
  - knowledge/template/需求Spec模板.md
  - knowledge/template/需求澄清规范.md
created_at: 2026-09-17
updated_at: 2026-09-17
---

# Spec: 夜间模式（Dark Mode）

# 0. 文档元信息

## 0.1 基本信息

- **文档类型**: ☑ 新增需求
- **适用产品范围**: 沸点火锅点单概念演示应用（`hdl-order-demo`）全部页面与组件
- **版本基线说明**: 基于仓库初始提交 `47b97e2`，当前为单一浅色主题

## 0.2 证据来源

| 来源 | 用途 | 可信度 | 备注 |
|------|------|--------|------|
| 仓库 AGENTS.md | 技术栈、样式约定、编码规范、验证命令 | 高 | 明确说明 Tailwind 未配置 darkMode、无 dark: 变体 |
| 仓库源码（tailwind.config.js、index.css、useElderlyMode.ts、TopBar.tsx 等） | 确认现有颜色体系、老人模式实现模式、切换入口位置 | 高 | 直接代码证据 |
| 任务描述 "添加夜间模式" | 原始需求 | 高 | 一句话需求 |
| 用户确认（ask-user-interaction） | 初始默认策略、切换提示方式 | 高 | 用户明确选择 |

---

# 1. 需求背景

- **需求类型**: ☑ 用户反馈
- **背景 / 驱动**: 当前应用仅有浅色主题，在夜间或低光环境下屏幕亮度高、对比刺眼，长时间使用导致视觉疲劳。用户（餐厅顾客）在晚餐高峰时段使用点单应用时，受环境光照不足影响，浅色界面眩光明显。
- **用户价值**: 为餐厅顾客提供低亮度的夜间使用界面，降低屏幕对眼睛的刺激，提升夜间点单体验。
- **关联重点特性**: 老人模式（已有，放大字号 + 增强对比度）、语言切换（已有）

| 用户角色 | 核心场景 | 痛点 | 相关 SA |
|----------|----------|------|---------|
| 餐厅顾客 | 晚间到店扫码点单 | 浅色界面在低光环境下眩光刺眼 | 无 |

---

# 2. 目标与边界

## 2.1 目标

| 目标 ID | 类目 | 目标描述 | 可度量指标 | 目标值 |
|---------|------|----------|------------|--------|
| GOAL-001 | 用户 | 用户可手动切换至夜间模式，降低屏幕亮度 | 切换后页面背景为深色、文字为浅色 | 100% 页面覆盖 |
| GOAL-002 | 用户 | 夜间模式偏好被持久化，下次进入自动恢复 | localStorage 保存用户选择 | 刷新/重进后保持 |
| GOAL-003 | 用户 | 首次访问跟随系统偏好（prefers-color-scheme）自动选择初始主题 | 检测系统暗色偏好时进入夜间模式 | 首次访问正确匹配 |
| GOAL-004 | 技术 | 夜间模式与老人模式独立工作，可同时启用 | 两种模式互不干扰 | 4 种组合均正常 |
| GOAL-005 | 用户 | 夜间模式支持中英文切换文案与提示 | i18n 覆盖 zh/en | 两种语言下均正确 |

## 2.2 非目标

| 非目标 ID | 不做的内容 | 原因 / 后续规划 |
|-----------|------------|------------------|
| NG-001 | 不引入 CSS 变量或语义 token 层重构 | AGENTS.md 明确约定颜色类名直接硬编码在 JSX，本次沿用 dark: 变体方式 |
| NG-002 | 不引入额外 UI 库或设计系统框架 | AGENTS.md 明确禁止 |
| NG-003 | 不修改 server/ 目录 | AGENTS.md 明确禁止 |
| NG-004 | 不做主题色自定义（如可选主题色） | 超出本次需求范围 |
| NG-005 | 不做定时自动切换（如按时间自动进入夜间模式） | 本次仅做手动切换 + 系统偏好初始化 |
| NG-006 | 不修改后端接口或数据逻辑 | 应用为纯前端内存态，无后端 |

---

# 3. 核心概念

| 概念 / 术语 | 描述 | 备注 |
|-------------|------|------|
| 夜间模式（Dark Mode） | 将页面从浅色背景切换为深色背景的显示模式 | 本 Spec 核心概念 |
| 老人模式（Elderly Mode） | 已有功能，放大字号约 1.25 倍 + 增强对比度 | 夜间模式需与之共存 |
| 浅色主题（Light Theme） | 当前默认主题，rice 系背景 + charcoal 系文字 | 默认状态 |
| prefers-color-scheme | CSS 媒体查询，检测用户系统是否偏好暗色 | 用于首次访问初始化默认值（已确认） |

---

# 4. 页面与信息架构

## 4.1 入口路径

| 入口 ID | 入口位置 | 目标页面 | 权限 / 前置条件 | 备注 |
|---------|----------|----------|------------------|------|
| ENTRY-001 | TopBar 工具栏新增夜间模式切换按钮 | 当前页面原地切换 | 无额外权限 | 与老人模式、语言切换按钮并列 |

## 4.2 页面清单

| 页面 ID | 页面名称 | 页面用途 | 主要操作 | 关联 REQ |
|---------|----------|----------|----------|----------|
| PAGE-ALL | 全部页面 | 夜间模式适用于所有视图 | 切换按钮 | REQ-001 |

涉及视图：BindTable（桌台绑定）、WelcomeView（欢迎页）、MenuView（菜单）、OrderView（订单）、CheckoutView（结账）、CartPanel（购物车面板）、ServiceSheet（服务弹层）、DemoConsole（演示控制台）、TopBar（顶栏）、各 Dialog 弹窗。

## 4.3 页面关系

| 起点 | 用户动作 | 终点 | 说明 |
|------|----------|------|------|
| 任意页面 | 点击 TopBar 夜间模式按钮 | 当前页面（主题切换） | 不跳转页面，仅切换显示主题 |

---

# 5. 功能需求

## REQ-001: 夜间模式切换

**User Story**
> As a 餐厅顾客, I want 在点单时切换到夜间模式, so that 在低光环境下减轻屏幕对眼睛的刺激。

**Priority**: P0

**需求描述**
用户在应用任意页面可通过 TopBar 上的切换按钮在浅色模式和夜间模式之间切换。切换即时生效，无需刷新页面，并显示一条 toast 提示消息。用户的选择通过 localStorage 持久化，下次进入应用时自动恢复。首次访问时，根据系统偏好（`prefers-color-scheme: dark`）自动选择初始主题。夜间模式与老人模式相互独立，可同时启用。

**Acceptance Requirements**
- **REQ-001.1**: The system **shall** 在 TopBar 提供一个夜间模式切换按钮，按钮位置与老人模式、语言切换按钮并列，使用 lucide-react 的 `Moon`/`Sun` 图标。
- **REQ-001.2**: **When** 用户点击夜间模式切换按钮, the system **shall** 立即在 `<html>` 元素上切换 `dark` class（或等效机制），使全页面视觉从浅色主题切换为夜间主题。
- **REQ-001.3**: **When** 用户切换夜间模式, the system **shall** 将当前选择（`true`/`false`）保存到 `localStorage` 的 `dark-mode` key。
- **REQ-001.4**: **When** 用户切换夜间模式, the system **shall** 显示一条 toast 提示消息（如"已切换为夜间模式"/"已切换为日间模式"），与老人模式的行为一致。
- **REQ-001.5**: **When** 应用加载时, the system **shall** 读取 `localStorage` 的 `dark-mode` 值并恢复用户上次选择；若 `localStorage` 不可用，**shall** 降级为内存态，不报错不阻塞。
- **REQ-001.6**: **If** `localStorage` 中无 `dark-mode` 值（首次访问）, **then** the system **shall** 根据系统偏好（`prefers-color-scheme: dark`）设置初始值；系统偏好为 dark 时进入夜间模式，否则进入浅色模式。
- **REQ-001.7**: **If** `localStorage` 不可用且无法检测系统偏好, **then** the system **shall** 默认为浅色模式。
- **REQ-001.8**: The system **shall** 确保夜间模式与老人模式独立工作，同时启用时两种效果叠加（深色背景 + 放大字号 + 增强对比度）。

**用户交互**

| 步骤 | 用户动作 | 产品响应 |
|------|----------|----------|
| 1 | 用户在任意页面点击 TopBar 夜间模式按钮 | 页面立即从当前主题切换为另一主题，并显示 toast 提示 |
| 2 | 用户继续浏览或操作 | 所有页面、弹窗、面板均以新主题显示 |
| 3 | 用户关闭/刷新页面后重新进入 | 自动恢复上次主题选择 |
| 4 | 首次访问且系统偏好为 dark | 自动进入夜间模式 |
| 5 | 用户同时开启老人模式 | 夜间模式深色背景 + 老人模式放大字号同时生效 |

**关联埋点**: 无（概念演示应用，无埋点系统）
**实现映射**: Tasks T-001

---

## REQ-002: 夜间模式视觉覆盖

**User Story**
> As a 餐厅顾客, I want 夜间模式下所有页面、组件、弹窗均显示为深色主题, so that 切换后体验一致、无遗漏。

**Priority**: P0

**需求描述**
夜间模式下，全部页面的背景、卡片、文字、按钮、弹窗、图标等元素应呈现深色主题。深色主题需保证文字与背景之间的对比度满足 WCAG AA 标准（≥ 4.5:1）。已有老人模式的对比度增强规则在夜间模式下同样适用。

**Acceptance Requirements**
- **REQ-002.1**: The system **shall** 在夜间模式下将页面背景从 `rice` 系（浅色）切换为 `charcoal` 系（深色）。
- **REQ-002.2**: The system **shall** 在夜间模式下将主要文字颜色从 `charcoal` 系（深色）切换为 `rice` 系（浅色）。
- **REQ-002.3**: The system **shall** 保持 `chili`（红色强调）和 `amber`（徽章色）在夜间模式下的视觉辨识度，必要时调整明度。
- **REQ-002.4**: The system **shall** 确保所有 Dialog/弹窗组件在夜间模式下也呈现深色主题。
- **REQ-002.5**: The system **shall** 确保 TopBar 的横幅条（`bg-charcoal-900`）在夜间模式下仍有视觉层次区分（如更深的背景或边框区分）。
- **REQ-002.6**: **If** 夜间模式与老人模式同时启用, **then** the system **shall** 保证老人模式的对比度增强规则在深色背景下同样有效。
- **REQ-002.7**: The system **shall** 确保 `index.html` 中 `index.html` 的内联脚本在 React 挂载前根据 `dark-mode` localStorage 值设置 `<html>` 的 `dark` class，避免主题闪烁（FOUC）。

**用户交互**: 见 REQ-001

**关联埋点**: 无
**实现映射**: Tasks T-002

---

## REQ-003: 国际化文案

**User Story**
> As a 使用英文界面的用户, I want 夜间模式切换按钮有英文提示, so that 能够理解按钮功能。

**Priority**: P1

**需求描述**
夜间模式切换按钮的 `aria-label` 和 toast 提示文案需在中英文下均有对应翻译。

**Acceptance Requirements**
- **REQ-003.1**: The system **shall** 在 `i18n.ts` 的 zh/en 资源中同步添加夜间模式相关文案（aria-label、toast 提示）。
- **REQ-003.2**: **When** 用户切换夜间模式, the system **shall** 显示与当前语言匹配的切换提示消息。

**i18n 文案规划**

| key | zh | en | 用途 |
|-----|----|----|------|
| `common.aria_dark` | 切换至日间模式 | Switch to light mode | 夜间模式已开启时按钮 aria-label |
| `common.aria_light` | 切换至夜间模式 | Switch to dark mode | 浅色模式时按钮 aria-label |
| `common.toast_dark` | 已切换为夜间模式 | Switched to dark mode | 切换到夜间模式的 toast |
| `common.toast_light` | 已切换为日间模式 | Switched to light mode | 切换到浅色模式的 toast |

**关联埋点**: 无
**实现映射**: Tasks T-003

---

# 6. 字段与校验

| 字段 ID | 字段名称 | 类型 | 必填 | 默认值 | 约束 / 校验 | 使用页面 / 展示位置 | 关联 REQ |
|---------|----------|------|------|--------|-------------|----------------------|----------|
| FIELD-001 | dark-mode（localStorage） | string | 否 | 无（首次访问） | 值为 `"true"` 或 `"false"` | localStorage | REQ-001 |
| FIELD-002 | dark class（html 元素） | boolean | 否 | 首次访问由系统偏好决定 | 存在或不存在 | `<html>` class | REQ-001, REQ-002 |
| FIELD-003 | aria-label | string | 是 | 见 i18n | 非空 | TopBar 切换按钮 | REQ-003 |
| FIELD-004 | toast message | string | 是 | 见 i18n | 非空 | 切换提示 toast | REQ-001, REQ-003 |

---

# 7. 状态与流转

## 7.1 状态定义

| 状态 ID | 状态名称 | 含义 | 进入条件 | 退出条件 |
|---------|------|------|----------|----------|
| STATE-LIGHT | 浅色模式 | 默认浅色主题显示 | 初始加载（无系统偏好）/ 用户切换至浅色 | 用户点击切换按钮 |
| STATE-DARK | 夜间模式 | 深色主题显示 | 用户切换至夜间 / 系统偏好为 dark / localStorage 为 true | 用户点击切换按钮 |

## 7.2 操作流转

| 操作 ID | 用户动作 | 前置状态 | 目标状态 | 生效时机 | 失败处理 | 关联 REQ |
|---------|----------|----------|----------|----------|----------|----------|
| ACTION-001 | 点击夜间模式切换按钮 | STATE-LIGHT | STATE-DARK | 立即 + toast 提示 | 无失败场景 | REQ-001 |
| ACTION-002 | 点击夜间模式切换按钮 | STATE-DARK | STATE-LIGHT | 立即 + toast 提示 | 无失败场景 | REQ-001 |
| ACTION-003 | 页面加载（有 localStorage 值） | 无 | STATE-DARK 或 STATE-LIGHT | 挂载时（内联脚本先执行） | localStorage 不可用则降级内存态 | REQ-001 |
| ACTION-004 | 页面加载（无 localStorage 值） | 无 | STATE-DARK 或 STATE-LIGHT | 挂载时（检测 prefers-color-scheme） | 无法检测系统偏好则默认浅色 | REQ-001 |

---

# 8. API 设计

本次无 API 变更。应用为纯前端内存态，不涉及后端接口。

---

# 9. 非功能性需求

| NFR ID | 类别 | 要求 | 验收方法 |
|--------|------|------|----------|
| NFR-001 | 兼容 | 夜间模式在所有现有视图（bind/welcome/menu/order/checkout）下正常显示 | 逐一切换视图检查深色主题覆盖 |
| NFR-002 | 兼容 | 夜间模式与老人模式可同时启用，互不干扰 | 同时开启两种模式，检查视觉效果叠加 |
| NFR-003 | 性能 | 主题切换即时生效，无可感知延迟（< 100ms） | 手动切换观察 |
| NFR-004 | 可访问性 | 夜间模式下文字对比度 ≥ 4.5:1（WCAG AA） | 对比度工具检查关键文字/背景组合 |
| NFR-005 | 兼容 | 不引入新依赖库；在现有 Tailwind CSS 架构内实现 | 检查 package.json 无新增依赖 |
| NFR-006 | 稳定性 | localStorage 不可用时降级为内存态，不报错不阻塞 | 清除 localStorage 后操作 |
| NFR-007 | 可观测 | 主题切换有 250ms 过渡动画（已有 CSS 过渡覆盖 background-color, border-color, color） | 视觉检查过渡效果 |
| NFR-008 | 可访问性 | 避免 FOUC（Flash of Unstyled Content），index.html 内联脚本在 React 挂载前设置 dark class | 检查首次加载无主题闪烁 |

---

# 10. 追溯矩阵

| REQ / NFR ID | 设计章节 | Task ID | QA 用例 | API / 埋点 / 迁移 | 证据来源 |
|--------------|----------|---------|---------|-------------------|----------|
| REQ-001 | §5 REQ-001 | T-001 | QA-001~006 | localStorage: dark-mode | 仓库源码 useElderlyMode.ts 模式参考 |
| REQ-002 | §5 REQ-002 | T-002 | QA-007~010 | Tailwind dark: 变体 | 仓库 AGENTS.md 样式约定 |
| REQ-003 | §5 REQ-003 | T-003 | QA-011~012 | i18n zh/en | 仓库 i18n.ts |
| NFR-001~008 | §9 | T-001~003 | QA-001~012 | 无 | 仓库 AGENTS.md |

---

# 11. 验收标准

- [主流程] 在【应用任意页面】下，用户执行【点击 TopBar 夜间模式切换按钮】后，系统应【立即切换为深色主题，并显示 toast 提示消息】。
- [主流程] 在【应用首次访问且系统偏好为 dark】下，系统应【自动进入夜间模式，页面显示深色主题】。
- [持久化] 在【用户已切换至夜间模式并刷新页面】后，系统应【自动恢复夜间模式，无需重新切换】。
- [边界约束] 本次改动不应影响【老人模式功能、语言切换功能、订单流程、服务呼叫等既有能力】。
- [兼容] 在【夜间模式与老人模式同时启用】下，系统应【深色背景 + 放大字号 + 增强对比度同时生效】。
- [内容正确性] 展示的【toast 提示消息和 aria-label】应符合【当前语言对应的 i18n 文案】。
- [异常处理] 当出现【localStorage 不可用】时，系统应【降级为内存态，不报错不阻塞，默认浅色或系统偏好】。
- [兼容稳定] 变更后【所有视图页面、弹窗、面板】保持正常，无明显异常。
- [无闪烁] 首次加载时【不应出现主题闪烁（FOUC）】。

---

# 12. 待确认清单

## 缺失信息

无。所有关键决策已通过用户交互确认。

## 冲突信息

无。

## 推断项

1. **推断**: 夜间模式实现将沿用老人模式的架构模式——`useDarkMode` hook + localStorage 持久化 + `<html>` class 切换 + index.css 中添加 dark 主题样式 + Tailwind `darkMode: 'class'` 配置。
   - **依据**: 仓库 `useElderlyMode.ts` 已建立此模式，AGENTS.md 编码约定要求沿用。
   - **风险**: 低，与现有模式高度一致。

2. **推断**: 夜间模式下 `chili`（红色强调色）保持不变或微调明度，不需要完全更换色系。
   - **依据**: AGENTS.md 样式约定中 chili 用于按钮/强调/徽章，在深色背景下红色仍有足够辨识度。
   - **风险**: 低。

3. **推断**: TopBar 按钮使用 lucide-react 的 `Moon`/`Sun` 图标组合（夜间模式关闭时显示 Moon 表示可切至夜间，开启时显示 Sun 表示可切回日间）。
   - **依据**: 现有按钮均使用 lucide-react 图标，项目已安装该依赖。
   - **风险**: 低。

4. **推断**: AGENTS.md 提到"颜色类名直接硬编码在 JSX，不用 CSS 变量或语义 token 层"，因此夜间模式将采用 Tailwind `dark:` 前缀变体方式实现，而非 CSS 变量重构。
   - **依据**: AGENTS.md 明确约定 + 现有代码无 CSS 变量。
   - **风险**: 中。dark: 变体数量较多，需覆盖全部组件。

5. **推断**: `index.html` 内联脚本需扩展，在 React 挂载前读取 `dark-mode` localStorage 和 `prefers-color-scheme` 设置 `<html>` 的 `dark` class，避免 FOUC。
   - **依据**: AGENTS.md 明确要求"需要在 React 挂载前设置 html 属性/class 时，扩展 index.html 的内联脚本"；现有内联脚本已为语言做了类似处理。
   - **风险**: 低。

---

# 13. 实现方向建议（供开发节点参考）

> 以下为实现方向建议，非需求约束，具体实现方案由代码开发节点决定。

## 13.1 Tailwind 配置

- 在 `tailwind.config.js` 中添加 `darkMode: 'class'`。

## 13.2 useDarkMode hook

- 新建 `src/hooks/useDarkMode.ts`，参照 `useElderlyMode.ts` 的结构：
  - `STORAGE_KEY = 'dark-mode'`
  - 初始化时读取 localStorage，无值时检测 `window.matchMedia('(prefers-color-scheme: dark)')`
  - `applyDarkMode(enabled)` 切换 `<html>` 的 `dark` class
  - `toggle()` 切换并持久化
  - localStorage 不可用时 try/catch 降级

## 13.3 index.html 内联脚本扩展

- 在现有内联脚本中追加 dark-mode 初始化逻辑，避免 FOUC。

## 13.4 组件 dark: 变体

- 为所有使用 `bg-rice-*`、`bg-white`、`text-charcoal-*`、`border-charcoal-*` 等颜色类的组件添加 `dark:` 变体。
- 重点组件：App.tsx（根布局）、TopBar、BindTable、WelcomeView、MenuView、OrderView、CheckoutView、CartPanel、ServiceSheet、DemoConsole、Dialog 弹窗。

## 13.5 i18n 文案

- 在 `src/i18n.ts` 的 zh/en 资源中添加 `common.aria_dark`、`common.aria_light`、`common.toast_dark`、`common.toast_light`。

## 13.6 TopBar 集成

- 在 TopBar 中新增夜间模式切换按钮（Moon/Sun 图标），与老人模式按钮并列。
- 切换时 dispatch toast 消息（复用现有 `SET_MESSAGE` action）。
