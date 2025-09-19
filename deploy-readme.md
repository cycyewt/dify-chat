# 发布操作步骤

1. 安装 mysql 8+，设置相关的用户名和密码
2. 创建数据库 `aihub`，utf8mb4 + utf8mb4_general_ci
3. 在 `/opt` 目录下安装项目源代码包
4. 更新 `packages/platform/.env.production`，按照实际情况填写相关字段
   - ACCESS_CONTROL_ALLOW_ORIGIN
   - DATABASE_URL
5. 执行 `sh prod-start.sh`
6. 执行 `setup-nginx.sh`
7. 更新 mysql 数据库表 `agencies` 的内容，写入组织结构数据。
8. 在项目根目录 `/opt/dify-chat` 下执行 `pnpm create-admin`
   - 用户名
   - 账号
   - 手机号码
   - 密码
