import { useMount } from 'ahooks'
import { Route, useHistory, useSearchParams } from 'pure-react-router'
import { useEffect, useState } from 'react'

import { useAuth } from '@/hooks/use-auth'
import { useGlobalStore } from '@/store'

const RedirectWrapper = () => {
	const history = useHistory()
	const { isAuthorized } = useAuth()

	useEffect(() => {
		const pathname = history.location.pathname

		if (['', '/'].includes(pathname)) {
			history.push('apps')
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
