import { IDifyAppItem } from '@dify-chat/core'
import { create } from 'zustand'

interface GlobalAppListStore {
	globalAppId: string
	setGlobalAppId: (appId: string) => void
	globalAppList: IDifyAppItem[]
	setGlobalAppList: (appList: IDifyAppItem[]) => void
}

export const useGlobalAppListStore = create<GlobalAppListStore>(set => ({
	globalAppId: '',
	setGlobalAppId: (appId: string) =>
		set(() => ({
			globalAppId: appId,
		})),
	globalAppList: [],
	setGlobalAppList: (appList: IDifyAppItem[]) =>
		set(() => ({
			globalAppList: appList,
		})),
}))
