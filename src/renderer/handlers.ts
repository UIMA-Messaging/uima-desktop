import { Channel } from '../common/types'

export async function getOnlineState(): Promise<boolean> {
	return await window.electron.isOnline()
}

export function isOnline(setState?: (state: boolean) => void): boolean {
	let isOnline
	window.electron.onOnline((_, result) => {
		isOnline = result
		setState(result)
	})
	return isOnline
}

export async function getChannels(): Promise<Channel[]> {
	return await window.electron.getChannels()
}
