import { NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'

export const GET = async () => {
	try {
		const apps = await prisma.difyApp.findMany({
			select: {
				id: true,
				name: true,
				description: true,
			},
		})
		return NextResponse.json(apps)
	} catch (error) {
		console.error('Error fetching app simple list:', error)
		throw new Error('Failed to fetch app simple list')
	}
}
