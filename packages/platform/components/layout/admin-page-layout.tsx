import { CaretDownFilled, LogoutOutlined, UserOutlined } from '@ant-design/icons'
import { Avatar, Dropdown, Space } from 'antd'
import { MenuItemType } from 'antd/es/menu/interface'
import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ReactNode } from 'react'

import LogoIcon from '@/assets/images/logo.png'

import AdminHeaderTitle from './admin-header-title'
import PageLayout from './page-layout'

interface IAdminPageLayoutProps {
	children: ReactNode
}

/**
 * 控制台的页面布局组件
 */
export default function AdminPageLayout(props: IAdminPageLayoutProps) {
	const { children } = props
	const { data: session } = useSession()
	const router = useRouter()

	const handleLogout = async () => {
		await signOut({ redirect: false })
		router.replace('/login')
	}

	const menuItems: MenuItemType[] = [
		{
			key: 'logout',
			icon: <LogoutOutlined />,
			label: '退出登录',
			onClick: handleLogout,
		},
	]

	return (
		<PageLayout
			headerProps={{
				logoText: '和田公安人工智能专栏',
				renderLogo: () => (
					<Image
						src={LogoIcon}
						width={40}
						height={40}
						alt="和田公安人工智能专栏"
					/>
				),
				isTitleWrapped: true,
				title: <AdminHeaderTitle />,
				rightIcon: session?.user ? (
					<>
						{/*<Dropdown*/}
						{/*	menu={{ items: menuItems }}*/}
						{/*	placement="bottomRight"*/}
						{/*	arrow*/}
						{/*>*/}
						{/*	<Space*/}
						{/*		size={[6, 6]}*/}
						{/*	>*/}
						{/*		<div className="flex justify-center items-center w-6 h-6 border border-solid border-black rounded-full text-sm">*/}
						{/*			{session.user.name?.at(0)}*/}
						{/*		</div>*/}
						{/*		<span className={'text-sm cursor-default'}>*/}
						{/*			{session.user.name || session.user.email}*/}
						{/*		</span>*/}
						{/*		<CaretDownFilled*/}
						{/*			size={12}*/}
						{/*			style={{ color: '#798495', fontSize: 12 }}*/}
						{/*		/>*/}
						{/*	</Space>*/}
						{/*</Dropdown>*/}
						<Dropdown
							menu={{ items: menuItems }}
							placement="bottomRight"
							arrow
						>
							<Space size={[6, 6]}>
								<Avatar
									size={28}
									icon={<UserOutlined />}
									style={{ backgroundColor: '#4B5BF5', fontSize: 14 }}
								/>
								<span className={'text-sm cursor-default'}>
									{session.user.name || session.user.email}
								</span>
								<CaretDownFilled
									size={12}
									style={{ color: '#798495', fontSize: 12 }}
								/>
							</Space>
						</Dropdown>
						{/*<Dropdown*/}
						{/*	menu={{ items: menuItems }}*/}
						{/*	placement="bottomRight"*/}
						{/*	arrow*/}
						{/*>*/}
						{/*	<Button*/}
						{/*		variant={'outlined'}*/}
						{/*		shape="round"*/}
						{/*		icon={<UserOutlined />}*/}
						{/*	>*/}
						{/*		{session.user.name || session.user.email}*/}
						{/*	</Button>*/}
						{/*</Dropdown>*/}
					</>
				) : null,
			}}
		>
			{children}
		</PageLayout>
	)
}
