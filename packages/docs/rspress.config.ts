import * as path from 'node:path';
import { defineConfig } from 'rspress/config';

export default defineConfig({
	root: path.join(__dirname, 'docs'),
	title: 'Dify Chat Docs',
	icon: '/logo.png',
	multiVersion: {
		default: 'Latest',
		versions: ['Latest', 'v0.5.x', 'v0.4.x'],
	},
	search: {
		versioned: true,
	},
	builderConfig: {
		server: {
			// 指定启动端口
			port: 6200,
		},
	},
	themeConfig: {
		socialLinks: [
			{
				icon: 'github',
				mode: 'link',
				content: 'https://github.com/lexmin0412/dify-chat',
			},
		],
	},
});
