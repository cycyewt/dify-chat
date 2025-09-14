'use server'

import { getServerSession } from 'next-auth/next'
import { NextRequest, NextResponse } from 'next/server'

import { authOptions } from '@/lib/auth'
import { getAppItem } from '@/repository/app'
import { getUser } from '@/repository/user'

/**
 * 代理 Dify API 的会话列表请求
 *
 * @param request NextRequest 对象
 * @param params 包含应用 ID 的参数对象
 * @returns 来自 Dify API 的会话列表
 */
export async function GET(
	request: NextRequest,
	{ params }: { params: Promise<{ appId: string }> },
) {
	try {
		const { appId } = await params

		// 获取应用配置
		const app = await getAppItem(appId)
		if (!app) {
			return NextResponse.json({ error: 'App not found' }, { status: 404 })
		}

		// 获取查询参数
		const searchParams = request.nextUrl.searchParams
		const limit = searchParams.get('limit') || '100'
		const last_id = searchParams.get('last_id')
		const sort_by = searchParams.get('sort_by')
		const param_user = searchParams.get('user') || 'anonymous'
		const session = await getServerSession(authOptions)
		const user = await getUser(session?.user.id)

		const fullSearchParams = new URLSearchParams()
		if (limit) {
			fullSearchParams.append('limit', limit)
		}
		if (last_id) {
			fullSearchParams.append('last_id', last_id)
		}
		if (sort_by) {
			fullSearchParams.append('sort_by', sort_by)
		}
		fullSearchParams.append('user', user?.sn || param_user)

		// 转发请求到 Dify API
		const response = await fetch(
			`${app.requestConfig.apiBase}/conversations?${fullSearchParams.toString()}`,
			{
				method: 'GET',
				headers: {
					Authorization: `Bearer ${app.requestConfig.apiKey}`,
				},
			},
		)

		// 返回响应
		const data = await response.json()
		return NextResponse.json(data, { status: response.status })
	} catch (error) {
		console.error(`Error fetching conversations from Dify API:`, error)
		return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 })
	}
}
