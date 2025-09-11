'use client'

import { PlusOutlined, ReloadOutlined } from '@ant-design/icons'
import { DifyApi } from '@dify-chat/api'
import { AppModeEnums, IDifyAppItem } from '@dify-chat/core'
import { AppModeNames } from '@dify-chat/core'
import { useMount, useRequest } from 'ahooks'
import { Button, message, Popconfirm, Space, Table, Tag } from 'antd'
import Title from 'antd/es/typography/Title'
import { useState } from 'react'

import { addApp } from '@/repository/app'

import { deleteApp, getApp, listApp, updateApp } from './actions'
import { AppEditDrawer } from './components/app-edit-drawer'
import { AppDetailDrawerModeEnum } from './enums'

export default function AppManagementPage() {
	const [appEditDrawerOpen, setAppEditDrawerOpen] = useState(false)
	const [appEditDrawerMode, setAppEditDrawerMode] = useState<AppDetailDrawerModeEnum>()
	const [appEditDrawerAppItem, setAppEditDrawerAppItem] = useState<IDifyAppItem>()

	const {
		runAsync: getAppList,
		data: list,
		loading: listLoading,
	} = useRequest(
		() => {
			return listApp()
		},
		{
			manual: true,
		},
	)

	useMount(() => {
		getAppList()
	})

	return (
		<div className="mx-auto px-4 w-full 2xl:!w-3/4 h-full">
			<div className="flex justify-between items-end mb-6">
				<div>
					<Title
						level={3}
						className={'!mb-0'}
					>
						应用管理
					</Title>
					<p className="mt-1 text-gray-600">管理 Dify 中配置的应用</p>
				</div>
				<Space>
					<Button
						icon={<ReloadOutlined />}
						onClick={getAppList}
					>
						刷新
					</Button>
					<Button
						type="primary"
						icon={<PlusOutlined />}
						className={'leading-none'}
						onClick={() => {
							setAppEditDrawerMode(AppDetailDrawerModeEnum.create)
							setAppEditDrawerOpen(true)
							setAppEditDrawerAppItem(undefined)
						}}
					>
						添加应用
					</Button>
				</Space>
			</div>

			<Table
				size={'small'}
				dataSource={list}
				rowKey="id"
				loading={listLoading}
				scroll={{ x: 1200 }}
				columns={[
					{
						title: '名称',
						dataIndex: 'info.name',
						width: 180,
						fixed: 'left',
						ellipsis: true,
						render: (_text, record) => {
							return record.info.name
						},
					},
					{
						title: '类型',
						dataIndex: 'info.mode',
						width: 200,
						render: (_mode: AppModeEnums, record) => {
							return record.info.mode
								? AppModeNames[(record.info.mode || AppModeEnums.CHATBOT) as AppModeEnums]
								: '--'
						},
					},
					{
						title: '描述',
						dataIndex: 'info.description',
						width: 300,
						ellipsis: true,
						render: (_text, record) => {
							return record.info.description || '暂无描述'
						},
					},
					{
						title: '标签',
						dataIndex: 'info.tags',
						width: 200,
						render: (_text, record) => {
							return record.info.tags?.length ? (
								<Space>
									{record.info.tags.map((tag: string) => (
										<Tag key={`${record.id}__${tag}`}>{tag}</Tag>
									))}
								</Space>
							) : null
						},
					},
					{
						title: '状态',
						dataIndex: 'isEnabled',
						width: 140,
						render: (_text, record) => {
							return record.isEnabled ? (
								<Tag color="success">已启用</Tag>
							) : (
								<Tag color="default">已禁用</Tag>
							)
						},
					},
					{
						title: '默认应用',
						dataIndex: 'isDefault',
						width: 140,
						render: (_text, record) => {
							return record.isDefault ? '是' : '-'
						},
					},
					{
						title: '操作',
						key: 'action',
						width: 200,
						fixed: 'right',
						render: (_, record) => (
							<Space size="middle">
								<Button
									className="!px-0"
									type="link"
									onClick={() => {
										setAppEditDrawerMode(AppDetailDrawerModeEnum.edit)
										setAppEditDrawerOpen(true)
										setAppEditDrawerAppItem(record)
									}}
								>
									编辑
								</Button>
								<Button
									className="!px-0"
									type="link"
									onClick={async () => {
										const appItem = await getApp(record.id)
										if (!appItem) {
											message.open({
												type: 'error',
												content: '应用不存在',
											})
											return
										}
										const { info: originalInfo, ...rest } = appItem!
										// 调用获取应用信息接口
										const difyApi = new DifyApi({
											...appItem.requestConfig,
											// TODO: 获取应用信息的 API 其实不用 user，后面处理掉
											user: '',
										})
										const appInfo = await difyApi.getAppInfo()
										try {
											await updateApp({
												...rest,
												info: {
													...originalInfo,
													...appInfo,
												},
											})
											message.open({
												type: 'success',
												content: '同步应用成功',
											})
											getAppList()
										} catch (error) {
											message.open({
												type: 'error',
												content: '同步应用失败',
											})
											console.error(error)
										}
									}}
								>
									同步应用信息
								</Button>
								<Popconfirm
									title="确定删除该应用吗？"
									description="删除后将无法恢复"
									okText="确定"
									cancelText="取消"
									onConfirm={async () => {
										await deleteApp(record.id)
										message.open({
											type: 'success',
											content: '删除应用成功',
										})
										getAppList()
									}}
								>
									<Button
										className="!px-0"
										type="link"
										danger
									>
										删除
									</Button>
								</Popconfirm>
							</Space>
						),
					},
				]}
			/>

			<AppEditDrawer
				detailDrawerMode={appEditDrawerMode!}
				open={appEditDrawerOpen}
				onClose={() => setAppEditDrawerOpen(false)}
				appItem={appEditDrawerAppItem}
				confirmCallback={() => {
					getAppList()
				}}
				addApi={addApp}
				updateApi={updateApp}
			/>
		</div>
	)
}
