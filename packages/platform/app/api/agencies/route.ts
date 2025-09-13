import { NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'

// 定义机构类型
interface Agency {
	id: number
	name: string
	parentId: number
	level: number
	children?: Agency[]
}

interface AgencyDisplay {
	value: number
	label: string
	children?: AgencyDisplay[]
}

// 构建树状结构的辅助函数
function buildAgencyTree(
	agencies: Pick<Agency, 'id' | 'name' | 'parentId' | 'level'>[],
): AgencyDisplay[] {
	// 创建映射以便快速查找机构
	const agencyMap: Record<number, AgencyDisplay> = {}

	// 初始化所有机构节点
	agencies.forEach(agency => {
		agencyMap[agency.id] = {
			value: agency.id,
			label: agency.name,
			children: [],
		}
	})

	// 存储根节点的数组
	const roots: AgencyDisplay[] = []

	// 构建树状结构
	agencies.forEach(agency => {
		const node = agencyMap[agency.id]
		if (agency.parentId === 0) {
			// parentId为0表示根节点
			roots.push(node)
		} else {
			// 查找父节点并添加当前节点到父节点的children数组中
			const parent = agencyMap[agency.parentId]
			if (parent) {
				parent.children!.push(node)
			}
		}
	})

	return roots
}

export const GET = async () => {
	const agencies = await prisma.agency.findMany({
		select: {
			id: true,
			name: true,
			parentId: true,
			level: true,
		},
	})
	return NextResponse.json(buildAgencyTree(agencies))
}
