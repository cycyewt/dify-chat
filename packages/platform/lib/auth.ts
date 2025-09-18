import { PrismaAdapter } from '@auth/prisma-adapter'
import bcrypt from 'bcryptjs'
import CredentialsProvider from 'next-auth/providers/credentials'

import { prisma, userIsAdmin } from './prisma'

export const authOptions = {
	adapter: PrismaAdapter(prisma),
	providers: [
		CredentialsProvider({
			name: 'credentials',
			credentials: {
				scene: { label: '场景', type: 'text' },
				sn: { label: '账号', type: 'text' },
				password: { label: '密码', type: 'password' },
			},
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-expect-error
			async authorize(credentials) {
				if (!credentials?.scene || !credentials?.sn || !credentials?.password) {
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

				// 如果没有管理员角色，不能登录管理系统，返回 null
				const isAdmin = await userIsAdmin(user.id)
				if (credentials.scene === 'admin' && !isAdmin) {
					return null
				}

				const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

				if (!isPasswordValid) {
					return null
				}

				return {
					id: user.id,
					sn: user.sn,
					name: user.name,
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
