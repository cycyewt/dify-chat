declare module 'next-auth' {
	interface User {
		id: string
		name: string
		sn: string
	}

	interface Session {
		user: {
			id: string
			name: string
			sn: string
		}
	}
}

declare module 'next-auth/jwt' {
	interface JWT {
		id?: string
	}
}
