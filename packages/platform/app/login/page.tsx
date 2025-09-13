'use client'

import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Card, Form, Input, message } from 'antd'
import { getSession, signIn } from 'next-auth/react'
import Image from 'next/image'
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
		<div className="min-h-screen flex items-center justify-center bg-gray-50">
			<Card className="w-full max-w-md">
				<div className="text-center mb-8">
					<div className="flex justify-center mb-4">
						<Image
							src={LogoIcon}
							width={64}
							height={64}
							alt="管理系统"
						/>
					</div>
					{!callbackUrl && <h1 className="text-2xl font-bold text-gray-900">管理系统</h1>}
					<p className="text-gray-600 mt-2">请登录您的账户</p>
				</div>

				<Form
					name="login"
					onFinish={onFinish}
					autoComplete="off"
					size="large"
				>
					<Form.Item
						name="sn"
						rules={[
							{
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
							prefix={<UserOutlined />}
							placeholder="警号"
							allowClear
						/>
					</Form.Item>

					<Form.Item
						name="password"
						rules={[{ required: true, message: '请输入密码' }]}
					>
						<Input.Password
							prefix={<LockOutlined />}
							placeholder="密码"
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
			</Card>
		</div>
	)
}
