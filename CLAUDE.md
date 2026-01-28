# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Viem Playground is a visual node-based Web3 API builder and debugging tool powered by Viem. It uses React + Vite for the UI and LiteGraph.js for the node-based visual programming interface.

## Development Commands

```bash
# Install dependencies (use pnpm)
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Lint code
pnpm lint

# Run tests (watch mode)
pnpm test

# Run unit tests only (src/**)
pnpm test:unit

# Run integration tests only
pnpm test:integration

# Run E2E tests (headless)
pnpm test:e2e

# Run E2E tests with UI (recommended for debugging)
pnpm test:e2e:ui

# View E2E test report
npx playwright show-report
```

## Architecture

### Node System

All nodes are built on top of LiteGraph.js (`LGraphNode`). Nodes are organized into 14 categories following Viem's documentation structure:

1. **Clients** - PublicClient, WalletClient, TestClient, transports
2. **Public Actions** - getBlockNumber, getBalance, getBlock, etc.
3. **Wallet Actions** - sendTransaction, signMessage, etc.
4. **Test Actions** - setBalance, mine, impersonateAccount (Anvil/Hardhat)
5. **Accounts** - Private key & mnemonic generation
6. **Chains** - Chain configuration nodes
7. **Contract** - readContract, writeContract, deployContract
8. **ENS** - getEnsAddress, getEnsName, etc.
9. **SIWE** - Sign-In with Ethereum message handling
10. **ABI** - parseAbi, encode/decode functions
11. **EIP-7702** - Authorization handling
12. **Utilities** - formatEther, parseEther, Display, ConsoleLog
13. **Glossary** - Reference nodes (Terms, Units, ChainIds)
14. **Control** - Button, Timer for triggering flows

### Node Registration

All nodes are registered in `src/nodes/index.ts`. Each category has its own registration function (e.g., `registerPublicActionNodes()`). The registration order matters for the UI menu organization.

### Node Structure

Nodes extend `LGraphNode` from LiteGraph.js. Key patterns:

- **Inputs**: Defined in constructor via `addInput(name, type)`
  - Type `-1` = trigger/action input
  - Type `'publicClient'` = typed client input
  - Type `'bigint'`, `'string'`, `'number'` = data types
- **Outputs**: Defined via `addOutput(name, type)`
- **Execution**: `onExecute()` runs continuously; `onAction()` handles triggers
- **Data Flow**: Use `getInputData(index)` to read inputs, `setOutputData(index, value)` to write outputs
- **Visual**: `onDrawForeground(ctx)` for custom canvas rendering

Example node pattern:
```typescript
export class ExampleNode extends LGraphNode {
  static title = 'example'
  static desc = 'Description'
  color = '#6b46c1'  // Node header color
  bgcolor = '#44337a' // Node body color

  constructor() {
    super()
    this.addInput('client', 'publicClient')
    this.addInput('trigger', -1)
    this.addOutput('result', 'bigint')
  }

  async onAction(action: string) {
    if (action === 'trigger') {
      // Execute logic
    }
  }

  onExecute() {
    // Continuous execution logic
  }
}
```

### Testing Strategy

Three-layer testing approach:

1. **Unit Tests** (`src/**/__tests__/*.test.ts`): Test individual node logic using Vitest
   - Mock Viem clients with `vi.fn().mockResolvedValue()`
   - Test `onExecute`, input handling, async operations
   - Canvas mocked in `tests/utils/setup.ts`

2. **Component Tests** (`src/components/**/__tests__/*.test.tsx`): Test React components with React Testing Library

3. **E2E Tests** (`tests/browser/*.spec.ts`): Test full workflows with Playwright
   - Auto-starts dev server via `playwright.config.ts`
   - Tests node connections and data flow
   - Use UI mode (`pnpm test:e2e:ui`) for debugging

### State Management

- **Zustand** for global React state (logs, UI state)
- **LiteGraph** for node graph state (positions, connections, values)

### Path Aliases

- `@/` maps to `./src/`
- `@test-utils/` maps to `./tests/utils/`

### Auto-Pairing System

The auto-pairing feature (`src/nodes/auto-pair.ts`) allows double-clicking an empty slot to automatically create and connect a relevant node. Node type mappings are defined in the pairing system.

### Key Files

- `src/nodes/index.ts` - Node registration entry point
- `src/nodes/auto-pair.ts` - Auto-pairing logic
- `tests/utils/setup.ts` - Test environment setup (canvas mocking)
- `tests/utils/helpers.ts` - Test utilities (mock clients)
- `vitest.config.ts` - Unit/integration test config
- `playwright.config.ts` - E2E test config
