import { getPagedAppList } from '@/repository/app'

export const GET = async () => {
	const apps = await getPagedAppList()
	return new Response(JSON.stringify(apps), {
		headers: {
			'Content-Type': 'application/json',
		},
	})
}
