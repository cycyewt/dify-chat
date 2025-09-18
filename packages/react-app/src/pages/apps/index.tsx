import { LockOutlined } from '@ant-design/icons'
import { useRequest } from 'ahooks'
import { Button, Card, ConfigProvider, message, Modal, Spin } from 'antd'
import { createStyles } from 'antd-style'
import { useHistory } from 'pure-react-router'

import LogoIcon from '@/assets/images/logo.png'
import { useAuth } from '@/hooks/use-auth.ts'
import appService from '@/services/app'

const useStyle = createStyles(({ prefixCls, css }) => ({
	defaultButton: css`
		&.${prefixCls}-btn-default:not([disabled]):not(.${prefixCls}-btn-dangerous) {
			border: 1px solid #1677ff;
			color: #1677ff;
		}
	`,
	linearGradientButton: css`
		&.${prefixCls}-btn-primary:not([disabled]):not(.${prefixCls}-btn-dangerous) {
			> span {
				position: relative;
			}

			&::before {
				content: '';
				background: linear-gradient(135deg, #6253e1, #04befe);
				position: absolute;
				inset: -1px;
				opacity: 1;
				transition: all 0.3s;
				border-radius: inherit;
			}

			&:hover::before {
				opacity: 0;
			}
		}
	`,
}))

export default function AppListPage() {
	const { styles } = useStyle()
	const history = useHistory()
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
		<div className="flex justify-center items-center w-full h-screen overflow-hidden portal-bg">
			{loading ? (
				<Spin spinning />
			) : (
				<Card className="!py-4 !px-4 w-full max-w-[883px] shadow-2xl">
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
							<ConfigProvider
								button={{
									className: styles.defaultButton,
								}}
							>
								<Button
									size={'large'}
									className={'w-40'}
									onClick={() => {
										if (list && list.length > 0) {
											history.push(`apps/${list[0].id}`)
										} else {
											Modal.info({
												title: '提示',
												content: '暂无 Dify 应用配置，请联系管理员',
											})
										}
									}}
								>
									基础功能
								</Button>
							</ConfigProvider>
							<ConfigProvider
								button={{
									className: styles.linearGradientButton,
								}}
							>
								<Button
									type={'primary'}
									size={'large'}
									className={'w-40'}
									icon={<LockOutlined />}
									onClick={() => {
										if (list && list.length > 0) {
											if (isAuthorized) {
												history.push(`apps/${list[0].id}`)
											} else {
												goAuthorize()
											}
										} else {
											Modal.info({
												title: '提示',
												content: '暂无 Dify 应用配置，请联系管理员',
											})
										}
									}}
								>
									高级功能
								</Button>
							</ConfigProvider>
						</div>
						<div className="mt-10 text-gray-300">&copy; 2025</div>
					</div>
				</Card>
			)}
		</div>
	)
}
