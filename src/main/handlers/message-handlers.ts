import { ipcMain } from 'electron'
import { channels } from '../../common/constants'
import { channels as channelsRepo, messages } from '..'
import { Channel } from '../../common/types'

ipcMain.handle("channels.CHATTING", async () => {
	return await channelsRepo.getAllChannels()
})

ipcMain.handle("channels.CREATE_CHANNEL", async (_, channel: Channel) => {
	return await channelsRepo.createOrUpdateChannel(channel)
})

ipcMain.handle("channels.CONVERSATIONS", async (_, channelId: string) => {
	return await messages.getMessagesFromChannel(channelId)
})
