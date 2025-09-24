# AGENTS Guidelines for This Repository

## 仓库概览

Dify Chat 是一个基于 pnpm workspace 构建的 Monorepo 项目，包含以下几个子包(所有子包均存放在 packages 目录下)：

- api Dify API 的 Node.js 客户端库
- components Dify 组件库，**即将废弃**，请不要在其他子包中引入，或者修改此包的源码（如果一定要修改，请先取得用户同意）
- core 核心子包，存放核心抽象逻辑
- docs 文档子包，基于 Rspress 构建
- helpers 辅助工具函数
- platform 平台子包，基于 Next.js 15 App Router 模式，提供应用配置的增删改查和 Dify API 代理
- react-app React 应用子包，提供用户与 Dify 交互的前端界面
- theme 主题子包，提供整个应用的主题相关组件/样式

## 依赖管理

当你需要自行安装/更新依赖时，请务必注意：本项目使用 pnpm-workspace 的 catalog 协议进行依赖管理，所有的依赖版本都是在根目录的 `pnpm-workspace.yaml` 文件的 `catalog` 部分，你需要按需修改该文件中的版本号，在对应子包然后在项目根目录运行 `pnpm install` 命令来安装/更新依赖。

## 样式处理

在本项目中，两个主要的子包（react-app 和 platform）都使用了 Tailwind CSS 进行样式管理。但它们使用的版本存在差异：

- react-app 使用的是 Tailwind CSS v3, 版本是使用 pnpm catalog 协议定义，真正的版本存放在根目录的 pnpm-workspace.yaml 文件的 catalog 部分
- platform 使用的是 Tailwind CSS v4, 版本直接在其 package.json 文件的 dependencies 部分定义
