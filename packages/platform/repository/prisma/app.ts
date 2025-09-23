'use server'

import { appItemToDbApp, appItemToDbAppUpdate, dbAppToAppItem } from '@/lib/db/types'
import { prisma } from '@/lib/prisma'
import { IDifyAppItem } from '@/types'

/**
 * 获取应用列表数据
 */
export const getAppList = async (userId?: number): Promise<IDifyAppItem[]> => {
	try {
		const defaultApp = await prisma.difyApp.findFirst({
			where: {
				isDefault: true,
			},
		})
		let dbApps = [defaultApp].filter(app => !!app)

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
			const userDbApps = await prisma.difyApp.findMany({
				where: {
					id: {
						in: appIds,
					},
					isDefault: false,
				},
			})
			dbApps = [...dbApps, ...userDbApps]
		}

		return dbApps.map(dbAppToAppItem)
	} catch (error) {
		console.error('Error fetching app list:', error)
		throw new Error('Failed to fetch app list')
	}
}

/**
 * 获取应用分页列表数据
 */
export const getPagedAppList = async (
	keyword: string,
	page: number,
	pageSize: number,
): Promise<{ total: number; rows: IDifyAppItem[] }> => {
	try {
		const where = {
			OR: [
				{
					name: {
						contains: keyword,
					},
				},
				{
					description: {
						contains: keyword,
					},
				},
				{
					tags: {
						contains: keyword,
					},
				},
			],
			isDeleted: false,
		}
		const total = await prisma.difyApp.count({
			where,
		})
		const dbApps = await prisma.difyApp.findMany({
			where,
			skip: (page - 1) * pageSize,
			take: pageSize,
		})

		return {
			total,
			rows: dbApps.map(dbAppToAppItem),
		}
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
		if (updateData.isDefault) {
			// 已移除有默认应用
			await prisma.difyApp.updateMany({
				where: {
					isDefault: true,
				},
				data: {
					isDefault: false,
				},
			})
		}
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
