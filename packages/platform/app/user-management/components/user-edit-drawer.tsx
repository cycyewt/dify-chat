'use client'

import { Button, Drawer, Form, Input, message, Select, Space } from 'antd'
import { useEffect, useState } from 'react'

interface User {
	id: string
	name: string
	sn: string
	phoneNumber: string
	agency: string
	isEnabled: boolean
	roles: { id: number; name: string; remark: string }[]
	createdAt: string
	updatedAt: string
}

interface UserRole {
	id: number
	name: string
	remark: string
}

interface UserEditDrawerProps {
	visible: boolean
	user: User | null
	onClose: () => void
	onSaveSuccess: () => void
}

interface UserFormData {
	name: string
	sn: string
	phoneNumber: string
	agency: string
	password?: string
	roles: number[]
}

export default function UserEditDrawer({
	visible,
	user,
	onClose,
	onSaveSuccess,
}: UserEditDrawerProps) {
	const [form] = Form.useForm()
	const [loading, setLoading] = useState(false)
	const isEditing = !!user
	const [userRoles, setUserRoles] = useState<UserRole[]>([])

	useEffect(() => {
		if (visible) {
			if (user) {
				form.resetFields()
				form.setFieldsValue({
					name: user.name || '',
					sn: user.sn || '',
					phoneNumber: user.phoneNumber || '',
					agency: user.agency || '',
					roles: user.roles.map(role => role.id),
				})
			} else {
				form.resetFields()
			}
		}
	}, [visible, user, form])
	const fetchUserRoles = async () => {
		try {
			const response = await fetch('/api/roles/simple')
			if (response.ok) {
				const data = await response.json()
				setUserRoles(data)
			} else {
				message.open({
					type: 'error',
					content: '获取角色列表失败',
				})
			}
		} catch (error) {
			console.error('获取角色列表时发生错误', error)
			message.open({
				type: 'error',
				content: '获取角色列表时发生错误',
			})
		}
	}
	useEffect(() => {
		if (visible) {
			fetchUserRoles()
		}
	}, [visible])

	const handleSubmit = async (values: UserFormData) => {
		setLoading(true)
		try {
			const url = isEditing ? `/api/users/${user.id}` : '/api/users'
			const method = isEditing ? 'PUT' : 'POST'

			const response = await fetch(url, {
				method,
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(values),
			})

			if (response.ok) {
				message.open({
					type: 'success',
					content: isEditing ? '更新用户成功' : '添加用户成功',
				})
				onSaveSuccess()
			} else {
				const error = await response.json()
				message.open({
					type: 'error',
					content: error.message || '操作失败',
				})
			}
		} catch (error) {
			console.error('操作时发生错误', error)
			message.open({
				type: 'error',
				content: '操作时发生错误',
			})
		} finally {
			setLoading(false)
		}
	}

	return (
		<Drawer
			title={isEditing ? '编辑用户' : '添加用户'}
			width={400}
			open={visible}
			onClose={onClose}
			extra={
				<div className="flex justify-end">
					<Space>
						<Button onClick={onClose}>取消</Button>
						<Button
							type="primary"
							loading={loading}
							onClick={() => form.submit()}
						>
							{isEditing ? '更新' : '添加'}
						</Button>
					</Space>
				</div>
			}
		>
			<Form
				form={form}
				layout="vertical"
				onFinish={handleSubmit}
			>
				<Form.Item
					name="name"
					label="姓名"
					rules={[{ required: true, message: '请输入姓名' }]}
				>
					<Input placeholder="请输入用户姓名" />
				</Form.Item>

				<Form.Item
					name="sn"
					label="账号"
					required
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
						placeholder="账号"
						allowClear
					/>
				</Form.Item>

				<Form.Item
					name="phoneNumber"
					label="手机号码"
					required
					rules={[
						{
							validator: (rule, value) => {
								if (/^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(value)) {
									return Promise.resolve()
								}

								return Promise.reject()
							},
							message: '请输入有效的手机号码',
						},
					]}
				>
					<Input
						placeholder="手机号码"
						allowClear
					/>
				</Form.Item>

				<Form.Item
					name="agency"
					label="工作单位"
					rules={[{ required: true, message: '请输入工作单位' }]}
				>
					<Input
						allowClear
						placeholder="请输入工作单位"
					/>
				</Form.Item>

				{isEditing ? (
					<Form.Item
						name="password"
						label="新密码"
						extra="留空则不修改密码"
						rules={[{ min: 6, message: '密码至少6位' }]}
					>
						<Input.Password
							allowClear
							placeholder="新密码"
							autoComplete="new-password"
						/>
					</Form.Item>
				) : (
					<Form.Item
						name="password"
						label="密码"
						rules={[
							{ required: true, message: '请输入密码' },
							{ min: 6, message: '密码至少6位' },
						]}
					>
						<Input.Password
							allowClear
							placeholder="请输入密码"
							autoComplete="new-password"
						/>
					</Form.Item>
				)}

				<Form.Item
					name="roles"
					label="分配角色"
				>
					<Select
						mode="multiple"
						placeholder="选择已配置的用户角色"
						showSearch
						optionFilterProp="name"
						allowClear
					>
						{userRoles.map(role => (
							<Select.Option
								key={role.id}
								value={role.id}
								name={role.name}
							>
								{role.name}
							</Select.Option>
						))}
					</Select>
				</Form.Item>
			</Form>
		</Drawer>
	)
}
