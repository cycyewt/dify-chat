import { LocalStorageKeys, LocalStorageStore } from '@dify-chat/helpers'
import { useMount } from 'ahooks'
import { Card } from 'antd'

import LogoImage from '@/assets/images/logo.png'

export default function AuthPage() {
	useMount(() => {
		const url = new URL(window.location.href)
		const userInfo = url.searchParams.get('userInfo')
		if (userInfo) {
			LocalStorageStore.set(LocalStorageKeys.USER_INFO, decodeURIComponent(userInfo))
			location.replace('/apps')
		} else {
			LocalStorageStore.remove(LocalStorageKeys.USER_INFO)
			const callbackUrl = encodeURIComponent(window.location.href)
			location.replace(`${process.env.PUBLIC_AUTH_LOGIN_URL}?callbackUrl=${callbackUrl}`)
		}
	})

	return (
		<div className="w-screen h-screen flex flex-col items-center justify-center bg-theme-bg">
			<div className="flex flex-col items-center justify-center w-full h-full">
				<Card className="w-full max-w-md">
					<div className={'mt-2 text-center'}>
						<img
							src={LogoImage}
							width={64}
							height={64}
							alt=""
						/>
					</div>
					<div className="mt-8 text-center text-lg">登录中...</div>
				</Card>
			</div>
		</div>
	)
}
