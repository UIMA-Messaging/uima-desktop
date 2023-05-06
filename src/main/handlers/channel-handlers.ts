import { channels as chattingChannels, window } from '..'
import { IpcMainEvent, ipcMain } from 'electron'
import { channels } from '../../common/constants'
import { Channel } from '../../common/types'

ipcMain.handle(channels.CHANNELS.GET_ALL, async (_: IpcMainEvent) => {
	return await chattingChannels.getAllChannels()
})

ipcMain.handle(channels.CHANNELS.GET, async (_: IpcMainEvent, id: string) => {
	return await chattingChannels.getChannelById(id)
})

ipcMain.handle(channels.CHANNELS.CREATE, async (event: IpcMainEvent, channel: Channel) => {
	const exists = await chattingChannels.getChannelById(channel.id)
	await chattingChannels.createOrUpdateChannel(channel)

	if (exists) {
		event.sender.send(channels.CHANNELS.ON_CHANGE, channel)
	} else {
		// send invites to members

		event.sender.send(channels.CHANNELS.ON_CREATE, channel)
	}
})

ipcMain.handle(channels.CHANNELS.DELETE, async (event: IpcMainEvent, id: string) => {
	const channel = await chattingChannels.getChannelById(id)
	if (channel) {
		await chattingChannels.deleteChannelById(id)
		event.sender.send(channels.CHANNELS.ON_DELETE, channel)
	} else {
		event.sender.send(channels.ON_ERROR, 'channels.error', 'Channel not found. Cannot delete channel.')
	}
})

export function notifyRendererOfNewChannel(channel: Channel) {
	window.webContents.send(channels.CHANNELS.ON_CREATE, channel)
}

export function notifyRendererOfRemovedChannel(channel: Channel) {
	window.webContents.send(channels.CHANNELS.ON_DELETE, channel)
}
