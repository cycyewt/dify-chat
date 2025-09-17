import { LogoutOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Dropdown } from 'antd'

import { useAuth } from '@/hooks/use-auth.ts'

export default function SystemMenu() {
	const { userInfo, logout, goAuthorize } = useAuth()

	return userInfo ? (
		<Dropdown
			menu={{
				items: [
					{
						key: 'logout',
						icon: <LogoutOutlined />,
						label: '退出登录',
						onClick: logout,
					},
				],
			}}
			placement="bottomRight"
			arrow
		>
			<Button
				type="primary"
				shape="round"
				icon={<UserOutlined />}
			>
				{userInfo.user.name || userInfo.user.id}
			</Button>
		</Dropdown>
	) : (
		<Button
			type="primary"
			shape="round"
			icon={<UserOutlined />}
			onClick={goAuthorize}
		>
			去登录
		</Button>
	)
}
