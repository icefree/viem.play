# Viem Playground 测试方案文档

本项目采用现代化的测试栈，旨在确保节点逻辑的正确性、UI 组件的稳定性以及整体工作流的连贯性。

## 1. 测试框架选型 (1 + 3 + 4)

根据项目基于 **Vite + React 19 + Viem** 的特征，选定以下组合：

- **1. Vitest**: 核心测试运行器。与 Vite 完美集成，速度极快，兼容 Jest API。
- **3. React Testing Library (RTL)**: 组件测试工具。专注于用户行为模拟，确保 UI 交互符合预期。
- **4. Playwright**: E2E (端到端) 测试框架。在真实浏览器中运行，验证完整的节点工作流。

## 2. 测试架构设计

### 2.1 单元测试 (Unit Tests - Vitest)

**目标**: 验证单个节点 (Node) 的逻辑。

- **位置**: `src/nodes/**/__tests__/*.test.ts`
- **重点**:
  - `onExecute` 逻辑：数据转换是否正确。
  - 输入处理：对 `null`、`undefined` 及异常数据的健壮性。
  - 异步处理：Mock Viem Client 返回值，测试 Promise 链。

### 2.2 组件测试 (Component Tests - Vitest + RTL)

**目标**: 验证 React UI 组件。

- **位置**: `src/components/**/__tests__/*.test.tsx`
- **重点**:
  - 渲染正确性：日志面板、搜索框、菜单等是否显示。
  - 用户交互：点击按钮、输入文本后的状态更新。

### 2.3 集成与 E2E 测试 (Integration & E2E - Playwright)

**目标**: 验证节点间的连接与数据流。

- **位置**: `tests/e2e/*.spec.ts`
- **重点**:
  - 拖拽连接：模拟用户拖拽线缆连接节点。
  - 核心链路：例如 `Chain -> Client -> getBalance -> Display` 的完整闭环。

## 3. 安装与配置

### 3.1 安装依赖

```bash
pnpm add -D vitest @vitest/ui happy-dom @testing-library/react @testing-library/jest-dom @playwright/test
```

### 3.2 脚本配置 (package.json)

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  }
}
```

### 3.3 运行 E2E 测试

Playwright 提供了多种运行模式，适用于不同的场景：

1.  **无头模式 (Headless)** - 默认
    - 适用于 CI 环境，速度最快。
    ```bash
    npx playwright test
    ```
2.  **UI 界面模式 (Interactive UI)** -- **推荐用于调试**
    - 提供时间轴视图，可以查看每一步的截图和 DOM 快照。
    - 可以在不重新启动整个套件的情况下重跑单个测试。

    ```bash
    npx playwright test --ui
    ```

3.  **显示浏览器模式 (Headed Mode)**
    - 能够看到浏览器弹出来并在进行自动操作。

    ```bash
    npx playwright test --headed
    ```

    - **SlowMo (慢放)**: 如果执行太快看不清，可以在 `playwright.config.ts` 中配置 `launchOptions: { slowMo: 1000 }` 来减慢速度。

4.  **调试单一文件**

    ```bash
    npx playwright test tests/browser/app.spec.ts --headed
    ```

5.  **查看测试报告**
    ```bash
    npx playwright show-report
    ```

## 4. Mock 策略

- **Viem Client**: 统一使用 `vi.fn().mockResolvedValue(...)` 模拟区块链返回。
- **LiteGraph**: 通过 `happy-dom` 配合 `HTMLCanvasElement.prototype.getContext = vi.fn()` 模拟画布环境。
- **Logger**: 监测 `src/stores/useLogStore` 的调用，验证节点是否输出了预期的调试信息。

## 5. 质量指标 (KPI)

- **核心节点覆盖率**: > 90% (Clients, Utilities)
- **Action 节点覆盖率**: > 75%
- **关键 UI 组件**: 覆盖所有主交互路径
- **CI 集成**: 每次 PR 必须通过所有测试用例

---

> [!TIP]
> **开发指南**: 建议在开发新节点时同步编写 `.test.ts` 文件，采用 TDD (测试驱动开发) 模式可以显著减少在浏览器中手动连接节点的重复调试工作。
