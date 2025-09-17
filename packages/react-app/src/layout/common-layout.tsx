import { IDifyAppItem, useAppContext } from '@dify-chat/core'
import { Empty, Spin } from 'antd'

import { HeaderLayout } from '@/components'

interface ICommonLayoutProps {
	initLoading: boolean
	/**
	 * 扩展的 JSX 元素, 如抽屉/弹窗等
	 */
	extComponents?: React.ReactNode
	/**
	 * 自定义 Logo 渲染
	 */
	renderLogo?: () => React.ReactNode
	/**
	 * 自定义中心标题
	 */
	renderCenterTitle?: (appInfo?: IDifyAppItem['info']) => React.ReactNode
	/**
	 * 自定义右侧头部内容
	 */
	renderRightHeader?: () => React.ReactNode
	children: React.ReactNode
}

export default function CommonLayout(props: ICommonLayoutProps) {
	const { initLoading, renderLogo, renderCenterTitle, renderRightHeader, children, extComponents } =
		props
	const { appLoading, currentApp } = useAppContext()

	return (
		<div className={`w-full h-screen flex flex-col overflow-hidden`}>
			{/* 头部 */}
			<HeaderLayout
				title={renderCenterTitle?.(currentApp?.config?.info)}
				logoText={''}
				renderLogo={renderLogo}
				renderRightHeader={renderRightHeader}
				isTitleWrapped
			/>

			{/* Main */}
			<div className="flex-1 overflow-hidden flex bg-theme-main-bg">
				{appLoading || initLoading ? (
					<div className="absolute w-full h-full left-0 top-0 z-50 flex items-center justify-center">
						<Spin spinning />
					</div>
				) : currentApp?.config ? (
					<>{children}</>
				) : (
					<div className="w-full h-full flex items-center justify-center">
						<Empty
							description="暂无 Dify 应用配置，请联系管理员"
							className="text-base"
						/>
					</div>
				)}
			</div>
			{extComponents}
		</div>
	)
}
