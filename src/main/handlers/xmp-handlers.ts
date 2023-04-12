import { ipcMain } from 'electron'
import { channels } from '../../common/constants'
import { Message } from '../../common/types'
import { ejabberd, window } from '..'

ipcMain.on(channels.CHATTING.SEND_MESSAGE, (event, recipientJid: string, message: Message) => {
	try {
		ejabberd.sendMessage(recipientJid, message)
	} catch (error) {
		event.sender.send(channels.ON_ERROR, 'xmp.send', error)
	}
})

ipcMain.handle(channels.CHATTING.ONLINE, () => {
	return ejabberd.isConnected()
})

export function notifyOfStatus(isOnline: boolean) {
	window.webContents.send(channels.CHATTING.ONLINE, isOnline)
}

export function notifyOfMessage(message: Message) {
	window.webContents.send(channels.CHATTING.RECEIVE_MESSAGE, message)
}

export function notifyOfError(error: string) {
	window.webContents.send(channels.ON_ERROR, 'xmp', error)
}
