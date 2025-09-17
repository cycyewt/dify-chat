'use client'

import { DoubleLeftOutlined } from '@ant-design/icons'
import { Button, Card, Form, Input, message } from 'antd'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import LogoIcon from '@/assets/images/logo.png'

interface PasswordForm {
	sn: string
	password: string
	newPassword: string
}

export default function PasswordPage() {
	const [loading, setLoading] = useState(false)
	const router = useRouter()

	const onFinish = async (values: PasswordForm) => {
		setLoading(true)
		try {
			const result = await fetch('/api/password', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					sn: values.sn,
					password: values.password,
					newPassword: values.newPassword,
				}),
			})

			if (result.ok) {
				message.open({
					type: 'success',
					content: '修改成功',
				})
				// 返回
				router.back()
			} else {
				message.open({
					type: 'error',
					content: '修改失败，请检查警号和密码',
				})
			}
		} catch (error) {
			console.error('修改过程中发生错误', error)
			message.open({
				type: 'error',
				content: '修改过程中发生错误',
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
							<p className="text-gray-600 mt-2">修改密码，请妥善保存</p>
						</div>

						<Form
							name="login"
							onFinish={onFinish}
							autoComplete="new-password"
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
									autoComplete="new-password"
									allowClear
								/>
							</Form.Item>

							<Form.Item
								name="password"
								label={'旧密码'}
								rules={[{ required: true, message: '请输入旧密码' }]}
							>
								<Input.Password
									placeholder="旧密码"
									autoComplete="new-password"
									allowClear
								/>
							</Form.Item>

							<Form.Item
								name="newPassword"
								label={'新密码'}
								rules={[{ required: true, message: '请输入新密码' }]}
							>
								<Input.Password
									placeholder="新密码"
									autoComplete="new-password"
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
									确定
								</Button>
							</Form.Item>
						</Form>

						<div className="flex justify-center items-center">
							<a onClick={() => router.back()}>
								<DoubleLeftOutlined />
								返回登录
							</a>
						</div>
						<div className="mt-10 text-gray-300 text-center">&copy; 2025</div>
					</div>
				</div>
			</Card>
		</div>
	)
}
