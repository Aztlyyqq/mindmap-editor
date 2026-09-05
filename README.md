# 思维导图编辑器 MindMap Editor

本地离线的思维导图 / 复盘工具：纯前端 **Vue 3 单页应用**（零后端、数据只存本机 localStorage），也可用 **Electron** 打包成 Windows / macOS / Linux 桌面程序。提供手机触摸版与 PC 桌面版两套页面。

## ✨ 功能

- **多导图管理**：标签栏切换，新建 / 重命名 / 删除多个思维导图，自动保存到本机
- **单画布多导图**：一个画布并存多个根节点（🌱），同屏对照
- **节点编辑**：加子节点 / 同级节点、删除、双击或 F2 编辑文字、自由拖动（整棵子树跟随）、一键重置自动布局
- **标签联想**：给节点打标签，点标签高亮所有同标签节点并画联想线
- **自由连接**：任意节点之间建立连接，连接线上可写**批注**，可在管理面板增删改
- **导出**：Markdown 大纲、Mermaid 源码、2 倍高清 PNG 图片
- **视图**：滚轮 / 双指缩放、拖拽平移、适应窗口、夜间模式
- **快捷键（PC）**：`Tab` 加子节点、`Enter` 加同级、`Delete` 删除、`F2` 编辑、`Ctrl ±` 缩放、`Ctrl+0` 适应窗口

## 📁 目录结构

```
.
├── index.html      # PC 版页面（Electron 加载的入口）
├── mobile.html     # 手机触摸版页面
├── vendor/
│   └── vue.global.prod.min.js   # Vue 3.4.38 运行库（由脚本自动获取，见下）
├── scripts/
│   └── prepare-vendor.mjs       # 下载 Vue 运行库到 vendor/
├── .github/workflows/prepare-vendor.yml  # CI 自动补齐 vendor
├── main.js         # Electron 主进程（窗口、中文菜单、PNG 保存对话框）
└── package.json
```

## 🧰 首次准备：获取 Vue 运行库

页面以 `<script src="vendor/vue.global.prod.min.js">` 方式本地引用 Vue（保证完全离线）。该第三方库不手工入库，通过下面任一方式获取：

```bash
# 方式一：安装依赖时 postinstall 会自动执行
npm install

# 方式二：单独执行（多 CDN 源自动兜底）
npm run prepare:vendor
```

> 推送到 GitHub 后，Actions 也会自动运行该脚本并把 vendor 提交回仓库，所以直接下载仓库 ZIP 通常已自带 vendor。

## 🖥 直接使用（浏览器）

完成上面的“获取运行库”后：

- **电脑**：双击 `index.html` 用现代浏览器打开
- **手机**：把 `mobile.html` 与 `vendor/` 一起传到手机，用浏览器打开；可在浏览器菜单选“添加到主屏幕”像 App 一样使用

## 📦 打包桌面程序（exe / app / AppImage）

环境要求：Node.js 18 及以上。

```bash
npm install          # 安装 electron、@electron/packager，并自动准备 vendor
npm run start        # 可选：本地预览桌面应用
npm run dist:win     # 打包 Windows 64 位 → dist/MindMapEditor-win32-x64/
# 其他平台：npm run dist:mac / npm run dist:linux
```

Windows 产物为免安装绿色目录，保持文件夹完整，双击其中的 **MindMapEditor.exe** 即可离线运行。未购买代码签名证书时，SmartScreen 首次可能提示“未知发布者”，选“更多信息 → 仍要运行”。

## 💾 数据存储说明

数据保存在本机，localStorage 键名：

| 版本 | 导图数据 | 界面偏好 |
|---|---|---|
| PC / Electron | `mindmap_pc_v1` | `mindmap_pc_pref_v1` |
| 手机网页版 | `mindmap_multi_v1` | `mindmap_pref_v1` |

清除浏览器 / 应用数据会同时清除导图，重要内容请用“导出”功能备份。

## 🛠 技术栈

- Vue 3.4.38（生产版本地内联引用，运行期无任何外部网络请求）
- SVG 贝塞尔曲线绘制树连线 / 自由连接 / 联想线
- Canvas 2D 生成 2 倍高清 PNG
- Electron 44 桌面外壳（中文菜单、系统保存对话框、单实例运行）

## 📄 License

MIT（Vue 为 MIT 协议第三方库，版权归 Vue 作者）
