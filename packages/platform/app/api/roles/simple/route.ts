import { getServerSession } from 'next-auth/next'
import { NextResponse } from 'next/server'

import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
	try {
		const session = await getServerSession(authOptions)
		if (!session) {
			return NextResponse.json({ message: '未授权' }, { status: 401 })
		}

		const roles = await prisma.role.findMany({
			where: {
				isDeleted: false,
			},
			select: {
				id: true,
				name: true,
				remark: true,
			},
		})

		return NextResponse.json(roles)
	} catch (error) {
		console.error('获取角色选择列表失败:', error)
		return NextResponse.json({ message: '服务器错误' }, { status: 500 })
	}
}
