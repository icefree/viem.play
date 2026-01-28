# Viem Playground Testing Strategy

This project adopts a modern testing stack to ensure node logic correctness, UI component stability, and overall workflow consistency.

## 1. Framework Selection (1 + 3 + 4)

Based on the project's **Vite + React 19 + Viem** characteristics, the following combination was selected:

- **1. Vitest**: Core test runner. Perfectly integrated with Vite, extremely fast, and Jest API compatible.
- **3. React Testing Library (RTL)**: Component testing tool. Focuses on user behavior simulation to ensure UI interactions meet expectations.
- **4. Playwright**: E2E (End-to-End) testing framework. Runs in a real browser to verify complete node workflows.

## 2. Test Architecture Design

### 2.1 Unit Tests (Vitest)

**Goal**: Verify individual Node logic.

- **Location**: `src/nodes/**/__tests__/*.test.ts`
- **Focus**:
  - `onExecute` logic: Correct data transformation.
  - Input handling: Robustness against `null`, `undefined`, and anomalous data.
  - Async handling: Mock Viem Client returns, test Promise chains.

### 2.2 Component Tests (Vitest + RTL)

**Goal**: Verify React UI components.

- **Location**: `src/components/**/__tests__/*.test.tsx`
- **Focus**:
  - Rendering correctness: Logs panel, search box, menus, etc.
  - User interaction: State updates after button clicks, text input.

### 2.3 Integration & E2E Tests (Playwright)

**Goal**: Verify node connections and data flow.

- **Location**: `tests/e2e/*.spec.ts`
- **Focus**:
  - Drag-and-connect: Simulate user dragging cables to connect nodes.
  - Core workflows: E.g., `Chain -> Client -> getBalance -> Display` complete loop.

## 3. Installation and Configuration

### 3.1 Install Dependencies

```bash
pnpm add -D vitest @vitest/ui happy-dom @testing-library/react @testing-library/jest-dom @playwright/test
```

### 3.2 Script Configuration (package.json)

```json
{
  "scripts": {
    "test": "vitest",
    "test:unit": "vitest src",
    "test:integration": "vitest tests/e2e",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  }
}
```

### 3.3 Running Unit & Integration Tests

- **Run all tests**:
  ```bash
  npm run test
  ```
- **Run unit tests only** (src/\*\*):
  ```bash
  npm run test:unit
  ```
- **Run integration tests only** (tests/e2e/\*\*):
  ```bash
  npm run test:integration
  ```

### 3.4 Running E2E Tests

Playwright offers multiple running modes suitable for different scenarios:

1.  **Headless Mode** - Default
    - Suitable for CI environments, fastest speed.

    ```bash
    npx playwright test
    ```

2.  **Interactive UI Mode** -- **Recommended for Debugging**
    - Provides a timeline view to see screenshots and DOM snapshots for each step.
    - Rerun single tests without restarting the entire suite.

    ```bash
    npx playwright test --ui
    ```

3.  **Headed Mode**
    - Watch the browser pop up and perform automatic actions.

    ```bash
    npx playwright test --headed
    ```

    - **SlowMo**: If it runs too fast to see, configure `launchOptions: { slowMo: 1000 }` in `playwright.config.ts` to slow it down.

4.  **Debug Single File**

    ```bash
    npx playwright test tests/browser/app.spec.ts --headed
    ```

5.  **View Test Report**
    ```bash
    npx playwright show-report
    ```

## 4. Mock Strategy

- **Viem Client**: Use `vi.fn().mockResolvedValue(...)` to simulate blockchain returns.
- **LiteGraph**: Use `happy-dom` with `HTMLCanvasElement.prototype.getContext = vi.fn()` to simulate canvas environment.
- **Logger**: Monitor `src/stores/useLogStore` calls to verify if nodes output expected debug information.

## 5. Quality Metrics (KPI)

- **Core Node Coverage**: > 90% (Clients, Utilities)
- **Action Node Coverage**: > 75%
- **Key UI Components**: Cover all main interaction paths
- **CI Integration**: Every PR must pass all test cases

