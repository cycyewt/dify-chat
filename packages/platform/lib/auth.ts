import { PrismaAdapter } from '@auth/prisma-adapter'
import bcrypt from 'bcryptjs'
import CredentialsProvider from 'next-auth/providers/credentials'

import { prisma } from './prisma'

export const authOptions = {
	adapter: PrismaAdapter(prisma),
	providers: [
		CredentialsProvider({
			name: 'credentials',
			credentials: {
				sn: { label: '账号' },
				password: { label: '密码', type: 'password' },
			},
			async authorize(credentials) {
				if (!credentials?.sn || !credentials?.password) {
					return null
				}

				const user = await prisma.user.findUnique({
					where: {
						sn: credentials.sn,
						isEnabled: true,
					},
				})

				if (!user) {
					return null
				}

				const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

				if (!isPasswordValid) {
					return null
				}

				return {
					id: user.id,
					name: user.name,
					sn: user.sn,
					phoneNumber: user.phoneNumber,
					agency: user.agency,
					isEnabled: user.isEnabled,
				}
			},
		}),
	],
	session: {
		strategy: 'jwt' as const,
	},
	pages: {
		signIn: '/login',
	},
	callbacks: {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		async jwt({ token, user }: any) {
			if (user) {
				token.id = user.id
			}
			return token
		},
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		session({ session, token }: any) {
			if (token && session.user) {
				session.user.id = token.id as string
			}
			return session
		},
	},
}
