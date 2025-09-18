# @dify-chat/components

## 0.5.5

### Patch Changes

- 0dafb64: - 文本生成应用支持一键复制生成结果
  - Platform 夜间模式下的登录页样式优化
  - 修复消息列表内容较少时从底部而不是顶部开始展示的问题
  - 修复回复过程中没有随内容更新自动滚动到底部的问题
- Updated dependencies [0dafb64]
  - @dify-chat/api@0.5.5
  - @dify-chat/core@0.5.5
  - @dify-chat/helpers@0.5.5
  - @dify-chat/theme@0.5.5

## 0.5.0

### Minor Changes

- c000dd6: 文本转语音正在播放时禁用播放按钮
- dd66d67: AppIcon 支持将 emoji 文本转换为 unicode 渲染
- 2cd396f: 附件上传支持 .doc 文件类型
- 98ae25e: 新增 MessageFileList 组件导出

### Patch Changes

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
  - @dify-chat/core@0.4.0
  - @dify-chat/theme@0.4.0

## 0.3.0

### Minor Changes

- 7fca918: 工作流支持通过 Dify WebApp 设置进行显示隐藏, 老版本默认隐藏
- c9951b5: 支持工作流的非 LLM 输出结果和详情展示

### Patch Changes

- Updated dependencies [7fca918]
  - @dify-chat/api@0.3.0
  - @dify-chat/core@0.3.0
  - @dify-chat/helpers@0.3.0
  - @dify-chat/theme@0.3.0

## 0.2.0

### Minor Changes

- a9e9bdf: 单应用模式支持自定义应用类型
- a80d7fe: 新增只读类型的 DifyAppStore 支持
- a94f97f: 回复过程中用户主动取消时, 保留已生成内容
- c65119d: 支持自适应及手动切换主题（浅色/深色/跟随系统）
- b802c26: 应用配置新增开场白展示场景配置项

### Patch Changes

- 70d7461: 首次对话完成加载历史消息不展示 loading, 提升用户体验
- 46c06c7: 修复知识库引用内容较长时，Popver 宽度超出屏幕的问题
- Updated dependencies [a9e9bdf]
- Updated dependencies [ae198ba]
- Updated dependencies [c65119d]
- Updated dependencies [c88b5ed]
- Updated dependencies [b802c26]
  - @dify-chat/core@0.2.0
  - @dify-chat/api@0.2.0
  - @dify-chat/theme@0.2.0
  - @dify-chat/helpers@0.2.0

## 0.1.0

### Minor Changes

- a750bf4: MVP 版本

### Patch Changes

- Updated dependencies [a750bf4]
  - @dify-chat/api@0.1.0
  - @dify-chat/core@0.1.0
  - @dify-chat/helpers@0.1.0
