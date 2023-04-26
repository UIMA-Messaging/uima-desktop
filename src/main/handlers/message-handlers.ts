import { IpcMainEvent, ipcMain } from 'electron'
import { channels } from '../../common/constants'
import { ejabberd, encryption, messages, window } from '..'
import { Message } from '../../common/types'

ipcMain.on(channels.MESSAGES.SEND, async (event: IpcMainEvent, jid: string, message: Message) => {
	const encrypted = await encryption.encrypt(message)
	ejabberd.sendMessage(jid, encrypted)
	await messages.createMessage(message)
	event.sender.send(channels.MESSAGES.ON_SENT, message)
})

export function notifyOfNewMessage(message: Message) {
	window.webContents.send(channels.MESSAGES.ON_RECEIVED, message)
}
