import { LocalStorageKeys, LocalStorageStore } from '@dify-chat/helpers'
import dayjs from 'dayjs'
import { useHistory } from 'pure-react-router'

import { ISession, logoutApi } from '@/services/auth'

export interface IAuth {
	userInfo: ISession
	isAuthorized: boolean
	goAuthorize: () => void
	logout: () => Promise<void>
}

/**
 * 授权 hook
 */
export const useAuth = (): IAuth => {
	const history = useHistory()
	const userInfo: ISession = LocalStorageStore.get(LocalStorageKeys.USER_INFO)
	const expires = userInfo?.expires

	const isAuthorized = !!expires && dayjs().isBefore(dayjs(expires))

	/**
	 * 跳转登录页
	 */
	const goAuthorize = () => {
		history.replace('/auth')
	}

	/**
	 * 退出登录
	 */
	const logout = async () => {
		await logoutApi()
		history.replace('/auth')
	}

	return {
		userInfo,
		isAuthorized,
		goAuthorize,
		logout,
	}
}
