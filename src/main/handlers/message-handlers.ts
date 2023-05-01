import { ejabberd, encryption, messages, window } from '..'
import { IpcMainEvent, ipcMain } from 'electron'
import { channels } from '../../common/constants'
import { Message } from '../../common/types'

ipcMain.on(channels.MESSAGES.SEND, async (event: IpcMainEvent, jid: string, message: Message) => {
	const encrypted = await encryption.encrypt(message)
	ejabberd.sendMessage(jid, encrypted)
	await messages.createMessage(message)
	event.sender.send(channels.MESSAGES.ON_SENT, message)
})

ipcMain.handle(channels.MESSAGES.GET, async (_: IpcMainEvent, id: string) => {
	return await messages.getMessagesFromChannel(id)
})

export function notifyOfNewMessage(message: Message) {
	window.webContents.send(channels.MESSAGES.ON_RECEIVED, message)
}

export function notifyOfSentMessage(message: Message) {
	window.webContents.send(channels.MESSAGES.ON_SENT, message)
}
