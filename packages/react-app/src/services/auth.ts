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

const API_BASE = process.env.PUBLIC_AUTH_API_BASE

export const getCsrfTokenApi = async () => {
	const response = await fetch(`${API_BASE}/csrf`)
	const result = (await response.json()) as { csrfToken: string }
	return result.csrfToken
}

export const loginApi = async (credentials: ICredentials) => {
	const response = await fetch(`${API_BASE}/callback/credentials`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: new URLSearchParams({
			...credentials,
			json: 'true',
			redirect: 'false',
		}),
		credentials: 'include',
	})
	return response.json()
}

export const getSessionApi = async () => {
	const response = await fetch(`${API_BASE}/session`, {
		credentials: 'include',
	})

	return (await response.json()) as ISession
}

export const logoutApi = async () => {
	const csrfToken = await getCsrfTokenApi()
	await fetch(`${API_BASE}/signout`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: new URLSearchParams({ csrfToken, json: 'true' }),
	})
}
