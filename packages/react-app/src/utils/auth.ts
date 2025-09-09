export interface ICredentials {
	sn: string
	password: string
}

export interface ISession {
	expires: string
	user: {
		id: string
		name: string
	}
}

export const getCsrfToken = async () => {
	const response = await fetch('http://localhost:5300/api/auth/csrf')
	const result = (await response.json()) as { csrfToken: string }
	return result.csrfToken
}

export const login = async (credentials: ICredentials) => {
	const response = await fetch('http://localhost:5300/api/auth/callback/credentials', {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: new URLSearchParams({
			...credentials,
			// csrfToken: await getCsrfToken(),
			json: 'true',
			redirect: 'false',
		}),
		credentials: 'include',
	})
	return response.json()
}

export const getSession = async () => {
	const response = await fetch('http://localhost:5300/api/auth/session', {
		credentials: 'include',
	})

	return (await response.json()) as ISession
}

export const logout = async () => {
	const csrfToken = await getCsrfToken()
	await fetch('https://your-auth-service.com/api/auth/signout', {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: new URLSearchParams({ csrfToken, json: 'true' }),
	})
}
