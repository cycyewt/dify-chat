import { getServerSession } from 'next-auth/next'
import { NextRequest, NextResponse } from 'next/server'

import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

interface RouteParams {
	params: Promise<{
		id: number
	}>
}

// 更新角色
export async function PUT(request: NextRequest, { params }: RouteParams) {
	try {
		const session = await getServerSession(authOptions)

		if (!session) {
			return NextResponse.json({ message: '未授权' }, { status: 401 })
		}

		let { id } = await params
		id = Number(id)
		const { name, remark, apps } = await request.json()

		if (!name || !remark) {
			return NextResponse.json({ message: '名称和描述都是必填项' }, { status: 400 })
		}

		// 检查角色是否存在
		const existingRole = await prisma.role.findUnique({
			where: { id },
		})

		if (!existingRole) {
			return NextResponse.json({ message: '角色不存在' }, { status: 404 })
		}

		// 准备更新数据
		const updateData = {
			name,
			remark,
		}

		// 更新角色
		const role = await prisma.role.update({
			where: { id },
			data: updateData,
			select: {
				id: true,
				name: true,
				code: true,
				remark: true,
				createdAt: true,
				updatedAt: true,
			},
		})

		// 关联应用
		if (apps?.length > 0) {
			// 先删除旧关联
			await prisma.roleDifyApp.deleteMany({
				where: {
					roleId: role.id,
				},
			})

			// 创建新关联
			await prisma.roleDifyApp.createMany({
				data: apps.map((appId: string) => ({
					roleId: role.id,
					difyAppId: appId,
				})),
			})
		}

		return NextResponse.json(role)
	} catch (error) {
		console.error('更新角色失败:', error)
		return NextResponse.json({ message: '服务器错误' }, { status: 500 })
	}
}

// 删除角色
export async function DELETE(_request: NextRequest, { params }: RouteParams) {
	try {
		const session = (await getServerSession(authOptions)) as { role: { id: number } }

		if (!session) {
			return NextResponse.json({ message: '未授权' }, { status: 401 })
		}

		let { id } = await params
		id = Number(id)

		// 检查角色是否存在
		const existingRole = await prisma.role.findUnique({
			where: { id },
		})

		if (!existingRole) {
			return NextResponse.json({ message: '角色不存在' }, { status: 404 })
		}

		// TODO 检查角色关联的用户数量
		const userCount = await prisma.userRole.count({
			where: {
				roleId: id,
			},
		})
		if (userCount > 0) {
			return NextResponse.json({ message: '该角色关联了用户，请先解除关联关系' }, { status: 400 })
		}

		// 直接删除角色（不再需要删除相关的会话和账户）
		await prisma.role.delete({
			where: { id },
		})

		return NextResponse.json({ message: '删除成功' })
	} catch (error) {
		console.error('删除角色失败:', error)
		return NextResponse.json({ message: '服务器错误' }, { status: 500 })
	}
}
