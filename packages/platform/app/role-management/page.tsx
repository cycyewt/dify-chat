'use client'

import { PlusOutlined } from '@ant-design/icons'
import { Button, Input, message, Popconfirm, Space, Table, TableColumnsType, Tag } from 'antd'
import Title from 'antd/es/typography/Title'
import { useEffect, useState } from 'react'

import RoleEditDrawer from '@/app/role-management/components/role-edit-drawer'

interface Role {
	id: string
	name: string
	code: string
	remark: string
	apps: { id: string; name: string }[]
	createdAt: string
	updatedAt: string
}

export default function RoleManagementPage() {
	const [roles, setRoles] = useState<Role[]>([])
	const [loading, setLoading] = useState(false)
	const [drawerVisible, setDrawerVisible] = useState(false)
	const [editingRole, setEditingRole] = useState<Role | null>(null)

	const [keyword, setKeyword] = useState('')
	const [page, setPage] = useState(1)
	const [pageSize, setPageSize] = useState(2)
	const [total, setTotal] = useState(0)
	const fetchRoles = async () => {
		setLoading(true)
		try {
			const response = await fetch(
				`/api/roles?keyword=${keyword}&page=${page}&pageSize=${pageSize}`,
			)
			if (response.ok) {
				const data = await response.json()
				setRoles(data.rows)
				setTotal(data.total)
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
		} finally {
			setLoading(false)
		}
	}

	const handleDelete = async (roleId: string) => {
		try {
			const response = await fetch(`/api/roles/${roleId}`, {
				method: 'DELETE',
			})
			if (response.ok) {
				message.open({
					type: 'success',
					content: '删除角色成功',
				})
				fetchRoles()
			} else {
				const error = await response.json()
				message.open({
					type: 'error',
					content: error.message || '删除角色失败',
				})
			}
		} catch (error) {
			console.error('删除角色时发生错误', error)
			message.open({
				type: 'error',
				content: '删除角色时发生错误',
			})
		}
	}

	const handleEdit = (role: Role) => {
		setEditingRole(role)
		setDrawerVisible(true)
	}

	const handleAdd = () => {
		setEditingRole(null)
		setDrawerVisible(true)
	}

	const handleDrawerClose = () => {
		setDrawerVisible(false)
		setEditingRole(null)
	}

	const handleSaveSuccess = () => {
		setDrawerVisible(false)
		setEditingRole(null)
		fetchRoles()
	}

	useEffect(() => {
		fetchRoles()
	}, [])

	useEffect(() => {
		fetchRoles()
	}, [keyword, page, pageSize])

	const columns: TableColumnsType<Role> = [
		{
			title: 'ID',
			dataIndex: 'id',
		},
		{
			title: '角色名称',
			dataIndex: 'name',
		},
		{
			title: '角色编码',
			dataIndex: 'code',
		},
		{
			title: '角色描述',
			dataIndex: 'remark',
		},
		{
			title: '已分配应用',
			dataIndex: 'apps',
			render: (_: unknown, record) => {
				return (
					<>
						{record.apps.map(app => (
							<div key={app.id}>
								<Tag
									className="!m-0 !text-[#556072]"
									color="#ebeced"
								>
									{app.name}
								</Tag>
							</div>
						))}
					</>
				)
			},
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
			render: (_: unknown, record) =>
				record.code === 'admin' ? null : (
					<Space>
						<Button
							className={'!px-0'}
							type="link"
							onClick={() => handleEdit(record)}
						>
							编辑
						</Button>
						<Popconfirm
							title="确认删除"
							description="确定要删除这个角色吗？此操作不可恢复。"
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
						角色管理
					</Title>
					<p className="mt-1 text-gray-600">管理系统用户角色</p>
				</div>
				<Space>
					<Input.Search
						placeholder="请输入关键字"
						allowClear
						onSearch={value => setKeyword(value.trim())}
					/>
					<Button
						type="primary"
						className={'leading-none'}
						icon={<PlusOutlined />}
						onClick={handleAdd}
					>
						添加角色
					</Button>
				</Space>
			</div>

			<Table
				columns={columns}
				dataSource={roles}
				rowKey="id"
				loading={loading}
				pagination={{
					current: page,
					total,
					pageSize: pageSize,
					size: 'default',
					showQuickJumper: false,
					showTotal: total => `共 ${total} 个角色`,
					onChange: (page, pageSize) => {
						console.log('page', page, pageSize)
						setPage(page)
						setPageSize(pageSize)
					},
				}}
			/>

			<RoleEditDrawer
				visible={drawerVisible}
				role={editingRole}
				onClose={handleDrawerClose}
				onSaveSuccess={handleSaveSuccess}
			/>
		</div>
	)
}
