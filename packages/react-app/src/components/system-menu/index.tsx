import { LogoutOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Dropdown } from 'antd'
import { useState } from 'react'

import { useAuth } from '@/hooks/use-auth.ts'

export default function SystemMenu() {
	const { userInfo, logout } = useAuth()
	const [logoutLoading, setLogoutLoading] = useState(false)

	const handleLogout = async () => {
		setLogoutLoading(true)
		await logout()
		setLogoutLoading(false)
	}

	return userInfo ? (
		<Dropdown
			menu={{
				items: [
					{
						key: 'logout',
						icon: <LogoutOutlined />,
						label: '退出登录',
						onClick: handleLogout,
					},
				],
			}}
			placement="bottomRight"
			arrow
		>
			<Button
				type="text"
				shape="round"
				icon={<UserOutlined />}
				loading={logoutLoading}
			>
				{userInfo.user.name || userInfo.user.id}
			</Button>
		</Dropdown>
	) : null
}
