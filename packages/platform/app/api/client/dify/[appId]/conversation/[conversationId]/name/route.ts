'use server'

import { getServerSession } from 'next-auth/next'
import { NextRequest } from 'next/server'

import { createDifyApiResponse, handleApiError, proxyDifyRequest } from '@/lib/api-utils'
import { authOptions } from '@/lib/auth'
import { getAppItem } from '@/repository/app'

/**
 * 重命名会话
 */
export async function POST(
	request: NextRequest,
	{ params }: { params: Promise<{ appId: string; conversationId: string }> },
) {
	try {
		const { appId, conversationId } = await params
		const session = await getServerSession(authOptions)

		// 获取应用配置
		const app = await getAppItem(appId)
		if (!app) {
			return createDifyApiResponse({ error: 'App not found' }, 404)
		}

		// 获取请求体
		const { name, auto_generate } = await request.json()

		if (!conversationId) {
			return createDifyApiResponse(
				{
					error:
						'Bad Request: lack of conversation_id. Please provide the "conversation_id" in your request.',
				},
				400,
			)
		}

		// 代理请求到 Dify API
		const response = await proxyDifyRequest(
			app.requestConfig.apiBase,
			app.requestConfig.apiKey,
			`/conversations/${conversationId}/name`,
			{
				method: 'POST',
				body: JSON.stringify({
					conversation_id: conversationId,
					name,
					auto_generate,
					user: String(session?.user?.id ?? 0),
				}),
			},
		)

		const data = await response.text()
		return createDifyApiResponse(data, response.status)
	} catch (error) {
		const resolvedParams = await params
		return handleApiError(
			error,
			`Error renaming conversation ${resolvedParams.conversationId} for ${resolvedParams.appId}`,
		)
	}
}
