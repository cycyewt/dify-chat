'use client'

import { useMount } from 'ahooks'
import { Card } from 'antd'
import { signOut } from 'next-auth/react'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'

import LogoImage from '@/assets/images/logo.png'

export default function LogoutPage() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const callbackUrl = searchParams.get('callbackUrl')

	useMount(async () => {
		await signOut({ redirect: false })
		if (callbackUrl) {
			const url = new URL(callbackUrl)
			url.searchParams.delete('userInfo')
			router.replace(url.href)
		}
	})

	return (
		<div className="flex items-center justify-center min-h-screen  bg-gray-50">
			<div className="flex flex-col items-center justify-center w-full h-full">
				<Card className="w-full max-w-md">
					<div className={'mt-2 flex justify-center'}>
						<Image
							src={LogoImage}
							width={96}
							height={96}
							alt=""
						/>
					</div>
					<div className="mt-8 text-center text-lg">正在退出登录...</div>
				</Card>
			</div>
		</div>
	)
}
