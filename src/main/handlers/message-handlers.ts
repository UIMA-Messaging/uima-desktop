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
			plaintext: content,
			timestamp: new Date(),
		}

		console.log('sender', sender)
		console.log('channel', channel)
		console.log('message', message)

		for (const member of channel.members) {
			try {
				console.log('about to send message to', member.displayName)
				const encrypted = await encryption.encrypt(member.id, sender.id, JSON.stringify({ channelId, message }))
				console.log('encrypted message', encrypted)
				await ejabberd.send(member.jid, messageTypes.CHANNELS.MESSAGE, encrypted)
			} catch (error) {
				console.log(error.message)
				event.sender.send(channels.ON_ERROR, 'messages.error', 'Could not send message to ' + member.displayName)
			}
		}

		await messages.createMessage(channelId, message)
		event.sender.send(channels.MESSAGES.ON_SENT, channelId, message)
	} catch (error) {
		console.log('Could not send message the ejabberd client:', error.message)
		event.sender.send(channels.ON_ERROR, 'messages.error', 'Could not send message to channel.')
	}
})

export function notifyOfNewMessage(channelId: string, message: Message) {
	window.webContents.send(channels.MESSAGES.ON_RECEIVE, channelId, message)
}

export function notifyOfSentMessage(channelId: string, message: Message) {
	window.webContents.send(channels.MESSAGES.ON_SENT, channelId, message)
}
