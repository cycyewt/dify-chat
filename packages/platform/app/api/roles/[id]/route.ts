import bcrypt from 'bcryptjs'
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
		const { name, remark } = await request.json()

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

		// TODO 检查角色下应用数量

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
