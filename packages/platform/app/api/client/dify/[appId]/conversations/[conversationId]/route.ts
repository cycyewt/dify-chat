'use server'

import { getServerSession } from 'next-auth/next'
import { NextRequest } from 'next/server'

import { createDifyApiResponse, handleApiError, proxyDifyRequest } from '@/lib/api-utils'
import { authOptions } from '@/lib/auth'
import { getAppItem } from '@/repository/app'

/**
 * 删除会话
 */
export async function DELETE(
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

		// 代理请求到 Dify API
		const response = await proxyDifyRequest(
			app.requestConfig.apiBase,
			app.requestConfig.apiKey,
			`/conversations/${conversationId}`,
			{
				method: 'DELETE',
				body: JSON.stringify({
					user: String(session?.user?.id ?? 0),
				}),
			},
		)

		return createDifyApiResponse<null>(null, response.status)
	} catch (error) {
		const resolvedParams = await params
		return handleApiError(
			error,
			`Error deleting conversation ${resolvedParams.conversationId} for ${resolvedParams.appId}`,
		)
	}
}
