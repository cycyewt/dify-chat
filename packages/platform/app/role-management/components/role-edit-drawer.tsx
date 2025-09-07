'use client'

import { Button, Drawer, Form, Input, message, Select, Space } from 'antd'
import { useEffect, useState } from 'react'

interface Role {
	id: string
	name: string
	code: string
	remark: string
	apps: { id: string; name: string }[]
	createdAt: string
	updatedAt: string
}

interface RoleApp {
	id: string
	name: string
	description: string
}

interface RoleEditDrawerProps {
	visible: boolean
	role: Role | null
	onClose: () => void
	onSaveSuccess: () => void
}

interface RoleFormData {
	name: string
	code: string
	remark: string
	apps: string[]
}

export default function RoleEditDrawer({
	visible,
	role,
	onClose,
	onSaveSuccess,
}: RoleEditDrawerProps) {
	const [form] = Form.useForm<RoleFormData>()
	const [loading, setLoading] = useState(false)
	const isEditing = !!role
	const [roleApps, setRoleApps] = useState<RoleApp[]>([])

	useEffect(() => {
		if (visible) {
			if (role) {
				form.resetFields()
				form.setFieldsValue({
					name: role.name || '',
					code: role.code || '',
					remark: role.remark || '',
					apps: role.apps.map(app => app.id) || [],
				})
			} else {
				form.resetFields()
			}
		}
	}, [visible, role, form])

	const fetchRoleApps = async () => {
		try {
			const response = await fetch('/api/apps/simple')
			if (response.ok) {
				const data = await response.json()
				setRoleApps(data)
			} else {
				message.open({
					type: 'error',
					content: '获取应用列表失败',
				})
			}
		} catch (error) {
			console.error('获取应用列表时发生错误', error)
			message.open({
				type: 'error',
				content: '获取应用列表时发生错误',
			})
		}
	}
	useEffect(() => {
		if (visible) {
			fetchRoleApps()
		}
	}, [visible])

	const handleSubmit = async (values: RoleFormData) => {
		setLoading(true)
		try {
			const url = isEditing ? `/api/roles/${role.id}` : '/api/roles'
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
					content: isEditing ? '更新角色成功' : '添加角色成功',
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
			title={isEditing ? '编辑角色' : '添加角色'}
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
					label="角色名称"
					rules={[{ required: true, message: '请输入角色名称' }]}
				>
					<Input placeholder="请输入角色名称" />
				</Form.Item>

				<Form.Item
					name="code"
					label="角色编码"
					required
					tooltip={'角色编码用于标识角色，请勿重复'}
					extra="大/小写字母、数字和下划线组合，请勿重复"
					rules={[
						{
							validator: (rule, value) => {
								if (/^[a-zA-Z0-9_]+$/.test(value)) {
									return Promise.resolve()
								}

								return Promise.reject()
							},
							message: '请输入角色编码',
						},
					]}
				>
					<Input
						disabled={isEditing}
						allowClear
						placeholder="请输入角色编码"
					/>
				</Form.Item>

				<Form.Item
					name="remark"
					label="角色描述"
					rules={[{ required: true, message: '请输入角色描述' }]}
				>
					<Input
						allowClear
						placeholder="请输入角色描述"
					/>
				</Form.Item>

				<Form.Item
					name="apps"
					label="分配应用"
				>
					<Select
						mode="multiple"
						placeholder="选择已配置的 Dify 应用"
						showSearch
						optionFilterProp="name"
						allowClear
					>
						{roleApps.map(app => (
							<Select.Option
								key={app.id}
								value={app.id}
								name={app.name}
							>
								{app.name}
							</Select.Option>
						))}
					</Select>
				</Form.Item>
			</Form>
		</Drawer>
	)
}
