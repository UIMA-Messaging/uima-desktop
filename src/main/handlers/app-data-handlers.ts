import { IpcMainEvent, ipcMain } from 'electron'
import { channels } from '../../common/constants'
import { appData, window } from '..'

ipcMain.handle(channels.STORE.GET, async (_: IpcMainEvent, key: string) => {
	return await appData.get(key)
})

ipcMain.handle(channels.STORE.SET, async (event: IpcMainEvent, key: string, value: any, sensitive: boolean = true) => {
	await appData.set(key, value, sensitive)
	event.sender.send(channels.STORE.ON_CHANGE, key, value)
})

export function notifyRenderer(key: string, value: any) {
	window.webContents.send(channels.STORE.ON_CHANGE, key, value)
}
