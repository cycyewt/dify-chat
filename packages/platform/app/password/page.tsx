'use client'

import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Card, Form, Input, message } from 'antd'
import Image from 'next/image'
import Link from 'next/link'
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
		<div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#1d1d1d]">
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
					<h1 className="text-2xl font-bold text-gray-900 dark:text-gray-500">修改密码</h1>
					<p className="text-gray-600 mt-2">请妥善保存新密码</p>
				</div>

				<Form
					name="login"
					onFinish={onFinish}
					autoComplete="new-password"
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
							autoComplete="new-password"
							allowClear
						/>
					</Form.Item>

					<Form.Item
						name="password"
						rules={[{ required: true, message: '请输入旧密码' }]}
					>
						<Input.Password
							prefix={<LockOutlined />}
							placeholder="旧密码"
							autoComplete="new-password"
							allowClear
						/>
					</Form.Item>

					<Form.Item
						name="newPassword"
						rules={[{ required: true, message: '请输入新密码' }]}
					>
						<Input.Password
							prefix={<LockOutlined />}
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
					<a onClick={() => router.back()}>返回</a>
				</div>
			</Card>
		</div>
	)
}
