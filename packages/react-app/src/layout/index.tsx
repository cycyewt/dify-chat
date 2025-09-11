import { useMount } from 'ahooks'
import { Route, useHistory, useSearchParams } from 'pure-react-router'
import { useEffect, useState } from 'react'

import { useAuth } from '@/hooks/use-auth'
import { useRedirect2Index } from '@/hooks/use-jump'
import { useGlobalStore } from '@/store'

const RedirectWrapper = () => {
	const history = useHistory()
	const { isAuthorized, goAuthorize } = useAuth()
	const redirect2Index = useRedirect2Index()

	useEffect(() => {
		const pathname = history.location.pathname

		// 如果未登录，则跳转登录
		if (!isAuthorized && pathname !== '/auth') {
			// goAuthorize()
			return
		}

		if (['', '/', '/login'].includes(pathname)) {
			// redirect2Index()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [history.location.pathname, isAuthorized])

	return <Route />
}

/**
 * 处理路由的布局容器
 */
export default function LayoutIndex() {
	const searchParams = useSearchParams()
	const store = useGlobalStore()
	const [init, setInit] = useState(false)

	/**
	 * 处理参数
	 */
	const handleParams = () => {
		const isKeepAll = searchParams.get('isKeepAll')
		// 是否保留所有参数，以在使用时直接从状态管理中获取
		if (isKeepAll === 'true') {
			searchParams.forEach((value, key) => {
				if (key === 'isKeepAll') {
					return
				}
				store.setGlobalParams({ [key]: value })
			})
		}
	}

	useMount(() => {
		handleParams()
		setInit(true)
	})

	if (!init) {
		return null
	}

	return <RedirectWrapper />
}
