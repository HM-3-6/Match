<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/assets/banner-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="docs/assets/banner-light.svg">
</picture>

**组件化前端工程 · 文档先行 · 资源归一**

![status](https://img.shields.io/badge/status-early-22c55e?style=flat-square)
![PRs welcome](https://img.shields.io/badge/PRs-welcome-3b82f6?style=flat-square)
![conventional commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-f472b6?style=flat-square)
![license](https://img.shields.io/badge/license-TBD-94a3b8?style=flat-square)

<a href="#-项目结构">项目结构</a> ·
<a href="#-快速开始">快速开始</a> ·
<a href="#-开发约定">开发约定</a> ·
<a href="#-路线图">路线图</a> ·
<a href="#-贡献">贡献</a>

</div>

> **让界面、资产与需求各归其位。**

---

## 概览

| 层面     | 关注点           | 落点                                                  |
| :------- | :--------------- | :---------------------------------------------------- |
| **需求** | 做什么、为什么做 | [`docs/`](docs) 需求文档与设计说明                    |
| **界面** | 如何拆、如何复用 | [`src/components/`](src/components) 组件 / 可复用组件 |
| **资产** | 图片、字体、图标 | [`src/static/`](src/static) 静态资源                  |

> 仓库当前处于**骨架阶段**：目录与协作约定已定，组件与文档将在此之上逐步填充。

## 设计原则

| 原则         | 说明                                                                 |
| :----------- | :------------------------------------------------------------------- |
| **组件化**   | 一切界面皆可拆解为组件，一个组件一个目录，职责单一、边界清晰。       |
| **文档先行** | 需求与设计先写进 `docs/`，对齐之后再落代码，减少返工与误解。         |
| **资源归一** | 图片、字体、图标集中在 `src/static/`，不散落、不重复，替换成本最低。 |
| **约定驱动** | 分支、提交、命名都遵循约定，历史可读，协作可预期。                   |

## 项目结构

```text
Match
├── docs/                 # 需求文档、设计说明与文档资源
│   └── assets/           # README 横幅等文档图像
├── src/
│   ├── components/       # 组件 / 可复用组件（JS放这里）
│   └── static/           # 图片、字体、图标等静态资源（CSS放这里）
├── .gitignore
└── README.md
```

## 快速开始

```bash
# 1. 克隆仓库
git clone https://github.com/z183946327-dev/Match.git
cd Match
```

> 构建工具尚未选型。确定技术栈后，在此补充依赖安装与启动命令，
> 例如 `pnpm install && pnpm dev`。

## 开发约定

**分支**

- `main` 始终保持可交付，功能开发从 `main` 切出 `feat/<name>`，修复使用 `fix/<name>`

**提交**

- 遵循 [Conventional Commits](https://www.conventionalcommits.org/)，格式：`type(scope): subject`

| type       | 用途                   |
| :--------- | :--------------------- |
| `feat`     | 新增功能或组件         |
| `fix`      | 修复缺陷               |
| `docs`     | 文档变更               |
| `style`    | 不影响逻辑的样式调整   |
| `refactor` | 重构，不改变外部行为   |
| `chore`    | 构建、配置、依赖等杂项 |

**命名**

- 组件目录与文件同名，采用 `PascalCase`；静态资源采用 `kebab-case`

## 路线图

- [x] 初始化仓库与目录规划
- [ ] 沉淀需求文档（`docs/`）
- [ ] 首批可复用组件（`src/components/`）
- [ ] 静态资源规范化（`src/static/`）
- [ ] 构建与预览环境

## 贡献

1. Fork 本仓库并克隆到本地
2. 从 `main` 切出功能分支：`git switch -c feat/your-feature`
3. 提交前自测，按约定规范提交信息
4. 推送分支并发起 Pull Request，描述变更动机与验证方式

> 欢迎通过 Issue 讨论需求与设计；较大的改动建议先开 Issue 对齐方案。

## 许可证

暂未选定。若计划开源，推荐采用 [MIT](https://opensource.org/license/mit)；
确定后补充 `LICENSE` 文件并同步更新顶部徽章。

---

<div align="center">
  <sub>© 2026 Match</sub>
</div>
