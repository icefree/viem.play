# Viem Playground ⚡

一个基于节点的可视化 Web3 接口构建与调试工具。受 [eth.build](https://github.com/austintgriffith/eth.build) 启发，基于 [Viem](https://viem.sh/) 实现。

![Viem Playground Preview](https://via.placeholder.com/800x450.png?text=Viem+Playground+Preview)

## 🌟 特性

- **可视化开发**：使用节点连接的方式构建复杂的区块链交互逻辑。
- **全方位的 Viem 支持**：
  - **Clients**: Public, Wallet, Test Clients.
  - **Actions**: 获取余额、发送交易、监听区块、合约读写等。
  - **Accounts**: 支持私钥、助记词及 JSON-RPC 账户。
  - **Ens/Siwe/Abi**: 内置 ENS 解析、SIWE 消息签名及 ABI 编解码节点。
- **高效交互**：
  - **快速搜索**：按 `⌘ + K` (或 `Ctrl + K`) 快速查找并添加节点。
  - **自动连接**：双击输入/输出插槽可智能推荐并创建匹配的节点。
  - **小地图**：右下角概览图，支持在大画布中快速导航。
- **文件管理**：支持将设计保存到浏览器本地，以及导入/导出 JSON 文件。

## 🛠️ 技术栈

- **框架**: [React 19](https://reactjs.org/)
- **构建工具**: [Vite](https://vitejs.dev/)
- **Web3 库**: [Viem](https://viem.sh/)
- **图形引擎**: [LiteGraph.js](https://github.com/jagenjo/litegraph.ts)
- **状态管理**: [Zustand](https://github.com/pmndrs/zustand)
- **样式**: Vanilla CSS

## 🚀 快速开始

### 安装依赖

建议使用 `pnpm`:

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

启动后在浏览器打开 `http://localhost:5173`。

## 📖 使用指南

1. **添加节点**：
   - 悬停顶部的分类菜单选择节点。
   - 或者使用 `⌘ + K` 进行全局搜索。
2. **连接节点**：
   - 拖拽节点的输出插槽连接到另一个节点的输入插槽。
   - **技巧**：双击空插槽可自动创建并连接相关节点。
3. **保存与加载**：
   - 点击右上角的 `Save` 将导出设计为 JSON 文件。
   - 点击 `Load` 可以读取本地 JSON 文件恢复设计。

## 📄 许可

MIT
