import { getAppList } from '@/repository/app'

export const GET = async () => {
	const apps = await getAppList()
	return new Response(JSON.stringify(apps), {
		headers: {
			'Content-Type': 'application/json',
		},
	})
}
