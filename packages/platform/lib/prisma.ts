import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
	prisma: PrismaClient | undefined
}

export const prisma =
	globalForPrisma.prisma ??
	new PrismaClient({
		log: ['query'],
	})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export const userIsAdmin = async (userId: number) => {
	const userRoles = await prisma.userRole.findMany({
		where: {
			userId,
		},
		select: {
			roleId: true,
		},
	})
	const roles = await prisma.role.findMany({
		where: {
			id: {
				in: userRoles.map(role => role.roleId),
			},
		},
	})

	return roles.some(role => role.code === 'admin')
}
