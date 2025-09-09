import { LocalStorageKeys, LocalStorageStore } from '@dify-chat/helpers'
import { useHistory } from 'pure-react-router'

import { ISession } from '@/utils/auth.ts'

export interface IAuth {
	isAuthorized: boolean
	goAuthorize: () => void
	userInfo: ISession
}

/**
 * 授权 hook
 */
export const useAuth = (): IAuth => {
	const history = useHistory()
	const userInfo: ISession = LocalStorageStore.get(LocalStorageKeys.USER_INFO)

	/**
	 * 跳转登录页
	 */
	const goAuthorize = () => {
		history.push('/auth')
	}

	return {
		isAuthorized: !!userInfo,
		goAuthorize,
		userInfo,
	}
}
