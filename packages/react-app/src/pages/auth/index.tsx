import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { LocalStorageKeys, LocalStorageStore } from '@dify-chat/helpers'
import { useMount } from 'ahooks'
import { Button, Card, Form, Input, message } from 'antd'
import { useHistory } from 'pure-react-router'
import { useState } from 'react'

import { Logo } from '@/components'
import { getCsrfToken, getSession, login } from '@/utils/auth.ts'

interface LoginForm {
	sn: string
	password: string
}

export default function AuthPage() {
	const history = useHistory()
	const [loading, setLoading] = useState(false)

	const onFinish = async (values: LoginForm) => {
		setLoading(true)
		try {
			const result = await login({
				sn: values.sn,
				password: values.password,
			})

			if (result?.error) {
				message.open({
					type: 'error',
					content: '登录失败，请检查账号和密码',
				})
			} else {
				message.open({
					type: 'success',
					content: '登录成功',
				})
				// 获取会话信息并跳转
				const session = await getSession()
				if (session) {
					// 存储用户信息
					LocalStorageStore.set(LocalStorageKeys.USER_INFO, session)
					history.push('/apps')
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

	useMount(() => {
		getCsrfToken()
	})

	return (
		<div className="w-screen h-screen flex flex-col items-center justify-center bg-theme-bg">
			<div className="absolute flex-col w-full h-full left-0 top-0 z-50 flex items-center justify-center">
				<Logo
					hideGithubIcon
					text={''}
				/>
				<div className="text-theme-text">请登录您的账户</div>
				<div className="mt-6">
					<Card className="w-full max-w-md">
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
										message: '请输入有效的账号',
									},
								]}
							>
								<Input
									prefix={<UserOutlined />}
									placeholder="账号"
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
			</div>
		</div>
	)
}
