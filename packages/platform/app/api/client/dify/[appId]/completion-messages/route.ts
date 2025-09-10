'use server'

import { getServerSession } from 'next-auth/next'
import { NextRequest } from 'next/server'

import { createDifyResponseProxy } from '@/lib/api-utils'
import { authOptions } from '@/lib/auth'
import { getAppItem } from '@/repository/app'

/**
 * 发送完成消息（文本生成）
 */
export async function POST(
	request: NextRequest,
	{ params }: { params: Promise<{ appId: string }> },
) {
	try {
		const { appId } = await params
		const session = await getServerSession(authOptions)

		// 获取应用配置
		const app = await getAppItem(appId)
		if (!app) {
			return new Response(JSON.stringify({ error: 'App not found' }), {
				status: 404,
				headers: { 'Content-Type': 'application/json' },
			})
		}

		// 获取请求体
		const { inputs } = await request.json()

		// 代理请求到 Dify API
		const response = await fetch(`${app.requestConfig.apiBase}/completion-messages`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${app.requestConfig.apiKey}`,
			},
			body: JSON.stringify({
				response_mode: 'streaming',
				user: String(session?.user?.id ?? 0),
				inputs,
			}),
		})

		// 返回流式响应
		return createDifyResponseProxy(response)
	} catch (error) {
		const resolvedParams = await params
		console.error(`Error sending completion message for ${resolvedParams.appId}:`, error)
		return new Response(JSON.stringify({ error: 'Failed to send completion message' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		})
	}
}
