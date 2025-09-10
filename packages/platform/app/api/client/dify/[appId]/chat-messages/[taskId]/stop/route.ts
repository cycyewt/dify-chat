'use server'

import { getServerSession } from 'next-auth/next'
import { NextRequest } from 'next/server'

import { createDifyApiResponse, handleApiError, proxyDifyRequest } from '@/lib/api-utils'
import { authOptions } from '@/lib/auth'
import { getAppItem } from '@/repository/app'

/**
 * 停止聊天消息生成
 */
export async function POST(
	request: NextRequest,
	{ params }: { params: Promise<{ appId: string; taskId: string }> },
) {
	try {
		const { appId, taskId } = await params
		const session = await getServerSession(authOptions)

		// 获取应用配置
		const app = await getAppItem(appId)
		if (!app) {
			return createDifyApiResponse({ error: 'App not found' }, 404)
		}

		// 代理请求到 Dify API
		const response = await proxyDifyRequest(
			app.requestConfig.apiBase,
			app.requestConfig.apiKey,
			`/chat-messages/${taskId}/stop`,
			{
				method: 'POST',
				body: JSON.stringify({
					user: String(session?.user?.id ?? 0),
				}),
			},
		)

		const data = await response.json()
		return createDifyApiResponse(data, response.status)
	} catch (error) {
		const resolvedParams = await params
		return handleApiError(
			error,
			`Error stopping chat message ${resolvedParams.taskId} for ${resolvedParams.appId}`,
		)
	}
}
