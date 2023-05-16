import { appData, ejabberd, encryption, messages, channels as chattingChannels, window, contacts } from '..'
import { IpcMainEvent, ipcMain } from 'electron'
import { channels, messageTypes } from '../../common/constants'
import { Message, User } from '../../common/types'
import { v4 } from 'uuid'

ipcMain.handle(channels.MESSAGES.GET, async (_: IpcMainEvent, channelId: string, limit: number, offset: number) => {
	return await messages.getMessagesByChannelId(channelId, limit, offset)
})

ipcMain.on(channels.MESSAGES.SEND, async (event: IpcMainEvent, channelId: string, content: string) => {
	try {
		const sender = await appData.get<User>('user.profile')
		const channel = await chattingChannels.getChannelById(channelId)

		if (!channel) {
			event.sender.send(channels.ON_ERROR, 'messages.error', 'Cannot find channel to send message to.')
		}

		const message: Message = {
			id: v4(),
			author: sender,
			content: content,
			timestamp: new Date(),
		}

		channel.members.forEach(async (user) => {
			try {
				const encrypted = await encryption.encrypt(user.id, { channelId, message })
				ejabberd.send(user.jid, messageTypes.CHANNELS.MESSAGE, encrypted)
			} catch (error) {
				event.sender.send(channels.ON_ERROR, 'messages.error', error.message)
			}
		})

		await messages.createMessage(channelId, message)
		event.sender.send(channels.MESSAGES.ON_SENT, channelId, message)
	} catch (error) {
		console.log('Could not send message the ejabberd client:', error.message)
	}
})

export function notifyOfNewMessage(channelId: string, message: Message) {
	window.webContents.send(channels.MESSAGES.ON_RECEIVE, channelId, message)
}

export function notifyOfSentMessage(channelId: string, message: Message) {
	window.webContents.send(channels.MESSAGES.ON_SENT, channelId, message)
}
