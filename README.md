# 思维导图编辑器 MindMap Editor

本地离线的思维导图 / 复盘工具：纯前端 **Vue 3 单文件**（零外部依赖、可离线），也可用 **Electron** 打包成 Windows 桌面 exe。所有数据只保存在本机浏览器 localStorage，无需联网、无需后端、无需注册。

## ✨ 功能

- **多导图管理**：顶部标签栏切换，可新建 / 重命名 / 删除多个思维导图，自动保存到本机
- **单画布多导图**：一个画布上可并存多个根节点（🌱），同屏对照
- **节点编辑**：加子节点 / 同级节点、删除、双击或 F2 编辑文字、自由拖动（整棵子树跟随）、一键重置自动布局
- **标签联想**：给节点打标签，点击标签高亮所有同标签节点并画出联想线
- **自由连接**：任意两个（多个）节点之间建立连接，连接线上可写**批注**，可在管理面板增删改
- **导出**：Markdown 大纲、Mermaid 源码、2 倍高清 PNG 图片
- **视图**：滚轮 / 双指缩放、拖拽平移、适应窗口、夜间模式
- **快捷键（PC）**：`Tab` 加子节点、`Enter` 加同级、`Delete` 删除、`F2` 编辑、`Ctrl ±` 缩放、`Ctrl+0` 适应窗口

## 📁 目录结构

```
.
├── index.html      # PC 版单文件应用（也是 Electron 加载的入口页面）
├── mobile.html     # 手机网页版（触摸交互，浏览器打开即用，可“添加到主屏幕”）
├── main.js         # Electron 主进程（窗口、中文菜单、PNG 保存对话框）
├── package.json    # Electron 依赖与打包脚本
└── README.md
```

## 🖥 直接使用（不用打包）

- **电脑**：双击 `index.html`，用任意现代浏览器打开即可
- **手机**：把 `mobile.html` 传到手机，用浏览器打开；iOS/Android 均可在浏览器菜单选“添加到主屏幕”，像 App 一样使用

## 📦 打包 Windows exe

环境要求：Node.js 18 及以上。

```bash
npm install          # 安装 electron 与 @electron/packager
npm run start        # 可选：本地预览桌面应用
npm run dist:win     # 打包 Windows 64 位
```

打包完成后产物在 `dist/MindMapEditor-win32-x64/`，整个文件夹保持完整，双击其中的 **MindMapEditor.exe** 即可运行（免安装、离线）。

> 打包其他平台：`npm run dist:mac`（macOS）、`npm run dist:linux`（Linux）。
> 未购买代码签名证书时，Windows SmartScreen 首次可能提示“未知发布者”，选“更多信息 → 仍要运行”。

## 💾 数据存储说明

数据保存在本机，键名：

| 版本 | 导图数据 | 界面偏好 |
|---|---|---|
| PC / Electron | `mindmap_pc_v1` | `mindmap_pc_pref_v1` |
| 手机网页版 | `mindmap_multi_v1` | `mindmap_pref_v1` |

清除浏览器 / 应用数据会同时清除导图，重要内容请用“导出”功能备份。

## 🛠 技术栈

- Vue 3.4（生产版内联，页面无任何外部网络请求）
- SVG 贝塞尔曲线绘制树连线 / 自由连接 / 联想线
- Canvas 2D 手绘 2 倍高清 PNG 导出
- Electron 44 作为桌面外壳（中文菜单、系统保存对话框、单实例运行）

## 📄 License

MIT
