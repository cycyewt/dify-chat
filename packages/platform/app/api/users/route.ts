import bcrypt from 'bcryptjs'
import { getServerSession } from 'next-auth/next'
import { NextRequest, NextResponse } from 'next/server'

import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// 获取用户列表
export async function GET() {
	try {
		const session = await getServerSession(authOptions)

		if (!session) {
			return NextResponse.json({ message: '未授权' }, { status: 401 })
		}

		const users = await prisma.user.findMany({
			where: {
				isDeleted: false,
			},
			select: {
				id: true,
				name: true,
				sn: true,
				phoneNumber: true,
				agency: true,
				isEnabled: true,
				createdAt: true,
				updatedAt: true,
			},
			orderBy: {
				createdAt: 'desc',
			},
		})
		const userIds = users.map(user => user.id)
		const userRoles = await prisma.userRole.findMany({
			where: {
				userId: {
					in: userIds,
				},
			},
			select: {
				userId: true,
				roleId: true,
			},
		})
		const roles = await prisma.role.findMany({
			where: {
				id: {
					in: userRoles.map(userRole => userRole.roleId),
				},
			},
			select: {
				id: true,
				name: true,
			},
		})
		const results = users.map(user => {
			return {
				...user,
				roles: roles.filter(role =>
					userRoles.some(userRole => userRole.userId === user.id && userRole.roleId === role.id),
				),
			}
		})

		return NextResponse.json(results)
	} catch (error) {
		console.error('获取用户列表失败:', error)
		return NextResponse.json({ message: '服务器错误' }, { status: 500 })
	}
}

// 新增用户
export async function POST(request: NextRequest) {
	try {
		const session = await getServerSession(authOptions)

		if (!session) {
			return NextResponse.json({ message: '未授权' }, { status: 401 })
		}

		const { name, sn, phoneNumber, agency, agencyName, password, roles } = await request.json()

		if (!name || !sn || !phoneNumber || !agency || !agencyName || !password) {
			return NextResponse.json(
				{ message: '姓名、警号、电话号码、工作单位和密码都是必填项' },
				{ status: 400 },
			)
		}

		// 检查警号是否已存在
		const existingUser = await prisma.user.findUnique({
			where: {
				sn,
				isDeleted: false,
			},
		})

		if (existingUser) {
			return NextResponse.json({ message: '该警号已被使用' }, { status: 400 })
		}

		// 加密密码
		const hashedPassword = await bcrypt.hash(password, 12)

		// 新增用户
		const user = await prisma.user.create({
			data: {
				name,
				sn,
				phoneNumber,
				agency: {
					id: agency,
					name: agencyName,
				},
				password: hashedPassword,
			},
			select: {
				id: true,
				name: true,
				sn: true,
				phoneNumber: true,
				agency: true,
				isEnabled: true,
				createdAt: true,
				updatedAt: true,
			},
		})

		if (roles?.length > 0) {
			// 添加用户角色关系
			await prisma.userRole.createMany({
				data: roles.map((roleId: number) => ({
					userId: user.id,
					roleId,
				})),
			})
		}

		return NextResponse.json(user, { status: 201 })
	} catch (error) {
		console.error('新增用户失败:', error)
		return NextResponse.json({ message: '服务器错误' }, { status: 500 })
	}
}
