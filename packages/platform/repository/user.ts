import { prisma } from '@/lib/prisma'

export function getUser(id?: number) {
	if (!id) {
		return null
	}

	return prisma.user.findUnique({
		where: {
			id,
		},
	})
}
