import { DoubleRightOutlined, LockOutlined } from '@ant-design/icons'
import { useIsMobile } from '@dify-chat/helpers'
import { useRequest } from 'ahooks'
import { Button, Card, Col, Empty, message, Row, Spin } from 'antd'
import { useHistory } from 'pure-react-router'

import LogoIcon from '@/assets/images/logo.png'
import { useAuth } from '@/hooks/use-auth.ts'
import appService from '@/services/app'

export default function AppListPage() {
	const history = useHistory()
	const isMobile = useIsMobile()
	const { isAuthorized, goAuthorize } = useAuth()

	const { data: list, loading } = useRequest(
		() => {
			return appService.getApps()
		},
		{
			onError: error => {
				message.error(`获取应用列表失败: ${error}`)
				console.error(error)
			},
		},
	)

	return (
		<div className="flex justify-center items-center w-full h-screen relative overflow-hidden portal-bg">
			<Card className="!py-4 !px-4 min-w-[920px] shadow-2xl">
				<div className="text-center">
					<div className="flex justify-center mb-4">
						<img
							src={LogoIcon}
							width={96}
							height={96}
							alt="AI应用平台"
							className={'align-middle'}
						/>
					</div>
					<h1>AI应用平台</h1>
					<p className="text-gray-600">请根据权限选择登录入口</p>
					<div className={'flex justify-center items-center gap-8 mt-10'}>
						<Button
							type={'default'}
							size={'large'}
							className={'w-40'}
						>
							基础功能
						</Button>
						<Button
							type={'primary'}
							size={'large'}
							className={'w-40'}
							icon={<LockOutlined />}
						>
							高级功能
						</Button>
					</div>
					<div className="mt-10 text-gray-300">&copy; 2025</div>
				</div>
			</Card>
			{/*{loading ? (*/}
			{/*	<div className="flex-1 flex justify-center items-center bg-theme-main-bg py-6 overflow-y-auto box-border overflow-x-hidden">*/}
			{/*		<Spin spinning />*/}
			{/*	</div>*/}
			{/*) : (*/}
			{/*	<div className="flex-1 flex justify-center items-center portal-bg py-6 overflow-y-auto box-border overflow-x-hidden">*/}
			{/*		{list?.length ? (*/}
			{/*			<Row*/}
			{/*				gutter={[16, 16]}*/}
			{/*				className={'h-64'}*/}
			{/*			>*/}
			{/*				{[list[0]].map(item => {*/}
			{/*					if (!item.info) {*/}
			{/*						return (*/}
			{/*							<Col*/}
			{/*								key={item.id}*/}
			{/*								span={isMobile ? 24 : 12}*/}
			{/*							>*/}
			{/*								<div*/}
			{/*									key={item.id}*/}
			{/*									className={`relative p-3 bg-theme-btn-bg border border-solid border-theme-border rounded-2xl cursor-pointer hover:border-primary hover:text-primary`}*/}
			{/*								>*/}
			{/*									应用信息缺失，请检查*/}
			{/*								</div>*/}
			{/*							</Col>*/}
			{/*						)*/}
			{/*					}*/}
			{/*					return (*/}
			{/*						<Col*/}
			{/*							key={item.id}*/}
			{/*							span={isMobile ? 24 : 12}*/}
			{/*						>*/}
			{/*							<div*/}
			{/*								key={item.id}*/}
			{/*								className={`p-24 h-full box-border bg-theme-btn-bg shadow-sm border border-solid border-theme-border rounded-2xl cursor-pointer hover:border-primary hover:text-primary`}*/}
			{/*								onClick={() => {*/}
			{/*									history.push(`apps/${item.id}`)*/}
			{/*								}}*/}
			{/*							>*/}
			{/*								<div className={'text-2xl font-semibold'}>{item.info.name}</div>*/}
			{/*								<div className={'flex items-center mt-2 text-gray-500'}>*/}
			{/*									<span>开始使用</span>*/}
			{/*									<DoubleRightOutlined />*/}
			{/*								</div>*/}
			{/*							</div>*/}
			{/*						</Col>*/}
			{/*					)*/}
			{/*				})}*/}
			{/*				{isAuthorized ? (*/}
			{/*					<Col span={isMobile ? 24 : 12}>*/}
			{/*						<div*/}
			{/*							className={`flex items-center p-24 h-full box-border bg-theme-btn-bg shadow-sm border border-solid border-theme-border rounded-2xl cursor-pointer hover:border-primary hover:text-primary`}*/}
			{/*							onClick={() => {*/}
			{/*								history.push(`apps/${list[0].id}`)*/}
			{/*							}}*/}
			{/*						>*/}
			{/*							<div className={'flex items-center whitespace-nowrap'}>*/}
			{/*								<span>使用更多</span>*/}
			{/*								<DoubleRightOutlined />*/}
			{/*							</div>*/}
			{/*						</div>*/}
			{/*					</Col>*/}
			{/*				) : (*/}
			{/*					<Col*/}
			{/*						span={isMobile ? 24 : 12}*/}
			{/*						className={'flex-1'}*/}
			{/*					>*/}
			{/*						<div*/}
			{/*							className={`flex items-center p-24 h-full box-border shadow-sm border border-solid border-theme-border rounded-2xl cursor-pointer hover:border-primary hover:text-primary`}*/}
			{/*							onClick={() => {*/}
			{/*								goAuthorize()*/}
			{/*							}}*/}
			{/*						>*/}
			{/*							<div className={'flex items-center whitespace-nowrap'}>*/}
			{/*								<span>登录使用更多</span>*/}
			{/*								<DoubleRightOutlined />*/}
			{/*							</div>*/}
			{/*						</div>*/}
			{/*					</Col>*/}
			{/*				)}*/}
			{/*			</Row>*/}
			{/*		) : (*/}
			{/*			<div className="w-full h-full box-border flex flex-col items-center justify-center px-3">*/}
			{/*				<Empty description="暂无应用" />*/}
			{/*			</div>*/}
			{/*		)}*/}
			{/*	</div>*/}
			{/*)}*/}
		</div>
	)
}
