import Title from 'antd/es/typography/Title'
import { Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

export default function RoleManagementPage() {
	return(
		<div className="mx-auto px-4 w-full 2xl:!w-3/4 h-full">
			<div className="flex justify-between items-end mb-6">
				<div>
					<Title level={3} className={'!mb-0'}>角色管理</Title>
					<p className="mt-1 text-gray-600">管理系统用户角色</p>
				</div>
				<Button
					type="primary"
					className={'leading-none'}
					icon={<PlusOutlined />}
				>
					添加角色
				</Button>
			</div>
		</div>
	)
}