## 6. Node Test Coverage 📊

**Legend**: ✅ = Covered, ⬜️ = Pending, 🚧 = WIP

### 6.1 Public Actions

| Node Name                  | Unit Test | E2E Test | Notes                      |
| -------------------------- | :-------: | :------: | -------------------------- |
| `GetBlock`                 |    ✅     |          |                            |
| `GetBlockNumber`           |    ✅     |    ✅    | Core workflow verification |
| `GetBlockTransactionCount` |    ✅     |          |                            |
| `WatchBlockNumber`         |    ✅     |          |                            |
| `WatchBlocks`              |    ✅     |          |                            |
| `GetBalance`               |    ⬜️     |          |                            |
| `GetGasPrice`              |    ⬜️     |          |                            |
| `GetTransactionCount`      |    ⬜️     |          |                            |

### 6.2 Clients & Transports

| Node Name            | Unit Test | E2E Test | Notes |
| -------------------- | :-------: | :------: | ----- |
| `PublicClient`       |           |    ✅    |       |
| `WalletClient`       |    ⬜️     |          |       |
| `TestClient`         |    ⬜️     |          |       |
| `HttpTransport`      |           |    ✅    |       |
| `WebSocketTransport` |    ⬜️     |          |       |
| `IpcTransport`       |    ⬜️     |          |       |

### 6.3 Chains

| Node Name   | Unit Test | E2E Test | Notes            |
| ----------- | :-------: | :------: | ---------------- |
| `Chain`     |           |    ✅    | Mainnet verified |
| `ChainId`   |    ⬜️     |          |                  |
| `ChainInfo` |    ⬜️     |          |                  |

### 6.4 Wallet Actions

| Node Name         | Unit Test | E2E Test | Notes |
| ----------------- | :-------: | :------: | ----- |
| `SendTransaction` |    ⬜️     |          |       |
| `SignMessage`     |    ⬜️     |          |       |
| `SignTypedData`   |    ⬜️     |          |       |
| `GetAddresses`    |    ⬜️     |          |       |
| `SwitchChain`     |    ⬜️     |          |       |

### 6.5 Accounts

| Node Name             | Unit Test | E2E Test | Notes |
| --------------------- | :-------: | :------: | ----- |
| `GeneratePrivateKey`  |    ⬜️     |          |       |
| `GenerateMnemonic`    |    ⬜️     |          |       |
| `PrivateKeyToAccount` |    ⬜️     |          |       |
| `MnemonicToAccount`   |    ⬜️     |          |       |
| `ToAccount`           |    ⬜️     |          |       |

### 6.6 Test Actions

| Node Name               | Unit Test | E2E Test | Notes |
| ----------------------- | :-------: | :------: | ----- |
| `Mine`                  |    ⬜️     |          |       |
| `SetBalance`            |    ⬜️     |          |       |
| `ImpersonateAccount`    |    ⬜️     |          |       |
| `Snapshot`              |    ⬜️     |          |       |
| `Revert`                |    ⬜️     |          |       |
| `SetNextBlockTimestamp` |    ⬜️     |          |       |

### 6.7 Utilities & Others

| Node Name      | Unit Test | E2E Test | Notes |
| -------------- | :-------: | :------: | ----- |
| `Display`      |    ⬜️     |          |       |
| `ConsoleLog`   |    ⬜️     |          |       |
| `Timer`        |    ⬜️     |          |       |
| `Button`       |    ⬜️     |          |       |
| `FormatEther`  |    ⬜️     |          |       |
| `ParseEther`   |    ⬜️     |          |       |
| `Keccak256`    |    ⬜️     |          |       |
| `AddressInput` |    ⬜️     |          |       |
| `ToBigInt`     |    ⬜️     |          |       |
| `Trigger`      |    ⬜️     |          |       |

> **Dev Guide**: It is recommended to write `.test.ts` files synchronously when developing new nodes. Using TDD (Test Driven Development) pattern can significantly reduce repetitive manual node connection debugging in the browser.
