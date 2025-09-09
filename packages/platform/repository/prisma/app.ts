'use server'

import { Prisma } from '@prisma/client'

import { appItemToDbApp, appItemToDbAppUpdate, dbAppToAppItem } from '@/lib/db/types'
import { prisma } from '@/lib/prisma'
import { IDifyAppItem } from '@/types'

/**
 * 获取应用列表数据
 */
export const getAppList = async (userId?: number): Promise<IDifyAppItem[]> => {
	try {
		let dbApps: Prisma.DifyAppSelect[]
		if (userId) {
			const userRoles = await prisma.userRole.findMany({
				where: {
					userId,
				},
				select: {
					roleId: true,
				},
			})
			const roleIds = userRoles.map(role => role.roleId)
			const roles = await prisma.role.findMany({
				where: {
					id: {
						in: roleIds,
					},
				},
			})
			const roleDifyApps = await prisma.roleDifyApp.findMany({
				where: {
					roleId: {
						in: roleIds,
					},
				},
				select: {
					difyAppId: true,
				},
			})
			const appIds = roleDifyApps.map(roleDifyApp => roleDifyApp.difyAppId)
			dbApps = await prisma.difyApp.findMany({
				where: {
					id: {
						in: appIds,
					},
				},
			})
		} else {
			dbApps = await prisma.difyApp.findMany({
				orderBy: {
					createdAt: 'desc',
				},
			})
		}
		return dbApps.map(dbAppToAppItem)
	} catch (error) {
		console.error('Error fetching app list:', error)
		throw new Error('Failed to fetch app list')
	}
}

/**
 * 根据 ID 获取应用详情
 */
export const getAppItem = async (id: string): Promise<IDifyAppItem | null> => {
	try {
		const dbApp = await prisma.difyApp.findUnique({
			where: { id },
		})
		return dbApp ? dbAppToAppItem(dbApp) : null
	} catch (error) {
		console.error('Error fetching app item:', error)
		throw new Error('Failed to fetch app item')
	}
}

/**
 * 新增应用配置
 */
export const addApp = async (app: Omit<IDifyAppItem, 'id'>): Promise<IDifyAppItem> => {
	try {
		const dbAppData = appItemToDbApp(app)
		const dbApp = await prisma.difyApp.create({
			data: dbAppData,
		})
		return dbAppToAppItem(dbApp)
	} catch (error) {
		console.error('Error adding app:', error)
		throw new Error('Failed to add app')
	}
}

/**
 * 更新应用
 */
export const updateApp = async (app: IDifyAppItem): Promise<IDifyAppItem> => {
	try {
		const dbAppData = appItemToDbAppUpdate(app)
		const { id, ...updateData } = dbAppData
		const dbApp = await prisma.difyApp.update({
			where: { id },
			data: updateData,
		})
		return dbAppToAppItem(dbApp)
	} catch (error) {
		console.error('Error updating app:', error)
		throw new Error('Failed to update app')
	}
}

/**
 * 删除应用
 */
export const deleteApp = async (id: string): Promise<void> => {
	try {
		await prisma.difyApp.delete({
			where: { id },
		})
	} catch (error) {
		console.error('Error deleting app:', error)
		throw new Error('Failed to delete app')
	}
}
