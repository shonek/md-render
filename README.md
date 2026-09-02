# OMS 订单系统 — Markdown 文档查看器

本地静态 HTML 应用，用于浏览 OMS 订单系统的设计文档。支持 **mermaid** + **PlantUML** 双图表语法，图表可**缩放、拖拽**查看。

## 快速启动

> ⚠️ **不能直接双击打开 `index.html`！** 浏览器在 `file://` 协议下会禁止 `fetch` 加载本地 `.md` 文件，导致所有菜单都报错。

### 启动本地服务（任选一种）

```bash
# 方法 1：Python 3（推荐，Python 3.7+ 自带）
python -m http.server 8000

# 方法 2：Node.js（如果装了 npx）
npx serve .

# 方法 3：PHP
php -S localhost:8000
```

### 浏览器打开

```
http://localhost:8000/
```

## 文件结构

```
md-render/
├── index.html       # 整个应用（布局、CSS、逻辑）
├── 测试用例.md      # PlantUML 用例图
├── 物理ER图.md      # mermaid erDiagram（物理表）
├── 逻辑ER图.md      # mermaid erDiagram（业务实体）
├── 架构图.md        # mermaid flowchart（部署 + 调用关系）
└── README.md        # 本文件
```

## 使用说明

- **切换菜单**：点击左侧菜单项，会加载同名 `<菜单>.md` 文件并渲染
- **深链**：URL `#<菜单名>` 可直接定位，例如 `http://localhost:8000/#物理ER图`
- **图表交互**：
  - **鼠标拖拽** → 平移图表
  - **Ctrl + 滚轮**（macOS ⌘ + 滚轮）→ 缩放
  - **普通滚轮** → 滚动页面（图表不拦截）
  - 工具栏 `+ / − / 重置` 按钮 → 居中缩放、复位视图
  - 图表右下角可手动拖拽拉高容器

## 图表语法说明

- **mermaid**：使用 ` ```mermaid ` 代码块，所有 mermaid 子类型（flowchart / erDiagram / sequenceDiagram / stateDiagram 等）均支持
- **PlantUML**：使用 ` ```plantuml ` 或 ` ```puml ` 或 ` ```uml ` 代码块，图表源文通过公共 `plantuml.com` 服务渲染（源文会发到第三方）
  - 如需内网渲染，可修改 `index.html` 中的 `PLANTUML_BASE` 常量改为 Kroki/自托管 URL

## 添加新文档

1. 在目录中新增 `<菜单名>.md`（文件名须与菜单项完全一致）
2. 编辑 `index.html` 顶部的 `MENU` 数组添加菜单名
3. 刷新浏览器

## 技术栈

| 库 | 版本 | CDN |
|---|---|---|
| marked | 4.x | `https://cdn.jsdelivr.net/npm/marked@4/marked.min.js` |
| mermaid | 10.x | `https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js` |
| plantuml-encoder | 1.4.0 | `https://cdn.jsdelivr.net/npm/plantuml-encoder@1.4.0/dist/plantuml-encoder.min.js` |
| panzoom | 9.4.3 | `https://cdn.jsdelivr.net/npm/panzoom@9.4.3/dist/panzoom.min.js` |

零构建步骤，零依赖安装，所有库通过 CDN 加载（需联网）。