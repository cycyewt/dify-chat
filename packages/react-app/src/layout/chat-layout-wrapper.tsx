import { DownOutlined, InfoCircleOutlined } from '@ant-design/icons'
import {
	AppContextProvider,
	AppModeEnums,
	DEFAULT_APP_SITE_SETTING,
	ICurrentApp,
	IDifyAppItem,
} from '@dify-chat/core'
import { useIsMobile } from '@dify-chat/helpers'
import { useMount, useRequest } from 'ahooks'
import { Dropdown, message, Tooltip } from 'antd'
import { useHistory, useParams } from 'pure-react-router'
import { useEffect, useState } from 'react'
import { flushSync } from 'react-dom'

import { LucideIcon } from '@/components'
import { isDebugMode } from '@/components/debug-mode'
import SystemMenu from '@/components/system-menu'
import { useAuth } from '@/hooks/use-auth'
import appService from '@/services/app'
import { createDifyApiInstance, DifyApi } from '@/utils/dify-api'

import MainLayout from './main-layout'

const MultiAppLayout = () => {
	const history = useHistory()
	const { userInfo } = useAuth()
	console.log('userInfo', userInfo)
	const userId = userInfo?.user.id

	const [difyApi] = useState(
		createDifyApiInstance({
			user: userId,
			apiBase: '',
			apiKey: '',
		}),
	)

	const [selectedAppId, setSelectedAppId] = useState<string>('')
	const [initLoading, setInitLoading] = useState(false)
	const [appList, setAppList] = useState<IDifyAppItem[]>([])

	const { appId } = useParams<{ appId: string }>()
	const [currentApp, setCurrentApp] = useState<ICurrentApp>()

	const { runAsync: getAppList } = useRequest(
		() => {
			setInitLoading(true)
			return appService.getApps()
		},
		{
			manual: true,
			onSuccess: result => {
				flushSync(() => {
					setAppList(result)
				})
				if (isMobile) {
					// 移动端如果没有应用，直接跳转应用列表页
					if (!result?.length) {
						history.replace('/apps')
						return Promise.resolve([])
					}
				}

				if (appId) {
					setSelectedAppId(appId as string)
				} else if (!selectedAppId && result?.length) {
					setSelectedAppId(result[0]?.id || '')
				}
			},
			onError: error => {
				message.error(`获取应用列表失败: ${error}`)
				console.error(error)
			},
			onFinally: () => {
				setInitLoading(false)
			},
		},
	)

	const { runAsync: getAppParameters } = useRequest(
		(difyApi: DifyApi) => {
			return difyApi.getAppParameters()
		},
		{
			manual: true,
		},
	)

	const { runAsync: getAppSiteSetting } = useRequest(
		(difyApi: DifyApi) => {
			return difyApi
				.getAppSiteSetting()
				.then(res => {
					return res
				})
				.catch(err => {
					console.error(err)
					console.warn(
						'Dify 版本提示: 获取应用 WebApp 设置失败，已降级为使用默认设置。如需与 Dify 配置同步，请确保你的 Dify 版本 >= v1.4.0',
					)
					return DEFAULT_APP_SITE_SETTING
				})
		},
		{
			manual: true,
		},
	)

	/**
	 * 初始化应用信息
	 */
	const initApp = async () => {
		const appItem = await appService.getAppByID(selectedAppId)
		if (!appItem) {
			return
		}
		const newOptions = isDebugMode()
			? {
					user: userId,
					...appItem.requestConfig,
				}
			: {
					user: userId,
					...appItem.requestConfig,
					apiBase: `/${selectedAppId}`,
				}
		difyApi.updateOptions(newOptions)
		setInitLoading(true)
		// 获取应用参数
		const getParameters = () => getAppParameters(difyApi)
		const getSiteSetting = () => getAppSiteSetting(difyApi)
		const promises = [getParameters(), getSiteSetting()] as const
		Promise.all(promises)
			.then(res => {
				const [parameters, siteSetting] = res
				setCurrentApp({
					config: appItem,
					parameters: parameters!,
					site: siteSetting,
				})
			})
			.catch(err => {
				message.error(`获取应用参数失败: ${err}`)
				console.error(err)
				setCurrentApp(undefined)
			})
			.finally(() => {
				setInitLoading(false)
			})
	}

	useEffect(() => {
		initApp()
	}, [selectedAppId])

	const isMobile = useIsMobile()

	// 初始化获取应用列表
	useMount(() => {
		getAppList()
	})

	return (
		<AppContextProvider
			value={{
				appLoading: initLoading,
				currentAppId: selectedAppId,
				setCurrentAppId: setSelectedAppId,
				currentApp,
				setCurrentApp,
			}}
		>
			<>
				<MainLayout
					difyApi={difyApi}
					initLoading={initLoading}
					renderCenterTitle={() => {
						return (
							<div className="flex items-center overflow-hidden">
								<LucideIcon
									name="layout-grid"
									size={16}
									className="mr-1"
								/>
								<span
									className="cursor-pointer inline-block shrink-0"
									onClick={() => {
										history.push('apps')
									}}
								>
									应用列表
								</span>
								{selectedAppId ? (
									<div className="flex items-center overflow-hidden">
										<div className="mx-2 font-normal text-desc">/</div>
										<Dropdown
											arrow
											placement="bottom"
											trigger={['hover']}
											forceRender={true}
											menu={{
												selectedKeys: [selectedAppId],
												items: [
													...(appList?.map(item => {
														const isSelected = selectedAppId === item.id
														return {
															key: item.id,
															label: (
																<div className={isSelected ? 'text-primary' : 'text-theme-text'}>
																	{item.info.name}
																</div>
															),
															onClick: () => {
																history.push(`apps/${item.id}`)
																setSelectedAppId(item.id)
															},
															icon: (
																<LucideIcon
																	name={
																		item.info.mode === AppModeEnums.CHATBOT
																			? 'bot-message-square'
																			: item.info.mode === AppModeEnums.WORKFLOW
																				? 'workflow'
																				: item.info.mode === AppModeEnums.CHATFLOW
																					? 'workflow'
																					: item.info.mode === AppModeEnums.TEXT_GENERATOR
																						? 'pen-line'
																						: 'brain-circuit'
																	}
																	size={18}
																/>
															),
															extra: (
																<Tooltip
																	title={item.info.description}
																	placement={'right'}
																>
																	<InfoCircleOutlined />
																</Tooltip>
															),
														}
													}) || []),
												],
											}}
										>
											<div className="cursor-pointer flex-1 flex items-center overflow-hidden">
												<span className="cursor-pointer w-full inline-block truncate">
													{currentApp?.config?.info?.name}
												</span>
												<DownOutlined className="ml-1 w-2 h-2 text-gray-500" />
											</div>
										</Dropdown>
									</div>
								) : null}
							</div>
						)
					}}
					renderRightHeader={() => <SystemMenu />}
				/>
			</>
		</AppContextProvider>
	)
}

export default MultiAppLayout
