import { ipcMain } from 'electron'
import { channels } from '../../common/constants'
import { ejabberd, window } from '..'

ipcMain.handle(channels.XMP.ONLINE, () => {
	return ejabberd.isConnected()
})

export function notifyOfStatus(isOnline: boolean) {
	window.webContents.send(channels.XMP.ONLINE, isOnline)
}

export function notifyOfError(error: string) {
	window.webContents.send(channels.ON_ERROR, 'xmp.error', error)
}
