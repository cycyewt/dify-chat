import bcrypt from 'bcryptjs'
import { NextRequest, NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'

// 修改密码
export async function POST(request: NextRequest) {
	try {
		const { sn, password, newPassword } = await request.json()

		if (!sn || !password || !newPassword) {
			return NextResponse.json({ message: '警号、密码和新密码都是必填项' }, { status: 400 })
		}

		const user = await prisma.user.findUnique({
			where: {
				sn,
				isEnabled: true,
				isDeleted: false,
			},
		})

		if (!user) {
			return NextResponse.json({ message: '账号不存在' }, { status: 404 })
		}

		const isPasswordValid = await bcrypt.compare(password, user.password)

		if (!isPasswordValid) {
			return NextResponse.json({ message: '密码错误' }, { status: 400 })
		}

		// 加密新密码
		const hashedPassword = await bcrypt.hash(newPassword, 12)
		await prisma.user.update({
			where: {
				id: user.id,
			},
			data: {
				password: hashedPassword,
			},
		})

		return NextResponse.json({}, { status: 200 })
	} catch (error) {
		console.error('修改密码失败:', error)
		return NextResponse.json({ message: '服务器错误' }, { status: 500 })
	}
}
