'use server'

import { getServerSession } from 'next-auth/next'
import { NextRequest } from 'next/server'

import { createDifyApiResponse, createFormDataProxy, handleApiError } from '@/lib/api-utils'
import { authOptions } from '@/lib/auth'
import { getAppItem } from '@/repository/app'

/**
 * 音频转文字
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
			return createDifyApiResponse({ error: 'App not found' }, 404)
		}

		// 构建代理 FormData
		const proxyFormData = await createFormDataProxy(request)
		proxyFormData.append('user', String(session?.user?.id ?? 0))

		// 代理请求到 Dify API
		const response = await fetch(`${app.requestConfig.apiBase}/audio-to-text`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${app.requestConfig.apiKey}`,
			},
			body: proxyFormData,
		})

		const data = await response.json()
		return createDifyApiResponse(data, response.status)
	} catch (error) {
		const resolvedParams = await params
		return handleApiError(error, `Error converting audio to text for ${resolvedParams.appId}`)
	}
}
