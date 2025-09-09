declare module 'next-auth' {
	interface User {
		id: string
	}

	interface Session {
		user: {
			id: string
			name: string | null
		}
	}
}

declare module 'next-auth/jwt' {
	interface JWT {
		id?: string
	}
}
