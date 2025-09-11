import { LogoutOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Dropdown } from 'antd'
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
		router.push('/login')
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
				logoText: '管理系统',
				renderLogo: () => (
					<Image
						src={LogoIcon}
						width={32}
						height={32}
						alt="管理系统"
					/>
				),
				isTitleWrapped: true,
				title: <AdminHeaderTitle />,
				rightIcon: session?.user ? (
					<Dropdown
						menu={{ items: menuItems }}
						placement="bottomRight"
						arrow
					>
						<Button
							type="text"
							shape="round"
							icon={<UserOutlined />}
						>
							{session.user.name || session.user.email}
						</Button>
					</Dropdown>
				) : null,
			}}
		>
			{children}
		</PageLayout>
	)
}
