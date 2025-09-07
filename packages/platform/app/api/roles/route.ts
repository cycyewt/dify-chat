import { getServerSession } from 'next-auth/next'
import { NextRequest, NextResponse } from 'next/server'

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
				code: true,
				remark: true,
				createdAt: true,
				updatedAt: true,
			},
			orderBy: {
				createdAt: 'desc',
			},
		})

		return NextResponse.json(roles)
	} catch (error) {
		console.error('获取角色列表失败:', error)
		return NextResponse.json({ message: '服务器错误' }, { status: 500 })
	}
}

// 新增角色
export async function POST(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions)

		if (!session) {
			return NextResponse.json({ message: '未授权' }, { status: 401 })
		}

		const { name, code, remark } = await request.json()

		if (!name || !code || !remark) {
			return NextResponse.json({ message: '名称、编码和描述都是必填项' }, { status: 400 })
		}

		// 检查账号是否已存在
		const existingRole = await prisma.role.findUnique({
			where: {
				name,
				code,
				isDeleted: false,
			},
		})

		if (existingRole) {
			return NextResponse.json({ message: '该账号已被使用' }, { status: 400 })
		}

		// 新增用户
		const role = await prisma.role.create({
			data: {
				name,
				code,
				remark,
			},
			select: {
				id: true,
				name: true,
				code: true,
				remark: true,
				createdAt: true,
				updatedAt: true,
			},
		})

		return NextResponse.json(role, { status: 201 })
	} catch (error) {
		console.error('新增角色失败:', error)
		return NextResponse.json({ message: '服务器错误' }, { status: 500 })
	}
}
