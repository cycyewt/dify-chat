import bcrypt from 'bcryptjs'
import * as readline from 'readline'

import { prisma } from '../lib/prisma'

// 创建 readline 接口
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
})

// 封装 readline 为 Promise
function question(prompt: string): Promise<string> {
	return new Promise(resolve => {
		rl.question(prompt, resolve)
	})
}

async function createAdmin() {
	console.log('=== 创建管理员账户 ===')

	// 获取用户输入
	const name = await question('请输入管理员姓名: ')
	const sn = await question('请输入管理员账号: ')
	const phoneNumber = await question('请输入管理员手机号: ')
	const password = await question('请输入管理员密码: ')

	// 验证输入
	if (!name || !sn || !phoneNumber || !password) {
		console.log('姓名、账号、手机号和密码都不能为空')
		rl.close()
		return
	}

	// 验证账号格式
	const snRegex = /^\d{6,7}$/
	if (!snRegex.test(sn)) {
		console.log('账号格式不正确')
		rl.close()
		return
	}

	// 验证手机号号格式
	const phoneNumberRegex = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/
	if (!phoneNumberRegex.test(phoneNumber)) {
		console.log('手机号号格式不正确')
		rl.close()
		return
	}

	// 检查管理员是否已存在
	const existingUser = await prisma.user.findUnique({
		where: { sn },
	})

	if (existingUser) {
		console.log('管理员账户已存在')
		rl.close()
		return
	}

	// 加密密码
	const hashedPassword = await bcrypt.hash(password, 12)

	const role = await prisma.role.create({
		data: {
			name: '管理员',
			code: 'admin',
			remark: '系统管理员',
		},
	})

	// 创建管理员账户
	const admin = await prisma.user.create({
		data: {
			name,
			sn,
			phoneNumber,
			agency: { id: [0], name: '默认单位' },
			password: hashedPassword,
		},
	})

	await prisma.userRole.create({
		data: {
			userId: admin.id,
			roleId: role.id,
		},
	})

	console.log('\n管理员账户创建成功:')
	console.log(`姓名: ${admin.name}`)
	console.log(`账号: ${admin.sn}`)
	console.log(`手机号: ${admin.phoneNumber}`)
	console.log(`工作单位: 默认单位`)
	console.log(`密码: ${password}`)

	rl.close()
}

createAdmin()
	.catch(e => {
		console.error(e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
