'use client'

import { ApartmentOutlined, AppstoreOutlined, TeamOutlined } from '@ant-design/icons'
import { message, Segmented, Space } from 'antd'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

enum ETopMenuKeys {
	AppManagement = 'app-management',
	RoleManagement = 'role-management',
	UserManagement = 'user-management',
}

interface ITopMenuOption {
	label: string
	value: ETopMenuKeys
	route: string
	icon?: React.ReactNode
}

const TopMenuOptions: ITopMenuOption[] = [
	{
		label: '应用管理',
		icon: <AppstoreOutlined />,
		value: ETopMenuKeys.AppManagement,
		route: '/app-management',
	},
	{
		label: '角色管理',
		icon: <ApartmentOutlined />,
		value: ETopMenuKeys.RoleManagement,
		route: '/role-management',
	},
	{
		label: '用户管理',
		icon: <TeamOutlined />,
		value: ETopMenuKeys.UserManagement,
		route: '/user-management',
	},
]

export default function AdminHeaderTitle() {
	const [activeKey, setActiveKey] = useState<ETopMenuKeys>()
	const router = useRouter()
	const pathname = usePathname()

	useEffect(() => {
		const key = TopMenuOptions.find(item => item.route === pathname)?.value
		if (key) {
			setActiveKey(key)
		}
	}, [pathname])

	return (
		<Space>
			<Segmented
				value={activeKey}
				shape="round"
				options={TopMenuOptions}
				rootClassName={'text-primary'}
				onChange={key => {
					const route = TopMenuOptions.find(item => item.value === key)?.route
					if (route) {
						router.push(route)
					} else {
						message.open({
							type: 'error',
							content: '未找到该页面',
						})
					}
				}}
			/>
		</Space>
	)
}
