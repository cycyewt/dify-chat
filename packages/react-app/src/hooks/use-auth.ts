import { LocalStorageKeys, LocalStorageStore } from '@dify-chat/helpers'
import dayjs from 'dayjs'
import { useHistory } from 'pure-react-router'

import { getSessionApi, ISession } from '@/services/auth'

export interface IAuth {
	userId: string
	userInfo: ISession
	isAuthorized: boolean
	goAuthorize: () => void
	getSession: () => Promise<ISession | void>
	logout: () => Promise<void>
}

/**
 * 授权 hook
 */
export const useAuth = (): IAuth => {
	const history = useHistory()
	const userInfo: ISession = LocalStorageStore.get(LocalStorageKeys.USER_INFO)
	const expires = userInfo?.expires
	const browserUserId = LocalStorageStore.get(LocalStorageKeys.USER_ID)

	const isAuthorized = !!expires && dayjs().isBefore(dayjs(expires))

	/**
	 * 跳转登录页
	 */
	const goAuthorize = () => {
		history.replace('auth')
	}

	/**
	 * 获取会话信息
	 */
	const getSession = async (): Promise<ISession | void> => {
		const session = await getSessionApi()
		if (!session.user) {
			return goAuthorize()
		}

		return session
	}

	/**
	 * 退出登录
	 */
	const logout = async () => {
		LocalStorageStore.remove(LocalStorageKeys.USER_INFO)
		const url = new URL(window.location.href)
		url.pathname = '/auth'
		const callbackUrl = encodeURIComponent(url.href)
		location.replace(`${process.env.PUBLIC_AUTH_LOGOUT_URL}?callbackUrl=${callbackUrl}`)
	}

	return {
		userId: browserUserId,
		userInfo,
		isAuthorized,
		goAuthorize,
		getSession,
		logout,
	}
}
