#!/bin/bash

# Nginx 安装和配置脚本 - 用于服务器本地部署
# 在服务器上直接运行此脚本

set -e

# 颜色输出
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 开始配置 Nginx...${NC}"

# 1. 安装 Nginx
echo -e "\n${GREEN}📦 安装 Nginx...${NC}"
sudo apt update
sudo apt install -y nginx

# 2. 备份默认配置
echo -e "\n${GREEN}📋 备份默认配置...${NC}"
if [ -f /etc/nginx/sites-enabled/default ]; then
    sudo cp /etc/nginx/sites-enabled/default /etc/nginx/sites-enabled/default.bak
fi

# 3. 复制配置文件
echo -e "\n${GREEN}📝 配置 Nginx...${NC}"

# 如果需要修改域名，可以在这里设置
read -p "请输入域名或IP地址 (默认: localhost): " DOMAIN
DOMAIN=${DOMAIN:-localhost}

# 复制配置文件并替换域名
sudo cp nginx/dify-chat.conf /etc/nginx/sites-available/dify-chat
sudo sed -i "s/your-domain.com/$DOMAIN/g" /etc/nginx/sites-available/dify-chat

# 创建符号链接
sudo ln -sf /etc/nginx/sites-available/dify-chat /etc/nginx/sites-enabled/

# 移除默认站点
sudo rm -f /etc/nginx/sites-enabled/default

# 4. 测试配置
echo -e "\n${GREEN}✅ 测试 Nginx 配置...${NC}"
sudo nginx -t

# 5. 重启 Nginx
echo -e "\n${GREEN}🔄 重启 Nginx...${NC}"
sudo systemctl restart nginx
sudo systemctl enable nginx

# 6. 配置防火墙
echo -e "\n${GREEN}🔒 配置防火墙...${NC}"
sudo ufw allow 'Nginx Full' 2>/dev/null || true
sudo ufw allow 80/tcp 2>/dev/null || true
sudo ufw allow 443/tcp 2>/dev/null || true

# 7. 显示状态
echo -e "\n${GREEN}📊 Nginx 状态:${NC}"
sudo systemctl status nginx --no-pager

echo -e "\n${GREEN}✅ Nginx 配置完成！${NC}"
echo -e "\n访问地址:"
echo -e "  Web: ${YELLOW}http://$DOMAIN${NC}"
echo -e "  API: ${YELLOW}http://$DOMAIN/api${NC}"
echo -e "\n常用命令:"
echo -e "  查看访问日志: ${YELLOW}sudo tail -f /var/log/nginx/dify-chat-access.log${NC}"
echo -e "  查看错误日志: ${YELLOW}sudo tail -f /var/log/nginx/dify-chat-error.log${NC}"
echo -e "  重启 Nginx:   ${YELLOW}sudo systemctl restart nginx${NC}"
echo -e "\n${YELLOW}⚠️  注意:${NC}"
echo -e "1. 确保应用已通过 ./prod-start.sh 启动"
echo -e "2. 静态文件位于: /opt/dify-chat/packages/react-app/dist"
echo -e "3. API 服务运行在: http://localhost:5300"