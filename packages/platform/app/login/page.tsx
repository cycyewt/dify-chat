'use client'

import { DoubleRightOutlined } from '@ant-design/icons'
import { Button, Card, Form, Input, message } from 'antd'
import { getSession, signIn } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

import LogoIcon from '@/assets/images/logo.png'

interface LoginForm {
	sn: string
	password: string
}

export default function LoginPage() {
	const [loading, setLoading] = useState(false)
	const router = useRouter()
	const searchParams = useSearchParams()
	const callbackUrl = searchParams.get('callbackUrl')
	const scene = callbackUrl ? 'client' : 'admin'

	const onFinish = async (values: LoginForm) => {
		setLoading(true)
		try {
			const result = await signIn('credentials', {
				scene: scene,
				sn: values.sn,
				password: values.password,
				redirect: false,
			})

			if (result?.error) {
				message.open({
					type: 'error',
					content: '登录失败，请检查警号和密码',
				})
			} else {
				message.open({
					type: 'success',
					content: '登录成功',
				})
				// 获取会话信息并跳转
				const session = await getSession()
				if (session) {
					if (callbackUrl) {
						const url = new URL(callbackUrl)
						url.searchParams.append('userInfo', encodeURIComponent(JSON.stringify(session)))
						router.replace(url.href)
					} else {
						router.push('/')
					}
				}
			}
		} catch (error) {
			console.error('登录过程中发生错误', error)
			message.open({
				type: 'error',
				content: '登录过程中发生错误',
			})
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="min-h-screen flex items-center justify-center auth-bg bg-gray-50 dark:bg-[#1d1d1d]">
			<Card className="!py-4 !px-4 shadow-2xl">
				<div className={'flex justify-between items-center gap-10'}>
					<div className={'flex flex-col justify-center w-full max-w-[400px]'}>
						<h2 className={'text-[40px] font-semibold'}>欢迎使用，AI应用平台</h2>
						<div className={'mt-5 text-gray-500'}>
							加入数百万创作者，使用 AI
							驱动的工具获取关键词建议、追踪实时表现、每天获得选题灵感，并节省数小时制作时间。
						</div>
					</div>
					<div className={'h-[420px] w-px bg-gray-100'}></div>
					<div className={'w-[320px]'}>
						<div className="text-center mb-8">
							<div className="flex justify-center mb-4">
								<Image
									src={LogoIcon}
									width={96}
									height={96}
									alt="AI应用平台"
								/>
							</div>
							<p className="text-lg text-gray-700 mt-2">请登录你的账户</p>
						</div>

						<Form
							name="login"
							onFinish={onFinish}
							autoComplete="off"
							size="large"
							layout={'vertical'}
						>
							<Form.Item
								name="sn"
								label={'警号'}
								rules={[
									{
										required: true,
										validator: (rule, value) => {
											if (/^\d{6,7}$/.test(value)) {
												return Promise.resolve()
											}

											return Promise.reject()
										},
										message: '请输入有效的警号',
									},
								]}
							>
								<Input
									placeholder="请输入警号"
									allowClear
								/>
							</Form.Item>

							<Form.Item
								name="password"
								label={'密码'}
								rules={[{ required: true, message: '请输入密码' }]}
							>
								<Input.Password
									placeholder="请输入密码"
									allowClear
								/>
							</Form.Item>

							<Form.Item>
								<Button
									type="primary"
									htmlType="submit"
									className="w-full"
									loading={loading}
								>
									登录
								</Button>
							</Form.Item>
						</Form>

						<div className="flex justify-center items-center">
							<Link href="/password">
								修改密码
								<DoubleRightOutlined />
							</Link>
						</div>
						<div className="mt-10 text-gray-300 text-center">&copy; 2025</div>
					</div>
				</div>
			</Card>
		</div>
	)
}
