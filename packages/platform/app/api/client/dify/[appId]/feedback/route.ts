'use server'

import { getServerSession } from 'next-auth/next'
import { NextRequest } from 'next/server'

import { createDifyApiResponse, handleApiError, proxyDifyRequest } from '@/lib/api-utils'
import { authOptions } from '@/lib/auth'
import { getAppItem } from '@/repository/app'
import { getUser } from '@/repository/user'

/**
 * 提交消息反馈
 */
export async function POST(
	request: NextRequest,
	{ params }: { params: Promise<{ appId: string }> },
) {
	try {
		const { appId } = await params
		const session = await getServerSession(authOptions)
		const user = await getUser(session?.user.id)

		// 获取应用配置
		const app = await getAppItem(appId)
		if (!app) {
			return createDifyApiResponse({ error: 'App not found' }, 404)
		}

		// 获取请求体
		const { rating, content, messageId } = await request.json()

		// 代理请求到 Dify API
		const response = await proxyDifyRequest(
			app.requestConfig.apiBase,
			app.requestConfig.apiKey,
			`/messages/${messageId}/feedbacks`,
			{
				method: 'POST',
				body: JSON.stringify({
					user: user?.sn ?? 'anonymous',
					rating,
					content,
				}),
			},
		)

		const data = await response.json()
		return createDifyApiResponse(data, response.status)
	} catch (error) {
		const resolvedParams = await params
		return handleApiError(error, `Error submitting feedback for ${resolvedParams.appId}`)
	}
}
