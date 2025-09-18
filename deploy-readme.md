
发布操作步骤

1. 安装 mysql，设置相关的用户名和密码。
2. 在 `/opt` 目录下安装项目源代码包。
3. 更新 `packages/platform/.env.production`，按照实际情况填写相关字段
   - ACCESS_CONTROL_ALLOW_ORIGIN
   - DATABASE_URL
4. 执行 `sh prod-start.sh`
5. 执行 `setup-nginx.sh`
6. 更新 mysql 数据库表 `agencies` 的内容，写入组织结构数据。
7. 在项目根目录 `/opt/dify-chat` 下执行 `pnpm create-admin` 
