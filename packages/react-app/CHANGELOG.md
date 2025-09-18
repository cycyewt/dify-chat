# dify-chat-app-react

## 0.5.5

### Patch Changes

- 0dafb64: - 文本生成应用支持一键复制生成结果
  - Platform 夜间模式下的登录页样式优化
  - 修复消息列表内容较少时从底部而不是顶部开始展示的问题
  - 修复回复过程中没有随内容更新自动滚动到底部的问题
- Updated dependencies [0dafb64]
  - @dify-chat/api@0.5.5
  - @dify-chat/components@0.5.5
  - @dify-chat/core@0.5.5
  - @dify-chat/helpers@0.5.5
  - @dify-chat/theme@0.5.5

## 0.5.3

### Patch Changes

- 36dc666: 修复调试模式配置多个应用时生成了同一个 id 导致列表展示重复数据的问题
- e059e25: - 对话参数全部设置为隐藏时, 不展示整个对话参数设置模块
  - 切换对话时，自动聚焦输入框
- cbaf187: 修复发送消息携带文件时, 无法接收回复的问题

## 0.5.2

### Patch Changes

- 10a31d2: 对话参数支持默认值

## 0.5.1

### Patch Changes

- f941ce9: 修复下拉选项类型的对话参数选择后没有正确赋值的问题

## 0.5.0

### Minor Changes

- b157251: 新增 Platform 应用

### Patch Changes

- Updated dependencies [c000dd6]
- Updated dependencies [dd66d67]
- Updated dependencies [2cd396f]
- Updated dependencies [98ae25e]
  - @dify-chat/components@0.5.0
  - @dify-chat/api@0.5.0
  - @dify-chat/core@0.5.0
  - @dify-chat/helpers@0.5.0
  - @dify-chat/theme@0.5.0

## 0.4.0

### Minor Changes

- a415147: 新增 Next.js MVP 版本, 以及文档站点子包

### Patch Changes

- Updated dependencies [b9e8b63]
- Updated dependencies [a415147]
- Updated dependencies [14c0820]
  - @dify-chat/helpers@0.4.0
  - @dify-chat/api@0.4.0
  - @dify-chat/components@0.4.0
  - @dify-chat/core@0.4.0
  - @dify-chat/theme@0.4.0

## 0.3.0

### Minor Changes

- c9951b5: 支持工作流的非 LLM 输出结果和详情展示

### Patch Changes

- Updated dependencies [7fca918]
- Updated dependencies [c9951b5]
  - @dify-chat/api@0.3.0
  - @dify-chat/components@0.3.0
  - @dify-chat/core@0.3.0
  - @dify-chat/helpers@0.3.0
  - @dify-chat/theme@0.3.0
