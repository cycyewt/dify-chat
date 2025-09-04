'use client'

import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Card, Form, Input, message } from 'antd'
import { getSession, signIn } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import LogoIcon from '@/assets/images/logo.png'

interface LoginForm {
	email: string
	password: string
}

export default function LoginPage() {
	const [loading, setLoading] = useState(false)
	const router = useRouter()

	const onFinish = async (values: LoginForm) => {
		setLoading(true)
		try {
			const result = await signIn('credentials', {
				email: values.email,
				password: values.password,
				redirect: false,
			})

			if (result?.error) {
				message.error('登录失败，请检查邮箱和密码')
			} else {
				message.success('登录成功')
				// 获取会话信息并跳转
				const session = await getSession()
				if (session) {
					router.push('/')
				}
			}
		} catch (error) {
			console.error('登录过程中发生错误', error)
			message.error('登录过程中发生错误')
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
							alt="管理后台"
						/>
					</div>
					<h1 className="text-2xl font-bold text-gray-900">管理后台</h1>
					<p className="text-gray-600 mt-2">请登录您的账户</p>
				</div>

				<Form
					name="login"
					onFinish={onFinish}
					autoComplete="off"
					size="large"
				>
					<Form.Item
						name="email"
						rules={[
							{ required: true, message: '请输入邮箱地址' },
							{ type: 'email', message: '请输入有效的邮箱地址' },
						]}
					>
						<Input
							prefix={<UserOutlined />}
							placeholder="邮箱地址"
						/>
					</Form.Item>

					<Form.Item
						name="password"
						rules={[{ required: true, message: '请输入密码' }]}
					>
						<Input.Password
							prefix={<LockOutlined />}
							placeholder="密码"
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
