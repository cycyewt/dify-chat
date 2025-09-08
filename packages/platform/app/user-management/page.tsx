'use client'

import { PlusOutlined, ReloadOutlined, UserOutlined } from '@ant-design/icons'
import { Button, message, Popconfirm, Space, Table, TableColumnsType, Tag } from 'antd'
import Title from 'antd/es/typography/Title'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'

import UserEditDrawer from './components/user-edit-drawer'

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

export default function UserManagementPage() {
	const { data: session } = useSession()
	const [users, setUsers] = useState<User[]>([])
	const [loading, setLoading] = useState(false)
	const [drawerVisible, setDrawerVisible] = useState(false)
	const [editingUser, setEditingUser] = useState<User | null>(null)

	const fetchUsers = async () => {
		setLoading(true)
		try {
			const response = await fetch('/api/users')
			if (response.ok) {
				const data = await response.json()
				setUsers(data)
			} else {
				message.open({
					type: 'error',
					content: '获取用户列表失败',
				})
			}
		} catch (error) {
			console.error('获取用户列表时发生错误', error)
			message.open({
				type: 'error',
				content: '获取用户列表时发生错误',
			})
		} finally {
			setLoading(false)
		}
	}

	const handleDelete = async (userId: string) => {
		try {
			const response = await fetch(`/api/users/${userId}`, {
				method: 'DELETE',
			})
			if (response.ok) {
				message.open({
					type: 'success',
					content: '删除用户成功',
				})
				fetchUsers()
			} else {
				message.open({
					type: 'error',
					content: '删除用户失败',
				})
			}
		} catch (error) {
			console.error('删除用户时发生错误', error)
			message.open({
				type: 'error',
				content: '删除用户时发生错误',
			})
		}
	}

	const handleEdit = (user: User) => {
		setEditingUser(user)
		setDrawerVisible(true)
	}

	const handleAdd = () => {
		setEditingUser(null)
		setDrawerVisible(true)
	}

	const handleDrawerClose = () => {
		setDrawerVisible(false)
		setEditingUser(null)
	}

	const handleSaveSuccess = () => {
		setDrawerVisible(false)
		setEditingUser(null)
		fetchUsers()
	}

	useEffect(() => {
		fetchUsers()
	}, [])

	const columns: TableColumnsType<User> = [
		{
			title: '用户',
			dataIndex: 'name',
			key: 'name',
			render: (name: string, record) => (
				<Space>
					<UserOutlined />
					<div>
						<div>{name}</div>
						<div className="text-gray-500 text-sm">{record.sn}</div>
					</div>
				</Space>
			),
		},
		{
			title: '手机号',
			dataIndex: 'phoneNumber',
		},
		{
			title: '工作单位',
			dataIndex: 'agency',
			width: 220,
		},
		{
			title: '已分配角色',
			dataIndex: 'roles',
			render: (_: unknown, record) => {
				return (
					<>
						{record.roles.map(role => (
							<div key={role.id}>
								<Tag>{role.name}</Tag>
							</div>
						))}
					</>
				)
			},
		},
		{
			title: '状态',
			dataIndex: 'isEnabled',
			render: (isEnabled: boolean) =>
				isEnabled ? <Tag color="green">正常</Tag> : <Tag color="red">禁用</Tag>,
		},
		{
			title: '创建时间',
			dataIndex: 'createdAt',
			render: (date: string) => new Date(date).toLocaleString('zh-CN'),
		},
		{
			title: '最后更新',
			dataIndex: 'updatedAt',
			render: (date: string) => new Date(date).toLocaleString('zh-CN'),
		},
		{
			title: '操作',
			key: 'actions',
			render: (_: unknown, record: User) => (
				<Space>
					<Button
						className={'!px-0'}
						type="link"
						onClick={() => handleEdit(record)}
					>
						编辑
					</Button>
					{/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
					{record.id !== (session?.user as any)?.id && (
						<Popconfirm
							title="确认删除"
							description="确定要删除这个用户吗？此操作不可恢复。"
							onConfirm={() => handleDelete(record.id)}
							okText="确定"
							cancelText="取消"
						>
							<Button
								className={'!px-0'}
								type="link"
								danger
							>
								删除
							</Button>
						</Popconfirm>
					)}
				</Space>
			),
		},
	]

	return (
		<div className="mx-auto px-4 w-full 2xl:!w-3/4 h-full">
			<div className="flex justify-between items-end mb-6">
				<div>
					<Title
						level={3}
						className={'!mb-0'}
					>
						用户管理
					</Title>
					<p className="mt-1 text-gray-600">管理系统用户账号</p>
				</div>
				<Space>
					<Button
						icon={<ReloadOutlined />}
						onClick={fetchUsers}
					>
						刷新
					</Button>
					<Button
						type="primary"
						icon={<PlusOutlined />}
						className={'leading-none'}
						onClick={handleAdd}
					>
						添加用户
					</Button>
				</Space>
			</div>

			<Table
				size={'small'}
				columns={columns}
				dataSource={users}
				rowKey="id"
				loading={loading}
				pagination={{
					size: 'default',
					showSizeChanger: true,
					showQuickJumper: true,
					showTotal: total => `共 ${total} 个用户`,
				}}
			/>

			<UserEditDrawer
				visible={drawerVisible}
				user={editingUser}
				onClose={handleDrawerClose}
				onSaveSuccess={handleSaveSuccess}
			/>
		</div>
	)
}
